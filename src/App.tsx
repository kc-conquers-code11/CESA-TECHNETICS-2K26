import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import GamesPage from './pages/GamesPage';
import WaitingArea from './pages/WaitingArea';

// Auth Components
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Game Flow 
import { MCQRound } from './components/competition/MCQRound';

// Admin
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/games" element={<GamesPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Secure Routes */}
          <Route path="/waiting-area" element={
            <ProtectedRoute>
              <WaitingArea />
            </ProtectedRoute>
          } />

          <Route path="/mcq" element={
            <ProtectedRoute>
              <MCQRound />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;