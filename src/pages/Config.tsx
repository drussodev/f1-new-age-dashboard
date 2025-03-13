import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Settings, Newspaper, Twitch, Star, Image, Video, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { sendWebhookNotification } from '../utils/webhook';

const Config = () => {
  const { 
    config, setConfig,
    drivers, setDrivers,
    teams, setTeams,
    races, setRaces,
    news, setNews
  } = useF1Data();
  
  const { isRoot, user } = useAuth();

  const [title, setTitle] = useState(config.title);
  const [season, setSeason] = useState(config.season);

  const [newStreamer, setNewStreamer] = useState('');

  const saveGeneralSettings = () => {
    setConfig({
      ...config,
      title,
      season
    });
    
    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "Settings Updated", 
        user.username, 
        { 
          action: "Updated general settings",
          title,
          season 
        }
      );
    }
    
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    });
  };

  const addStreamer = () => {
    if (!newStreamer.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Twitch username",
        variant: "destructive"
      });
      return;
    }

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

    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "Streamer Added", 
        user.username, 
        { 
          action: "Added new streamer",
          streamer: newStreamer.trim()
        }
      );
    }

    setNewStreamer('');
    
    toast({
      title: "Streamer added",
      description: `${newStreamer} has been added to the streamers list`,
    });
  };

  const removeStreamer = (username: string) => {
    const updatedStreamers = config.streamers.filter(
      streamer => streamer.username !== username
    );

    setConfig({
      ...config,
      streamers: updatedStreamers
    });

    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "Streamer Removed", 
        user.username, 
        { 
          action: "Removed streamer",
          streamer: username
        }
      );
    }

    toast({
      title: "Streamer removed",
      description: `${username} has been removed from the streamers list`,
    });
  };

  const [driverName, setDriverName] = useState('');
  const [driverTeam, setDriverTeam] = useState('');
  const [driverCountry, setDriverCountry] = useState('');
  const [driverPoints, setDriverPoints] = useState('');
  const [driverColor, setDriverColor] = useState('');
  const [selectedTeamName, setSelectedTeamName] = useState('');

  const handleTeamSelect = (teamId: string) => {
    setDriverTeam(teamId);
    
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      setDriverColor(selectedTeam.color);
      setSelectedTeamName(selectedTeam.name);
    }
  };

  const addDriver = () => {
    if (!driverName.trim() || !driverTeam.trim() || !driverCountry.trim() || !driverPoints || !driverColor.trim()) {
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
      team: selectedTeamName,
      country: driverCountry,
      points: parseInt(driverPoints),
      color: driverColor
    };

    setDrivers([...drivers, newDriver]);
    
    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "Driver Added", 
        user.username, 
        { 
          action: "Added new driver",
          driver: driverName,
          team: selectedTeamName,
          points: driverPoints
        }
      );
    }
    
    setDriverName('');
    setDriverTeam('');
    setSelectedTeamName('');
    setDriverCountry('');
    setDriverPoints('');
    setDriverColor('');

    toast({
      title: "Driver added",
      description: `${driverName} has been added to the drivers list`,
    });
  };

  const removeDriver = (id: string) => {
    const driverToRemove = drivers.find(d => d.id === id);
    
    setDrivers(drivers.filter(driver => driver.id !== id));
    
    if (user && (user.role === 'admin' || user.role === 'root') && driverToRemove) {
      sendWebhookNotification(
        "Driver Removed", 
        user.username, 
        { 
          action: "Removed driver",
          driver: driverToRemove.name,
          team: driverToRemove.team
        }
      );
    }
    
    toast({
      title: "Driver removed",
      description: `Driver has been removed from the drivers list`,
    });
  };

  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState('');
  const [teamPoints, setTeamPoints] = useState('');

  const addTeam = () => {
    if (!teamName.trim() || !teamColor.trim() || !teamPoints) {
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
      points: parseInt(teamPoints)
    };

    setTeams([...teams, newTeam]);
    
    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "Team Added", 
        user.username, 
        { 
          action: "Added new team",
          team: teamName,
          color: teamColor,
          points: teamPoints
        }
      );
    }
    
    setTeamName('');
    setTeamColor('');
    setTeamPoints('');

    toast({
      title: "Team added",
      description: `${teamName} has been added to the teams list`,
    });
  };

  const removeTeam = (id: string) => {
    const teamToRemove = teams.find(t => t.id === id);
    
    setTeams(teams.filter(team => team.id !== id));
    
    if (user && (user.role === 'admin' || user.role === 'root') && teamToRemove) {
      sendWebhookNotification(
        "Team Removed", 
        user.username, 
        { 
          action: "Removed team",
          team: teamToRemove.name
        }
      );
    }
    
    toast({
      title: "Team removed",
      description: `Team has been removed from the teams list`,
    });
  };

  const [raceName, setRaceName] = useState('');
  const [raceCircuit, setRaceCircuit] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [raceLocation, setRaceLocation] = useState('');
  const [raceCompleted, setRaceCompleted] = useState(false);
  const [raceWinner, setRaceWinner] = useState('');

  const addRace = () => {
    if (!raceName.trim() || !raceCircuit.trim() || !raceDate.trim() || !raceLocation.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all race fields.",
        variant: "destructive"
      });
      return;
    }

    const newRace = {
      id: Math.random().toString(36).substring(7),
      name: raceName,
      circuit: raceCircuit,
      date: raceDate,
      location: raceLocation,
      completed: raceCompleted,
      winner: raceCompleted ? raceWinner : undefined
    };

    setRaces([...races, newRace]);
    
    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "Race Added", 
        user.username, 
        { 
          action: "Added new race",
          race: raceName,
          circuit: raceCircuit,
          date: raceDate,
          completed: raceCompleted ? "Yes" : "No"
        }
      );
    }
    
    setRaceName('');
    setRaceCircuit('');
    setRaceDate('');
    setRaceLocation('');
    setRaceCompleted(false);
    setRaceWinner('');

    toast({
      title: "Race added",
      description: `${raceName} has been added to the race calendar`,
    });
  };

  const removeRace = (id: string) => {
    const raceToRemove = races.find(r => r.id === id);
    
    setRaces(races.filter(race => race.id !== id));
    
    if (user && (user.role === 'admin' || user.role === 'root') && raceToRemove) {
      sendWebhookNotification(
        "Race Removed", 
        user.username, 
        { 
          action: "Removed race",
          race: raceToRemove.name,
          circuit: raceToRemove.circuit
        }
      );
    }
    
    toast({
      title: "Race removed",
      description: `Race has been removed from the race calendar`,
    });
  };

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

    if (newsImageUrl && newsVideoUrl) {
      toast({
        title: "Warning",
        description: "Both image and video URLs are provided. Only one will be displayed (video takes precedence).",
      });
    }

    const newNews = {
      id: Math.random().toString(36).substring(7),
      title: newsTitle,
      content: newsContent,
      date: newsDate,
      imageUrl: newsImageUrl || undefined,
      videoUrl: newsVideoUrl || undefined,
      featured: newsFeatured
    };

    setNews([...news, newNews]);
    
    if (user && (user.role === 'admin' || user.role === 'root')) {
      sendWebhookNotification(
        "News Added", 
        user.username, 
        { 
          action: "Added news article",
          title: newsTitle,
          date: newsDate,
          featured: newsFeatured ? "Yes" : "No"
        }
      );
    }
    
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
    const newsToRemove = news.find(n => n.id === id);
    
    setNews(news.filter(newsItem => newsItem.id !== id));
    
    if (user && (user.role === 'admin' || user.role === 'root') && newsToRemove) {
      sendWebhookNotification(
        "News Removed", 
        user.username, 
        { 
          action: "Removed news article",
          title: newsToRemove.title
        }
      );
    }
    
    toast({
      title: "News removed",
      description: `News has been removed from the news list`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Settings className="mr-2 h-8 w-8" />
          Configuration Panel
        </h1>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-6">
            <TabsTrigger value="general" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Drivers
            </TabsTrigger>
            {isRoot && (
              <TabsTrigger value="teams" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                Teams
              </TabsTrigger>
            )}
            {!isRoot && (
              <div className="flex items-center justify-center px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-md cursor-not-allowed">
                <Lock className="mr-2 h-4 w-4" />
                Teams (Root Only)
              </div>
            )}
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center">
              <Newspaper className="mr-2 h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="streaming" className="flex items-center">
              <Twitch className="mr-2 h-4 w-4" />
              Streaming
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
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
                    <Label htmlFor="driverTeam">Driver Team</Label>
                    <Select onValueChange={handleTeamSelect} value={driverTeam}>
                      <SelectTrigger id="driverTeam">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: team.color }}
                              ></div>
                              {team.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="driverColor" className="flex items-center">
                      Team Color 
                      {driverColor && (
                        <div 
                          className="w-4 h-4 rounded-full ml-2" 
                          style={{ backgroundColor: driverColor }}
                        ></div>
                      )}
                    </Label>
                    <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {driverTeam ? (
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: driverColor }}
                          ></div>
                          <span>
                            {selectedTeamName ? `${selectedTeamName} (${driverColor})` : 'Select a team first'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Select a team to set the color
                        </span>
                      )}
                    </div>
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
                            <TableHead>Team</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                              <TableCell className="font-medium">{driver.name}</TableCell>
                              <TableCell>{driver.team}</TableCell>
                              <TableCell>{driver.country}</TableCell>
                              <TableCell>{driver.points}</TableCell>
                              <TableCell>
                                <div 
                                  className="w-6 h-6 rounded-full" 
                                  style={{ backgroundColor: driver.color }}
                                  title={driver.color}
                                ></div>
                              </TableCell>
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

          {isRoot && (
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
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teams.map((team) => (
                              <TableRow key={team.id}>
                                <TableCell className="font-medium">{team.name}</TableCell>
                                <TableCell>{team.color}</TableCell>
                                <TableCell>{team.points}</TableCell>
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
          )}

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Settings</CardTitle>
                <CardDescription>
                  Add, remove, and manage races in the F1 calendar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="raceName">Race Name</Label>
                    <Input
                      id="raceName"
                      value={raceName}
                      onChange={(e) => setRaceName(e.target.value)}
                      placeholder="Enter race name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="raceCircuit">Race Circuit</Label>
                    <Input
                      id="raceCircuit"
                      value={raceCircuit}
                      onChange={(e) => setRaceCircuit(e.target.value)}
                      placeholder="Enter race circuit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="raceDate">Race Date</Label>
                    <Input
                      id="raceDate"
                      type="date"
                      value={raceDate}
                      onChange={(e) => setRaceDate(e.target.value)}
                      placeholder="Enter race date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="raceLocation">Race Location</Label>
                    <Input
                      id="raceLocation"
                      value={raceLocation}
                      onChange={(e) => setRaceLocation(e.target.value)}
                      placeholder="Enter race location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="raceCompleted">Race Completed</Label>
                    <Input
                      id="raceCompleted"
                      type="checkbox"
                      checked={raceCompleted}
                      onChange={(e) => setRaceCompleted(e.target.checked)}
                    />
                  </div>
                  {raceCompleted && (
                    <div>
                      <Label htmlFor="raceWinner">Race Winner</Label>
                      <Input
                        id="raceWinner"
                        value={raceWinner}
                        onChange={(e) => setRaceWinner(e.target.value)}
                        placeholder="Enter race winner"
                      />
                    </div>
                  )}
                </div>
                <Button onClick={addRace}>Add Race</Button>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Current Races</h3>
                  {races.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No races added yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Name</TableHead>
                            <TableHead>Circuit</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Completed</TableHead>
                            <TableHead>Winner</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {races.map((race) => (
                            <TableRow key={race.id}>
                              <TableCell className="font-medium">{race.name}</TableCell>
                              <TableCell>{race.circuit}</TableCell>
                              <TableCell>{race.date}</TableCell>
                              <TableCell>{race.location}</TableCell>
                              <TableCell>{race.completed ? 'Yes' : 'No'}</TableCell>
                              <TableCell>{race.winner}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => removeRace(race.id)}>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsContent">News Content *</Label>
                    <Input
                      id="newsContent"
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      placeholder="Enter news content"
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsImageUrl" className="flex items-center">
                      <Image className="h-4 w-4 mr-1" /> Image URL
                    </Label>
                    <Input
                      id="newsImageUrl"
                      value={newsImageUrl}
                      onChange={(e) => setNewsImageUrl(e.target.value)}
                      placeholder="Enter image URL (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newsVideoUrl" className="flex items-center">
                      <Video className="h-4 w-4 mr-1" /> Video URL
                    </Label>
                    <Input
                      id="newsVideoUrl"
                      value={newsVideoUrl}
                      onChange={(e) => setNewsVideoUrl(e.target.value)}
                      placeholder="Enter video URL (optional)"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox 
                      id="newsFeatured" 
                      checked={newsFeatured}
                      onCheckedChange={(checked) => setNewsFeatured(checked === true)}
                    />
                    <Label htmlFor="newsFeatured" className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-f1-red" /> Featured Article
                    </Label>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">* Required fields</div>
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
                              <TableCell className="max-w-[200px] truncate">{newsItem.content}</TableCell>
                              <TableCell>{newsItem.date}</TableCell>
                              <TableCell>
                                {newsItem.videoUrl && <Video className="h-4 w-4 inline mr-1" />}
                                {newsItem.imageUrl && !newsItem.videoUrl && <Image className="h-4 w-4 inline mr-1" />}
                                {!newsItem.imageUrl && !newsItem.videoUrl && 'None'}
                              </TableCell>
                              <TableCell>{newsItem.featured ? 
                                <Star className="h-4 w-4 text-f1-red" /> : 'No'}
                              </TableCell>
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

