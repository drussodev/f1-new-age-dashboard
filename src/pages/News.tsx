
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Newspaper, Star, Image, Video } from 'lucide-react';
import MediaPopup from '../components/news/MediaPopup';

const News = () => {
  const { news, loading } = useF1Data();
  const [popupMedia, setPopupMedia] = useState<{
    isOpen: boolean;
    type: 'image' | 'video';
    url: string;
    title: string;
  }>({
    isOpen: false,
    type: 'image',
    url: '',
    title: ''
  });
  
  // Sort news by date (newest first) and put featured news at the top
  const sortedNews = [...news].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Function to convert YouTube URL to embed URL
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

  const openImagePopup = (url: string, title: string) => {
    setPopupMedia({
      isOpen: true,
      type: 'image',
      url,
      title
    });
  };

  const openVideoPopup = (url: string, title: string) => {
    setPopupMedia({
      isOpen: true,
      type: 'video',
      url,
      title
    });
  };

  const closePopup = () => {
    setPopupMedia(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Newspaper className="w-8 h-8 text-f1-red mr-3" />
          <h1 className="text-3xl font-bold">Latest News</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNews.map((newsItem) => (
              <Card key={newsItem.id} className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                {newsItem.image_url && !newsItem.video_url && (
                  <div 
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => openImagePopup(newsItem.image_url!, newsItem.title)}
                  >
                    <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-md">
                      <Image className="w-4 h-4" />
                    </div>
                    <img 
                      src={newsItem.image_url} 
                      alt={newsItem.title} 
                      className="w-full h-full object-cover"
                    />
                    {newsItem.featured && (
                      <div className="absolute top-2 right-2 bg-f1-red text-white p-1 rounded-md flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                )}
                
                {newsItem.video_url && (
                  <div 
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => openVideoPopup(newsItem.video_url!, newsItem.title)}
                  >
                    <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-md z-10">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="w-full h-full">
                      <iframe 
                        src={getEmbedUrl(newsItem.video_url)} 
                        title={newsItem.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="origin"
                      ></iframe>
                    </div>
                    {newsItem.featured && (
                      <div className="absolute top-2 right-2 bg-f1-red text-white p-1 rounded-md flex items-center z-10">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                )}
                
                <CardHeader className={newsItem.image_url || newsItem.video_url ? "" : "pb-2"}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                    {!newsItem.image_url && !newsItem.video_url && newsItem.featured && (
                      <Star className="w-5 h-5 text-f1-red" />
                    )}
                  </div>
                  <CardDescription>{format(new Date(newsItem.date), 'MMMM dd, yyyy')}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p>{newsItem.content}</p>
                </CardContent>
                
                <CardFooter className="pt-2 text-sm text-gray-500">
                  <p>#{newsItem.id}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MediaPopup 
        isOpen={popupMedia.isOpen}
        onClose={closePopup}
        mediaType={popupMedia.type}
        mediaUrl={popupMedia.url}
        title={popupMedia.title}
      />
    </Layout>
  );
};

export default News;
