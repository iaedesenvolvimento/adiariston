interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

export function YouTubePlayer({
  videoId,
  title,
}: YouTubePlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-sm">
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
