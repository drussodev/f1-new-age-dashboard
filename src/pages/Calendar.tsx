import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Plus, Clock, Timer, Flag, Award } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendWebhookNotification } from '@/utils/webhook';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import RacePreparationPopup from '@/components/calendar/RacePreparationPopup';

interface RaceDriver {
  driverId: string;
  driverName: string;
  position: number;
  bestLapTime?: string;
  totalTime?: string;
  points: number;
  stops: number;
}

interface RaceDetails {
  grid: RaceDriver[];
}

interface Race {
  id: string;
  name: string;
  circuit: string;
  date: string;
  location: string;
  completed: boolean;
  winner?: string;
  details?: RaceDetails;
}

const CalendarPage = () => {
  const { races, setRaces, drivers } = useF1Data();
  const [selectedRace, setSelectedRace] = useState<any>(null);
  const [isRaceDetailsOpen, setIsRaceDetailsOpen] = useState(false);
  const [isAddRaceOpen, setIsAddRaceOpen] = useState(false);
  const [isEditGridOpen, setIsEditGridOpen] = useState(false);
  const [isPreparationPopupOpen, setIsPreparationPopupOpen] = useState(false);
  const [raceDetails, setRaceDetails] = useState<RaceDetails>({
    grid: []
  });
  const [newRace, setNewRace] = useState({
    id: '',
    name: '',
    circuit: '',
    date: new Date(),
    location: '',
    completed: false,
    winner: ''
  });
  const [editMode, setEditMode] = useState(false);

  const sortedRaces = [...races].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingRaces = sortedRaces.filter(race => !race.completed);
  const completedRaces = sortedRaces.filter(race => race.completed);

  const handleRaceClick = (race: any) => {
    setSelectedRace(race);
    
    if (!race.completed) {
      setIsPreparationPopupOpen(true);
      return;
    }
    
    if (race.details) {
      setRaceDetails(race.details);
    } else {
      const mockDetails: RaceDetails = {
        grid: drivers.slice(0, 10).map((driver, index) => ({
          driverId: driver.id,
          driverName: driver.name,
          position: index + 1,
          bestLapTime: `1:${Math.floor(Math.random() * 10) + 30}:${Math.floor(Math.random() * 60)}`,
          totalTime: `${Math.floor(Math.random() * 2) + 1}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`,
          points: race.completed ? (10 - index) * 2 : 0,
          stops: Math.floor(Math.random() * 3) + 1
        }))
      };
      setRaceDetails(mockDetails);
    }
    
    setIsRaceDetailsOpen(true);
  };

  const closeRaceDetails = () => {
    setIsRaceDetailsOpen(false);
    setSelectedRace(null);
  };

  const closePreparationPopup = () => {
    setIsPreparationPopupOpen(false);
    setSelectedRace(null);
  };

  const openAddRaceForm = () => {
    setEditMode(false);
    setNewRace({
      id: Date.now().toString(),
      name: '',
      circuit: '',
      date: new Date(),
      location: '',
      completed: false,
      winner: ''
    });
    setIsAddRaceOpen(true);
  };

  const openEditRaceForm = (race: any) => {
    setEditMode(true);
    setNewRace({
      ...race,
      date: new Date(race.date)
    });
    setIsAddRaceOpen(true);
  };

  const closeAddRaceForm = () => {
    setIsAddRaceOpen(false);
  };

  const handleRaceFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRace(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewRace(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleCompletedChange = (value: string) => {
    setNewRace(prev => ({
      ...prev,
      completed: value === 'true'
    }));
  };

  const handleWinnerChange = (value: string) => {
    setNewRace(prev => ({
      ...prev,
      winner: value
    }));
  };

  const handleAddOrUpdateRace = () => {
    const raceToSave = {
      ...newRace,
      date: newRace.date.toISOString(),
      details: selectedRace?.details
    };

    if (editMode) {
      setRaces(prevRaces => 
        prevRaces.map(race => race.id === raceToSave.id ? raceToSave as Race : race)
      );
      sendWebhookNotification(
        "Race Updated",
        "admin",
        {
          action: "Updated race",
          race: newRace.name,
          circuit: newRace.circuit,
          date: format(newRace.date, 'PPP'),
          completed: newRace.completed ? "Yes" : "No"
        }
      );
    } else {
      setRaces(prevRaces => [...prevRaces, raceToSave as Race]);
      sendWebhookNotification(
        "Race Added",
        "admin",
        {
          action: "Added new race",
          race: newRace.name,
          circuit: newRace.circuit,
          date: format(newRace.date, 'PPP'),
          completed: newRace.completed ? "Yes" : "No"
        }
      );
    }
    closeAddRaceForm();
  };

  const openEditGrid = () => {
    setIsEditGridOpen(true);
  };

  const closeEditGrid = () => {
    setIsEditGridOpen(false);
  };

  const updateDriverDetail = (driverId: string, field: keyof RaceDriver, value: any) => {
    setRaceDetails(prev => {
      const updatedGrid = prev.grid.map(driver => 
        driver.driverId === driverId 
          ? { ...driver, [field]: field === 'position' || field === 'points' || field === 'stops' ? Number(value) : value }
          : driver
      );
      return { ...prev, grid: updatedGrid };
    });
  };

  const saveRaceDetails = () => {
    if (!selectedRace) return;

    const sortedGrid = [...raceDetails.grid].sort((a, b) => a.position - b.position);
    const updatedDetails = { ...raceDetails, grid: sortedGrid };

    const updatedRace = {
      ...selectedRace,
      details: updatedDetails
    };

    setRaces(prevRaces => 
      prevRaces.map(race => race.id === selectedRace.id ? updatedRace : race)
    );

    setSelectedRace(updatedRace);
    closeEditGrid();

    sendWebhookNotification(
      "Race Grid Updated",
      "admin",
      {
        action: "Updated race grid",
        race: selectedRace.name,
        circuit: selectedRace.circuit
      }
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-f1-red mr-3" />
            <h1 className="text-3xl font-bold">Race Calendar</h1>
          </div>
          <Button 
            onClick={openAddRaceForm}
            className="bg-f1-red hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Race
          </Button>
        </div>

        {upcomingRaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Races</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRaces.map((race) => (
                <Card 
                  key={race.id} 
                  className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleRaceClick(race)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{race.name}</CardTitle>
                    <CardDescription>{format(new Date(race.date), 'MMMM dd, yyyy')}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>Circuit: {race.circuit}</p>
                    <p>Location: {race.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedRaces.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Races</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedRaces.map((race) => (
                <Card 
                  key={race.id} 
                  className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleRaceClick(race)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{race.name}</CardTitle>
                    <CardDescription>{format(new Date(race.date), 'MMMM dd, yyyy')}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>Circuit: {race.circuit}</p>
                    <p>Location: {race.location}</p>
                    <p>Winner: {race.winner || 'N/A'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {races.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-500">No races available in the calendar.</p>
          </div>
        )}

        {selectedRace && (
          <RacePreparationPopup
            isOpen={isPreparationPopupOpen}
            onClose={closePreparationPopup}
            raceName={selectedRace.name}
            raceDate={selectedRace.date}
            circuit={selectedRace.circuit}
          />
        )}

        <Dialog open={isRaceDetailsOpen} onOpenChange={setIsRaceDetailsOpen}>
          <DialogContent className="sm:max-w-[800px]">
            {selectedRace && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedRace.name}</DialogTitle>
                  <DialogDescription>
                    {format(new Date(selectedRace.date), 'MMMM dd, yyyy')} - {selectedRace.circuit}, {selectedRace.location}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Race Results</h3>
                    <div className="flex items-center gap-2">
                      {selectedRace.winner && (
                        <div className="flex items-center mr-4">
                          <Award className="text-yellow-500 w-5 h-5 mr-1" />
                          <span>Winner: <strong>{selectedRace.winner}</strong></span>
                        </div>
                      )}
                      <Button variant="outline" onClick={openEditGrid}>
                        Edit Grid
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Position</TableHead>
                          <TableHead>Driver</TableHead>
                          <TableHead className="text-center"><Clock className="inline-block w-4 h-4 mr-1" /> Best Lap</TableHead>
                          <TableHead className="text-center"><Timer className="inline-block w-4 h-4 mr-1" /> Total Time</TableHead>
                          <TableHead className="text-center"><Flag className="inline-block w-4 h-4 mr-1" /> Stops</TableHead>
                          <TableHead className="text-center"><Award className="inline-block w-4 h-4 mr-1" /> Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {raceDetails.grid.map((driver) => (
                          <TableRow key={driver.driverId}>
                            <TableCell className="font-medium">{driver.position}</TableCell>
                            <TableCell>{driver.driverName}</TableCell>
                            <TableCell className="text-center">{driver.bestLapTime}</TableCell>
                            <TableCell className="text-center">{driver.totalTime}</TableCell>
                            <TableCell className="text-center">{driver.stops}</TableCell>
                            <TableCell className="text-center">{driver.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between items-center mt-6">
                  <Button variant="outline" onClick={() => openEditRaceForm(selectedRace)}>
                    Edit Race
                  </Button>
                  <Button variant="default" onClick={closeRaceDetails}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Sheet open={isEditGridOpen} onOpenChange={setIsEditGridOpen}>
          <SheetContent className="sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Race Grid</SheetTitle>
              <SheetDescription>
                Update driver positions, times, points, and pit stops.
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Best Lap</TableHead>
                    <TableHead>Total Time</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {raceDetails.grid.map((driver) => (
                    <TableRow key={driver.driverId}>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={driver.position} 
                          min={1}
                          onChange={(e) => updateDriverDetail(driver.driverId, 'position', e.target.value)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>{driver.driverName}</TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          value={driver.bestLapTime || ''} 
                          onChange={(e) => updateDriverDetail(driver.driverId, 'bestLapTime', e.target.value)}
                          placeholder="0:00:00"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          value={driver.totalTime || ''} 
                          onChange={(e) => updateDriverDetail(driver.driverId, 'totalTime', e.target.value)}
                          placeholder="0:00:00"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={driver.stops} 
                          min={0}
                          onChange={(e) => updateDriverDetail(driver.driverId, 'stops', e.target.value)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={driver.points} 
                          min={0}
                          onChange={(e) => updateDriverDetail(driver.driverId, 'points', e.target.value)}
                          className="w-16"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <SheetFooter className="mt-6">
              <Button variant="outline" onClick={closeEditGrid} className="mr-2">
                Cancel
              </Button>
              <Button onClick={saveRaceDetails}>
                Save Grid
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet open={isAddRaceOpen} onOpenChange={setIsAddRaceOpen}>
          <SheetContent className="sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>{editMode ? 'Edit Race' : 'Add New Race'}</SheetTitle>
              <SheetDescription>
                {editMode 
                  ? 'Make changes to the existing race in the calendar.' 
                  : 'Add a new race to the F1 calendar. Fill in all the details below.'}
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 py-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Race Name</label>
                <Input
                  id="name"
                  name="name"
                  value={newRace.name}
                  onChange={handleRaceFormChange}
                  placeholder="e.g. Monaco Grand Prix"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="circuit" className="text-sm font-medium">Circuit</label>
                <Input
                  id="circuit"
                  name="circuit"
                  value={newRace.circuit}
                  onChange={handleRaceFormChange}
                  placeholder="e.g. Circuit de Monaco"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input
                  id="location"
                  name="location"
                  value={newRace.location}
                  onChange={handleRaceFormChange}
                  placeholder="e.g. Monte Carlo, Monaco"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newRace.date ? format(newRace.date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newRace.date}
                      onSelect={handleDateChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={newRace.completed ? 'true' : 'false'} 
                  onValueChange={handleCompletedChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Upcoming</SelectItem>
                    <SelectItem value="true">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newRace.completed && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Winner</label>
                  <Select 
                    value={newRace.winner || ''} 
                    onValueChange={handleWinnerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select winner" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map(driver => (
                        <SelectItem key={driver.id} value={driver.name}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <SheetFooter>
              <Button variant="outline" onClick={closeAddRaceForm}>
                Cancel
              </Button>
              <Button onClick={handleAddOrUpdateRace}>
                {editMode ? 'Update Race' : 'Add Race'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
};

export default CalendarPage;
