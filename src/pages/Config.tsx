import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Settings, Newspaper, Twitch, Image, Video, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";

const Config = () => {
  const { 
    drivers, setDrivers, 
    teams, setTeams, 
    races, setRaces,
    config, setConfig,
    news, setNews
  } = useF1Data();

  // Title and season state
  const [title, setTitle] = useState(config.title);
  const [season, setSeason] = useState(config.season);

  // New streamer state
  const [newStreamer, setNewStreamer] = useState('');

  // Save general settings
  const saveGeneralSettings = () => {
    setConfig({
      ...config,
      title,
      season
    });
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    });
  };

  // Add new streamer
  const addStreamer = () => {
    if (!newStreamer.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Twitch username",
        variant: "destructive"
      });
      return;
    }

    // Check if streamer already exists
    if (config.streamers.some(s => s.username.toLowerCase() === newStreamer.toLowerCase())) {
      toast({
        title: "Error",
        description: "This streamer is already in the list",
        variant: "destructive"
      });
      return;
    }

    const updatedStreamers = [...config.streamers, { 
      username: newStreamer.trim(),
      displayName: newStreamer.trim() 
    }];

    setConfig({
      ...config,
      streamers: updatedStreamers
    });

    setNewStreamer('');
    
    toast({
      title: "Streamer added",
      description: `${newStreamer} has been added to the streamers list`,
    });
  };

  // Remove streamer
  const removeStreamer = (username: string) => {
    const updatedStreamers = config.streamers.filter(
      streamer => streamer.username !== username
    );

    setConfig({
      ...config,
      streamers: updatedStreamers
    });

    toast({
      title: "Streamer removed",
      description: `${username} has been removed from the streamers list`,
    });
  };

  // Driver State
  const [driverName, setDriverName] = useState('');
  const [driverNumber, setDriverNumber] = useState('');
  const [driverTeam, setDriverTeam] = useState('');
  const [driverCountry, setDriverCountry] = useState('');
  const [driverPoints, setDriverPoints] = useState('');
  const [driverColor, setDriverColor] = useState('');

  const addDriver = () => {
    if (!driverName.trim() || !driverNumber || !driverTeam.trim() || !driverCountry.trim() || !driverPoints || !driverColor.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all driver fields.",
        variant: "destructive"
      });
      return;
    }

    const newDriver = {
      id: Math.random().toString(36).substring(7),
      name: driverName,
      number: parseInt(driverNumber),
      team: driverTeam,
      country: driverCountry,
      points: parseInt(driverPoints),
      color: driverColor
    };

    setDrivers([...drivers, newDriver]);
    setDriverName('');
    setDriverNumber('');
    setDriverTeam('');
    setDriverCountry('');
    setDriverPoints('');
    setDriverColor('');

    toast({
      title: "Driver added",
      description: `${driverName} has been added to the drivers list`,
    });
  };

  const removeDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
    toast({
      title: "Driver removed",
      description: `Driver has been removed from the drivers list`,
    });
  };

  // Team State
  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState('');
  const [teamPoints, setTeamPoints] = useState('');
  const [teamBase, setTeamBase] = useState('');

  const addTeam = () => {
    if (!teamName.trim() || !teamColor.trim() || !teamPoints || !teamBase.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all team fields.",
        variant: "destructive"
      });
      return;
    }

    const newTeam = {
      id: Math.random().toString(36).substring(7),
      name: teamName,
      color: teamColor,
      points: parseInt(teamPoints),
      base: teamBase
    };

    setTeams([...teams, newTeam]);
    setTeamName('');
    setTeamColor('');
    setTeamPoints('');
    setTeamBase('');

    toast({
      title: "Team added",
      description: `${teamName} has been added to the teams list`,
    });
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
    toast({
      title: "Team removed",
      description: `Team has been removed from the teams list`,
    });
  };

  // Race State
  const [newRace, setNewRace] = useState({
    id: '',
    name: '',
    circuit: '',
    date: '',
    location: '',
    country: '',
    completed: false,
    winner: ''
  });

  const handleAddRace = () => {
    if (!newRace.name || !newRace.circuit || !newRace.date || !newRace.location || !newRace.country) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const raceId = Date.now().toString();
    setRaces([...races, { ...newRace, id: raceId }]);
    setNewRace({
      id: '',
      name: '',
      circuit: '',
      date: '',
      location: '',
      country: '',
      completed: false,
      winner: ''
    });
    
    toast({
      title: "Success",
      description: "Race added successfully!"
    });
  };

  // News State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsFeatured, setNewsFeatured] = useState(false);

  const addNews = () => {
    if (!newsTitle.trim() || !newsContent.trim() || !newsDate.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required news fields (title, content, date).",
        variant: "destructive"
      });
      return;
    }

    const newNews = {
      id: Math.random().toString(36).substring(7),
      title: newsTitle,
      content: newsContent,
      date: newsDate,
      imageUrl: newsImageUrl.trim() || undefined,
      videoUrl: newsVideoUrl.trim() || undefined,
      featured: newsFeatured
    };

    setNews([...news, newNews]);
    setNewsTitle('');
    setNewsContent('');
    setNewsDate('');
    setNewsImageUrl('');
    setNewsVideoUrl('');
    setNewsFeatured(false);

    toast({
      title: "News added",
      description: `${newsTitle} has been added to the news list`,
    });
  };

  const removeNews = (id: string) => {
    setNews(news.filter(newsItem => newsItem.id !== id));
    toast({
      title: "News removed",
      description: `News has been removed from the news list`,
    });
  };

  return (
    <Layout>
      <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Admin Configuration</h1>
        
        <Tabs defaultValue="drivers">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="drivers" className="flex items-center gap-1"><Users className="w-4 h-4" /> Drivers</TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-1"><Trophy className="w-4 h-4" /> Teams</TabsTrigger>
            <TabsTrigger value="races" className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Races</TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-1"><Newspaper className="w-4 h-4" /> News</TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>Driver Settings</CardTitle>
                <CardDescription>
                  Add, remove, and manage drivers in the F1 tournament.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input
                      id="driverName"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Enter driver name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverNumber">Driver Number</Label>
                    <Input
                      id="driverNumber"
                      type="number"
                      value={driverNumber}
                      onChange={(e) => setDriverNumber(e.target.value)}
                      placeholder="Enter driver number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverTeam">Driver Team</Label>
                    <Input
                      id="driverTeam"
                      value={driverTeam}
                      onChange={(e) => setDriverTeam(e.target.value)}
                      placeholder="Enter driver team"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverCountry">Driver Country</Label>
                    <Input
                      id="driverCountry"
                      value={driverCountry}
                      onChange={(e) => setDriverCountry(e.target.value)}
                      placeholder="Enter driver country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverPoints">Driver Points</Label>
                    <Input
                      id="driverPoints"
                      type="number"
                      value={driverPoints}
                      onChange={(e) => setDriverPoints(e.target.value)}
                      placeholder="Enter driver points"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverColor">Driver Color</Label>
                    <Input
                      id="driverColor"
                      type="color"
                      value={driverColor}
                      onChange={(e) => setDriverColor(e.target.value)}
                      placeholder="Enter driver color"
                    />
                  </div>
                </div>
                <Button onClick={addDriver}>Add Driver</Button>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Current Drivers</h3>
                  {drivers.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No drivers added yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Number</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                              <TableCell className="font-medium">{driver.name}</TableCell>
                              <TableCell>{driver.number}</TableCell>
                              <TableCell>{driver.team}</TableCell>
                              <TableCell>{driver.country}</TableCell>
                              <TableCell>{driver.points}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => removeDriver(driver.id)}>
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Team Settings</CardTitle>
                <CardDescription>
                  Add, remove, and manage teams in the F1 tournament.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamColor">Team Color</Label>
                    <Input
                      id="teamColor"
                      type="color"
                      value={teamColor}
                      onChange={(e) => setTeamColor(e.target.value)}
                      placeholder="Enter team color"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamPoints">Team Points</Label>
                    <Input
                      id="teamPoints"
                      type="number"
                      value={teamPoints}
                      onChange={(e) => setTeamPoints(e.target.value)}
                      placeholder="Enter team points"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamBase">Team Base</Label>
                    <Input
                      id="teamBase"
                      value={teamBase}
                      onChange={(e) => setTeamBase(e.target.value)}
                      placeholder="Enter team base"
                    />
                  </div>
                </div>
                <Button onClick={addTeam}>Add Team</Button>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Current Teams</h3>
                  {teams.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No teams added yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Base</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teams.map((team) => (
                            <TableRow key={team.id}>
                              <TableCell className="font-medium">{team.name}</TableCell>
                              <TableCell>{team.color}</TableCell>
                              <TableCell>{team.points}</TableCell>
                              <TableCell>{team.base}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => removeTeam(team.id)}>
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="races">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add Race</CardTitle>
                  <CardDescription>Add a new race to the calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="race-name">Race Name</Label>
                      <Input 
                        id="race-name"
                        value={newRace.name}
                        onChange={(e) => setNewRace({...newRace, name: e.target.value})}
                        placeholder="e.g. Monaco Grand Prix"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="race-circuit">Circuit</Label>
                      <Input 
                        id="race-circuit"
                        value={newRace.circuit}
                        onChange={(e) => setNewRace({...newRace, circuit: e.target.value})}
                        placeholder="e.g. Circuit de Monaco"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="race-date">Date</Label>
                      <Input 
                        id="race-date"
                        type="date"
                        value={newRace.date}
                        onChange={(e) => setNewRace({...newRace, date: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="race-location">Location</Label>
                      <Input 
                        id="race-location"
                        value={newRace.location}
                        onChange={(e) => setNewRace({...newRace, location: e.target.value})}
                        placeholder="e.g. Monte Carlo, Monaco"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="race-country">Country</Label>
                      <Input 
                        id="race-country"
                        value={newRace.country}
                        onChange={(e) => setNewRace({...newRace, country: e.target.value})}
                        placeholder="e.g. Monaco"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="race-completed"
                        checked={newRace.completed}
                        onCheckedChange={(checked) => 
                          setNewRace({...newRace, completed: checked === true})
                        }
                      />
                      <Label htmlFor="race-completed">Race Completed</Label>
                    </div>
                    
                    {newRace.completed && (
                      <div>
                        <Label htmlFor="race-winner">Winner</Label>
                        <Input 
                          id="race-winner"
                          value={newRace.winner || ''}
                          onChange={(e) => setNewRace({...newRace, winner: e.target.value})}
                          placeholder="Race winner's name"
                        />
                      </div>
                    )}
                    
                    <Button type="button" onClick={handleAddRace} className="w-full">
                      Add Race
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Race Calendar</CardTitle>
                  <CardDescription>Manage existing races</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  {races.length === 0 ? (
                    <p className="text-muted-foreground">No races added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {races.map((race) => (
                        <div key={race.id} className="border p-3 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{race.name}</h3>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setRaces(races.filter(r => r.id !== race.id));
                                toast({
                                  title: "Success",
                                  description: "Race removed successfully!"
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {race.circuit} - {new Date(race.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {race.location}, {race.country}
                          </p>
                          <div className="mt-1 text-sm">
                            {race.completed ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                {race.winner ? `Winner: ${race.winner}` : 'Completed'}
                              </span>
                            ) : (
                              <span className="text-blue-600">Upcoming</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>News Settings</CardTitle>
                <CardDescription>
                  Add, remove, and manage news articles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newsTitle">News Title *</Label>
                    <Input
                      id="newsTitle"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="Enter news title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsContent">News Content *</Label>
                    <Input
                      id="newsContent"
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      placeholder="Enter news content"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsDate">News Date *</Label>
                    <Input
                      id="newsDate"
                      type="date"
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      placeholder="Enter news date"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsImageUrl" className="flex items-center gap-2">
                      <Image className="h-4 w-4" /> Image URL
                    </Label>
                    <Input
                      id="newsImageUrl"
                      value={newsImageUrl}
                      onChange={(e) => setNewsImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsVideoUrl" className="flex items-center gap-2">
                      <Video className="h-4 w-4" /> Video URL
                    </Label>
                    <Input
                      id="newsVideoUrl"
                      value={newsVideoUrl}
                      onChange={(e) => setNewsVideoUrl(e.target.value)}
                      placeholder="Enter video embed URL"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="newsFeatured" 
                      checked={newsFeatured}
                      onCheckedChange={(checked) => setNewsFeatured(checked === true)}
                    />
                    <Label htmlFor="newsFeatured" className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-f1-red" /> Featured News
                    </Label>
                  </div>
                </div>
                <Button onClick={addNews}>Add News</Button>
  
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Current News</h3>
                  {news.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Newspaper className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No news added yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Title</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Media</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {news.map((newsItem) => (
                            <TableRow key={newsItem.id}>
                              <TableCell className="font-medium">{newsItem.title}</TableCell>
                              <TableCell>{newsItem.content.length > 50 ? `${newsItem.content.substring(0, 50)}...` : newsItem.content}</TableCell>
                              <TableCell>{newsItem.date}</TableCell>
                              <TableCell>
                                {newsItem.imageUrl && <Image className="h-4 w-4 inline mr-2" />}
                                {newsItem.videoUrl && <Video className="h-4 w-4 inline" />}
                              </TableCell>
                              <TableCell>{newsItem.featured ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => removeNews(newsItem.id)}>
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the basic settings for the F1 tournament.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="title">
                    Tournament Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter tournament title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="season">
                    Season
                  </label>
                  <Input
                    id="season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    placeholder="Enter season year"
                  />
                </div>
                <Button onClick={saveGeneralSettings}>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streaming">
            <Card>
              <CardHeader>
                <CardTitle>Streaming Settings</CardTitle>
                <CardDescription>
                  Manage Twitch streamers that will be featured on the Streaming page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter Twitch username"
                        value={newStreamer}
                        onChange={(e) => setNewStreamer(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="shrink-0" 
                      onClick={addStreamer}
                    >
                      Add Streamer
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Current Streamers</h3>
                    
                    {config.streamers.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <Twitch className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">No streamers added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {config.streamers.map((streamer) => (
                          <div 
                            key={streamer.username}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center">
                              <Twitch className="w-5 h-5 mr-2 text-purple-600" />
                              <span>{streamer.username}</span>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeStreamer(streamer.username)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Config;

