
import mysql from 'mysql2/promise';

export interface MySQLConfig {
  hostname: string;
  username: string;
  password: string;
  database: string;
}

const defaultConfig: MySQLConfig = {
  hostname: "185.113.141.167",
  username: "russo",
  password: "drusso22",
  database: "f1tournament"
};

export const getClient = async (config: MySQLConfig = defaultConfig) => {
  const connection = await mysql.createConnection({
    host: config.hostname,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  
  return connection;
};

export const query = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  const connection = await getClient();
  try {
    const [rows] = await connection.query(sql, params);
    return rows as T[];
  } finally {
    await connection.end();
  }
};

export const fetchDrivers = async () => {
  return await query('SELECT * FROM drivers ORDER BY points DESC');
};

export const fetchTeams = async () => {
  return await query('SELECT * FROM teams ORDER BY points DESC');
};

export const fetchRaces = async () => {
  return await query('SELECT * FROM races ORDER BY date ASC');
};

export const fetchNews = async () => {
  return await query('SELECT * FROM news ORDER BY date DESC');
};

export const fetchConfig = async () => {
  return await query('SELECT * FROM config LIMIT 1');
};

export const fetchStreamers = async () => {
  return await query('SELECT * FROM streamers');
};

export const updateDriverPoints = async (driverId: string, points: number) => {
  await query('UPDATE drivers SET points = ? WHERE id = ?', [points, driverId]);
  
  // Update team points
  const driver = (await query('SELECT * FROM drivers WHERE id = ?', [driverId]))[0];
  if (driver) {
    const teamDrivers = await query(
      'SELECT SUM(points) as total FROM drivers WHERE team = ? AND id != ?',
      [driver.team, driverId]
    );
    
    const teamPoints = (teamDrivers[0]?.total || 0) + points;
    await query(
      'UPDATE teams SET points = ? WHERE name = ?', 
      [teamPoints, driver.team]
    );
  }
  
  return true;
};
