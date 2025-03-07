import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useF1Data } from '../context/F1DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from 'date-fns';

const Calendar = () => {
  const { races } = useF1Data();

  // Sort races by date
  const sortedRaces = [...races].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Separate upcoming and completed races
  const upcomingRaces = sortedRaces.filter(race => !race.completed);
  const completedRaces = sortedRaces.filter(race => race.completed);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <CalendarIcon className="w-8 h-8 text-f1-red mr-3" />
          <h1 className="text-3xl font-bold">Race Calendar</h1>
        </div>

        {/* Upcoming Races */}
        {upcomingRaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Races</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRaces.map((race) => (
                <Card key={race.id} className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Completed Races */}
        {completedRaces.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Races</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedRaces.map((race) => (
                <Card key={race.id} className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Message if no races are available */}
        {races.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-500">No races available in the calendar.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;
