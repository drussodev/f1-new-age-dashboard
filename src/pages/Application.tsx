
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Trophy, User, Mail, MessageSquare, Clock } from 'lucide-react';

const Application: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    availability: '',
    discord: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.experience || !formData.availability) {
      toast.error("Please fill out all required fields");
      setSubmitting(false);
      return;
    }
    
    // Simulating submission - in a real app, this would send data to a server
    setTimeout(() => {
      toast.success("Application submitted successfully! We'll contact you soon.");
      setFormData({
        name: '',
        email: '',
        experience: '',
        availability: '',
        discord: '',
      });
      setSubmitting(false);
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Join the F1 New Age Tournament</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Are you ready to compete against the best? Fill out the application form below to join our next racing season.
          </p>
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-f1-red">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-f1-red" />
              Tournament Application Form
            </CardTitle>
            <CardDescription>
              Please provide your information to apply for the tournament
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Full Name *
                    </Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> Email Address *
                    </Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discord" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> Discord Username
                  </Label>
                  <Input 
                    id="discord"
                    name="discord"
                    value={formData.discord}
                    onChange={handleChange}
                    placeholder="Your Discord username (optional)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" /> Racing Experience *
                  </Label>
                  <Input 
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Describe your racing experience and skill level"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Availability *
                  </Label>
                  <Input 
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="When are you available for races? (e.g., weekends, evenings)"
                    required
                  />
                </div>
              </div>
              
              <CardFooter className="px-0 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-gray-500">
                  Fields marked with * are required
                </div>
                <Button 
                  type="submit" 
                  className="bg-f1-red hover:bg-f1-dark w-full sm:w-auto"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Our team will review your application</li>
            <li>You will receive an email confirmation</li>
            <li>If selected, you'll get an invitation to join the next tournament</li>
            <li>Complete your registration and get ready to race!</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default Application;
