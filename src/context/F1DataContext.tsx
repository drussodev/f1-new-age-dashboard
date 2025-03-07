import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Types for F1 Data
interface Driver {
  id: string;
  name: string;
  team: string;
  points: number;
  position: number;
  number: number;
  color: string;
  imageUrl?: string;
  image?: string;
  description?: string;
  country?: string;
}

interface Team {
  id: string;
  name: string;
  points: number;
  position: number;
  color: string;
  drivers: string[];
}

interface Race {
  id: string;
  name: string;
  date: string;
  circuit: string;
  country: string;
  location: string;
  winner?: string;
  completed: boolean;
  imageUrl?: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  featured?: boolean;
}

interface Config {
  title: string;
  season: string;
  nextRace: string;
  pointsSystem: {
    [position: string]: number;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

interface F1DataContextType {
  drivers: Driver[];
  teams: Team[];
  races: Race[];
  news: News[];
  config: Config;
  sortedDrivers: Driver[];
  sortedTeams: Team[];
  updateDriverName: (id: string, name: string) => void;
  updateDriverTeam: (id: string, team: string) => void;
  updateTeamName: (id: string, name: string) => void;
  updateTeamColor: (id: string, color: string) => void;
  updateRaceName: (id: string, name: string) => void;
  updateRaceCircuit: (id: string, circuit: string) => void;
  updateRaceLocation: (id: string, location: string) => void;
  updateRaceDate: (id: string, date: string) => void;
  updateRaceWinner: (id: string, winner: string) => void;
  updateRaceCompleted: (id: string, completed: boolean) => void;
  updateDriverPoints: (id: string, points: number) => void;
  updateTeamPoints: (id: string, points: number) => void;
  updateConfig: (newConfig: Partial<Config>) => void;
  updateDriverDescription: (id: string, description: string) => void;
  updateDriverCountry: (id: string, country: string) => void;
  updateDriverPhoto: (id: string, imageUrl: string) => void;
  addNews: (news: Omit<News, 'id'>) => string;
  updateNews: (id: string, updates: Partial<Omit<News, 'id'>>) => void;
  deleteNews: (id: string) => void;
  addNewsItem: (newsItem: any) => void;
  updateNewsItem: (id: string, updates: any) => void;
  deleteNewsItem: (id: string) => void;
  updateRaceDetails: (id: string, details: any) => void;
  addTeam: (team: any) => void;
  addRace: (race: any) => void;
  updateDriverDetails: (id: string, details: any) => void;
}

// Initial data
const initialDrivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    points: 395,
    position: 1,
    number: 1,
    color: '#0600EF',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    description: 'The reigning world champion known for his aggressive driving style.',
    country: 'Netherlands'
  },
  {
    id: 'driver-2',
    name: 'Sergio Pérez',
    team: 'Red Bull Racing',
    points: 285,
    position: 2,
    number: 11,
    color: '#0600EF',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
    description: 'An experienced driver known for his strategic racing and tire management.',
    country: 'Mexico'
  },
  {
    id: 'driver-3',
    name: 'Lewis Hamilton',
    team: 'Mercedes',
    points: 240,
    position: 3,
    number: 44,
    color: '#00D2BE',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    description: 'A seven-time world champion and one of the greatest drivers of all time.',
    country: 'United Kingdom'
  },
  {
    id: 'driver-4',
    name: 'Fernando Alonso',
    team: 'Aston Martin',
    points: 200,
    position: 4,
    number: 14,
    color: '#006F62',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
    description: 'A two-time world champion making a strong comeback with Aston Martin.',
    country: 'Spain'
  },
  {
    id: 'driver-5',
    name: 'Charles Leclerc',
    team: 'Ferrari',
    points: 180,
    position: 5,
    number: 16,
    color: '#DC0000',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CHLLEC01_Charles_Leclerc/chllec01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CHLLEC01_Charles_Leclerc/chllec01.png',
    description: 'A young and talented driver known for his qualifying speed.',
    country: 'Monaco'
  },
  {
    id: 'driver-6',
    name: 'Lando Norris',
    team: 'McLaren',
    points: 160,
    position: 6,
    number: 47,
    color: '#FF8700',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    description: 'A rising star with consistent performances and a fan favorite.',
    country: 'United Kingdom'
  },
  {
    id: 'driver-7',
    name: 'Carlos Sainz Jr.',
    team: 'Ferrari',
    points: 150,
    position: 7,
    number: 55,
    color: '#DC0000',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    description: 'A consistent performer with a strong racing pedigree.',
    country: 'Spain'
  },
  {
    id: 'driver-8',
    name: 'George Russell',
    team: 'Mercedes',
    points: 140,
    position: 8,
    number: 12,
    color: '#00D2BE',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    description: 'A young and promising driver with a bright future.',
    country: 'United Kingdom'
  },
  {
    id: 'driver-9',
    name: 'Oscar Piastri',
    team: 'McLaren',
    points: 120,
    position: 9,
    number: 18,
    color: '#FF8700',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    description: 'A talented rookie making a name for himself in Formula 1.',
    country: 'Australia'
  },
  {
    id: 'driver-10',
    name: 'Lance Stroll',
    team: 'Aston Martin',
    points: 100,
    position: 10,
    number: 10,
    color: '#006F62',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
    image: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
    description: 'A solid driver with experience and occasional flashes of brilliance.',
    country: 'Canada'
  }
];

const initialTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Red Bull Racing',
    points: 680,
    position: 1,
    color: '#0600EF',
    drivers: ['driver-1', 'driver-2']
  },
  {
    id: 'team-2',
    name: 'Mercedes',
    points: 380,
    position: 2,
    color: '#00D2BE',
    drivers: ['driver-3', 'driver-8']
  },
  {
    id: 'team-3',
    name: 'Ferrari',
    points: 330,
    position: 3,
    color: '#DC0000',
    drivers: ['driver-5', 'driver-7']
  },
  {
    id: 'team-4',
    name: 'McLaren',
    points: 280,
    position: 4,
    color: '#FF8700',
    drivers: ['driver-6', 'driver-9']
  },
  {
    id: 'team-5',
    name: 'Aston Martin',
    points: 240,
    position: 5,
    color: '#006F62',
    drivers: ['driver-4', 'driver-10']
  }
];

const initialRaces: Race[] = [
  {
    id: 'race-1',
    name: 'Bahrain Grand Prix',
    date: '2024-02-29',
    circuit: 'Bahrain International Circuit',
    country: 'Bahrain',
    location: 'Sakhir, Bahrain',
    winner: 'Max Verstappen',
    completed: true,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/races/2024/Bahrain/Circuit.png'
  },
  {
    id: 'race-2',
    name: 'Saudi Arabian Grand Prix',
    date: '2024-03-07',
    circuit: 'Jeddah Street Circuit',
    country: 'Saudi Arabia',
    location: 'Jeddah, Saudi Arabia',
    winner: 'Sergio Pérez',
    completed: true,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/races/2024/Saudi%20Arabia/Circuit.png'
  },
  {
    id: 'race-3',
    name: 'Australian Grand Prix',
    date: '2024-03-21',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    location: 'Melbourne, Australia',
    winner: 'Carlos Sainz Jr.',
    completed: true,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/races/2024/Australia/Circuit.png'
  },
  {
    id: 'race-4',
    name: 'Japanese Grand Prix',
    date: '2024-04-04',
    circuit: 'Suzuka International Racing Course',
    country: 'Japan',
    location: 'Suzuka, Japan',
    winner: 'Max Verstappen',
    completed: true,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/races/2024/Japan/Circuit.png'
  },
  {
    id: 'race-5',
    name: 'Chinese Grand Prix',
    date: '2024-04-18',
    circuit: 'Shanghai International Circuit',
    country: 'China',
    location: 'Shanghai, China',
    completed: false,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/races/2024/China/Circuit.png'
  },
  {
    id: 'race-6',
    name: 'Miami Grand Prix',
    date: '2024-05-02',
    circuit: 'Miami International Autodrome',
    country: 'USA',
    location: 'Miami, Florida, USA',
    completed: false,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/races/2024/Miami/Circuit.png'
  }
];

const initialNews: News[] = [
  {
    id: 'news-1',
    title: 'Verstappen Dominates Bahrain GP',
    content: 'Max Verstappen secured a dominant victory at the Bahrain Grand Prix, leading from start to finish.',
    date: '2024-02-29',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/sutton/2024/Bahrain/1371279-Portrait.jpg',
    featured: true
  },
  {
    id: 'news-2',
    title: 'Pérez Wins Saudi Arabian GP',
    content: 'Sergio Pérez wins the Saudi Arabian Grand Prix after teammate Verstappen experiences mechanical issues.',
    date: '2024-03-07',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/sutton/2024/Saudi%20Arabia/1371797-Portrait.jpg'
  },
  {
    id: 'news-3',
    title: 'Sainz Triumphs in Australia',
    content: 'Carlos Sainz Jr. takes the victory in a chaotic Australian Grand Prix, following a strategic masterclass.',
    date: '2024-03-21',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/sutton/2024/Australia/1372894-Portrait.jpg'
  },
  {
    id: 'news-4',
    title: 'Verstappen Back on Top in Japan',
    content: 'Max Verstappen returns to winning form at the Japanese Grand Prix, leading a Red Bull 1-2 finish.',
    date: '2024-04-04',
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/sutton/2024/Japan/1373583-Portrait.jpg'
  },
  {
    id: 'news-5',
    title: 'F1 Announces New Partnership',
    content: 'Formula 1 announces a new partnership with a leading technology company to enhance the fan experience.',
    date: '2024-04-11',
    featured: true
  }
];

const initialConfig: Config = {
  title: 'F1 New Age Tournament',
  season: '2024',
  nextRace: 'Chinese Grand Prix',
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
    '10': 1
  },
  theme: {
    primaryColor: '#F1000D',
    secondaryColor: '#000'
  }
};

const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'f1-new-age-data';

