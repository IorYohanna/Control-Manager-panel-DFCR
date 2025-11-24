import { Search } from "lucide-react";

export const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, loading, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#2d466e] to-[#24344d] hover:from-[#24344d] hover:to-[#2d466e] text-[#f5ece3] shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-[#f5ece3] text-[#24344d] border-2 border-[#c4beaf]/30 shadow-md',
    outline: 'bg-transparent hover:bg-[#2d466e] hover:text-[#f5ece3] text-[#2d466e] border border-[#2d466e]',
    ghost: 'bg-transparent hover:bg-[#f5ece3]/50 text-[#24344d]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed  ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#f5ece3] border-t-transparent" />
      ) : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export const SearchInput = ({ placeholder, value, onChange, onKeyPress }) => (
  <div className="relative flex-1">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="w-full bg-white text-[#24344d] font-medium pl-4 pr-4 py-3 border-2 border-[#c4beaf]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all placeholder-[#73839e]"
    />
  </div>
);

export const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl font-semibold font-dropline transition-all duration-300 text-sm ${active
        ? 'bg-linear-to-r from-[#2d466e] to-[#24344d] text-[#f5ece3] shadow-lg scale-105'
        : 'text-[#24344d] hover:bg-[#f5ece3] bg-white border border-[#c4beaf]/30'
      }`}
  >
    {children}
  </button>
);

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    'nouveau': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Nouveau' },
    'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
    'au_service': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Au service' },
    'assigne': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Assigné' },
    'en_traitement': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En traitement' },
    'termine': { bg: 'bg-green-100', text: 'text-green-700', label: 'Terminé' },
    'complet': { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Complet' },
    'validation_directeur': { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Validation' },
    'refuse': { bg: 'bg-red-100', text: 'text-red-700', label: 'Refusé' }
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export const Select = ({ label, required, children, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-[#24344d] font-necoMedium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      {...props}
      className="w-full px-4 py-3 border-2 border-[#c4beaf]/30 rounded-xl focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all outline-none bg-white text-[#24344d] font-medium"
    >
      {children}
    </select>
  </div>
);

export const Input = ({ label, required, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-[#24344d]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      {...props}
      className="w-full px-4 py-3 border-2 border-[#c4beaf]/30 rounded-xl focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all outline-none text-[#24344d] font-medium placeholder-[#73839e] bg-white"
    />
  </div>
);

export const Textarea = ({ label, required, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-[#24344d]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      {...props}
      className="w-full px-4 py-3 border-2 border-[#c4beaf]/30 rounded-xl focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all outline-none resize-none text-[#24344d] font-medium placeholder-[#73839e] bg-white"
    />
  </div>
);