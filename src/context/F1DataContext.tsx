import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface Driver {
  id: string;
  name: string;
  team: string;
  country: string;
  points: number;
  color: string;
  image?: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  points: number;
  logo?: string;
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
  displayName?: string;
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
  imageUrl?: string;
  videoUrl?: string;
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
    { username: 'formula1', displayName: 'Official F1' },
    { username: 'grandprixracing', displayName: 'Grand Prix Racing' }
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

  const fetchAllData = async () => {
    console.log("Fetching all data from Supabase...");
    setLoading(true);
    setError(null);
    
    try {
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('*')
        .order('points', { ascending: false });

      if (driversError) throw driversError;
      
      const mappedDrivers = driversData.map(driver => ({
        id: driver.id,
        name: driver.name,
        team: driver.team,
        country: driver.country,
        points: driver.points,
        color: driver.color,
        image: driver.image_url
      }));
      setDrivers(mappedDrivers);
      console.log("Fetched drivers:", mappedDrivers.length);

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('points', { ascending: false });

      if (teamsError) throw teamsError;
      
      const mappedTeams = teamsData.map(team => ({
        id: team.id,
        name: team.name,
        color: team.color,
        points: team.points,
        logo: team.logo_url
      }));
      setTeams(mappedTeams);
      console.log("Fetched teams:", mappedTeams.length);

      const { data: racesData, error: racesError } = await supabase
        .from('races')
        .select('*')
        .order('date', { ascending: true });

      if (racesError) throw racesError;
      
      const mappedRaces = racesData.map(race => ({
        id: race.id,
        name: race.name,
        circuit: race.circuit,
        date: race.date,
        location: race.location,
        completed: race.completed,
        winner: race.winner
      }));
      setRaces(mappedRaces);
      console.log("Fetched races:", mappedRaces.length);

      const { data: configData, error: configError } = await supabase
        .from('config')
        .select('*')
        .single();

      if (configError && configError.code !== 'PGRST116') throw configError;

      let streamersData = [];
      if (configData?.id) {
        const { data: fetchedStreamers, error: streamersError } = await supabase
          .from('streamers')
          .select('*')
          .eq('config_id', configData.id);

        if (streamersError) throw streamersError;
        streamersData = fetchedStreamers;
      }
      
      const mappedStreamers = streamersData.map(streamer => ({
        username: streamer.username,
        displayName: streamer.display_name
      }));

      setConfig({
        title: configData?.title || defaultConfig.title,
        season: configData?.season || defaultConfig.season,
        streamers: mappedStreamers.length > 0 ? mappedStreamers : defaultConfig.streamers
      });
      console.log("Fetched config and streamers");

      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

      if (newsError) throw newsError;
      
      const mappedNews = newsData.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        date: item.date,
        imageUrl: item.image_url,
        videoUrl: item.video_url,
        featured: item.featured
      }));
      setNews(mappedNews);
      console.log("Fetched news:", mappedNews.length);
      
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      setError('Failed to load data from the database.');
      toast.error('Failed to load data from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    console.log("Setting up Supabase realtime subscriptions...");
    
    const setupRealtimeSubscriptions = async () => {
      try {
        const driversChannel = supabase
          .channel('drivers-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'drivers' 
          }, () => {
            console.log("Drivers changed, refreshing data...");
            fetchAllData();
          })
          .subscribe();
          
        const teamsChannel = supabase
          .channel('teams-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'teams' 
          }, () => {
            console.log("Teams changed, refreshing data...");
            fetchAllData();
          })
          .subscribe();
          
        const racesChannel = supabase
          .channel('races-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'races' 
          }, () => {
            console.log("Races changed, refreshing data...");
            fetchAllData();
          })
          .subscribe();
          
        const newsChannel = supabase
          .channel('news-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'news' 
          }, () => {
            console.log("News changed, refreshing data...");
            fetchAllData();
          })
          .subscribe();
          
        const configChannel = supabase
          .channel('config-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'config' 
          }, () => {
            console.log("Config changed, refreshing data...");
            fetchAllData();
          })
          .subscribe();

        return () => {
          supabase.removeChannel(driversChannel);
          supabase.removeChannel(teamsChannel);
          supabase.removeChannel(racesChannel);
          supabase.removeChannel(newsChannel);
          supabase.removeChannel(configChannel);
        };
      } catch (error) {
        console.error("Error setting up realtime subscriptions:", error);
        toast.error("Failed to set up realtime updates");
      }
    };

    setupRealtimeSubscriptions();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const updateDriverPoints = async (driverId: string, points: number) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ points })
        .eq('id', driverId);
      
      if (error) throw error;
      
      const driver = drivers.find(d => d.id === driverId);
      if (driver) {
        const team = teams.find(t => t.name === driver.team);
        if (team) {
          const teamDrivers = drivers.filter(d => d.team === team.name && d.id !== driverId);
          const newTeamPoints = teamDrivers.reduce((sum, d) => sum + d.points, points);
          
          const { error: teamError } = await supabase
            .from('teams')
            .update({ points: newTeamPoints })
            .eq('id', team.id);
            
          if (teamError) throw teamError;
        }
      }
      
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver.id === driverId ? { ...driver, points } : driver
        )
      );
      
      toast.success('Driver points updated successfully');
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
