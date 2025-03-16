
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const DataImporter = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const { session } = useAuth();

  const importData = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Retrieve the session token for authorization
      const token = session?.access_token;
      
      if (!token) {
        toast.error("You must be logged in to import data");
        setResult('error');
        return;
      }
      
      // Call the Supabase Edge Function to import the data
      const { data, error } = await supabase.functions.invoke('import-external-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (error) {
        console.error('Error calling import function:', error);
        toast.error("Failed to import data: " + error.message);
        setResult('error');
        return;
      }
      
      console.log('Import result:', data);
      toast.success("Data imported successfully!");
      setResult('success');
    } catch (err) {
      console.error('Error in data import process:', err);
      toast.error("An unexpected error occurred");
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Import External Data</CardTitle>
        <CardDescription>
          Import F1 tournament data from external database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          This will import data from the external server and replace all existing data in your Supabase database.
          Use with caution as this operation cannot be undone.
        </p>
        {result === 'success' && (
          <div className="flex items-center text-green-600 p-3 bg-green-50 rounded-md mb-4">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Data imported successfully!</span>
          </div>
        )}
        {result === 'error' && (
          <div className="flex items-center text-red-600 p-3 bg-red-50 rounded-md mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to import data. Check console for details.</span>
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
              Importing Data...
            </>
          ) : "Import Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataImporter;
