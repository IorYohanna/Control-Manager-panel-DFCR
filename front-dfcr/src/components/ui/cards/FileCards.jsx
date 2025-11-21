import { Download, Eye, File, FileText, Folder, Image, Sheet } from "lucide-react";

export function FileCard({ file, onClick, viewMode, onDownload }) {
  const getFileIcon = (mimeType) => {
    if (mimeType.includes('folder')) return <Folder className="w-full h-full" fill="currentColor" />;
    if (mimeType.includes('image')) return <Image className="w-full h-full" />;
    if (mimeType.includes('pdf')) return <File className="w-full h-full" />;
    if (mimeType.includes('document')) return <FileText className="w-full h-full" />;
    if (mimeType.includes('spreadsheet')) return <Sheet className="w-full h-full" />;
    return <File className="w-full h-full" />;
  };

  const getFileColor = (mimeType) => {
    if (mimeType.includes('folder')) return 'text-[#5f6368]';
    if (mimeType.includes('pdf')) return 'text-[#ea4335]';
    if (mimeType.includes('document')) return 'text-[#4285f4]';
    if (mimeType.includes('spreadsheet')) return 'text-[#0f9d58]';
    if (mimeType.includes('presentation')) return 'text-[#fbbc04]';
    if (mimeType.includes('image')) return 'text-blue-400';
    return 'text-[#5f6368]';
  };

  if (viewMode === 'grid') {
    return (
      <div
        onClick={onClick}
        className="group bg-white rounded-lg border border-transparent hover:border-light-blue hover:shadow-md transition-all cursor-pointer p-3"
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`w-6 h-6 ${getFileColor(file.mimeType)}`}>
            {getFileIcon(file.mimeType)}
          </div>
        </div>
        <h3 className="text-[13px] sm:text-sm text-[#202124] truncate font-dropline">{file.name}</h3>
        {file.modifiedTime && (
          <div className="text-[12px] sm:text-[13px] text-[#5f6368] font-eirene">
            {new Date(file.modifiedTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group flex flex-col sm:flex-row items-center bg-white border border-transparent rounded-xl p-4 sm:px-6 sm:py-4 hover:bg-gray-200 cursor-pointer gap-2 sm:gap-4"
    >
      <div className={`w-5 h-5 ${getFileColor(file.mimeType)} shrink-0`}>
        {getFileIcon(file.mimeType)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-sm sm:text-base text-[#202124]">{file.name}</h3>
      </div>
      <div className="flex gap-1 sm:gap-2">
        <button onClick={(e) => { e.stopPropagation(); onDownload?.(); }} className="p-1 sm:p-2 hover:bg-gray-200 rounded-full">
          <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#5f6368]" />
        </button>
        <button className="p-1 sm:p-2 hover:bg-gray-200 rounded-full">
          <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#5f6368]" />
        </button>
      </div>
    </div>
  );
}