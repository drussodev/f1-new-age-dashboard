
// Mock data for frontend use - MySQL cannot be used directly in the browser
import { toast } from "sonner";

export interface MySQLConfig {
  hostname: string;
  username: string;
  password: string;
  database: string;
}

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

// Mock functions that would normally connect to MySQL
export const getClient = async () => {
  console.log("Mock MySQL client created");
  return { query: () => {}, end: () => {} };
};

export const query = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  console.log("Mock query executed:", sql, params);
  
  // Return mock data based on the query
  if (sql.includes("drivers")) return mockDrivers as unknown as T[];
  if (sql.includes("teams")) return mockTeams as unknown as T[];
  if (sql.includes("races")) return mockRaces as unknown as T[];
  if (sql.includes("news")) return mockNews as unknown as T[];
  if (sql.includes("config")) return [mockConfig] as unknown as T[];
  if (sql.includes("streamers")) return mockStreamers as unknown as T[];
  
  return [] as T[];
};

export const fetchDrivers = async () => {
  console.log("Fetching mock drivers data");
  return mockDrivers;
};

export const fetchTeams = async () => {
  console.log("Fetching mock teams data");
  return mockTeams;
};

export const fetchRaces = async () => {
  console.log("Fetching mock races data");
  return mockRaces;
};

export const fetchNews = async () => {
  console.log("Fetching mock news data");
  return mockNews;
};

export const fetchConfig = async () => {
  console.log("Fetching mock config data");
  return [mockConfig];
};

export const fetchStreamers = async () => {
  console.log("Fetching mock streamers data");
  return mockStreamers;
};

export const updateDriverPoints = async (driverId: string, points: number) => {
  console.log("Updating driver points (mock):", driverId, points);
  
  // Update the mock data
  const driverIndex = mockDrivers.findIndex(d => d.id === driverId);
  if (driverIndex >= 0) {
    mockDrivers[driverIndex].points = points;
    
    // Update team points
    const driver = mockDrivers[driverIndex];
    const teamDrivers = mockDrivers.filter(d => d.team === driver.team && d.id !== driverId);
    const teamPoints = teamDrivers.reduce((sum, d) => sum + d.points, 0) + points;
    
    const teamIndex = mockTeams.findIndex(t => t.name === driver.team);
    if (teamIndex >= 0) {
      mockTeams[teamIndex].points = teamPoints;
    }
    
    toast.success("Driver points updated successfully (mock)");
    return true;
  }
  
  toast.error("Driver not found");
  return false;
};
