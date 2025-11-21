// components/Chat/Chat.jsx
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getCurrentUser, getMessages, getUsers } from "../../api/Chat/chat";
import ChatSidebar from "../../components/Chat/ChatSidebar";
import ChatWindow from "../../components/Chat/ChatWindow";

export default function Chat() {
  // --- États ---
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // ID (matricule)
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Refs
  const stompClientRef = useRef(null);

  // --- Chargement initial ---
  useEffect(() => {
    async function init() {
      const userMatricule = await getCurrentUser();
      setCurrentUser(userMatricule);
    }
    init();
  }, []);

  // --- Chargement des utilisateurs ---
  useEffect(() => {
    if (!currentUser) return;
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data.filter((u) => u.matricule !== currentUser));
      } catch (err) {
        console.error("Erreur chargement utilisateurs", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [currentUser]);

  // --- Chargement des messages ---
  useEffect(() => {
    if (!selectedUserId || !currentUser) {
      setMessages([]);
      return;
    }
    async function loadMessages() {
      setChatLoading(true);
      try {
        const data = await getMessages(currentUser, selectedUserId);
        setMessages(data);
      } catch (err) {
        console.error("Erreur fetching messages:", err);
        setMessages([]);
      } finally {
        setChatLoading(false);
      }
    }
    loadMessages();
  }, [selectedUserId, currentUser]);

  // --- WebSocket ---
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:8080/ws-message");
    
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WS Connected");
        client.subscribe(`/user/queue/messages`, (msg) => {
          try {
            const received = JSON.parse(msg.body);
            // Si le message vient de la personne sélectionnée ou si c'est moi qui l'ai envoyé (multi-device)
            setMessages((prev) => [...prev, received]);
          } catch (e) { console.error(e); }
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => { if (client.connected) client.deactivate(); };
  }, [currentUser]);

  // --- Actions ---
  const sendMessage = (content) => {
    if (!stompClientRef.current?.connected || !content.trim()) return;
    
    const msgPayload = {
      senderMatricule: currentUser,
      receiverMatricule: selectedUserId,
      content: content.trim(),
    };

    stompClientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(msgPayload),
      headers: { "content-type": "application/json" },
    });
    
    // Optimistic UI update (optionnel, car le WS renvoie souvent le message)
    // setMessages(prev => [...prev, { ...msgPayload, sentAt: new Date() }]); 
  };

  // Trouver l'objet utilisateur complet
  const selectedUserObj = users.find(u => u.matricule === selectedUserId);

  if (loading) return <div className="p-10 text-center text-[#73839e]">Chargement du module de chat...</div>;

  return (
    <div className="flex w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 md:m-3 xl:m-5">
      
      {/* SIDEBAR : Visible sur mobile si aucun user sélectionné, toujours visible sur Desktop */}
      <div className={`w-full md:w-80 flex-col border-r border-gray-100 bg-[#f5ece3] ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
        <ChatSidebar 
          users={users} 
          currentUserMatricule={currentUser}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      </div>

      {/* CHAT WINDOW : Visible sur mobile si user sélectionné, toujours visible sur Desktop */}
      <div className={`flex-1 flex-col bg-white ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
        <ChatWindow 
          currentUser={currentUser}
          selectedUser={selectedUserObj}
          messages={messages}
          loading={chatLoading}
          onSendMessage={sendMessage}
          onBack={() => setSelectedUserId(null)} // Pour le mobile
        />
      </div>
    </div>
  );
}