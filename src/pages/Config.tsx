import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Settings, Save, Trophy, Users, Flag, Calendar, PlusCircle, MapPin, Image, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Config = () => {
  const { 
    drivers, 
    teams, 
    races, 
    config, 
    updateDriverPoints, 
    updateTeamPoints, 
    updateRaceDetails, 
    updateConfig,
    updateDriverName,
    addTeam,
    addRace,
    updateDriverDetails
  } = useF1Data();
  
  const [driverPoints, setDriverPoints] = useState<{ [key: string]: number }>(
    drivers.reduce((acc, driver) => ({ ...acc, [driver.id]: driver.points }), {})
  );
  
  const [teamPoints, setTeamPoints] = useState<{ [key: string]: number }>(
    teams.reduce((acc, team) => ({ ...acc, [team.id]: team.points }), {})
  );
  
  const [tournamentConfig, setTournamentConfig] = useState({ ...config });

  const [raceDetails, setRaceDetails] = useState<{ [key: string]: { date: string; country: string; completed: boolean } }>(
    races.reduce((acc, race) => ({ 
      ...acc, 
      [race.id]: { 
        date: race.date, 
        country: race.country,
        completed: race.completed 
      } 
    }), {})
  );

  // Add state for driver name editing
  const [driverNames, setDriverNames] = useState<{ [key: string]: string }>(
    drivers.reduce((acc, driver) => ({ ...acc, [driver.id]: driver.name }), {})
  );

  // Add state for driver details editing
  const [driverDetails, setDriverDetails] = useState<{ [key: string]: { country: string; image: string; description: string } }>(
    drivers.reduce((acc, driver) => ({ 
      ...acc, 
      [driver.id]: { 
        country: driver.country || '',
        image: driver.image || '',
        description: driver.description || '' 
      } 
    }), {})
  );

  // Add state for new team
  const [newTeam, setNewTeam] = useState({
    name: '',
    points: 0,
    color: '#000000'
  });

  // Add state for new race
  const [newRace, setNewRace] = useState({
    name: '',
    circuit: '',
    date: new Date().toISOString().split('T')[0],
    country: '',
    completed: false
  });

  const handleDriverPointsChange = (driverId: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setDriverPoints(prev => ({ ...prev, [driverId]: points }));
  };

  const handleTeamPointsChange = (teamId: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setTeamPoints(prev => ({ ...prev, [teamId]: points }));
  };

  // Handler for driver name changes
  const handleDriverNameChange = (driverId: string, value: string) => {
    setDriverNames(prev => ({ ...prev, [driverId]: value }));
  };

  // Handler for driver details changes
  const handleDriverDetailsChange = (driverId: string, field: 'country' | 'image' | 'description', value: string) => {
    setDriverDetails(prev => ({
      ...prev,
      [driverId]: {
        ...prev[driverId],
        [field]: value
      }
    }));
  };

  const saveDriverPoints = () => {
    Object.entries(driverPoints).forEach(([driverId, points]) => {
      updateDriverPoints(driverId, points);
    });
    toast.success("All driver points have been updated");
  };

  const saveTeamPoints = () => {
    Object.entries(teamPoints).forEach(([teamId, points]) => {
      updateTeamPoints(teamId, points);
    });
    toast.success("All team points have been updated");
  };

  // Save driver names
  const saveDriverNames = () => {
    Object.entries(driverNames).forEach(([driverId, name]) => {
      if (name.trim() !== '') {
        updateDriverName(driverId, name);
      }
    });
    toast.success("All driver names have been updated");
  };

  const saveDriverDetails = () => {
    Object.entries(driverDetails).forEach(([driverId, details]) => {
      updateDriverDetails(driverId, details);
    });
    toast.success("All driver details have been updated");
  };

  const handleConfigChange = (field: keyof typeof tournamentConfig, value: any) => {
    setTournamentConfig(prev => ({ ...prev, [field]: value }));
  };

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

  const saveTournamentConfig = () => {
    updateConfig(tournamentConfig);
  };

  const handleRaceDetailsChange = (raceId: string, field: 'date' | 'country' | 'completed', value: string | boolean) => {
    setRaceDetails(prev => ({
      ...prev,
      [raceId]: {
        ...prev[raceId],
        [field]: value
      }
    }));
  };

  const saveRaceDetails = () => {
    Object.entries(raceDetails).forEach(([raceId, details]) => {
      updateRaceDetails(raceId, details);
    });
    toast.success("All race details have been updated");
  };

  // Handler for new team input changes
  const handleNewTeamChange = (field: keyof typeof newTeam, value: string | number) => {
    setNewTeam(prev => ({ ...prev, [field]: value }));
  };

  // Handler for new race input changes
  const handleNewRaceChange = (field: keyof typeof newRace, value: string | boolean) => {
    setNewRace(prev => ({ ...prev, [field]: value }));
  };

  // Submit new team
  const submitNewTeam = () => {
    if (newTeam.name.trim() === '') {
      toast.error("Team name cannot be empty");
      return;
    }
    
    addTeam(newTeam);
    
    // Reset form
    setNewTeam({
      name: '',
      points: 0,
      color: '#000000'
    });
  };

  // Submit new race
  const submitNewRace = () => {
    if (newRace.name.trim() === '' || newRace.circuit.trim() === '' || newRace.country.trim() === '') {
      toast.error("All race fields must be filled");
      return;
    }
    
    addRace(newRace);
    
    // Reset form
    setNewRace({
      name: '',
      circuit: '',
      date: new Date().toISOString().split('T')[0],
      country: '',
      completed: false
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-f1-red mr-3" />
          <h1 className="text-3xl font-bold">Tournament Configuration</h1>
        </div>
        
        <Tabs defaultValue="drivers">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="drivers">Driver Details</TabsTrigger>
            <TabsTrigger value="teams">Team Points</TabsTrigger>
            <TabsTrigger value="races">Race Calendar</TabsTrigger>
            <TabsTrigger value="tournament">Tournament Settings</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="drivers">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Update Driver Names
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.map(driver => (
                    <div key={`name-${driver.id}`} className="flex items-center space-x-4">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: driver.color }}></div>
                      <div className="flex-1">
                        <Input
                          value={driverNames[driver.id]}
                          onChange={(e) => handleDriverNameChange(driver.id, e.target.value)}
                          placeholder="Driver name"
                        />
                      </div>
                      <div className="text-sm text-gray-500">{driver.team}</div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={saveDriverNames}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Driver Names
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Update Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {drivers.map(driver => (
                    <div key={`details-${driver.id}`} className="border-b pb-6">
                      <div className="flex items-center mb-4">
                        <div className="w-1 h-10 rounded-full mr-3" style={{ backgroundColor: driver.color }}></div>
                        <div className="font-bold text-lg">{driver.name}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-f1-red" />
                            Country
                          </label>
                          <Input
                            value={driverDetails[driver.id]?.country || ''}
                            onChange={(e) => handleDriverDetailsChange(driver.id, 'country', e.target.value)}
                            placeholder="Driver country"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Image className="w-4 h-4 mr-1 text-f1-red" />
                            Image URL
                          </label>
                          <Input
                            value={driverDetails[driver.id]?.image || ''}
                            onChange={(e) => handleDriverDetailsChange(driver.id, 'image', e.target.value)}
                            placeholder="Image URL or path"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 flex items-center">
                          <FileText className="w-4 h-4 mr-1 text-f1-red" />
                          Driver Description
                        </label>
                        <Textarea
                          value={driverDetails[driver.id]?.description || ''}
                          onChange={(e) => handleDriverDetailsChange(driver.id, 'description', e.target.value)}
                          placeholder="Brief description of the driver's career or notable achievements"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={saveDriverDetails}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Driver Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Update Driver Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.map(driver => (
                    <div key={`points-${driver.id}`} className="flex items-center space-x-4">
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
          
          <TabsContent value="races">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Update Race Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {races.map(race => (
                    <div key={race.id} className="border-b pb-4">
                      <div className="font-medium text-lg mb-2">{race.name}</div>
                      <div className="text-sm text-gray-500 mb-3">{race.circuit}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Date</label>
                          <Input
                            type="date"
                            value={raceDetails[race.id].date}
                            onChange={(e) => handleRaceDetailsChange(race.id, 'date', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Country</label>
                          <Input
                            type="text"
                            value={raceDetails[race.id].country}
                            onChange={(e) => handleRaceDetailsChange(race.id, 'country', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-f1-red border-gray-300 rounded mr-2"
                            checked={raceDetails[race.id].completed}
                            onChange={(e) => handleRaceDetailsChange(race.id, 'completed', e.target.checked)}
                          />
                          <span className="text-sm">Race completed</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={saveRaceDetails}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Race Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
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
          
          <TabsContent value="add">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Add New Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Name</label>
                      <Input
                        value={newTeam.name}
                        onChange={(e) => handleNewTeamChange('name', e.target.value)}
                        placeholder="Enter team name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Initial Points</label>
                      <Input
                        type="number"
                        min="0"
                        value={newTeam.points}
                        onChange={(e) => handleNewTeamChange('points', parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={newTeam.color}
                          onChange={(e) => handleNewTeamChange('color', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={newTeam.color}
                          onChange={(e) => handleNewTeamChange('color', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={submitNewTeam}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flag className="w-5 h-5 mr-2" />
                    Add New Race
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Race Name</label>
                      <Input
                        value={newRace.name}
                        onChange={(e) => handleNewRaceChange('name', e.target.value)}
                        placeholder="E.g. Monaco Grand Prix"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Circuit</label>
                      <Input
                        value={newRace.circuit}
                        onChange={(e) => handleNewRaceChange('circuit', e.target.value)}
                        placeholder="E.g. Circuit de Monaco"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <Input
                        value={newRace.country}
                        onChange={(e) => handleNewRaceChange('country', e.target.value)}
                        placeholder="E.g. Monaco"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <Input
                        type="date"
                        value={newRace.date}
                        onChange={(e) => handleNewRaceChange('date', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-f1-red border-gray-300 rounded mr-2"
                          checked={newRace.completed}
                          onChange={(e) => handleNewRaceChange('completed', e.target.checked)}
                        />
                        <span className="text-sm">Race completed</span>
                      </label>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={submitNewRace}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Race
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Config;
