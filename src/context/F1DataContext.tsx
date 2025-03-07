import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

export interface Driver {
  id: string;
  name: string;
  team: string;
  points: number;
  country: string;
  number: number;
  image: string;
  color: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  points: number;
  color: string;
}

export interface Race {
  id: string;
  name: string;
  circuit: string;
  date: string;
  country: string;
  completed: boolean;
}

export interface TournamentConfig {
  title: string;
  season: number;
  pointsSystem: {
    [position: string]: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  featured: boolean;
}

interface F1DataContextType {
  drivers: Driver[];
  teams: Team[];
  races: Race[];
  config: TournamentConfig;
  news: NewsItem[];
  updateDriverPoints: (driverId: string, newPoints: number) => void;
  updateTeamPoints: (teamId: string, newPoints: number) => void;
  updateRaceDetails: (raceId: string, updatedRace: Partial<Race>) => void;
  updateConfig: (newConfig: Partial<TournamentConfig>) => void;
  updateDriverName: (driverId: string, newName: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  addRace: (race: Omit<Race, 'id'>) => void;
  updateDriverDetails: (driverId: string, details: Partial<Driver>) => void;
  addNewsItem: (newsItem: Omit<NewsItem, 'id'>) => void;
  updateNewsItem: (id: string, updates: Partial<Omit<NewsItem, 'id'>>) => void;
  deleteNewsItem: (id: string) => void;
  sortedDrivers: Driver[];
  sortedTeams: Team[];
}

const defaultDrivers: Driver[] = [
  { id: '1', name: 'Max Verstappen', team: 'Red Bull Racing', points: 312, country: 'Netherlands', number: 1, image: '/placeholder.svg', color: '#0600EF', description: 'Reigning World Champion known for his aggressive driving style.' },
  { id: '2', name: 'Lewis Hamilton', team: 'Mercedes', points: 196, country: 'United Kingdom', number: 44, image: '/placeholder.svg', color: '#00D2BE', description: 'Seven-time World Champion and one of the most successful F1 drivers in history.' },
  { id: '3', name: 'Lando Norris', team: 'McLaren', points: 195, country: 'United Kingdom', number: 4, image: '/placeholder.svg', color: '#FF9800', description: 'Rising star known for his consistency and skill in wet conditions.' },
  { id: '4', name: 'Charles Leclerc', team: 'Ferrari', points: 175, country: 'Monaco', number: 16, image: '/placeholder.svg', color: '#DC0000', description: 'Ferrari\'s lead driver known for his qualifying pace and race craft.' },
  { id: '5', name: 'Carlos Sainz', team: 'Ferrari', points: 170, country: 'Spain', number: 55, image: '/placeholder.svg', color: '#DC0000', description: 'Consistent performer who has driven for multiple teams throughout his career.' },
  { id: '6', name: 'Oscar Piastri', team: 'McLaren', points: 165, country: 'Australia', number: 81, image: '/placeholder.svg', color: '#FF9800', description: 'Rookie sensation who was highly sought after following his junior formula success.' },
  { id: '7', name: 'Sergio Perez', team: 'Red Bull Racing', points: 155, country: 'Mexico', number: 11, image: '/placeholder.svg', color: '#0600EF', description: 'Known as the \"tire whisperer\" for his ability to manage tire wear during races.' },
  { id: '8', name: 'George Russell', team: 'Mercedes', points: 155, country: 'United Kingdom', number: 63, image: '/placeholder.svg', color: '#00D2BE', description: 'Former Williams driver who earned his promotion to Mercedes through consistent performances.' },
];

const defaultTeams: Team[] = [
  { id: '1', name: 'Red Bull Racing', points: 467, color: '#0600EF' },
  { id: '2', name: 'Mercedes', points: 351, color: '#00D2BE' },
  { id: '3', name: 'McLaren', points: 360, color: '#FF9800' },
  { id: '4', name: 'Ferrari', points: 345, color: '#DC0000' },
];

const defaultRaces: Race[] = [
  { id: '1', name: 'Bahrain Grand Prix', circuit: 'Bahrain International Circuit', date: '2024-03-02', country: 'Bahrain', completed: true },
  { id: '2', name: 'Saudi Arabian Grand Prix', circuit: 'Jeddah Corniche Circuit', date: '2024-03-09', country: 'Saudi Arabia', completed: true },
  { id: '3', name: 'Australian Grand Prix', circuit: 'Albert Park Circuit', date: '2024-03-24', country: 'Australia', completed: true },
  { id: '4', name: 'Japanese Grand Prix', circuit: 'Suzuka International Racing Course', date: '2024-04-07', country: 'Japan', completed: true },
  { id: '5', name: 'Chinese Grand Prix', circuit: 'Shanghai International Circuit', date: '2024-04-21', country: 'China', completed: true },
  { id: '6', name: 'Miami Grand Prix', circuit: 'Miami International Autodrome', date: '2024-05-05', country: 'United States', completed: false },
  { id: '7', name: 'Emilia Romagna Grand Prix', circuit: 'Autodromo Enzo e Dino Ferrari', date: '2024-05-19', country: 'Italy', completed: false },
  { id: '8', name: 'Monaco Grand Prix', circuit: 'Circuit de Monaco', date: '2024-05-26', country: 'Monaco', completed: false },
];

const defaultConfig: TournamentConfig = {
  title: 'F1 New Age',
  season: 2024,
  pointsSystem: {
    '1': 25,
    '2': 18,
    '3': 15,
    '4': 12,
    '5': 10,
    '6': 8,
    '7': 6,
    '8': 4,
    '9': 2,
    '10': 1,
  }
};

const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DRIVERS: 'f1-new-age-drivers',
  TEAMS: 'f1-new-age-teams',
  RACES: 'f1-new-age-races',
  CONFIG: 'f1-new-age-config'
};

export const F1DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    return stored ? JSON.parse(stored) : defaultDrivers;
  });
  
  const [teams, setTeams] = useState<Team[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return stored ? JSON.parse(stored) : defaultTeams;
  });
  
  const [races, setRaces] = useState<Race[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RACES);
    return stored ? JSON.parse(stored) : defaultRaces;
  });
  
  const [config, setConfig] = useState<TournamentConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return stored ? JSON.parse(stored) : defaultConfig;
  });

  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "news-1",
      title: "Season Opener: Exciting Start to the Championship",
      content: "The new season kicked off with an incredible race that saw multiple lead changes and surprising performances from rookies.",
      date: "2024-03-15",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: "news-2",
      title: "Team Changes: New Technical Directors Announced",
      content: "Multiple teams have announced changes to their technical leadership as they prepare for next season's regulation changes.",
      date: "2024-04-02",
      imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: "news-3",
      title: "Driver Market: Contract Negotiations Begin",
      content: "Several top drivers are entering negotiations for new contracts as the mid-season approaches.",
      date: "2024-04-10",
      featured: false,
    }
  ]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RACES, JSON.stringify(races));
  }, [races]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  const updateDriverPoints = (driverId: string, newPoints: number) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, points: newPoints } 
          : driver
      )
    );
    toast.success("Driver points updated successfully");
  };

  const updateTeamPoints = (teamId: string, newPoints: number) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, points: newPoints } 
          : team
      )
    );
    toast.success("Team points updated successfully");
  };

  const updateRaceDetails = (raceId: string, updatedRace: Partial<Race>) => {
    setRaces(prevRaces => 
      prevRaces.map(race => 
        race.id === raceId 
          ? { ...race, ...updatedRace } 
          : race
      )
    );
    toast.success("Race details updated successfully");
  };

  const updateConfig = (newConfig: Partial<TournamentConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
    toast.success("Tournament configuration updated");
  };

  const updateDriverName = (driverId: string, newName: string) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, name: newName } 
          : driver
      )
    );
    toast.success("Driver name updated successfully");
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: (teams.length + 1).toString() // Simple ID generation
    };
    setTeams(prevTeams => [...prevTeams, newTeam]);
    toast.success(`Team ${team.name} added successfully`);
  };

  const addRace = (race: Omit<Race, 'id'>) => {
    const newRace: Race = {
      ...race,
      id: (races.length + 1).toString() // Simple ID generation
    };
    setRaces(prevRaces => [...prevRaces, newRace]);
    toast.success(`Race ${race.name} added successfully`);
  };

  const updateDriverDetails = (driverId: string, details: Partial<Driver>) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, ...details } 
          : driver
      )
    );
    toast.success("Driver details updated successfully");
  };

  const addNewsItem = (newsItem: Omit<NewsItem, 'id'>) => {
    const newItem = {
      ...newsItem,
      id: `news-${Date.now()}`
    };
    setNews(prev => [...prev, newItem]);
  };

  const updateNewsItem = (id: string, updates: Partial<Omit<NewsItem, 'id'>>) => {
    setNews(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteNewsItem = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
  };

  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);
  
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  const value = {
    drivers,
    teams,
    races,
    config,
    news,
    updateDriverPoints,
    updateTeamPoints,
    updateRaceDetails,
    updateConfig,
    updateDriverName,
    addTeam,
    addRace,
    updateDriverDetails,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    sortedDrivers,
    sortedTeams
  };

  return (
    <F1DataContext.Provider value={value}>
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
