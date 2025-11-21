import { Download, FileText } from "lucide-react";

export function FilePreview({ file, previewContent, loadingPreview, onDownload, href = "" }) {
  if (loadingPreview) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a73e8]"></div>
      </div>
    );
  }

  if (!previewContent) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="text-6xl mb-3 text-[#dadce0]">📄</div>
          <p className="text-sm text-[#5f6368]">Aucun élément sélectionné</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-necoMedium text-[#202124] truncate">{file.name}</h3>
        <div className="text-[12px] sm:text-[13px] text-[#5f6368] font-eirene space-y-1">
          <div><span className="font-medium">Type :</span> {file.mimeType?.split('/').pop() || 'Dossier'}</div>
          {file.size && <div><span className="font-medium">Taille :</span> {(file.size / 1024 / 1024).toFixed(2)} Mo</div>}
          {file.modifiedTime && <div><span className="font-medium">Modifié :</span> {new Date(file.modifiedTime).toLocaleDateString('fr-FR')}</div>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button onClick={onDownload} className="flex items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-blue-zodiac rounded-xl hover:bg-light-blue text-white text-sm sm:text-base font-medium transition-all">
            <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Télécharger
          </button>
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="px-3 sm:px-4 py-1 sm:py-2 border border-[#dadce0] hover:bg-[#f8f9fa] text-blue-zodiac rounded-xl text-sm sm:text-base font-medium text-center transition-all">
              Ouvrir dans Drive
            </a>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#f8f9fa] p-2 sm:p-4">
        {previewContent.type === 'image' && (
          <img src={previewContent.url} alt={file.name} className="max-w-full max-h-full object-contain rounded shadow-lg mx-auto" />
        )}
        {previewContent.type === 'text' && (
          <pre className="text-[12px] sm:text-[13px] font-mono whitespace-pre-wrap">{previewContent.content}</pre>
        )}
        {previewContent.type === 'pdf' && (
          <iframe src={previewContent.url} className="w-full h-full rounded border border-[#dadce0]" title={file.name} />
        )}
      </div>
    </div>

  );
}