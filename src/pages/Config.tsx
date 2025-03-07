
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Settings, Save, Trophy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Config = () => {
  const { drivers, teams, config, updateDriverPoints, updateTeamPoints, updateConfig } = useF1Data();
  
  const [driverPoints, setDriverPoints] = useState<{ [key: string]: number }>(
    drivers.reduce((acc, driver) => ({ ...acc, [driver.id]: driver.points }), {})
  );
  
  const [teamPoints, setTeamPoints] = useState<{ [key: string]: number }>(
    teams.reduce((acc, team) => ({ ...acc, [team.id]: team.points }), {})
  );
  
  const [tournamentConfig, setTournamentConfig] = useState({ ...config });

  // Handle driver points change
  const handleDriverPointsChange = (driverId: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setDriverPoints(prev => ({ ...prev, [driverId]: points }));
  };

  // Handle team points change
  const handleTeamPointsChange = (teamId: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setTeamPoints(prev => ({ ...prev, [teamId]: points }));
  };

  // Save driver points
  const saveDriverPoints = () => {
    Object.entries(driverPoints).forEach(([driverId, points]) => {
      updateDriverPoints(driverId, points);
    });
    toast.success("All driver points have been updated");
  };

  // Save team points
  const saveTeamPoints = () => {
    Object.entries(teamPoints).forEach(([teamId, points]) => {
      updateTeamPoints(teamId, points);
    });
    toast.success("All team points have been updated");
  };

  // Handle config change
  const handleConfigChange = (field: keyof typeof tournamentConfig, value: any) => {
    setTournamentConfig(prev => ({ ...prev, [field]: value }));
  };

  // Handle points system change
  const handlePointsSystemChange = (position: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setTournamentConfig(prev => ({
      ...prev,
      pointsSystem: {
        ...prev.pointsSystem,
        [position]: points
      }
    }));
  };

  // Save tournament config
  const saveTournamentConfig = () => {
    updateConfig(tournamentConfig);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-f1-red mr-3" />
          <h1 className="text-3xl font-bold">Tournament Configuration</h1>
        </div>
        
        <Tabs defaultValue="drivers">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="drivers">Driver Points</TabsTrigger>
            <TabsTrigger value="teams">Team Points</TabsTrigger>
            <TabsTrigger value="tournament">Tournament Settings</TabsTrigger>
          </TabsList>
          
          {/* Driver Points Tab */}
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Update Driver Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.map(driver => (
                    <div key={driver.id} className="flex items-center space-x-4">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: driver.color }}></div>
                      <div className="flex-1">
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.team}</div>
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="0"
                          value={driverPoints[driver.id]}
                          onChange={(e) => handleDriverPointsChange(driver.id, e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={saveDriverPoints}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Driver Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Team Points Tab */}
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Update Team Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map(team => (
                    <div key={team.id} className="flex items-center space-x-4">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: team.color }}></div>
                      <div className="flex-1">
                        <div className="font-medium">{team.name}</div>
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="0"
                          value={teamPoints[team.id]}
                          onChange={(e) => handleTeamPointsChange(team.id, e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={saveTeamPoints}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Team Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tournament Settings Tab */}
          <TabsContent value="tournament">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tournament Name</label>
                    <Input
                      value={tournamentConfig.title}
                      onChange={(e) => handleConfigChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Season Year</label>
                    <Input
                      type="number"
                      min="2000"
                      max="2100"
                      value={tournamentConfig.season}
                      onChange={(e) => handleConfigChange('season', parseInt(e.target.value, 10) || 2024)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Points System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(tournamentConfig.pointsSystem).map(([position, points]) => (
                    <div key={position}>
                      <label className="block text-sm font-medium mb-1">Position {position}</label>
                      <Input
                        type="number"
                        min="0"
                        value={points}
                        onChange={(e) => handlePointsSystemChange(position, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-6"
                  onClick={saveTournamentConfig}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Tournament Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Config;
