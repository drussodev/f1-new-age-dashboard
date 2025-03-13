
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { useAuth } from '../context/AuthContext';
import { Users, MapPin, Trophy, ChevronDown, ChevronUp, Edit, Check, X, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Drivers = () => {
  const { drivers, setDrivers, teams } = useF1Data();
  const { isAdmin } = useAuth();
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    team: '',
    teamId: '',
    country: '',
    points: 0,
    color: '',
    image: '',
  });

  const toggleDriverDetails = (driverId: string) => {
    setExpandedDriverId(expandedDriverId === driverId ? null : driverId);
  };

  const startEditing = (driver: any) => {
    if (!isAdmin) {
      toast.error("Only administrators can edit driver profiles");
      return;
    }
    
    // Find team ID based on team name
    const teamFound = teams.find(team => team.name === driver.team);
    const teamId = teamFound ? teamFound.id : '';
    
    setEditingDriverId(driver.id);
    setEditFormData({
      name: driver.name,
      team: driver.team,
      teamId: teamId,
      country: driver.country,
      points: driver.points,
      color: driver.color,
      image: driver.image || '',
    });
  };

  const cancelEditing = () => {
    setEditingDriverId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'points' ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleTeamChange = (teamId: string) => {
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      setEditFormData({
        ...editFormData,
        teamId: teamId,
        team: selectedTeam.name,
        color: selectedTeam.color
      });
    }
  };

  const saveDriverChanges = (driverId: string) => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId ? { ...driver, ...editFormData } : driver
    ));
    setEditingDriverId(null);
    toast.success("Driver information updated successfully");
  };

  return (
    <Layout>
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Users className="w-8 h-8 text-f1-red mr-3" />
            <h1 className="text-3xl font-bold">Driver Profiles</h1>
            
            {!isAdmin && (
              <div className="ml-auto flex items-center text-gray-500 text-sm">
                <ShieldAlert className="w-4 h-4 mr-2" />
                <span>Administrator access required to edit drivers</span>
              </div>
            )}
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
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-bold text-lg">Edit Driver</h3>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => saveDriverChanges(driver.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={cancelEditing}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">Points</label>
                          <Input 
                            name="points"
                            type="number"
                            value={editFormData.points}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Driver Name</label>
                        <Input 
                          name="name"
                          value={editFormData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Team</label>
                        <Select 
                          value={editFormData.teamId}
                          onValueChange={handleTeamChange}
                        >
                          <SelectTrigger>
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
                        <label className="text-xs text-gray-500">Country</label>
                        <Input 
                          name="country"
                          value={editFormData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Team Color</label>
                        <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: editFormData.color }}
                          ></div>
                          <span>
                            {editFormData.team ? `${editFormData.team} (${editFormData.color})` : 'Select a team first'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Image URL</label>
                        <Input 
                          name="image"
                          value={editFormData.image}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                        />
                        {editFormData.image && (
                          <div className="mt-2 h-20 w-full rounded overflow-hidden">
                            <img 
                              src={editFormData.image} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-center mb-4">
                        <div className="flex-1">
                          <h2 className="font-bold text-xl">{driver.name}</h2>
                          {isAdmin && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditing(driver)}
                              className="mt-1 h-7 px-2 text-xs"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          )}
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
                        
                        <Button 
                          variant="ghost" 
                          className="w-full flex items-center justify-between mt-2 border"
                          onClick={() => toggleDriverDetails(driver.id)}
                        >
                          <span>More Details</span>
                          {expandedDriverId === driver.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        
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
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
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
