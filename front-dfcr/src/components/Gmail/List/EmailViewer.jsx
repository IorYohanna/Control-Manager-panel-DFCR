import {ChevronRight  } from 'lucide-react';

export default function EmailViewer ({
  email,
  extractSenderName,
  formatDate,
  getEmailBody,
  close,
}) {
  return (
    <div className="w-[100%] flex-1 bg-white rounded-tr-2xl rounded-br-2xl p-6 overflow-y-auto shadow-lg border-l border-[#73839e]/20">

        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-[#2d466e]">{email.subject}</h2>

            <button
            onClick={close}
            className="p-2 rounded-full hover:bg-[#f5ece3] transition"
            >
            <ChevronRight className="w-5 h-5 text-[#73839e]" />
            </button>
        </div>

        <div className="flex items-start gap-4 border-b border-[#73839e]/20 pb-6 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d466e] to-[#73839e] text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-md">
            {extractSenderName(email.from).charAt(0)}
            </div>

            <div className="flex-1">
            <strong className="text-[#2d466e] text-lg">
                {extractSenderName(email.from)}
            </strong>
            <p className="text-[#73839e] text-sm">{email.from}</p>
            </div>

            <span className="text-[#73839e] text-sm font-medium">{formatDate(email.date)}</span>
        </div>

        <div className="whitespace-pre-wrap text-[#2d466e] leading-relaxed font-necoMedium text-auto md:text-lg lg:text-xl">
            {getEmailBody(email.body) || email.snippet}
        </div>

        </div>

  );
}