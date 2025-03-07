
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { F1DataProvider } from "./context/F1DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Drivers from "./pages/Drivers";
import Calendar from "./pages/Calendar";
import News from "./pages/News";
import Config from "./pages/Config";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AccountsManagement from "./pages/AccountsManagement";
import Logs from "./pages/Logs";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/logs" element={
                <ProtectedRoute requireRoot>
                  <Logs />
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

export default App;
