
import React from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MediaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
}

const MediaPopup: React.FC<MediaPopupProps> = ({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  title,
}) => {
  const [fullScreen, setFullScreen] = React.useState(false);

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  if (!isOpen) return null;

  // Function to convert YouTube URL to embed URL (same as in News.tsx)
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Extract video ID from different YouTube URL formats
    let videoId = '';
    
    // Match youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (watchMatch) videoId = watchMatch[1];
    
    // Match youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) videoId = shortMatch[1];
    
    // Match youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) videoId = embedMatch[1];
    
    if (!videoId) return url; // Return original if no match
    
    // Return proper embed URL with necessary parameters
    return `https://www.youtube.com/embed/${videoId}?origin=${window.location.origin}`;
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/70 z-50 flex items-center justify-center",
        fullScreen ? "p-0" : "p-4"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "bg-white rounded-lg overflow-hidden shadow-xl flex flex-col",
          fullScreen ? "w-full h-full" : "max-w-4xl w-full max-h-[80vh]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
          <h3 className="font-medium truncate">{title}</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullScreen}
              className="h-8 w-8"
            >
              {fullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto relative">
          {mediaType === 'image' && (
            <img 
              src={mediaUrl} 
              alt={title} 
              className="w-full h-full object-contain"
            />
          )}
          
          {mediaType === 'video' && (
            <div className="w-full h-full">
              <iframe 
                src={getEmbedUrl(mediaUrl)}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="origin"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPopup;
