import {  Download, Eye, File, Folder, Image, Sheet, Text } from "lucide-react";

export function FileCard({ file, onClick, viewMode, onDownload }) {
  const getFileIcon = (mimeType) => {
    if (mimeType.includes('folder')) return (<Folder/>);
    if (mimeType.includes('image')) return ( <Image/>);
    if (mimeType.includes('pdf')) return (<File/>);
    if (mimeType.includes('document')) return (<Text/>);
    if (mimeType.includes('spreadsheet')) return (<Sheet/>);
    return '📄';
  };

  const getFileColor = (mimeType) => {
    if (mimeType.includes('pdf')) return 'bg-red-100 text-red-600';
    if (mimeType.includes('document')) return 'bg-blue-100 text-blue-600';
    if (mimeType.includes('spreadsheet')) return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  if (viewMode === 'grid') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 rounded-lg ${getFileColor(file.mimeType)} flex items-center justify-center text-2xl`}>
            {getFileIcon(file.mimeType)}
          </div>
        </div>
        <h3 className="font-semibold font-dropline text-gray-800 truncate mb-1">{file.name}</h3>
        <p className="text-xs text-gray-500">
          {file.size ? `${(file.size / 1024).toFixed(0)} KB` : 'Folder'}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white border-b border-gray-100 px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-lg ${getFileColor(file.mimeType)} flex items-center justify-center text-xl shrink-0`}>
          {getFileIcon(file.mimeType)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium font-dropline text-gray-800 truncate">{file.name}</h3>
          <p className="text-sm text-gray-500">
            {file.modifiedTime && new Date(file.modifiedTime).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-gray-200 rounded">
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
        <button onClick={onDownload} className="p-2 hover:bg-gray-200 rounded">
          <Download className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}