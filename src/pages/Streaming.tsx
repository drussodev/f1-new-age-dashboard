
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useF1Data } from '../context/F1DataContext';
import { Twitch, CircleOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Create a new streaming page
const Streaming = () => {
  const { config } = useF1Data();
  const streamers = config.streamers || []; // Fallback to empty array if not defined

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">F1 Live Streaming</h1>
          <p className="text-gray-600">Watch your favorite F1 drivers and commentators live</p>
        </div>

        {streamers.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <Twitch className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No streamers have been added yet. Admins can add streamers in the Config page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamers.map((streamer) => (
              <StreamerCard key={streamer.username} username={streamer.username} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

interface StreamerCardProps {
  username: string;
}

const StreamerCard: React.FC<StreamerCardProps> = ({ username }) => {
  const { data: streamInfo, isLoading } = useQuery({
    queryKey: ['stream', username],
    queryFn: async () => {
      // Simulate checking if a streamer is online
      // In a real app, you'd call the Twitch API here
      const isOnline = Math.random() > 0.5; // Random online status for demonstration
      return { isOnline };
    },
    // Refresh every minute
    refetchInterval: 60000,
  });

  const isOnline = streamInfo?.isOnline || false;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Twitch className="w-5 h-5 mr-2" />
            {username}
          </div>
          <StreamerStatus isOnline={isOnline} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse">Loading stream info...</div>
          </div>
        ) : isOnline ? (
          <div className="w-full aspect-video">
            <iframe
              src={`https://player.twitch.tv/?channel=${username}&parent=${window.location.hostname}&autoplay=false`}
              height="100%"
              width="100%"
              title={`${username}'s stream`}
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <CircleOff className="w-12 h-12 mb-2 text-gray-400" />
            <p>Stream is currently offline</p>
            <p className="text-sm text-gray-400">Check back later</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StreamerStatus: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  return (
    <div className="flex items-center">
      <div 
        className={`w-3 h-3 rounded-full mr-2 ${
          isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`} 
      />
      <span className="text-xs font-medium">
        {isOnline ? 'LIVE' : 'Offline'}
      </span>
    </div>
  );
};

export default Streaming;
