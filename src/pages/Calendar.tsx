
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Calendar as CalendarIcon, Flag, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Calendar = () => {
  const { races } = useF1Data();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Group races by month
  const racesByMonth: { [key: string]: typeof races } = {};
  races.forEach(race => {
    const date = new Date(race.date);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    if (!racesByMonth[month]) {
      racesByMonth[month] = [];
    }
    
    racesByMonth[month].push(race);
  });

  return (
    <Layout>
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <CalendarIcon className="w-8 h-8 text-f1-red mr-3" />
            <h1 className="text-3xl font-bold">2024 Race Calendar</h1>
          </div>
          
          <div className="space-y-10">
            {Object.entries(racesByMonth).map(([month, monthRaces]) => (
              <div key={month}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="inline-block w-8 h-1 bg-f1-red mr-3"></span>
                  {month}
                </h2>
                
                <div className="space-y-4">
                  {monthRaces.map(race => (
                    <Card 
                      key={race.id}
                      className={`overflow-hidden border-l-4 ${
                        race.completed 
                          ? 'border-l-green-500' 
                          : 'border-l-f1-red'
                      }`}
                    >
                      <CardContent className="p-0">
                        <div className="p-4 flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center">
                              {race.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              ) : (
                                <Flag className="w-5 h-5 text-f1-red mr-2" />
                              )}
                              <h3 className="font-bold text-lg">{race.name}</h3>
                            </div>
                            <p className="text-gray-600">{race.circuit}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatDate(race.date)}</div>
                            <div className="text-xs text-gray-500">{race.country}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
