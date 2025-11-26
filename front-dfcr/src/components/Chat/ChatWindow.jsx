// components/Chat/ChatWindow.jsx
import { useState, useEffect, useRef } from "react";
import { Send, MoreVertical, ArrowLeft, MessageCircle, Clock } from "lucide-react";

export default function ChatWindow({ currentUser, selectedUser, messages, loading, onSendMessage, onBack }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // État vide (Aucune sélection)
  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#f5ece3]/30 p-6 text-center">
        <div className="w-20 h-20 bg-[#f5ece3] rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-10 h-10 text-[#2d466e]" />
        </div>
        <h3 className="text-xl font-bold text-[#2d466e]">Messagerie Interne</h3>
        <p className="text-[#73839e] mt-2">Sélectionnez un collègue pour démarrer une conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header Chat */}
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          {/* Bouton retour Mobile */}
          <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full text-[#2d466e]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Info User */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2d466e] to-[#3d5680] text-white flex items-center justify-center font-bold text-sm">
            {selectedUser.surname?.[0]}{selectedUser.username?.[0]}
          </div>
          <div>
            <h3 className="font-bold text-[#2d466e] leading-none">
              {selectedUser.surname} {selectedUser.username}
            </h3>
            <p className="text-xs text-[#73839e] mt-1">{selectedUser.fonction}</p>
          </div>
        </div>
      </div>

      {/* Zone Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f5ece3]/20"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        {loading ? (
           <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-4 border-[#2d466e] border-t-transparent rounded-full"></div></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">Début de la conversation</div>
        ) : (
          messages
          .filter(m => m.senderMatricule === selectedUser.matricule || m.receiverMatricule === selectedUser.matricule)
          .map((m, idx) => {
            const isMe = m.senderMatricule === currentUser;
            return (
              <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-lg shadow-sm text-sm leading-relaxed ${
                    isMe 
                      ? "bg-[#2d466e] text-white rounded-tr-none" 
                      : "bg-white text-[#2d466e] border border-gray-100 rounded-tl-none"
                  }`}>
                    {m.content}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Zone Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 focus-within:border-[#2d466e]/50 focus-within:ring-2 focus-within:ring-[#2d466e]/10 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm max-h-32 min-h-6 py-2 px-2 text-[#2d466e]"
            rows={1}
            style={{ height: "auto" }} 
            onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-[#2d466e] text-white hover:bg-[#1a2b44] disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}