// frontend/src/components/ui/Card.jsx
export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`glass-card ${
        hover
          ? 'glow-on-hover cursor-pointer hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-300'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
