// frontend/src/components/lesson/YouTubePlayer.jsx
export default function YouTubePlayer({ url }) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-2xl"
        src={url}
        title="Lesson Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
