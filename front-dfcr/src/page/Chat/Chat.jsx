import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Send, Search, MoreVertical, Trash2, User, MessageCircle, Clock } from "lucide-react";
import { getCurrentUser, getMessages, getUsers } from "../../api/Chat/chat";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const stompClientRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }
    loadUser()
  }, []);

  useEffect(() => {
    if (!currentUser) return
    async function loadUsers() {
      setLoading(true)
      const data = await getUsers()
      setUsers(data.filter(u => u.matricule !== currentUser))
      setLoading(false);
    }
    loadUsers()
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([])
      return
    }
    
    async function loadMessages() {
      setChatLoading(true)
      try {
        const data = await getMessages(currentUser, selectedUser)
        setMessages(data)
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
      setChatLoading(false);
    }
    loadMessages()
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.matricule?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserInfo = users.find((u) => u.matricule === selectedUser);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full bg-[#f5ece3]">
        <div className="text-center">
          <div className="h-15 w-15 border-3 border-[#2d466e] border-t-transparent rounded-[50%] animate-spin  m-4"></div>
          <p className="text-[#73839e] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center w-full bg-[#f5ece3]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-[#73839e]/20">
          <p className="text-red-600 font-semibold">Utilisateur non connecté</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full p-4 sm:p-6">
      <div className="flex w-full  mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-transparent">
        
        {/* Sidebar utilisateurs */}
        <div className="w-80 border-r border-[#73839e]/20 flex flex-col bg-[#f5ece3]">
          
          {/* Header Sidebar */}
          <div className="p-5 bg-linear-to-br from-[#2d466e] to-[#3d5680] text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#f5ece3]/20 backdrop-blur-sm flex items-center justify-center border border-[#f5ece3]/30">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold truncate">Messages</h2>
                <p className="text-xs text-[#f5ece3]/80 truncate">{currentUser}</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73839e]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#f5ece3]/20 backdrop-blur-sm border border-[#f5ece3]/30 text-white placeholder-[#f5ece3]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5ece3]/40 transition-all"
              />
            </div>
          </div>

          {/* Liste utilisateurs */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-[#73839e]">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.matricule}
                  onClick={() => setSelectedUser(user.matricule)}
                  className={`cursor-pointer rounded-xl p-3 transition-all duration-200 group
                    ${
                      selectedUser === user.matricule
                        ? "bg-[#2d466e] text-white shadow-md"
                        : "hover:bg-[#f5ece3]/60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                      selectedUser === user.matricule
                        ? "bg-[#f5ece3]/20 text-white border border-[#f5ece3]/30"
                        : "bg-linear-to-br from-[#2d466e] to-[#3d5680] text-white"
                    }`}>
                      {user.surname?.[0]}{user.username?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${
                        selectedUser === user.matricule ? "text-white" : "text-[#2d466e]"
                      }`}>
                        {user.fonction}  ( {user.idService} )
                      </p>
                      <p className={`text-xs truncate ${
                        selectedUser === user.matricule ? "text-[#f5ece3]/80" : "text-[#73839e]"
                      }`}>
                        {user.surname} {user.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col">
          {selectedUser && selectedUserInfo ? (
            <>
              {/* Header chat */}
              <div className="p-4 border-b border-[#73839e]/20 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2d466e] to-[#3d5680] flex items-center justify-center text-white font-semibold text-sm">
                      {selectedUserInfo.surname?.[0]}{selectedUserInfo.username?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2d466e]">
                        {selectedUserInfo.surname} {selectedUserInfo.username}
                      </h3>
                      <p className="text-xs text-[#73839e]">{selectedUserInfo.fonction}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-[#f5ece3]/50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#73839e]" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 p-6 overflow-y-auto bg-[#f5ece3]/30"
                ref={chatContainerRef}
                style={{
                  backgroundImage: `radial-linear(circle at 1px 1px, rgba(115, 131, 158, 0.08) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}
              >
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-[#2d466e] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-[#73839e] text-sm">Chargement des messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#73839e]/40" />
                      <p className="text-[#73839e]">Aucun message</p>
                      <p className="text-sm text-[#73839e]/70 mt-2">Commencez la conversation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages
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
                          } group`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${
                            m.senderMatricule === currentUser ? "flex-row-reverse" : "flex-row"
                          }`}>
                            
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 ${
                              m.senderMatricule === currentUser
                                ? "bg-linear-to-br from-[#2d466e] to-[#3d5680]"
                                : "bg-linear-to-br from-[#73839e] to-[#5a6a85]"
                            }`}>
                              {m.senderName?.split(" ").map(n => n[0]).join("") || "?"}
                            </div>

                            {/* Message bubble */}
                            <div className="flex flex-col">
                              <div
                                className={`px-4 py-3 rounded-2xl shadow-sm ${
                                  m.senderMatricule === currentUser
                                    ? "bg-linear-to-br from-[#2d466e] to-[#3d5680] text-white rounded-br-md"
                                    : "bg-white text-[#2d466e] rounded-bl-md border border-[#73839e]/20"
                                }`}
                              >
                                <p className="text-sm leading-relaxed wrap-break-words">{m.content}</p>
                              </div>
                              
                              {/* Timestamp */}
                              <div className={`flex items-center gap-1 mt-1 px-2 ${
                                m.senderMatricule === currentUser ? "justify-end" : "justify-start"
                              }`}>
                                <Clock className="w-3 h-3 text-[#73839e]" />
                                <span className="text-xs text-[#73839e]">
                                  {new Date(m.sentAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                
                                {/* Delete button
                                {m.senderMatricule === currentUser && (
                                  <button
                                    onClick={() => deleteMessage(m.id)}
                                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                )} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Input message */}
              <div className="p-4 bg-white border-t border-[#73839e]/20">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Tapez votre message..."
                      rows="1"
                      className="w-full resize-none border border-[#73839e]/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all text-sm text-[#2d466e] placeholder-[#73839e]/60"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="bg-linear-to-br from-[#2d466e] to-[#3d5680] text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-[#73839e]/70 mt-2">Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#f5ece3]/30">
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#f5ece3] to-[#e8ddd0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#73839e]/20">
                  <MessageCircle className="w-10 h-10 text-[#2d466e]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2d466e] mb-2">Bienvenue sur la messagerie</h3>
                <p className="text-[#73839e]">Sélectionnez un utilisateur pour commencer une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}