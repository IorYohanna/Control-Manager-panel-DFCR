export const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, loading, className = '' }) => {
  const variants = {
    primary: 'bg-linear-to-r from-[#2d466e] to-[#24344d] hover:from-[#24344d] hover:to-[#2d466e] text-[#f5ece3] shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-[#f5ece3] text-[#24344d] border-2 border-[#c4beaf]/30 shadow-md',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md'
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
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#f5ece3] border-t-transparent" />
      ) : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};