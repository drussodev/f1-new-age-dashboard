
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Users, MapPin, Trophy, ChevronDown, ChevronUp, PenSquare, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Drivers = () => {
  const { drivers, setDrivers } = useF1Data();
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [editedDriver, setEditedDriver] = useState<any>(null);

  const toggleDriverDetails = (driverId: string) => {
    setExpandedDriverId(expandedDriverId === driverId ? null : driverId);
  };

  const startEditingDriver = (driver: any) => {
    setEditingDriverId(driver.id);
    setEditedDriver({ ...driver });
  };

  const cancelEditingDriver = () => {
    setEditingDriverId(null);
    setEditedDriver(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setEditedDriver({ ...editedDriver, [name]: parseInt(value) || 0 });
    } else {
      setEditedDriver({ ...editedDriver, [name]: value });
    }
  };

  const saveDriverChanges = () => {
    const updatedDrivers = drivers.map(driver => 
      driver.id === editingDriverId ? editedDriver : driver
    );
    
    setDrivers(updatedDrivers);
    setEditingDriverId(null);
    setEditedDriver(null);
    
    toast({
      title: "Driver Updated",
      description: "Driver information has been successfully updated.",
    });
  };

  return (
    <Layout>
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Users className="w-8 h-8 text-f1-red mr-3" />
            <h1 className="text-3xl font-bold">Driver Profiles</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drivers.map((driver) => (
              <Card 
                key={driver.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-4" style={{ backgroundColor: driver.color }}></div>
                <CardContent className="p-6">
                  {editingDriverId === driver.id ? (
                    // Editing Mode
                    <>
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-xl font-bold">
                          <Input
                            type="number"
                            name="number"
                            value={editedDriver.number}
                            onChange={handleInputChange}
                            className="w-12 h-12 text-center p-0 border-0 text-xl font-bold bg-transparent"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            name="name"
                            value={editedDriver.name}
                            onChange={handleInputChange}
                            placeholder="Driver Name"
                            className="font-bold text-xl mb-1"
                          />
                          <Input
                            name="country"
                            value={editedDriver.country}
                            onChange={handleInputChange}
                            placeholder="Country"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-f1-red" />
                            <span className="text-gray-600">Team</span>
                          </div>
                          <Input
                            name="team"
                            value={editedDriver.team}
                            onChange={handleInputChange}
                            placeholder="Team"
                            className="w-32 text-right"
                          />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-f1-red" />
                            <span className="text-gray-600">Points</span>
                          </div>
                          <Input
                            name="points"
                            type="number"
                            value={editedDriver.points}
                            onChange={handleInputChange}
                            placeholder="Points"
                            className="w-20 text-right font-bold"
                          />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Color</span>
                          </div>
                          <Input
                            type="color"
                            name="color"
                            value={editedDriver.color}
                            onChange={handleInputChange}
                            className="w-20 h-8"
                          />
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button 
                            onClick={saveDriverChanges} 
                            className="flex-1 flex items-center justify-center"
                            variant="default"
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button 
                            onClick={cancelEditingDriver} 
                            className="flex-1 flex items-center justify-center"
                            variant="outline"
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-2xl font-bold">
                          {driver.number}
                        </div>
                        <div>
                          <h2 className="font-bold text-xl">{driver.name}</h2>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-f1-red" />
                            <span className="text-gray-600">Team</span>
                          </div>
                          <span className="font-medium">{driver.team}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-f1-red" />
                            <span className="text-gray-600">Points</span>
                          </div>
                          <span className="font-bold text-lg">{driver.points}</span>
                        </div>
                        
                        <div className="flex justify-between gap-2">
                          <Button 
                            variant="ghost" 
                            className="flex-1 flex items-center justify-between border"
                            onClick={() => toggleDriverDetails(driver.id)}
                          >
                            <span>More Details</span>
                            {expandedDriverId === driver.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => startEditingDriver(driver)}
                            className="h-10 w-10"
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {expandedDriverId === driver.id && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-f1-red" />
                                <span className="text-gray-600">Country:</span>
                                <span className="font-medium">{driver.country}</span>
                              </div>
                            </div>
                            
                            <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                              <img 
                                src={driver.image || "/placeholder.svg"} 
                                alt={`${driver.name} profile`}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Drivers;
