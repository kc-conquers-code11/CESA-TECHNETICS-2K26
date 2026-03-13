import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import StrangerHero from "./components/StrangerHero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DarkMarkLogin from "./pages/DarkMarkLogin";

//  Import ProtectedRoute
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          {/*  PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/dark-mark-login" element={<DarkMarkLogin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/*  HOME PAGE IS NOW PUBLIC (Animation sabko dikhegi) */}
          <Route path="/" element={<Index />} />

          {/* 🔒 ADMIN ROUTE (Sirf Admin ke liye protected) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;