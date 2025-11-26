import { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Volume2, VolumeX, ChevronDown } from "lucide-react";
import {
  getCurrentUser,
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotificationWebSocket,
  formatRelativeDate,
  getNotificationIcon,
  initAudio,
  toggleSound,
  isSoundMuted
} from "../../api/Notification/notification";

function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <div
      className={`p-4 border-b border-[#2d466e]/10 hover:bg-[#2d466e]/5 transition-all duration-200 cursor-pointer ${
        !notification.read ? "bg-[#2d466e]/20" : ""
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-eirene ${!notification.read ? "font-semibold text-[#2d466e]" : "text-[#73839e]"}`}>
            {notification.message}
          </p>
          <p className="text-xs text-[#73839e] mt-1 font-eirene">
            {formatRelativeDate(notification.createdAt)}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-[#2d466e] rounded-full shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
}

export default function NotificationWidget() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const stompClientRef = useRef(null);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  const PAGE_SIZE = 10;

  // Compteur de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // ============ Initialisation utilisateur ============
  useEffect(() => {
    async function init() {
      try {
        const matricule = await getCurrentUser();
        setCurrentUser(matricule);
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur:", err);
      }
    }
    init();
  }, []);

  // ============ Initialisation de l'audio au premier clic ============
  const handleFirstInteraction = async () => {
    if (!audioInitialized) {
      const success = await initAudio();
      setAudioInitialized(success);
      setSoundMuted(isSoundMuted());
    }
  };

  // ============ Toggle son ============
  const handleToggleSound = (e) => {
    e.stopPropagation();
    const newMutedState = toggleSound();
    setSoundMuted(newMutedState);
  };

  // ============ Chargement initial des notifications ============
  useEffect(() => {
    if (!currentUser) return;
    
    async function loadNotifications() {
      setLoading(true);
      try {
        const data = await getNotifications(currentUser, 0, PAGE_SIZE);
        console.log("notification", data);

        // Vérifier le format de la réponse
        if (data.content && Array.isArray(data.content)) {
          // Format paginé Spring Boot
          setNotifications(data.content);
          setHasMore(!data.last);
          setCurrentPage(0);
        } else if (Array.isArray(data)) {
          // Format simple array (si le backend n'est pas encore modifié)
          const sorted = data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sorted.slice(0, PAGE_SIZE));
          setHasMore(sorted.length > PAGE_SIZE);
          setCurrentPage(0);
        }
      } catch (err) {
        console.error("Erreur chargement notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [currentUser]);

  // ============ Charger plus de notifications ============
  const loadMoreNotifications = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await getNotifications(currentUser, nextPage, PAGE_SIZE);
      
      if (data.content && Array.isArray(data.content)) {
        // Format paginé Spring Boot
        setNotifications(prev => [...prev, ...data.content]);
        setHasMore(!data.last);
        setCurrentPage(nextPage);
      } else if (Array.isArray(data)) {
        // Format simple array
        setNotifications(prev => [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error("Erreur chargement notifications supplémentaires:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ============ Détection du scroll pour charger plus ============
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isNearBottom && hasMore && !loadingMore) {
      loadMoreNotifications();
    }
  };

  // ============ WebSocket Connection ============
  useEffect(() => {
    if (!currentUser) return;
    
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    const client = createNotificationWebSocket(currentUser, handleNewNotification);
    stompClientRef.current = client;

    return () => {
      if (client && client.connected) {
        console.log("🔌 Déconnexion WebSocket Notifications");
        client.deactivate();
      }
    };
  }, [currentUser]);

  // ============ Gestion du clic externe ============
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // ============ Actions ============
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Erreur lors du marquage comme lu:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(currentUser);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Erreur lors du marquage de toutes les notifications:", err);
    }
  };

  // ============ Toggle dropdown avec initialisation audio ============
  const handleToggleDropdown = async () => {
    await handleFirstInteraction();
    setIsOpen(!isOpen);
  };

  // ============ Demande de permission pour les notifications du navigateur ============
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Bouton Bell */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleDropdown}
          className="relative p-2 rounded-full hover:bg-[#2d466e]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2d466e]/30"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-[#2d466e]" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-xs font-bold font-eirene rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Bouton Son */}
        {audioInitialized && (
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-full hover:bg-[#2d466e]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2d466e]/30"
            aria-label={soundMuted ? "Activer le son" : "Désactiver le son"}
            title={soundMuted ? "Activer le son" : "Désactiver le son"}
          >
            {soundMuted ? (
              <VolumeX className="w-5 h-5 text-[#ef4444]" />
            ) : (
              <Volume2 className="w-5 h-5 text-green-600" />
            )}
          </button>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 backdrop-blur-xl bg-[#f5ece3] rounded-3xl shadow-2xl border border-white/30 z-50 max-h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#2d466e]/10 flex items-center justify-between bg-linear-to-br from-[#2d466e]/5 to-transparent">
            <div>
              <h3 className="font-bold font-dropline text-[#2d466e] text-xl">Notifications</h3>
              <p className="text-xs text-[#73839e] font-eirene mt-1">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Aucune nouvelle notification"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[#2d466e] hover:text-[#1a2d4d] text-sm font-medium font-eirene flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#2d466e]/10 transition-all duration-200"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-4 h-4" />
                Tout lire
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          <div 
            ref={listRef}
            onScroll={handleScroll}
            className="overflow-y-auto flex-1"
          >
            {loading ? (
              <div className="p-8 text-center text-[#73839e]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d466e] mx-auto"></div>
                <p className="mt-2 text-sm font-eirene">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#73839e]">
                <Bell className="w-12 h-12 mx-auto text-[#2d466e]/20 mb-2" />
                <p className="text-sm font-eirene">Aucune notification</p>
              </div>
            ) : (
              <>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
                
                {/* Indicateur de chargement pour les notifications supplémentaires */}
                {loadingMore && (
                  <div className="p-4 text-center text-[#73839e]">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2d466e] mx-auto"></div>
                    <p className="mt-2 text-xs font-eirene">Chargement...</p>
                  </div>
                )}
                
                {/* Bouton pour charger plus */}
                {!loadingMore && hasMore && (
                  <div className="p-4 text-center">
                    <button
                      onClick={loadMoreNotifications}
                      className="text-[#2d466e] hover:text-[#1a2d4d] text-sm font-medium font-eirene flex items-center gap-1 mx-auto px-4 py-2 rounded-lg hover:bg-[#2d466e]/10 transition-all duration-200"
                    >
                      <ChevronDown className="w-4 h-4" />
                      Charger plus
                    </button>
                  </div>
                )}
                
                {/* Message de fin */}
                {!hasMore && notifications.length > 0 && (
                  <div className="p-4 text-center text-[#73839e]">
                    <p className="text-xs font-eirene">Toutes les notifications chargées</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-[#2d466e]/10 bg-linear-to-br from-transparent to-[#2d466e]/5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-[#2d466e] hover:text-[#1a2d4d] font-medium font-eirene py-2 rounded-lg hover:bg-[#2d466e]/10 transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}