
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Function to fetch all data from Supabase
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('*');

      if (driversError) throw driversError;
      
      // Map Supabase data to our application data model
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

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');

      if (teamsError) throw teamsError;
      
      const mappedTeams = teamsData.map(team => ({
        id: team.id,
        name: team.name,
        color: team.color,
        points: team.points,
        logo: team.logo_url
      }));
      setTeams(mappedTeams);

      // Fetch races
      const { data: racesData, error: racesError } = await supabase
        .from('races')
        .select('*');

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

      // Fetch config and streamers
      const { data: configData, error: configError } = await supabase
        .from('config')
        .select('*')
        .single();

      if (configError && configError.code !== 'PGRST116') throw configError;

      // Fetch streamers related to config
      const { data: streamersData, error: streamersError } = await supabase
        .from('streamers')
        .select('*')
        .eq('config_id', configData?.id);

      if (streamersError) throw streamersError;
      
      const mappedStreamers = streamersData.map(streamer => ({
        username: streamer.username,
        displayName: streamer.display_name
      }));

      setConfig({
        title: configData?.title || defaultConfig.title,
        season: configData?.season || defaultConfig.season,
        streamers: mappedStreamers.length > 0 ? mappedStreamers : defaultConfig.streamers
      });

      // Fetch news
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*');

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

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      toast.error('Failed to load data from the database. Using default data instead.');
      
      // If there's an error, load data from localStorage as fallback
      const savedDrivers = localStorage.getItem('f1-drivers');
      const savedTeams = localStorage.getItem('f1-teams');
      const savedRaces = localStorage.getItem('f1-races');
      const savedConfig = localStorage.getItem('f1-config');
      const savedNews = localStorage.getItem('f1-news');
      
      if (savedDrivers) setDrivers(JSON.parse(savedDrivers));
      if (savedTeams) setTeams(JSON.parse(savedTeams));
      if (savedRaces) setRaces(JSON.parse(savedRaces));
      if (savedConfig) setConfig(JSON.parse(savedConfig));
      if (savedNews) setNews(JSON.parse(savedNews));
    } finally {
      setLoading(false);
    }
  };

  // Initial data load from Supabase
  useEffect(() => {
    fetchAllData();
  }, []);

  // Update driver points in Supabase and local state
  const updateDriverPoints = async (driverId: string, points: number) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('drivers')
        .update({ points })
        .eq('id', driverId);
      
      if (error) throw error;
      
      // Update local state
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

  // Calculate team points based on driver points
  useEffect(() => {
    const teamPointsMap = new Map<string, number>();
    
    drivers.forEach(driver => {
      const teamName = driver.team;
      const currentPoints = teamPointsMap.get(teamName) || 0;
      teamPointsMap.set(teamName, currentPoints + driver.points);
    });
    
    if (teamPointsMap.size > 0) {
      // Update team points in local state
      const updatedTeams = teams.map(team => ({
        ...team,
        points: teamPointsMap.get(team.name) || 0
      }));
      
      setTeams(updatedTeams);
      
      // Update team points in Supabase (only if teams exist)
      if (teams.length > 0) {
        teams.forEach(async (team) => {
          const newPoints = teamPointsMap.get(team.name) || 0;
          if (newPoints !== team.points) {
            try {
              await supabase
                .from('teams')
                .update({ points: newPoints })
                .eq('id', team.id);
            } catch (error) {
              console.error(`Error updating points for team ${team.name}:`, error);
            }
          }
        });
      }
    }
  }, [drivers]);

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  
  const upcomingRaces = [...races]
    .filter(race => !race.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const completedRaces = [...races]
    .filter(race => race.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      loading
    }}>
      {children}
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
