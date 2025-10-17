export default function ProviderIcon({ provider, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl'
  };

  const icons = {
    gmail: '📧',
    outlook: '📮',
    yahoo: '📬',
    imap: '✉️'
  };

  const colors = {
    gmail: 'from-red-500 to-red-600',
    outlook: 'from-blue-500 to-blue-600',
    yahoo: 'from-purple-500 to-purple-600',
    imap: 'from-gray-500 to-gray-600'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${
        colors[provider] || colors.imap
      } flex items-center justify-center`}
    >
      {icons[provider] || icons.imap}
    </div>
  );
}