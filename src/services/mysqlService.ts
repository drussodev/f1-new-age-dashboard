
// Mock data for frontend use - No database connection required
import { toast } from "sonner";

// Mock data structures
const mockDrivers = [
  { id: "1", name: "Lewis Hamilton", team: "Mercedes", country: "UK", points: 295, color: "#00D2BE", image_url: "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png" },
  { id: "2", name: "Max Verstappen", team: "Red Bull Racing", country: "Netherlands", points: 342, color: "#0600EF", image_url: "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png" },
  { id: "3", name: "Charles Leclerc", team: "Ferrari", country: "Monaco", points: 188, color: "#DC0000", image_url: "https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png" },
  { id: "4", name: "Lando Norris", team: "McLaren", country: "UK", points: 248, color: "#FF8700", image_url: "https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png" },
];

const mockTeams = [
  { id: "1", name: "Mercedes", color: "#00D2BE", points: 473, logo_url: "https://www.formula1.com/content/dam/fom-website/teams/Mercedes/mercedes-logo.png" },
  { id: "2", name: "Red Bull Racing", color: "#0600EF", points: 587, logo_url: "https://www.formula1.com/content/dam/fom-website/teams/Red-Bull-Racing/red-bull-racing-logo.png" },
  { id: "3", name: "Ferrari", color: "#DC0000", points: 362, logo_url: "https://www.formula1.com/content/dam/fom-website/teams/Ferrari/ferrari-logo.png" },
  { id: "4", name: "McLaren", color: "#FF8700", points: 374, logo_url: "https://www.formula1.com/content/dam/fom-website/teams/McLaren/mclaren-logo.png" },
];

const mockRaces = [
  { id: "1", name: "Australian Grand Prix", circuit: "Albert Park", date: "2023-03-12", location: "Melbourne", completed: true, winner: "Max Verstappen" },
  { id: "2", name: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: "2023-03-05", location: "Sakhir", completed: true, winner: "Lewis Hamilton" },
  { id: "3", name: "Monaco Grand Prix", circuit: "Circuit de Monaco", date: "2023-05-28", location: "Monte Carlo", completed: false },
  { id: "4", name: "Italian Grand Prix", circuit: "Monza", date: "2023-09-03", location: "Monza", completed: false },
];

const mockNews = [
  { id: "1", title: "Verstappen wins championship", content: "Max Verstappen has won his third world championship.", date: "2023-10-07", image_url: "https://www.formula1.com/content/dam/fom-website/sutton/2023/Japan/Sunday/verstappen-japan-2023.jpg", featured: true },
  { id: "2", title: "McLaren unveils new upgrades", content: "McLaren has introduced new upgrades for the upcoming race.", date: "2023-10-01", video_url: "https://www.youtube.com/watch?v=sample1" },
  { id: "3", title: "Hamilton signs new contract", content: "Lewis Hamilton has signed a new contract with Mercedes.", date: "2023-09-20", image_url: "https://www.formula1.com/content/dam/fom-website/sutton/2023/Hungary/Friday/hamilton-hungary-2023.jpg" },
];

const mockConfig = {
  title: "F1 New Age Tournament",
  season: "2023",
};

const mockStreamers = [
  { username: "formula1", display_name: "Formula 1" },
  { username: "grandprixracing", display_name: "Grand Prix Racing" },
  { username: "f1newage", display_name: "F1 New Age Tournament" },
];

// Local storage functions to persist data
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
};

const getFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage: ${key}`, error);
    return defaultValue;
  }
};

// Initialize local data
const initLocalData = () => {
  if (!localStorage.getItem('f1_drivers')) saveToLocalStorage('f1_drivers', mockDrivers);
  if (!localStorage.getItem('f1_teams')) saveToLocalStorage('f1_teams', mockTeams);
  if (!localStorage.getItem('f1_races')) saveToLocalStorage('f1_races', mockRaces);
  if (!localStorage.getItem('f1_news')) saveToLocalStorage('f1_news', mockNews);
  if (!localStorage.getItem('f1_config')) saveToLocalStorage('f1_config', mockConfig);
  if (!localStorage.getItem('f1_streamers')) saveToLocalStorage('f1_streamers', mockStreamers);
};

// Run initialization
initLocalData();

// Mock functions that use localStorage instead of a database
export const fetchDrivers = async () => {
  console.log("Fetching drivers from local storage");
  return getFromLocalStorage('f1_drivers', mockDrivers);
};

export const fetchTeams = async () => {
  console.log("Fetching teams from local storage");
  return getFromLocalStorage('f1_teams', mockTeams);
};

export const fetchRaces = async () => {
  console.log("Fetching races from local storage");
  return getFromLocalStorage('f1_races', mockRaces);
};

export const fetchNews = async () => {
  console.log("Fetching news from local storage");
  return getFromLocalStorage('f1_news', mockNews);
};

export const fetchConfig = async () => {
  console.log("Fetching config from local storage");
  return [getFromLocalStorage('f1_config', mockConfig)];
};

export const fetchStreamers = async () => {
  console.log("Fetching streamers from local storage");
  return getFromLocalStorage('f1_streamers', mockStreamers);
};

export const updateDriverPoints = async (driverId, points) => {
  console.log("Updating driver points in local storage:", driverId, points);
  
  // Get current data
  const drivers = getFromLocalStorage('f1_drivers', mockDrivers);
  const teams = getFromLocalStorage('f1_teams', mockTeams);
  
  // Update driver points
  const driverIndex = drivers.findIndex(d => d.id === driverId);
  if (driverIndex >= 0) {
    drivers[driverIndex].points = points;
    saveToLocalStorage('f1_drivers', drivers);
    
    // Update team points
    const driver = drivers[driverIndex];
    const teamDrivers = drivers.filter(d => d.team === driver.team && d.id !== driverId);
    const teamPoints = teamDrivers.reduce((sum, d) => sum + d.points, 0) + points;
    
    const teamIndex = teams.findIndex(t => t.name === driver.team);
    if (teamIndex >= 0) {
      teams[teamIndex].points = teamPoints;
      saveToLocalStorage('f1_teams', teams);
    }
    
    toast.success("Driver points updated successfully");
    return true;
  }
  
  toast.error("Driver not found");
  return false;
};

// Clean up unused MySQL functions
export const getClient = async () => {
  console.log("Mock client created (no database connection)");
  return { query: () => {}, end: () => {} };
};

export const query = async (sql, params = []) => {
  console.log("Mock query executed (no database connection):", sql, params);
  
  // Return mock data based on the query
  if (sql.includes("drivers")) return getFromLocalStorage('f1_drivers', mockDrivers);
  if (sql.includes("teams")) return getFromLocalStorage('f1_teams', mockTeams);
  if (sql.includes("races")) return getFromLocalStorage('f1_races', mockRaces);
  if (sql.includes("news")) return getFromLocalStorage('f1_news', mockNews);
  if (sql.includes("config")) return [getFromLocalStorage('f1_config', mockConfig)];
  if (sql.includes("streamers")) return getFromLocalStorage('f1_streamers', mockStreamers);
  
  return [];
};
