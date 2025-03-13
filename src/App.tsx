
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { F1DataProvider } from "./context/F1DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import MaintenancePage from "./pages/MaintenancePage";

// Pages
import Index from "./pages/Index";
import Drivers from "./pages/Drivers";
import Calendar from "./pages/Calendar";
import News from "./pages/News";
import Config from "./pages/Config";
import Streaming from "./pages/Streaming";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AccountsManagement from "./pages/AccountsManagement";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if maintenance mode is active
  const maintenanceMode = (window as any).MAINTENANCE_MODE === true;
  
  useEffect(() => {
    // Check if user is already authorized
    const authorized = localStorage.getItem('maintenance_authorized') === 'true';
    setIsAuthorized(authorized);
    setIsLoading(false);
  }, []);
  
  // Show loading state
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="animate-pulse text-white text-2xl">Loading...</div>
    </div>;
  }
  
  // Render maintenance page if in maintenance mode and not authorized
  if (maintenanceMode && !isAuthorized) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <MaintenancePage />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  // Render normal app
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <F1DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/news" element={<News />} />
                <Route path="/streaming" element={<Streaming />} />
                <Route path="/config" element={
                  <ProtectedRoute requireAdmin>
                    <Config />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/accounts" element={
                  <ProtectedRoute requireRoot>
                    <AccountsManagement />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </F1DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
