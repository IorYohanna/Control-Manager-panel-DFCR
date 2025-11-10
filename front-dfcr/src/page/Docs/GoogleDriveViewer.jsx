import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { DriveHeader } from '../../components/ui/cards/DriveHeader';
import { FileCard } from '../../components/ui/cards/FileCards';
import { FilePreview } from '../../components/ui/cards/FilePreview';
import { Folder } from 'lucide-react';

function GoogleDriveViewer() {
  const [accessToken, setAccessToken] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({ id: 'root', name: 'My Drive' });
  const [breadcrumb, setBreadcrumb] = useState([{ id: 'root', name: 'My Drive' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      localStorage.setItem('google_access_token', response.access_token);
    },
    scope: 'https://www.googleapis.com/auth/drive.readonly',
  });

  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    if (accessToken) loadFiles(currentFolder.id);
  }, [accessToken, currentFolder]);

  const loadFiles = async (folderId) => {
    setLoading(true);
    try {
      const query = `'${folderId}' in parents and trashed=false`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}&fields=files(id,name,mimeType,thumbnailLink,webViewLink,size,modifiedTime)&orderBy=folder,name`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setAccessToken(null);
          localStorage.removeItem('google_access_token');
        }
        throw new Error('Erreur de chargement');
      }

      const data = await response.json();
      setFolders(data.files.filter(f => f.mimeType === 'application/vnd.google-apps.folder'));
      setFiles(data.files.filter(f => f.mimeType !== 'application/vnd.google-apps.folder'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openFolder = (folder) => {
    setCurrentFolder({ id: folder.id, name: folder.name });
    setBreadcrumb([...breadcrumb, { id: folder.id, name: folder.name }]);
    setSelectedFile(null);
    setPreviewContent(null);
  };

  const navigateToBreadcrumb = (index) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setCurrentFolder(newBreadcrumb[newBreadcrumb.length - 1]);
    setSelectedFile(null);
    setPreviewContent(null);
  };

  const previewFile = async (file) => {
    setSelectedFile(file);
    setPreviewContent(null);
    setLoadingPreview(true);

    try {
      if (file.mimeType.startsWith('image/')) {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const blob = await res.blob();
        setPreviewContent({ type: 'image', url: URL.createObjectURL(blob) });
      } else if (
        file.mimeType.startsWith('text/') ||
        file.mimeType === 'application/json'
      ) {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const text = await res.text();
        setPreviewContent({ type: 'text', content: text });
      } else if (file.mimeType === 'application/pdf') {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const blob = await res.blob();
        setPreviewContent({ type: 'pdf', url: URL.createObjectURL(blob) });
      } else if (
        file.mimeType === 'application/vnd.google-apps.document' ||
        file.mimeType === 'application/vnd.google-apps.spreadsheet' ||
        file.mimeType === 'application/vnd.google-apps.presentation'
      ) {
        setPreviewContent({ type: 'google-doc', file });
      } else {
        setPreviewContent({ type: 'other', file });
      }
    } catch (err) {
      console.error(err);
      setPreviewContent({ type: 'error', message: 'Impossible de prévisualiser ce fichier' });
    } finally {
      setLoadingPreview(false);
    }
  };

  const downloadFile = async (file) => {
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('google_access_token');
    setFiles([]);
    setFolders([]);
    setSelectedFile(null);
    setPreviewContent(null);
    setBreadcrumb([{ id: 'root', name: 'My Drive' }]);
    setCurrentFolder({ id: 'root', name: 'My Drive' });
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!accessToken) {
    return (
      <div className="w-full bg-linear-to-br from-light-blue to-blue-zodiac rounded-2xl flex items-center justify-center m-6">
        <div className="bg-linear-to-tr from-beige-creme to-white-gray rounded-2xl shadow-2xl p-12 max-w-md w-full text-center flex flex-col items-center">
          <div className="text-6xl mb-6"><img src="/img/drive.png" alt="" className='w-20 h-20' /></div>
          <h1 className="text-3xl font-necoBlack font-bold text-gray-800 mb-4">
            Google Drive Viewer
          </h1>
          <p className="text-gray-600 mb-8 font-necoMedium">
            Connectez-vous pour accéder à vos fichiers Google Drive
          </p>
          <button
            onClick={() => login()}
            className="bg-linear-to-r from-dark-blue to-gray-400 font-eirene text-lg hover:bg-dark-blue text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 w-full"
          >
            Se connecter avec Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full m-6 rounded-2xl flex flex-col bg-gray-100">
      <DriveHeader
        currentFolder={currentFolder}
        onSearch={handleSearch}
        onLogout={logout}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          
          <div className="p-5 border-b border-gray-200 flex items-center gap-2 text-sm overflow-x-auto">
            {breadcrumb.map((crumb, i) => (
              <div key={crumb.id} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={() => navigateToBreadcrumb(i)}
                  className="font-dropline text-lg hover:text-blue-zodiac font-medium whitespace-nowrap"
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>


          <div className="flex-1 overflow-auto p-6 thin-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Chargement...</div>
              </div>
            ) : (
              <>
                {filteredFolders.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase mb-4">Dossiers</h2>
                    <div className={viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'
                      : 'space-y-1 '
                    }>
                      {filteredFolders.map((folder) => (
                        <FileCard
                          key={folder.id}
                          file={folder}
                          onClick={() => openFolder(folder)}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {filteredFiles.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold uppercase mb-4">Fichiers</h2>
                    <div className={viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'
                      : 'bg-white rounded-lg border border-gray-200 overflow-hidden'
                    }>
                      {filteredFiles.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          onClick={() => previewFile(file)}
                          onDownload={() => downloadFile(file)}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4"><Folder className='w-10 h-10' /></div>
                      <p className="text-gray-500 text-xl">Fichier Introuvable</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {selectedFile && (
          <div className="w-[30%] rounded-br-2xl border-l border-gray-200 overflow-hidden">
            <FilePreview
              file={selectedFile}
              previewContent={previewContent}
              loadingPreview={loadingPreview}
              onDownload={() => downloadFile(selectedFile)}
              href={selectedFile.webViewLink}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleDriveViewer;
