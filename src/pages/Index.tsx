
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { sortedDrivers, races } = useF1Data();
  const completedRaces = races.filter(race => race.completed).length;
  const upcomingRace = races.find(race => !race.completed);

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Hero section */}
        <div className="bg-f1-red text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-checkered-pattern opacity-10"></div>
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col items-center text-center">
              <Trophy className="w-16 h-16 mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-2">F1 New Age Tournament</h1>
              <p className="text-xl opacity-90 mb-6">2024 Season Standings</p>
              <div className="flex space-x-4 items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{completedRaces}</div>
                  <div className="text-xs opacity-80">Races<br />Completed</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{races.length - completedRaces}</div>
                  <div className="text-xs opacity-80">Races<br />Remaining</div>
                </div>
                {upcomingRace && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{new Date(upcomingRace.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-xs opacity-80">Next Race<br />{upcomingRace.name}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      
        {/* Leaderboard */}
        <div className="container mx-auto px-4 py-12">
          <Card className="overflow-hidden shadow-lg border-t-4 border-t-f1-red">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-2xl">
                <Trophy className="w-6 h-6 mr-2 text-f1-red" />
                Drivers Championship Standings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left w-16">Pos</th>
                      <th className="py-3 px-4 text-left">Driver</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Team</th>
                      <th className="py-3 px-4 text-right w-24">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDrivers.map((driver, index) => (
                      <tr 
                        key={driver.id} 
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-bold flex items-center">
                            {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 mr-1" />}
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div 
                              className="w-1 h-10 rounded-full mr-3" 
                              style={{ backgroundColor: driver.color }}
                            ></div>
                            <div>
                              <div className="font-bold">{driver.name}</div>
                              <div className="text-xs text-gray-500 md:hidden">{driver.team}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">{driver.team}</td>
                        <td className="py-4 px-4 text-right font-bold">{driver.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
