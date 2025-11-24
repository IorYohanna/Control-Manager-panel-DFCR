// UserAvatar.jsx
import React from 'react';

const UserAvatar = ({ user, imageUrl, size = 'w-10 h-10' }) => {
  // Fonction pour obtenir les initiales
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Fonction pour générer une couleur basée sur le nom
  const getColorFromName = (name) => {
    if (!name) return '#2D466E';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#1e40af', '#7c3aed', '#db2777', '#dc2626', 
      '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
      '#2D466E', '#73839E'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={user} 
        className={`${size} rounded-full shrink-0 object-cover`} 
      />
    );
  }

  return (
    <div 
      className={`${size} rounded-full shrink-0 flex items-center justify-center font-bold text-white`}
      style={{ backgroundColor: getColorFromName(user) }}
    >
      <span className="text-sm">{getInitials(user)}</span>
    </div>
  );
};

export default UserAvatar;