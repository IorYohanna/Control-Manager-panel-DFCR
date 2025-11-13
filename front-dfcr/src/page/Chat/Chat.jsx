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
  const chatContainerRef = useRef(null);

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

  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:8080/ws-message");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected");

        client.subscribe(`/user/queue/messages`, (msg) => {
          try {
            const receivedMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, receivedMessage]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

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
    if (!stompClientRef.current?.connected) return;
    if (!input.trim() || !selectedUser || !currentUser) return;

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
  };

    const deleteMessage = (id) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce message ?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
        if (!res.ok) throw new Error("Impossible de supprimer le message");
        setMessages((prev) => prev.filter((m) => m.id !== id));
        })
        .catch(console.error);
    };


  // Scroll automatique en bas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="flex h-screen font-sans text-gray-800 p-5">
      {/* Sidebar utilisateurs */}
      <div className="w-64 bg-[#2d466e] text-white p-4 flex flex-col rounded-tl-2xl rounded-bl-2xl">
        <div className="">
          <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
          <p className="text-sm mb-4 opacity-80">Connecté: {currentUser}</p>
        </div>
       
        <div className="flex-1 overflow-y-auto space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-300 text-sm">Aucun utilisateur disponible</p>
          ) : (
            users.map((user) => (
              <div
                key={user.matricule}
                onClick={() => setSelectedUser(user.matricule)}
                className={`cursor-pointer rounded-lg p-2 transition-colors duration-200 
                  ${
                    selectedUser === user.matricule
                      ? "bg-[#73839e]"
                      : "hover:bg-[#73839e]/40"
                  }`}
              >
                <p className="font-medium">{user.surname} {user.username}</p>
                <p className="text-xs opacity-70">{user.matricule}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col bg-[#f5ece3] rounded-tr-2xl rounded-br-2xl">
        {selectedUser ? (
          <>
            {/* Header chat */}
            <div className="p-4 border-b border-[#73839e]/40 font-semibold text-lg bg-[#73839e]/10">
              Chat avec {selectedUser}
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3"
              id="chat-container"
              ref={chatContainerRef}
            >
              {chatLoading ? (
                <p className="text-gray-500 text-center mt-10">Chargement des messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Aucun message</p>
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
                        m.senderMatricule === currentUser ? "justify-end" : "justify-start"
                      } items-end`}
                    >
                      {m.senderMatricule === currentUser && (
                        <button
                          onClick={() => deleteMessage(m.id)}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}

                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] wrap-break-word shadow-lg
                          ${
                            m.senderMatricule === currentUser
                              ? "bg-[#2d466e] text-white rounded-br-none"
                              : "bg-[#73839e]/30 text-[#2d466e] rounded-bl-none"
                          }`}
                      >
                        <p className="text-xs opacity-70 mb-1">{m.senderName}</p>
                        <p>{m.content}</p>
                        <p className="text-[10px] opacity-50 mt-1 text-right">
                          {new Date(m.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Input message */}
            <div className="p-4 border-t border-[#73839e]/40 flex gap-2 bg-[#73839e]/5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 border border-[#73839e]/40 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2d466e]"
              />
              <button
                onClick={sendMessage}
                className="bg-[#2d466e] text-white px-4 py-2 rounded-full hover:bg-[#73839e]"
              >
                Envoyer
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#73839e] text-lg">
            👈 Sélectionnez un utilisateur pour commencer à discuter
          </div>
        )}
      </div>
    </div>
  );
}
