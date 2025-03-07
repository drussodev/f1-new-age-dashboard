
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Newspaper, Star, Image, Video } from 'lucide-react';

const News = () => {
  const { news } = useF1Data();
  
  // Sort news by date (newest first) and put featured news at the top
  const sortedNews = [...news].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Newspaper className="w-8 h-8 text-f1-red mr-3" />
          <h1 className="text-3xl font-bold">Latest News</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNews.map((newsItem) => (
            <Card key={newsItem.id} className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              {newsItem.imageUrl && !newsItem.videoUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={newsItem.imageUrl} 
                    alt={newsItem.title} 
                    className="w-full h-full object-cover"
                  />
                  {newsItem.featured && (
                    <div className="absolute top-2 right-2 bg-f1-red text-white p-1 rounded-md flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Featured</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-1 rounded-md flex items-center">
                    <Image className="w-4 h-4 mr-1" />
                  </div>
                </div>
              )}
              
              {newsItem.videoUrl && (
                <div className="relative h-48 overflow-hidden">
                  <iframe 
                    src={newsItem.videoUrl} 
                    title={newsItem.title}
                    className="w-full h-full object-cover"
                    allowFullScreen
                  />
                  {newsItem.featured && (
                    <div className="absolute top-2 right-2 bg-f1-red text-white p-1 rounded-md flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Featured</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-1 rounded-md flex items-center">
                    <Video className="w-4 h-4 mr-1" />
                  </div>
                </div>
              )}
              
              <CardHeader className={(!newsItem.imageUrl && !newsItem.videoUrl) ? "" : "pb-2"}>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                  {(!newsItem.imageUrl && !newsItem.videoUrl) && newsItem.featured && (
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
      </div>
    </Layout>
  );
};

export default News;
