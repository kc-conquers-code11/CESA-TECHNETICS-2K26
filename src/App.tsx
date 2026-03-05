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

function App() {
  return (
    <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
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
    </div>
  );
}

export default App;