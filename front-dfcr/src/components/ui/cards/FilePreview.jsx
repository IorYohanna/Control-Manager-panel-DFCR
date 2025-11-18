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
      <div className="border-b border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="text-base font-normal text-[#202124] mb-2 wrap-break-words font-necoMedium">{file.name}</h3>
          
          <div className="space-y-2 text-[13px] text-[#5f6368]">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#202124] font-necoMedium">Type :</span>
              <span className="font-eirene">{file.mimeType?.split('/').pop() || 'Dossier'}</span>
            </div>
            
            {file.size && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#202124] font-necoMedium">Taille :</span>
                <span className="font-eirene">{(file.size / 1024 / 1024).toFixed(2)} Mo</span>
              </div>
            )}
            
            {file.modifiedTime && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#202124] font-necoMedium">Modifié :</span>
                <span className="font-eirene">
                  {new Date(file.modifiedTime).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-zodiac rounded-xl hover:bg-light-blue text-white text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </button>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#dadce0] hover:bg-[#f8f9fa] text-blue-zodiac rounded-xl text-sm font-medium transition-colors"
            >
              Ouvrir dans Drive 
            </a>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#f8f9fa]">
        {previewContent.type === 'image' && (
          <div className="flex items-center justify-center h-full p-6">
            <img
              src={previewContent.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded shadow-lg"
            />
          </div>
        )}

        {previewContent.type === 'text' && (
          <div className="p-6">
            <div className="bg-white rounded border border-[#dadce0] p-6 shadow-sm">
              <pre className="text-[13px] text-[#202124] whitespace-pre-wrap font-mono leading-relaxed">
                {previewContent.content}
              </pre>
            </div>
          </div>
        )}

        {previewContent.type === 'pdf' && (
          <div className="h-full p-4">
            <iframe
              src={previewContent.url}
              className="w-full h-full rounded border border-[#dadce0] bg-white shadow-sm"
              title={file.name}
            />
          </div>
        )}

        {previewContent.type === 'google-doc' && (
          <div className="flex items-center justify-center h-full p-6">
            <div className="bg-white rounded-lg shadow-sm border border-[#dadce0] p-10 text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#e8f0fe] rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#1a73e8]" />
              </div>
              <h3 className="text-base font-normal text-[#202124] mb-2">
                {file.name}
              </h3>
              <p className="text-sm text-[#5f6368] mb-6">
                Document Google
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded text-sm font-medium transition-colors"
              >
                Ouvrir dans Drive
              </a>
            </div>
          </div>
        )}

        {previewContent.type === 'error' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3 text-[#ea4335]">⚠️</div>
              <p className="text-sm text-[#5f6368]">{previewContent.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}