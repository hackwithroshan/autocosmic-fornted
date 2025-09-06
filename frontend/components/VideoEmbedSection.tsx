
import React from 'react';

interface VideoEmbedSectionProps {
  url: string;
}

const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    let videoId;
    if (url.includes('youtube.com/watch?v=')) {
        videoId = new URL(url).searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (url.includes('youtu.be/')) {
        videoId = url.split('/').pop();
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (url.includes('vimeo.com/')) {
        videoId = url.split('/').pop();
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
}

const VideoEmbedSection: React.FC<VideoEmbedSectionProps> = ({ url }) => {
  const embedUrl = getEmbedUrl(url);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {embedUrl ? (
          <div className="aspect-video w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title="Embedded Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p>Invalid or unsupported video URL. Please provide a valid YouTube or Vimeo link.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoEmbedSection;