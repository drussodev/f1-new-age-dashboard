
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

interface F1DataContextType {
  drivers: Driver[];
  races: Race[];
  config: TournamentConfig;
  updateDriverPoints: (driverId: string, newPoints: number) => void;
  updateConfig: (newConfig: Partial<TournamentConfig>) => void;
  sortedDrivers: Driver[];
}

// Initial data
const defaultDrivers: Driver[] = [
  { id: '1', name: 'Max Verstappen', team: 'Red Bull Racing', points: 312, country: 'Netherlands', number: 1, image: '/placeholder.svg', color: '#0600EF' },
  { id: '2', name: 'Lewis Hamilton', team: 'Mercedes', points: 196, country: 'United Kingdom', number: 44, image: '/placeholder.svg', color: '#00D2BE' },
  { id: '3', name: 'Lando Norris', team: 'McLaren', points: 195, country: 'United Kingdom', number: 4, image: '/placeholder.svg', color: '#FF9800' },
  { id: '4', name: 'Charles Leclerc', team: 'Ferrari', points: 175, country: 'Monaco', number: 16, image: '/placeholder.svg', color: '#DC0000' },
  { id: '5', name: 'Carlos Sainz', team: 'Ferrari', points: 170, country: 'Spain', number: 55, image: '/placeholder.svg', color: '#DC0000' },
  { id: '6', name: 'Oscar Piastri', team: 'McLaren', points: 165, country: 'Australia', number: 81, image: '/placeholder.svg', color: '#FF9800' },
  { id: '7', name: 'Sergio Perez', team: 'Red Bull Racing', points: 155, country: 'Mexico', number: 11, image: '/placeholder.svg', color: '#0600EF' },
  { id: '8', name: 'George Russell', team: 'Mercedes', points: 155, country: 'United Kingdom', number: 63, image: '/placeholder.svg', color: '#00D2BE' },
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

// Create context
const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  DRIVERS: 'f1-new-age-drivers',
  RACES: 'f1-new-age-races',
  CONFIG: 'f1-new-age-config'
};

// Provider component
export const F1DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    return stored ? JSON.parse(stored) : defaultDrivers;
  });
  
  const [races, setRaces] = useState<Race[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RACES);
    return stored ? JSON.parse(stored) : defaultRaces;
  });
  
  const [config, setConfig] = useState<TournamentConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return stored ? JSON.parse(stored) : defaultConfig;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RACES, JSON.stringify(races));
  }, [races]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  // Update driver points
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

  // Update config
  const updateConfig = (newConfig: Partial<TournamentConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
    toast.success("Tournament configuration updated");
  };

  // Sorted drivers by points (for leaderboard)
  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  // Context value
  const value = {
    drivers,
    races,
    config,
    updateDriverPoints,
    updateConfig,
    sortedDrivers
  };

  return (
    <F1DataContext.Provider value={value}>
      {children}
    </F1DataContext.Provider>
  );
};

// Custom hook to use the context
export const useF1Data = () => {
  const context = useContext(F1DataContext);
  if (context === undefined) {
    throw new Error('useF1Data must be used within a F1DataProvider');
  }
  return context;
};
