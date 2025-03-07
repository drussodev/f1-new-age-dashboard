
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Settings, Save, Trophy, Users, Flag, Calendar, PlusCircle, MapPin, Image, FileText, Newspaper, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

const Config = () => {
  const { 
    drivers, 
    teams, 
    races, 
    config, 
    news,
    updateDriverPoints, 
    updateTeamPoints, 
    updateRaceDetails, 
    updateConfig,
    updateDriverName,
    addTeam,
    addRace,
    updateDriverDetails,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem
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

  const [driverNames, setDriverNames] = useState<{ [key: string]: string }>(
    drivers.reduce((acc, driver) => ({ ...acc, [driver.id]: driver.name }), {})
  );

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

  const [newTeam, setNewTeam] = useState({
    name: '',
    points: 0,
    color: '#000000'
  });

  const [newRace, setNewRace] = useState({
    name: '',
    circuit: '',
    date: new Date().toISOString().split('T')[0],
    country: '',
    completed: false
  });

  const [newsItems, setNewsItems] = useState(news);
  const [newNewsItem, setNewNewsItem] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    featured: false
  });

  const handleDriverPointsChange = (driverId: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setDriverPoints(prev => ({ ...prev, [driverId]: points }));
  };

  const handleTeamPointsChange = (teamId: string, value: string) => {
    const points = parseInt(value, 10) || 0;
    setTeamPoints(prev => ({ ...prev, [teamId]: points }));
  };

  const handleDriverNameChange = (driverId: string, value: string) => {
    setDriverNames(prev => ({ ...prev, [driverId]: value }));
  };

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

  const handleNewTeamChange = (field: keyof typeof newTeam, value: string | number) => {
    setNewTeam(prev => ({ ...prev, [field]: value }));
  };

  const handleNewRaceChange = (field: keyof typeof newRace, value: string | boolean) => {
    setNewRace(prev => ({ ...prev, [field]: value }));
  };

  const submitNewTeam = () => {
    if (newTeam.name.trim() === '') {
      toast.error("Team name cannot be empty");
      return;
    }
    
    addTeam(newTeam);
    
    setNewTeam({
      name: '',
      points: 0,
      color: '#000000'
    });
  };

  const submitNewRace = () => {
    if (newRace.name.trim() === '' || newRace.circuit.trim() === '' || newRace.country.trim() === '') {
      toast.error("All race fields must be filled");
      return;
    }
    
    addRace(newRace);
    
    setNewRace({
      name: '',
      circuit: '',
      date: new Date().toISOString().split('T')[0],
      country: '',
      completed: false
    });
  };

  const handleNewsItemChange = (id: string, field: keyof typeof newNewsItem, value: string | boolean) => {
    setNewsItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleNewNewsItemChange = (field: keyof typeof newNewsItem, value: string | boolean) => {
    setNewNewsItem(prev => ({ ...prev, [field]: value }));
  };

  const saveNewsItems = () => {
    newsItems.forEach(item => {
      const originalItem = news.find(n => n.id === item.id);
      if (originalItem && JSON.stringify(originalItem) !== JSON.stringify(item)) {
        const { id, ...updates } = item;
        updateNewsItem(id, updates);
      }
    });
    toast.success("All news items have been updated");
  };

  const submitNewNewsItem = () => {
    if (newNewsItem.title.trim() === '' || newNewsItem.content.trim() === '') {
      toast.error("Title and content are required");
      return;
    }
    
    addNewsItem(newNewsItem);
    setNewsItems([...newsItems, { ...newNewsItem, id: `news-${Date.now()}` }]);
    
    setNewNewsItem({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      featured: false
    });
    
    toast.success("News item added successfully");
  };

  const handleDeleteNewsItem = (id: string) => {
    deleteNewsItem(id);
    setNewsItems(prev => prev.filter(item => item.id !== id));
    toast.success("News item deleted");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 text-f1-red mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold">Tournament Config</h1>
        </div>
        
        <Tabs defaultValue="drivers" className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid w-full min-w-max grid-cols-3 md:grid-cols-7">
              <TabsTrigger value="drivers" className="text-sm py-1.5">Drivers</TabsTrigger>
              <TabsTrigger value="driver-details" className="text-sm py-1.5">Details</TabsTrigger>
              <TabsTrigger value="teams" className="text-sm py-1.5">Teams</TabsTrigger>
              <TabsTrigger value="races" className="text-sm py-1.5">Races</TabsTrigger>
              <TabsTrigger value="news" className="text-sm py-1.5">News</TabsTrigger>
              <TabsTrigger value="tournament" className="text-sm py-1.5">Settings</TabsTrigger>
              <TabsTrigger value="add" className="text-sm py-1.5">Add New</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="drivers">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-4 h-4 mr-2" />
                  Driver Names
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drivers.map(driver => (
                    <div key={`name-${driver.id}`} className="flex items-center space-x-3">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: driver.color }}></div>
                      <div className="flex-1">
                        <Input
                          value={driverNames[driver.id]}
                          onChange={(e) => handleDriverNameChange(driver.id, e.target.value)}
                          placeholder="Driver name"
                          className="text-sm"
                        />
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">{driver.team}</div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 text-sm"
                    onClick={saveDriverNames}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Names
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="w-4 h-4 mr-2" />
                  Driver Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drivers.map(driver => (
                    <div key={`points-${driver.id}`} className="flex items-center space-x-3">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: driver.color }}></div>
                      <div className="flex-1 text-sm truncate">
                        <div className="font-medium">{driver.name}</div>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min="0"
                          value={driverPoints[driver.id]}
                          onChange={(e) => handleDriverPointsChange(driver.id, e.target.value)}
                          className="text-right text-sm h-8"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 text-sm"
                    onClick={saveDriverPoints}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="driver-details">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-4 h-4 mr-2" />
                  Driver Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {drivers.map(driver => (
                    <div key={`details-${driver.id}`} className="border-b pb-5">
                      <div className="flex items-center mb-3">
                        <div className="w-1 h-8 rounded-full mr-2" style={{ backgroundColor: driver.color }}></div>
                        <div className="font-bold text-sm">{driver.name}</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-f1-red" />
                            Country
                          </label>
                          <Input
                            value={driverDetails[driver.id]?.country || ''}
                            onChange={(e) => handleDriverDetailsChange(driver.id, 'country', e.target.value)}
                            placeholder="Driver country"
                            className="text-sm h-9"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium mb-1 flex items-center">
                            <Image className="w-3 h-3 mr-1 text-f1-red" />
                            Image URL
                          </label>
                          <Input
                            value={driverDetails[driver.id]?.image || ''}
                            onChange={(e) => handleDriverDetailsChange(driver.id, 'image', e.target.value)}
                            placeholder="Image URL or path"
                            className="text-sm h-9"
                          />
                        </div>
                      
                        <div>
                          <label className="block text-xs font-medium mb-1 flex items-center">
                            <FileText className="w-3 h-3 mr-1 text-f1-red" />
                            Description
                          </label>
                          <Textarea
                            value={driverDetails[driver.id]?.description || ''}
                            onChange={(e) => handleDriverDetailsChange(driver.id, 'description', e.target.value)}
                            placeholder="Brief description of the driver"
                            className="min-h-[80px] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 text-sm"
                    onClick={saveDriverDetails}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="w-4 h-4 mr-2" />
                  Team Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teams.map(team => (
                    <div key={team.id} className="flex items-center space-x-3">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: team.color }}></div>
                      <div className="flex-1 truncate">
                        <div className="font-medium text-sm">{team.name}</div>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min="0"
                          value={teamPoints[team.id]}
                          onChange={(e) => handleTeamPointsChange(team.id, e.target.value)}
                          className="text-right text-sm h-8"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 text-sm"
                    onClick={saveTeamPoints}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="races">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Race Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {races.map(race => (
                    <div key={race.id} className="border-b pb-4">
                      <div className="font-medium text-base mb-1">{race.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{race.circuit}</div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Date</label>
                          <Input
                            type="date"
                            value={raceDetails[race.id].date}
                            onChange={(e) => handleRaceDetailsChange(race.id, 'date', e.target.value)}
                            className="text-sm h-9"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium mb-1">Country</label>
                          <Input
                            type="text"
                            value={raceDetails[race.id].country}
                            onChange={(e) => handleRaceDetailsChange(race.id, 'country', e.target.value)}
                            className="text-sm h-9"
                          />
                        </div>
                      
                        <div className="pt-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-f1-red border-gray-300 rounded mr-2"
                              checked={raceDetails[race.id].completed}
                              onChange={(e) => handleRaceDetailsChange(race.id, 'completed', e.target.checked)}
                            />
                            <span className="text-xs">Race completed</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 text-sm"
                    onClick={saveRaceDetails}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Add News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Title</label>
                    <Input
                      value={newNewsItem.title}
                      onChange={(e) => handleNewNewsItemChange('title', e.target.value)}
                      placeholder="News title"
                      className="text-sm h-9"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Content</label>
                    <Textarea
                      value={newNewsItem.content}
                      onChange={(e) => handleNewNewsItemChange('content', e.target.value)}
                      placeholder="News content"
                      className="min-h-[80px] text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Date</label>
                      <Input
                        type="date"
                        value={newNewsItem.date}
                        onChange={(e) => handleNewNewsItemChange('date', e.target.value)}
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Image URL</label>
                      <Input
                        value={newNewsItem.imageUrl}
                        onChange={(e) => handleNewNewsItemChange('imageUrl', e.target.value)}
                        placeholder="URL to an image"
                        className="text-sm h-9"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id="featured-new"
                      checked={newNewsItem.featured}
                      onCheckedChange={(checked) => handleNewNewsItemChange('featured', checked)}
                    />
                    <label htmlFor="featured-new" className="text-xs font-medium">
                      Featured news
                    </label>
                  </div>
                  
                  <Button 
                    className="w-full mt-2 text-sm"
                    onClick={submitNewNewsItem}
                    size="sm"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add News
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Manage News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {newsItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-3 text-sm">No news items found</p>
                  ) : (
                    newsItems.map((item) => (
                      <div key={item.id} className="border-b pb-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-sm truncate pr-2">{item.title}</h3>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteNewsItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Title</label>
                            <Input
                              value={item.title}
                              onChange={(e) => handleNewsItemChange(item.id, 'title', e.target.value)}
                              className="text-sm h-9"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium mb-1">Date</label>
                            <Input
                              type="date"
                              value={item.date}
                              onChange={(e) => handleNewsItemChange(item.id, 'date', e.target.value)}
                              className="text-sm h-9"
                            />
                          </div>
                        
                          <div>
                            <label className="block text-xs font-medium mb-1">Content</label>
                            <Textarea
                              value={item.content}
                              onChange={(e) => handleNewsItemChange(item.id, 'content', e.target.value)}
                              className="min-h-[80px] text-sm"
                            />
                          </div>
                        
                          <div>
                            <label className="block text-xs font-medium mb-1">Image URL</label>
                            <Input
                              value={item.imageUrl || ''}
                              onChange={(e) => handleNewsItemChange(item.id, 'imageUrl', e.target.value)}
                              placeholder="URL to an image"
                              className="text-sm h-9"
                            />
                          </div>
                        
                          <div className="flex items-center space-x-2 pt-1">
                            <Switch
                              id={`featured-${item.id}`}
                              checked={item.featured}
                              onCheckedChange={(checked) => handleNewsItemChange(item.id, 'featured', checked)}
                            />
                            <label htmlFor={`featured-${item.id}`} className="text-xs font-medium">
                              Featured news
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {newsItems.length > 0 && (
                    <Button 
                      className="w-full mt-2 text-sm"
                      onClick={saveNewsItems}
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tournament">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tournament Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Tournament Name</label>
                    <Input
                      value={tournamentConfig.title}
                      onChange={(e) => handleConfigChange('title', e.target.value)}
                      className="text-sm h-9"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">Season Year</label>
                    <Input
                      type="number"
                      min="2000"
                      max="2100"
                      value={tournamentConfig.season}
                      onChange={(e) => handleConfigChange('season', parseInt(e.target.value, 10) || 2024)}
                      className="text-sm h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Points System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(tournamentConfig.pointsSystem).map(([position, points]) => (
                    <div key={position}>
                      <label className="block text-xs font-medium mb-1">P{position}</label>
                      <Input
                        type="number"
                        min="0"
                        value={points}
                        onChange={(e) => handlePointsSystemChange(position, e.target.value)}
                        className="text-sm h-8"
                      />
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-4 text-sm"
                  onClick={saveTournamentConfig}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Trophy className="w-4 h-4 mr-2" />
                    Add Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Team Name</label>
                      <Input
                        value={newTeam.name}
                        onChange={(e) => handleNewTeamChange('name', e.target.value)}
                        placeholder="Enter team name"
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Initial Points</label>
                      <Input
                        type="number"
                        min="0"
                        value={newTeam.points}
                        onChange={(e) => handleNewTeamChange('points', parseInt(e.target.value, 10) || 0)}
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Team Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={newTeam.color}
                          onChange={(e) => handleNewTeamChange('color', e.target.value)}
                          className="w-12 h-9 p-1"
                        />
                        <Input
                          type="text"
                          value={newTeam.color}
                          onChange={(e) => handleNewTeamChange('color', e.target.value)}
                          placeholder="#000000"
                          className="text-sm h-9"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-3 text-sm"
                      onClick={submitNewTeam}
                      size="sm"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Flag className="w-4 h-4 mr-2" />
                    Add Race
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Race Name</label>
                      <Input
                        value={newRace.name}
                        onChange={(e) => handleNewRaceChange('name', e.target.value)}
                        placeholder="E.g. Monaco Grand Prix"
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Circuit</label>
                      <Input
                        value={newRace.circuit}
                        onChange={(e) => handleNewRaceChange('circuit', e.target.value)}
                        placeholder="E.g. Circuit de Monaco"
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Country</label>
                      <Input
                        value={newRace.country}
                        onChange={(e) => handleNewRaceChange('country', e.target.value)}
                        placeholder="E.g. Monaco"
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Date</label>
                      <Input
                        type="date"
                        value={newRace.date}
                        onChange={(e) => handleNewRaceChange('date', e.target.value)}
                        className="text-sm h-9"
                      />
                    </div>
                    
                    <div className="pt-1">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-f1-red border-gray-300 rounded mr-2"
                          checked={newRace.completed}
                          onChange={(e) => handleNewRaceChange('completed', e.target.checked)}
                        />
                        <span className="text-xs">Race completed</span>
                      </label>
                    </div>
                    
                    <Button 
                      className="w-full mt-3 text-sm"
                      onClick={submitNewRace}
                      size="sm"
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
