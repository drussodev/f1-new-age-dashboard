
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';

const Logs = () => {
  const { logs } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FileText className="w-8 h-8 text-f1-red mr-3" />
          <h1 className="text-3xl font-bold">System Logs</h1>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Admin Action Logs</CardTitle>
            <CardDescription>
              Record of all administrative actions performed on the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] rounded-md border p-4">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No logs recorded yet
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-gray-600">{log.details}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{log.username}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Logs;
