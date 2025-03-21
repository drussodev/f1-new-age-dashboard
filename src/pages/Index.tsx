
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Trophy, User, RefreshCcw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Index = () => {
  const { sortedDrivers, sortedTeams, loading, refreshData, lastUpdated } = useF1Data();

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  };

  return (
    <Layout>
      <div className="bg-gray-100 py-16 relative">
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">F1 New Age Tournament</h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto font-medium">
            Follow the latest standings, driver profiles, and race calendar for the F1 New Age Tournament
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Last updated: {format(lastUpdated, 'HH:mm:ss')}
              </span>
            )}
          </div>
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
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : sortedDrivers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No driver data available</p>
                    <Button 
                      onClick={handleRefresh} 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                    >
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pos</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedDrivers.map((driver, index) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-1 h-8 rounded-full mr-3" style={{ backgroundColor: driver.color }}></div>
                              <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-xs text-gray-500">{driver.country}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{driver.team}</TableCell>
                          <TableCell className="text-right font-bold">{driver.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : sortedTeams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No team data available</p>
                    <Button 
                      onClick={handleRefresh} 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                    >
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pos</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTeams.map((team, index) => (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-1 h-8 rounded-full mr-3" style={{ backgroundColor: team.color }}></div>
                              <div className="font-medium">{team.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold">{team.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
