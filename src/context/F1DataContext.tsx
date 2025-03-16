import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import * as localDataService from '@/services/mysqlService';

interface Driver {
  id: string;
  name: string;
  team: string;
  country: string;
  points: number;
  color: string;
  image_url?: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  points: number;
  logo_url?: string;
}

interface Race {
  id: string;
  name: string;
  circuit: string;
  date: string;
  location: string;
  completed: boolean;
  winner?: string;
}

interface Streamer {
  username: string;
  display_name?: string;
}

interface Config {
  title: string;
  season: string;
  streamers: Streamer[];
}

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  image_url?: string;
  video_url?: string;
  featured?: boolean;
}

interface F1DataContextType {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  races: Race[];
  setRaces: React.Dispatch<React.SetStateAction<Race[]>>;
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  news: News[];
  setNews: React.Dispatch<React.SetStateAction<News[]>>;
  sortedDrivers: Driver[];
  sortedTeams: Team[];
  upcomingRaces: Race[];
  completedRaces: Race[];
  updateDriverPoints: (driverId: string, points: number) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

const defaultConfig: Config = {
  title: 'F1 New Age Tournament',
  season: '2023',
  streamers: [
    { username: 'formula1', display_name: 'Official F1' },
    { username: 'grandprixracing', display_name: 'Grand Prix Racing' }
  ]
};

const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

export const F1DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { isAuthenticated } = useAuth();
  const isInitialLoadRef = useRef(true);

  const fetchAllData = async () => {
    console.log("Fetching all data from local storage...");
    setLoading(true);
    setError(null);
    
    try {
      const driversData = await localDataService.fetchDrivers();
      setDrivers(driversData);
      console.log("Fetched drivers:", driversData.length);

      const teamsData = await localDataService.fetchTeams();
      setTeams(teamsData);
      console.log("Fetched teams:", teamsData.length);

      const racesData = await localDataService.fetchRaces();
      setRaces(racesData);
      console.log("Fetched races:", racesData.length);

      const configData = await localDataService.fetchConfig();
      const streamersData = await localDataService.fetchStreamers();
      
      const mappedStreamers = streamersData.map(streamer => ({
        username: streamer.username,
        display_name: streamer.display_name
      }));

      setConfig({
        title: configData[0]?.title || defaultConfig.title,
        season: configData[0]?.season || defaultConfig.season,
        streamers: mappedStreamers.length > 0 ? mappedStreamers : defaultConfig.streamers
      });
      console.log("Fetched config and streamers");

      const newsData = await localDataService.fetchNews();
      setNews(newsData);
      console.log("Fetched news:", newsData.length);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data from local storage:', error);
      setError('Failed to load data from local storage.');
      toast.error('Failed to load data from local storage.');
    } finally {
      setLoading(false);
      isInitialLoadRef.current = false;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const updateDriverPoints = async (driverId: string, points: number) => {
    try {
      const success = await localDataService.updateDriverPoints(driverId, points);
      
      if (success) {
        setDrivers(prevDrivers => 
          prevDrivers.map(driver => 
            driver.id === driverId ? { ...driver, points } : driver
          )
        );
        
        const updatedTeams = await localDataService.fetchTeams();
        setTeams(updatedTeams);
        
        toast.success('Driver points updated successfully');
        setLastUpdated(new Date());
      } else {
        throw new Error('Failed to update driver points');
      }
    } catch (error) {
      console.error('Error updating driver points:', error);
      toast.error('Failed to update driver points');
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  
  const upcomingRaces = [...races]
    .filter(race => !race.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const completedRaces = [...races]
    .filter(race => race.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const refreshData = async () => {
    console.log("Manually refreshing data...");
    await fetchAllData();
    toast.success("Data refreshed successfully");
  };

  return (
    <F1DataContext.Provider value={{
      drivers, setDrivers,
      teams, setTeams,
      races, setRaces,
      config, setConfig,
      news, setNews,
      sortedDrivers,
      sortedTeams,
      upcomingRaces,
      completedRaces,
      updateDriverPoints,
      loading,
      refreshData,
      lastUpdated
    }}>
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md m-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={refreshData}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      ) : (
        children
      )}
    </F1DataContext.Provider>
  );
};

export const useF1Data = () => {
  const context = useContext(F1DataContext);
  if (context === undefined) {
    throw new Error('useF1Data must be used within a F1DataProvider');
  }
  return context;
};
