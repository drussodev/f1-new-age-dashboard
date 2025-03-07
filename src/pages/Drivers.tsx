
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Users, MapPin, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Drivers = () => {
  const { drivers } = useF1Data();
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);

  const toggleDriverDetails = (driverId: string) => {
    setExpandedDriverId(expandedDriverId === driverId ? null : driverId);
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
                          {driver.description && (
                            <div className="mt-2 text-sm text-gray-700">
                              {driver.description}
                            </div>
                          )}
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
