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
        className="group bg-white rounded-lg border border-transparent hover:border-light-blue hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_rgba(60,64,67,0.15)] transition-all cursor-pointer"
      >
        <div className="p-3">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-6 h-6 ${getFileColor(file.mimeType)}`}>
              {getFileIcon(file.mimeType)}
            </div>
          </div>
          
          <div className="space-y-0.5">
            <h3 className="text-[13px] text-[#202124] truncate leading-5 font-dropline">{file.name}</h3>
            <div className="text-[12px] text-[#5f6368] leading-4 font-eirene">
              {file.modifiedTime && (
                <span>{new Date(file.modifiedTime).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short' 
                })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group flex items-center bg-white border border-transparent rounded-xl px-6 py-4 hover:bg-gray-200 cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0 font-dropline text-sm">
        <div className={`w-5 h-5 ${getFileColor(file.mimeType)} shrink-0`}>
          {getFileIcon(file.mimeType)}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-[#202124] truncate leading-5 ">{file.name}</h3>
        </div>
        
        <div className="hidden lg:block w-32 text-[#5f6368] truncate capitalize ">
          moi
        </div>
        
        <div className="hidden md:block w-28 text-[#5f6368]">
          {file.modifiedTime && (
            new Date(file.modifiedTime).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short',
              year: 'numeric'
            })
          )}
        </div>
        
        <div className="hidden xl:block w-24 text-[#5f6368] text-right">
          {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} Mo` : '-'}
        </div>
      </div>
      
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDownload?.();
          }}
          className="p-2 hover:bg-gray-200 rounded-full" 
          title="Télécharger"
        >
          <Download className="w-4 h-4 text-[#5f6368]" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <Eye className="w-4 h-4 text-[#5f6368]" />
        </button>
      </div>
    </div>
  );
}