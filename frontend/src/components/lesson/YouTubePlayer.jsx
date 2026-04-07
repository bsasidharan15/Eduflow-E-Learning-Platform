// frontend/src/components/lesson/YouTubePlayer.jsx
function cleanUrl(url) {
  if (!url) return url
  // Use embed URL with params that reduce YouTube branding
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}modestbranding=1&rel=0&iv_load_policy=3&color=white&showinfo=0`
}

export default function YouTubePlayer({ url }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: 'calc(56.25% + 96px)' }}>
      {/* Iframe is offset up so top/bottom chrome sit behind solid covers */}
      <iframe
        className="absolute left-0 w-full"
        style={{ top: '-48px', height: 'calc(100% + 48px)' }}
        src={cleanUrl(url)}
        title="Lesson Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Solid cover over YouTube title bar */}
      <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none z-10"
        style={{ background: '#16132A' }}
      />
      {/* Solid cover over YouTube bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10"
        style={{ background: '#16132A' }}
      />
    </div>
  )
}
