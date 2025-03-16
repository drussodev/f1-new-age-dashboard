
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useF1Data } from '@/context/F1DataContext';

export const DataImporter = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const { user } = useAuth();
  const { refreshData } = useF1Data();

  const importData = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      if (!user) {
        toast.error("You must be logged in to import data");
        setResult('error');
        return;
      }
      
      // Simply refresh data from MySQL since we're directly connected to the source
      await refreshData();
      
      console.log('Import completed by refreshing data');
      toast.success("Data refreshed successfully!");
      setResult('success');
    } catch (err) {
      console.error('Error in data refresh process:', err);
      toast.error("An unexpected error occurred");
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Refresh MySQL Data</CardTitle>
        <CardDescription>
          Refresh F1 tournament data from MySQL database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          This will refresh all data from the MySQL database at 185.113.141.167.
        </p>
        {result === 'success' && (
          <div className="flex items-center text-green-600 p-3 bg-green-50 rounded-md mb-4">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Data refreshed successfully!</span>
          </div>
        )}
        {result === 'error' && (
          <div className="flex items-center text-red-600 p-3 bg-red-50 rounded-md mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to refresh data. Check console for details.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={importData} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing Data...
            </>
          ) : "Refresh Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataImporter;
