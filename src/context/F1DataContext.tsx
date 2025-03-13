import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const defaultDrivers: Driver[] = [
  { id: '1', name: 'Lewis Hamilton', team: 'Mercedes', country: 'United Kingdom', points: 180, color: '#00D2BE' },
  { id: '2', name: 'Max Verstappen', team: 'Red Bull Racing', country: 'Netherlands', points: 220, color: '#0600EF' },
  { id: '3', name: 'Charles Leclerc', team: 'Ferrari', country: 'Monaco', points: 150, color: '#DC0000' },
  { id: '4', name: 'Lando Norris', team: 'McLaren', country: 'United Kingdom', points: 130, color: '#FF8700' },
  { id: '5', name: 'Carlos Sainz', team: 'Ferrari', country: 'Spain', points: 140, color: '#DC0000' },
  { id: '6', name: 'Sergio Perez', team: 'Red Bull Racing', country: 'Mexico', points: 190, color: '#0600EF' },
];

const defaultTeams: Team[] = [
  { id: '1', name: 'Mercedes', color: '#00D2BE', points: 280 },
  { id: '2', name: 'Red Bull Racing', color: '#0600EF', points: 410 },
  { id: '3', name: 'Ferrari', color: '#DC0000', points: 290 },
  { id: '4', name: 'McLaren', color: '#FF8700', points: 240 },
  { id: '5', name: 'Aston Martin', color: '#006F62', points: 160 },
  { id: '6', name: 'Alpine', color: '#0090FF', points: 100 },
  { id: '7', name: 'Williams', color: '#005AFF', points: 40 },
  { id: '8', name: 'AlphaTauri', color: '#2B4562', points: 30 },
  { id: '9', name: 'Sauber', color: '#900000', points: 20 },
  { id: '10', name: 'Haas F1 Team', color: '#FFFFFF', points: 15 },
];

const defaultRaces: Race[] = [
  { id: '1', name: 'Bahrain Grand Prix', circuit: 'Bahrain International Circuit', date: '2023-03-05', location: 'Sakhir, Bahrain', completed: true, winner: 'Max Verstappen' },
  { id: '2', name: 'Saudi Arabian Grand Prix', circuit: 'Jeddah Corniche Circuit', date: '2023-03-19', location: 'Jeddah, Saudi Arabia', completed: true, winner: 'Sergio Perez' },
  { id: '3', name: 'Australian Grand Prix', circuit: 'Albert Park Circuit', date: '2023-04-02', location: 'Melbourne, Australia', completed: true, winner: 'Max Verstappen' },
  { id: '4', name: 'Azerbaijan Grand Prix', circuit: 'Baku City Circuit', date: '2023-04-30', location: 'Baku, Azerbaijan', completed: false },
  { id: '5', name: 'Miami Grand Prix', circuit: 'Miami International Autodrome', date: '2023-05-07', location: 'Miami, USA', completed: false },
];

const defaultConfig: Config = {
  title: 'F1 New Age Tournament',
  season: '2023',
  streamers: [
    { username: 'formula1', displayName: 'Official F1' },
    { username: 'grandprixracing', displayName: 'Grand Prix Racing' }
  ]
};

const defaultNews: News[] = [
  {
    id: '1',
    title: 'Hamilton Dominates in Monaco',
    content: 'Lewis Hamilton takes a commanding win at the Monaco Grand Prix, extending his championship lead.',
    date: '2023-05-28',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000',
    featured: true
  },
  {
    id: '2',
    title: 'Verstappen Signs New Contract',
    content: 'Max Verstappen has signed a new multi-year contract with Red Bull Racing, securing his future with the team.',
    date: '2023-05-24',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2000'
  },
];

const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

export const F1DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('f1-drivers');
    return saved ? JSON.parse(saved) : defaultDrivers;
  });
  
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('f1-teams');
    return saved ? JSON.parse(saved) : defaultTeams;
  });
  
  const [races, setRaces] = useState<Race[]>(() => {
    const saved = localStorage.getItem('f1-races');
    return saved ? JSON.parse(saved) : defaultRaces;
  });
  
  const [config, setConfig] = useState<Config>(() => {
    const saved = localStorage.getItem('f1-config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  
  const [news, setNews] = useState<News[]>(() => {
    const saved = localStorage.getItem('f1-news');
    return saved ? JSON.parse(saved) : defaultNews;
  });

  useEffect(() => {
    localStorage.setItem('f1-drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('f1-teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('f1-races', JSON.stringify(races));
  }, [races]);

  useEffect(() => {
    localStorage.setItem('f1-config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('f1-news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    const teamPointsMap = new Map<string, number>();
    
    drivers.forEach(driver => {
      const teamName = driver.team;
      const currentPoints = teamPointsMap.get(teamName) || 0;
      teamPointsMap.set(teamName, currentPoints + driver.points);
    });
    
    if (teamPointsMap.size > 0) {
      setTeams(prevTeams => 
        prevTeams.map(team => ({
          ...team,
          points: teamPointsMap.get(team.name) || 0
        }))
      );
    }
  }, [drivers]);

  const updateDriverPoints = (driverId: string, points: number) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId ? { ...driver, points } : driver
      )
    );
  };

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
      updateDriverPoints
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
