
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Trophy, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { sortedDrivers, sortedTeams } = useF1Data();

  return (
    <Layout>
      <div className="bg-f1-red bg-opacity-5 py-16 relative">
        {/* Portugal Track Wallpaper behind header section */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2000')",
          }}
          id="f1-wallpaper"
        ></div>
        
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">F1 New Age Tournament</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow the latest standings, driver profiles, and race calendar for the F1 New Age Tournament
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="drivers" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="drivers">Driver Standings</TabsTrigger>
            <TabsTrigger value="teams">Constructor Standings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="w-5 h-5 mr-2" />
                  Driver Championship Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Pos</th>
                        <th className="px-4 py-3 text-left">Driver</th>
                        <th className="px-4 py-3 text-left">Team</th>
                        <th className="px-4 py-3 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDrivers.map((driver, index) => (
                        <tr key={driver.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-1 h-8 rounded-full mr-3" style={{ backgroundColor: driver.color }}></div>
                              <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-xs text-gray-500">{driver.country}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{driver.team}</td>
                          <td className="px-4 py-3 text-right font-bold">{driver.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Trophy className="w-5 h-5 mr-2" />
                  Constructor Championship Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Pos</th>
                        <th className="px-4 py-3 text-left">Team</th>
                        <th className="px-4 py-3 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams.map((team, index) => (
                        <tr key={team.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-1 h-8 rounded-full mr-3" style={{ backgroundColor: team.color }}></div>
                              <div className="font-medium">{team.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-bold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
