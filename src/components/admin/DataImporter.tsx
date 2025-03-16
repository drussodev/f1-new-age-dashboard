
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useF1Data } from '@/context/F1DataContext';

export const DataImporter = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const { user } = useAuth();
  const { refreshData } = useF1Data();

  const resetToDefaults = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      if (!user) {
        toast.error("You must be logged in to reset data");
        setResult('error');
        return;
      }
      
      // Clear local storage for F1 data
      localStorage.removeItem('f1_drivers');
      localStorage.removeItem('f1_teams');
      localStorage.removeItem('f1_races');
      localStorage.removeItem('f1_news');
      localStorage.removeItem('f1_config');
      localStorage.removeItem('f1_streamers');
      
      // Refresh data to load defaults
      await refreshData();
      
      console.log('Data reset to defaults successfully');
      toast.success("Data reset to defaults successfully!");
      setResult('success');
    } catch (err) {
      console.error('Error in data reset process:', err);
      toast.error("An unexpected error occurred");
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Reset Local Data</CardTitle>
        <CardDescription>
          Reset F1 tournament data to default values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          This will reset all data to the default values. Any changes you've made will be lost.
        </p>
        {result === 'success' && (
          <div className="flex items-center text-green-600 p-3 bg-green-50 rounded-md mb-4">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Data reset successfully!</span>
          </div>
        )}
        {result === 'error' && (
          <div className="flex items-center text-red-600 p-3 bg-red-50 rounded-md mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to reset data. Check console for details.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={resetToDefaults} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Data...
            </>
          ) : "Reset to Defaults"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataImporter;
