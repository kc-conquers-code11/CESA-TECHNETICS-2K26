import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechneticsInfo from './components/TechneticsInfo.tsx';
import Events from './components/Events';
import InfoSections from './components/InfoSections';
import ContactUs from './components/ContactUs';
import ApparateHere from './components/ApparateHere';
import Footer from './components/Footer';
import Sponsors from './components/Sponsors.tsx';
import SponsorBanner from './components/SponsorBanner.tsx';
import GamesPage from './components/GamesPage';
import WaitingListPage from './components/WaitingListPage';

function MainLayout() {
  return (
    <>
      <Navbar />
      <Hero />
      <TechneticsInfo />
      <Events />
      <InfoSections />
      <Sponsors />
      <SponsorBanner />
      <ContactUs />
      <ApparateHere />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/waiting-list" element={<WaitingListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;