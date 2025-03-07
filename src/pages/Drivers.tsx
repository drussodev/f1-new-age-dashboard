
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Drivers = () => {
  const { drivers } = useF1Data();

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
                      <p className="text-gray-500">{driver.country}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Team</span>
                      <span className="font-medium">{driver.team}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Points</span>
                      <span className="font-bold text-lg">{driver.points}</span>
                    </div>
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
