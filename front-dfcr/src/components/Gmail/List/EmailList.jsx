import { Mail, RefreshCw  } from 'lucide-react';

export default function EmailList ({
  emails,
  loading,
  selectedEmail,
  setSelectedEmail,
  loadMoreEmails,
  hasMore,
  extractSenderName,
  formatDate,
}) {
  return (
    <div className="w-full bg-linear-to-r from-white/50 to-[#f5ece3] rounded-bl-xl shadow-inner overflow-y-auto thin-scrollbar ">
        {loading ? (
            <div className="flex items-center justify-center h-full w-full">
            <RefreshCw className="w-8 h-8 animate-spin text-[#2d466e]" />
            </div>
        ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#73839e]">
            <Mail className="w-16 h-16 mb-4 text-[#73839e]" />
            Aucun email
            </div>
        ) : (
            <>
            {emails.map((email) => (
                <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-[#73839e]/20 cursor-pointer transition 
                    ${selectedEmail?.id === email.id 
                    ? "bg-[#73839e]/20" 
                    : "hover:bg-white"
                    }`}
                >
                <div className="flex justify-between ">
                    <strong className="text-[#2d466e]">{extractSenderName(email.from)}</strong>
                    <span className="text-sm text-[#73839e]">{formatDate(email.date)}</span>
                </div>

                <p className="font-medium text-[#2d466e]">{email.subject}</p>
                <p className="text-[#73839e] text-sm truncate font-eirene">{email.snippet}</p>
                </div>
            ))}

            {hasMore && (
                <div className="p-4 text-center">
                <button
                    onClick={loadMoreEmails}
                    className="px-4 py-2 rounded-xl text-[#f5ece3] bg-[#2d466e] hover:bg-[#73839e]/20 hover:text-[#2d466e] transition"
                >
                    Voir plus (+10)
                </button>
                </div>
            )}
            </>
        )}
        </div>

  );
}
