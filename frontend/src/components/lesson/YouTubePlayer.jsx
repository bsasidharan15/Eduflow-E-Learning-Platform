// frontend/src/components/lesson/YouTubePlayer.jsx
function cleanUrl(url) {
  if (!url) return url
  // Append params that minimize YouTube branding
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}modestbranding=1&rel=0&iv_load_policy=3&color=white`
}

export default function YouTubePlayer({ url }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full"
        src={cleanUrl(url)}
        title="Lesson Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Cover the top title bar that YouTube shows on hover */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(14,12,26,0.85) 0%, transparent 100%)' }}
      />
      {/* Cover the bottom-right "Watch on YouTube" button */}
      <div className="absolute bottom-0 right-0 w-44 h-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(14,12,26,0.9) 40%, transparent 100%)' }}
      />
    </div>
  )
}
