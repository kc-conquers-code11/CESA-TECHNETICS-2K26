import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import GamesPage from './pages/GamesPage.tsx';
import WaitingListPage from './pages/WaitingListPage.tsx';
import AptitudeRound from './pages/AptitudeRound.tsx';

function App() {
  return (
    <Router>
      <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/aptitude-round" element={<AptitudeRound />} />
          <Route path="/waiting-list" element={<WaitingListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;