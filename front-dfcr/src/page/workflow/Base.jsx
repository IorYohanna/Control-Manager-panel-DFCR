export const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, loading, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export const  SearchInput = ({ placeholder, value, onChange, onKeyPress }) => (
  <div className="relative flex-1">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="w-full text-gray-500 pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
    />
  </div>
);

 export const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      {...props}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-sm"
    >
      {children}
    </select>
  </div>
);

export const Input = ({ label, required, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
    />
  </div>
);

export const Textarea = ({ label, required, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      {...props}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-sm"
    />
  </div>
);