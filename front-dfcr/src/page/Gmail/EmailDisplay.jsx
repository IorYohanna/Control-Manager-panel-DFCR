import React, { useState, useEffect } from "react";
import { Mail, Clock, Inbox, Loader2, LogOut, AlertCircle } from "lucide-react";
import { getEmails } from "../../api/Email/email";

const EmailItem = ({ email, selectedEmail, onSelect, formatDate }) => {
  const isSelected = selectedEmail?.id === email.id;

  return (
    <div
      onClick={() => onSelect(email)}
      className={`p-4 border-b border-[#73839E]/30 cursor-pointer transition-all ${
        isSelected ? "bg-[#73839E]/20 border-l-4 border-l-[#24344D]" : "hover:bg-[#73839E]/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#2D466E] rounded-full flex items-center justify-center text-white">
          {email.from.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-[#2D466E] truncate">
              {email.from}
            </span>
            <span className="text-xs text-[#73839E]">{formatDate(email.date)}</span>
          </div>
          <h3 className="text-sm font-medium text-[#2D466E] truncate">{email.subject}</h3>
          <p className="text-xs text-[#73839E] truncate">{email.snippet}</p>
        </div>
      </div>
    </div>
  );
};

const EmailContent = ({ email, formatDate }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <Mail className="w-20 h-20 mx-auto mb-4 text-[#73839E]" />
          <p className="text-[#2D466E] text-lg font-bold">Aucun email sélectionné</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-[#73839E]/30 p-8">
        <h2 className="text-2xl font-bold text-[#2D466E] mb-2">{email.subject}</h2>
        <div className="flex items-center gap-4 text-[#73839E] text-sm mb-6">
          <span className="font-medium text-[#2D466E]">{email.from}</span>
          <Clock className="w-4 h-4" />
          <span>{formatDate(email.date)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-3xl mx-auto">
          {email.body.split("\n").map((line, index) => (
            <p key={index} className="text-[#2D466E] mb-4 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default function EmailDisplay({ onLogout }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setLoading(true);
      const data = await getEmails();
      setEmails(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLogoutLoading(true);
      await fetch("http://localhost:8080/api/auth/gmail/logout", { method: "POST" });
      onLogout();
    } finally {
      setLogoutLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#73839E] to-[#F5ECE3] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2D466E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#73839E] to-[#F5ECE3] p-4">
      <div className="flex h-full rounded-2xl overflow-hidden shadow-lg">

        {/* Sidebar */}
        <div className="w-80 bg-[#F5ECE3] border-r border-[#73839E]/20 flex flex-col">
          <div className="p-6 border-b border-[#73839E]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#2D466E]" />
              <h1 className="text-xl font-bold text-[#2D466E]">Boîte de réception</h1>
            </div>

            <button
              onClick={logout}
              disabled={logoutLoading}
              className="p-2 rounded-lg hover:bg-[#73839E]/10 transition disabled:opacity-50"
            >
              {logoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#73839E]" />
              ) : (
                <LogOut className="w-5 h-5 text-[#73839E]" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                selectedEmail={selectedEmail}
                onSelect={setSelectedEmail}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <EmailContent email={selectedEmail} formatDate={formatDate} />
        </div>
      </div>
    </div>
  );
}
