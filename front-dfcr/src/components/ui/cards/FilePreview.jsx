export function FilePreview({ file, previewContent, loadingPreview, onDownload, href = "" }) {
  if (loadingPreview) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Chargement.....</div>
      </div>
    );
  }

  if (!previewContent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-500">Selectionner un fichier à prévisualiser</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 truncate ">{file.name}</h3>
        <button
          onClick={onDownload}
          className="flex gap-2 items-center px-4 py-2 bg-light-blue hover:bg-blue-zodiac text-white rounded-lg text-sm"
        >
            <img src="/img/telechargements.png" alt="" className="w-4 h-4" />
          Télécharger
        </button>
      </div>

      <div className="flex-1 bg-white rounded-br-2xl overflow-auto p-2">
        {previewContent.type === 'image' && (
          <img
            src={previewContent.url}
            alt={file.name}
            className="max-w-full h-auto rounded-lg"
          />
        )}

        {previewContent.type === 'text' && (
          <pre className="p-4 rounded-lg text-sm overflow-auto">
            {previewContent.content}
          </pre>
        )}

        {previewContent.type === 'pdf' && (
          <iframe
            src={previewContent.url}
            className="w-full h-full rounded-lg"
            title={file.name}
          />
        )}

        {previewContent.type === 'google-doc' && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {file.name}
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Document Google (Docs, Sheets ou Slides)
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Ouvrir dans Google Drive
              </a>
            </div>
          </div>
        )}


      </div>
    </div >
  );
}