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

// Technetics Pages & Layout
import TechneticsLayout from "./layouts/TechneticsLayout";
import GamesPage from "./pages/GamesPage";
import AptitudeRound from "./pages/AptitudeRound";
import GithubRound from "./pages/GithubRound";
import HackathonSelection from "./pages/HackathonSelection";
import WaitingListPage from "./pages/WaitingListPage";
import Rules from "./pages/Rules";

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
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/dark-mark-login" element={<DarkMarkLogin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 🧙‍♂️ TECHNETICS ROUTES */}
          <Route path="/" element={<TechneticsLayout />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/aptitude-round" element={<AptitudeRound />} />
          <Route path="/github-round" element={<GithubRound />} />
          <Route path="/hackathon-selection" element={<HackathonSelection />} />
          <Route path="/waiting-list" element={<WaitingListPage />} />
          <Route path="/rules-technetics" element={<Rules />} />

          {/* 🔒 PROTECTED USER ROUTES */}
          <Route 
            path="/rules" 
            element={
              <ProtectedRoute>
                {/* <Rules /> */}
                <Index />
              </ProtectedRoute>
            } 
          />

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