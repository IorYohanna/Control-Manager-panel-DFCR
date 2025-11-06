import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

function GoogleDriveViewer() {
  const [accessToken, setAccessToken] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [breadcrumb, setBreadcrumb] = useState([{ id: 'root', name: 'Mon Drive' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    console.error('VITE_GOOGLE_CLIENT_ID n\'est pas défini dans le fichier .env');
  }

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      localStorage.setItem('google_access_token', response.access_token);
    },
    scope: 'https://www.googleapis.com/auth/drive.readonly',
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      loadFiles(currentFolder);
    }
  }, [accessToken, currentFolder]);

  const loadFiles = async (folderId) => {
    setLoading(true);
    try {
      const query = `'${folderId}' in parents and trashed=false`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,iconLink,thumbnailLink,webViewLink,webContentLink,size,modifiedTime)&orderBy=folder,name`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setAccessToken(null);
          localStorage.removeItem('google_access_token');
        }
        throw new Error('Erreur de chargement');
      }

      const data = await response.json();
      
      const foldersList = data.files.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
      const filesList = data.files.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');
      
      setFolders(foldersList);
      setFiles(filesList);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const openFolder = (folder) => {
    setCurrentFolder(folder.id);
    setBreadcrumb([...breadcrumb, { id: folder.id, name: folder.name }]);
    setSelectedFile(null);
    setPreviewContent(null);
  };

  const navigateToBreadcrumb = (index) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setCurrentFolder(newBreadcrumb[newBreadcrumb.length - 1].id);
    setSelectedFile(null);
    setPreviewContent(null);
  };

  const previewFile = async (file) => {
    setSelectedFile(file);
    setPreviewContent(null);
    setLoadingPreview(true);

    try {
      // Pour les images
      if (file.mimeType.startsWith('image/')) {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewContent({ type: 'image', url });
      }
      // Pour les fichiers texte
      else if (
        file.mimeType.startsWith('text/') || 
        file.mimeType === 'application/json' ||
        file.mimeType === 'application/javascript' ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.js') ||
        file.name.endsWith('.css') ||
        file.name.endsWith('.html') ||
        file.name.endsWith('.md')
      ) {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const text = await response.text();
        setPreviewContent({ type: 'text', content: text });
      }
      // Pour les PDFs
      else if (file.mimeType === 'application/pdf') {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewContent({ type: 'pdf', url });
      }
      // Pour les Google Docs, Sheets, Slides
      else if (
        file.mimeType === 'application/vnd.google-apps.document' ||
        file.mimeType === 'application/vnd.google-apps.spreadsheet' ||
        file.mimeType === 'application/vnd.google-apps.presentation'
      ) {
        setPreviewContent({ type: 'google-doc', file });
      }
      // Pour les autres fichiers
      else {
        setPreviewContent({ type: 'other', file });
      }
    } catch (error) {
      console.error('Erreur preview:', error);
      setPreviewContent({ type: 'error', message: 'Impossible de prévisualiser ce fichier' });
    } finally {
      setLoadingPreview(false);
    }
  };

  const downloadFile = async (file) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    const sizes = ['o', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('google_access_token');
    setFiles([]);
    setFolders([]);
    setSelectedFile(null);
    setPreviewContent(null);
  };

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6">📁</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Google Drive Viewer
          </h1>
          <p className="text-gray-600 mb-8">
            Connectez-vous pour accéder à vos fichiers Google Drive
          </p>
          <button
            onClick={() => login()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 w-full"
          >
            🔐 Se connecter avec Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Mon Google Drive</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Liste des fichiers */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Breadcrumb */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-sm overflow-x-auto">
                {breadcrumb.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center">
                    {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                    <button
                      onClick={() => navigateToBreadcrumb(index)}
                      className="text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                    >
                      {crumb.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Liste des fichiers */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Chargement...</div>
                </div>
              ) : (
                <div>
                  {/* Dossiers */}
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => openFolder(folder)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                    >
                      <span className="text-2xl">📁</span>
                      <span className="text-gray-800 font-medium flex-1 truncate">
                        {folder.name}
                      </span>
                    </div>
                  ))}

                  {/* Fichiers */}
                  {files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => previewFile(file)}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                        selectedFile?.id === file.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {file.thumbnailLink ? (
                          <img src={file.thumbnailLink} alt="" className="w-8 h-8 object-cover rounded" />
                        ) : file.iconLink ? (
                          <img src={file.iconLink} alt="" className="w-6 h-6" />
                        ) : (
                          <span className="text-2xl">📄</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-800 font-medium truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {formatDate(file.modifiedTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {folders.length === 0 && files.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-2">📂</div>
                      <div>Aucun fichier</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-gray-100 flex flex-col">
            {selectedFile ? (
              <>
                <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 truncate flex-1">
                    {selectedFile.name}
                  </h2>
                  <div className="flex space-x-2">
                    <a
                      href={selectedFile.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
                    >
                      Ouvrir dans Drive
                    </a>
                    <button
                      onClick={() => downloadFile(selectedFile)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                      ⬇ Télécharger
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  {loadingPreview ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Chargement de la prévisualisation...</div>
                    </div>
                  ) : previewContent ? (
                    <>
                      {previewContent.type === 'image' && (
                        <div className="flex items-center justify-center h-full">
                          <img 
                            src={previewContent.url} 
                            alt={selectedFile.name} 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg" 
                          />
                        </div>
                      )}
                      
                      {previewContent.type === 'text' && (
                        <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-auto">
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                            {previewContent.content}
                          </pre>
                        </div>
                      )}
                      
                      {previewContent.type === 'pdf' && (
                        <div className="h-full">
                          <iframe
                            src={previewContent.url}
                            className="w-full h-full rounded-lg shadow-lg bg-white"
                            title={selectedFile.name}
                          />
                        </div>
                      )}
                      
                      {previewContent.type === 'google-doc' && (
                        <div className="flex items-center justify-center h-full">
                          <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {selectedFile.name}
                            </h3>
                            <p className="text-gray-600 mb-6">
                              Document Google (Docs, Sheets ou Slides)
                            </p>
                            <a
                              href={selectedFile.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                              Ouvrir dans Google Drive
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {(previewContent.type === 'other' || previewContent.type === 'error') && (
                        <div className="flex items-center justify-center h-full">
                          <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {selectedFile.name}
                            </h3>
                            <p className="text-gray-600 mb-6">
                              {previewContent.message || 'Prévisualisation non disponible pour ce type de fichier'}
                            </p>
                            <div className="space-y-2">
                              <a
                                href={selectedFile.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                              >
                                Ouvrir dans Google Drive
                              </a>
                              <button
                                onClick={() => downloadFile(selectedFile)}
                                className="block w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                              >
                                Télécharger le fichier
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">👈</div>
                  <div className="text-lg">Sélectionnez un fichier pour le prévisualiser</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleDriveViewer;