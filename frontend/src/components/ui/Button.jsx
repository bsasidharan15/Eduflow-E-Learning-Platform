// frontend/src/components/ui/Button.jsx
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/50'
  const variants = {
    primary: 'bg-accent text-white hover:brightness-110 active:scale-95 shadow-glow',
    ghost: 'border border-accent/50 text-accent hover:bg-accent/10 active:scale-95',
    danger: 'bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30 active:scale-95',
    subtle: 'bg-elevated text-white/80 hover:bg-white/10 active:scale-95',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
