import {ChevronRight  } from 'lucide-react';

export default function EmailViewer ({
  email,
  extractSenderName,
  formatDate,
  getEmailBody,
  close,
}) {
  return (
    <div className="flex-1 bg-[#f5ece3] rounded-tr-2xl rounded-br-2xl p-6 overflow-y-auto shadow">

        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-[#2d466e]">{email.subject}</h2>

            <button
            onClick={close}
            className="p-2 rounded-full hover:bg-[#73839e]/20 transition"
            >
            <ChevronRight className="w-5 h-5 text-[#2d466e]" />
            </button>
        </div>

        <div className="flex items-start gap-4 border-b border-[#73839e]/30 pb-6 mb-6">
            <div className="w-12 h-12 bg-[#2d466e] text-white rounded-full flex items-center justify-center">
            {extractSenderName(email.from).charAt(0)}
            </div>

            <div className="flex-1">
            <strong className="text-[#2d466e]">
                {extractSenderName(email.from)}
            </strong>
            <p className="text-[#73839e]">{email.from}</p>
            </div>

            <span className="text-[#73839e]">{formatDate(email.date)}</span>
        </div>

        <div className="whitespace-pre-wrap text-[#2d466e]">
            {getEmailBody(email.body) || email.snippet}
        </div>

        </div>

  );
}