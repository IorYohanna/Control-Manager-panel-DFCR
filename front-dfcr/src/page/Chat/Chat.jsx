import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const stompClientRef = useRef(null);

  // Récupère l'utilisateur courant depuis le token ou l'API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(payload.sub);
    } catch {
      fetch("http://localhost:8080/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => setCurrentUser(user.matricule))
        .catch(console.error);
    }
  }, []);

  // Récupère la liste des utilisateurs
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => u.matricule !== currentUser)))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // Charge l'historique de conversation à chaque changement d'utilisateur sélectionné
  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([]);
      return;
    }

    const token = localStorage.getItem("token");
    setChatLoading(true);

    fetch(`http://localhost:8080/messages/${currentUser}/${selectedUser}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setMessages([]);
      })
      .finally(() => setChatLoading(false));
  }, [selectedUser, currentUser]);

  // WebSocket STOMP connection
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:8080/ws-message");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected");

        // S'abonner aux messages privés
        client.subscribe(`/user/queue/messages`, (msg) => {
          try {
            const receivedMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, receivedMessage]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        // S'abonner aux erreurs (optionnel)
        client.subscribe(`/user/queue/errors`, (msg) => {
          console.error("WebSocket error:", msg.body);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"], frame.body);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.connected) client.deactivate();
    };
  }, [currentUser]);

  // Envoyer un message
  const sendMessage = () => {
    if (!stompClientRef.current?.connected) {
      console.error("WebSocket not connected");
      return;
    }

    if (!input.trim() || !selectedUser || !currentUser) return;

    try {
      stompClientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          senderMatricule: currentUser,
          receiverMatricule: selectedUser,
          content: input.trim(),
        }),
        headers: { "content-type": "application/json" },
      });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Chargement...
      </div>
    );
  if (!currentUser)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Utilisateur non connecté
      </div>
    );

  return (
    <div className="flex h-screen">
      {/* Sidebar utilisateurs */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Utilisateurs</h2>
        <p className="text-sm text-gray-500 mb-4">Connecté: {currentUser}</p>
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun utilisateur disponible</p>
        ) : (
          users.map((user) => (
            <div
              key={user.matricule}
              onClick={() => setSelectedUser(user.matricule)}
              className={`p-2 rounded cursor-pointer mb-2 hover:bg-gray-200 ${
                selectedUser === user.matricule ? "bg-blue-100" : "bg-white"
              }`}
            >
              <p className="font-medium">{user.nom || user.matricule}</p>
              <p className="text-xs text-gray-500">{user.matricule}</p>
            </div>
          ))
        )}
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 font-semibold text-lg">
              Chat avec {selectedUser}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
              {chatLoading ? (
                <p className="text-gray-400 text-center mt-10">
                  Chargement des messages...
                </p>
              ) : messages.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">Aucun message</p>
              ) : (
                messages
                  .filter(
                    (m) =>
                      m.senderMatricule === selectedUser ||
                      m.receiverMatricule === selectedUser
                  )
                  .map((m) => (
                    <div
                      key={m.id || Math.random()}
                      className={`flex ${
                        m.senderMatricule === currentUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-[70%] ${
                          m.senderMatricule === currentUser
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 shadow"
                        }`}
                      >
                        <p className="text-xs opacity-70 mb-1">{m.senderName}</p>
                        <p>{m.content}</p>
                        <p className="text-[10px] opacity-50 mt-1 text-right">
                          {new Date(m.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Envoyer
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            👈 Sélectionnez un utilisateur pour commencer à discuter
          </div>
        )}
      </div>
    </div>
  );
}