export const F1DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addLog } = useAuth();
  
  // Initialize state from localStorage or use default data
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData).drivers : initialDrivers;
  });
  const [teams, setTeams] = useState<Team[]>(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData).teams : initialTeams;
  });
  const [races, setRaces] = useState<Race[]>(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData).races : initialRaces;
  });
  const [news, setNews] = useState<News[]>(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData).news : initialNews;
  });
  const [config, setConfig] = useState<Config>(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData).config : initialConfig;
  });

  // Computed properties
  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ drivers, teams, races, news, config }));
  }, [drivers, teams, races, news, config]);

  // Driver update functions
  const updateDriverName = (id: string, name: string) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, name } : driver
      )
    );
    addLog('Updated Driver', `Changed driver ${id} name to "${name}"`);
  };

  const updateDriverTeam = (id: string, team: string) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, team } : driver
      )
    );
    addLog('Updated Driver', `Changed driver ${id} team to "${team}"`);
  };

  const updateDriverPoints = (id: string, points: number) => {
    setDrivers(prevDrivers => {
      // Update points for the driver
      const updatedDrivers = prevDrivers.map(driver =>
        driver.id === id ? { ...driver, points } : driver
      );
      
      // Sort by points and update positions
      return updatedDrivers
        .sort((a, b) => b.points - a.points)
        .map((driver, index) => ({ ...driver, position: index + 1 }));
    });
    addLog('Updated Points', `Changed driver ${id} points to ${points}`);
  };

  const updateDriverDescription = (id: string, description: string) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, description } : driver
      )
    );
    addLog('Updated Driver', `Changed driver ${id} description`);
  };

  const updateDriverCountry = (id: string, country: string) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, country } : driver
      )
    );
    addLog('Updated Driver', `Changed driver ${id} country to "${country}"`);
  };

  const updateDriverPhoto = (id: string, imageUrl: string) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, imageUrl } : driver
      )
    );
    addLog('Updated Driver', `Changed driver ${id} photo`);
  };

  const updateDriverDetails = (id: string, details: { country?: string; image?: string; description?: string }) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { 
          ...driver, 
          country: details.country || driver.country, 
          image: details.image || driver.image,
          imageUrl: details.image || driver.imageUrl, 
          description: details.description || driver.description 
        } : driver
      )
    );
    addLog('Updated Driver', `Updated details for driver ${id}`);
  };

  // Team update functions
  const updateTeamName = (id: string, name: string) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.id === id ? { ...team, name } : team
      )
    );
    addLog('Updated Team', `Changed team ${id} name to "${name}"`);
  };

  const updateTeamColor = (id: string, color: string) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.id === id ? { ...team, color } : team
      )
    );
    addLog('Updated Team', `Changed team ${id} color to "${color}"`);
  };

  const updateTeamPoints = (id: string, points: number) => {
    setTeams(prevTeams => {
      // Update points for the team
      const updatedTeams = prevTeams.map(team =>
        team.id === id ? { ...team, points } : team
      );
      
      // Sort by points and update positions
      return updatedTeams
        .sort((a, b) => b.points - a.points)
        .map((team, index) => ({ ...team, position: index + 1 }));
    });
    addLog('Updated Points', `Changed team ${id} points to ${points}`);
  };

  // Race update functions
  const updateRaceName = (id: string, name: string) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { ...race, name } : race
      )
    );
    addLog('Updated Race', `Changed race ${id} name to "${name}"`);
  };

  const updateRaceCircuit = (id: string, circuit: string) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { ...race, circuit } : race
      )
    );
    addLog('Updated Race', `Changed race ${id} circuit to "${circuit}"`);
  };

  const updateRaceLocation = (id: string, location: string) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { ...race, location } : race
      )
    );
    addLog('Updated Race', `Changed race ${id} location to "${location}"`);
  };

  const updateRaceDate = (id: string, date: string) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { ...race, date } : race
      )
    );
    addLog('Updated Race', `Changed race ${id} date to "${date}"`);
  };

  const updateRaceWinner = (id: string, winner: string) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { ...race, winner } : race
      )
    );
    addLog('Updated Race', `Set race ${id} winner to "${winner}"`);
  };

  const updateRaceCompleted = (id: string, completed: boolean) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { ...race, completed } : race
      )
    );
    addLog('Updated Race', `${completed ? 'Marked' : 'Unmarked'} race ${id} as completed`);
  };

  const updateRaceDetails = (id: string, details: { date?: string; country?: string; completed?: boolean }) => {
    setRaces(prevRaces =>
      prevRaces.map(race =>
        race.id === id ? { 
          ...race, 
          date: details.date || race.date, 
          country: details.country || race.country, 
          completed: details.completed !== undefined ? details.completed : race.completed 
        } : race
      )
    );
    addLog('Updated Race', `Updated details for race ${id}`);
  };

  const addTeam = (team: { name: string; points: number; color: string }) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: team.name,
      points: team.points,
      position: teams.length + 1,
      color: team.color,
      drivers: []
    };
    
    setTeams(prevTeams => [...prevTeams, newTeam]);
    addLog('Added Team', `Created new team: "${team.name}"`);
  };

  const addRace = (race: { name: string; circuit: string; date: string; country: string; completed: boolean }) => {
    const newRace: Race = {
      id: `race-${Date.now()}`,
      name: race.name,
      circuit: race.circuit,
      date: race.date,
      country: race.country,
      location: race.country,
      completed: race.completed
    };
    
    setRaces(prevRaces => [...prevRaces, newRace]);
    addLog('Added Race', `Created new race: "${race.name}"`);
  };

  const addNewsItem = (newsItem: { title: string; content: string; date: string; imageUrl?: string; featured?: boolean }) => {
    const newNewsItem: News = {
      id: `news-${Date.now()}`,
      title: newsItem.title,
      content: newsItem.content,
      date: newsItem.date,
      imageUrl: newsItem.imageUrl,
      featured: newsItem.featured
    };
    
    setNews(prevNews => [newNewsItem, ...prevNews]);
    addLog('Added News', `Created new article: "${newsItem.title}"`);
  };

  const updateNewsItem = (id: string, updates: Partial<Omit<News, 'id'>>) => {
    setNews(prevNews =>
      prevNews.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    addLog('Updated News', `Modified article ${id}: "${updates.title || 'No title change'}"`);
  };

  const deleteNewsItem = (id: string) => {
    setNews(prevNews => prevNews.filter(item => item.id !== id));
    addLog('Deleted News', `Removed article ${id}`);
  };

  const addNews = addNewsItem;
  const updateNews = updateNewsItem;
  const deleteNews = deleteNewsItem;

  // Config update function
  const updateConfig = (newConfig: Partial<Config>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
    addLog('Updated Config', `Changed system configuration`);
  };

  // Context provider
  return (
    <F1DataContext.Provider value={{
      drivers,
      teams,
      races,
      news,
      config,
      sortedDrivers,
      sortedTeams,
      updateDriverName,
      updateDriverTeam,
      updateTeamName,
      updateTeamColor,
      updateRaceName,
      updateRaceCircuit,
      updateRaceLocation,
      updateRaceDate,
      updateRaceWinner,
      updateRaceCompleted,
      updateDriverPoints,
      updateTeamPoints,
      updateConfig,
      updateDriverDescription,
      updateDriverCountry,
      updateDriverPhoto,
      addNews,
      updateNews,
      deleteNews,
      addNewsItem,
      updateNewsItem,
      deleteNewsItem,
      updateRaceDetails,
      addTeam,
      addRace,
      updateDriverDetails
    }}>
      {children}
    </F1DataContext.Provider>
  );
};

export const useF1Data = () => {
  const context = useContext(F1DataContext);
  if (!context) {
    throw new Error('useF1Data must be used within an F1DataProvider');
  }
  return context;
};
