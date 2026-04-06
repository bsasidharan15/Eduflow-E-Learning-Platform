// frontend/src/components/ui/Input.jsx
export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-muted">{label}</label>
      )}
      <input
        className={`w-full bg-elevated border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all ${
          error ? 'border-red-500/60' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
