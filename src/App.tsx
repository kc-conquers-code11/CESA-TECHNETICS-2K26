import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsTechnetics from './components/Whatistechnetics.tsx';
import Events from './components/Events';
import InfoSections from './components/InfoSections';
import Sponsors from './components/Sponsors';
import ContactUs from './components/ContactUs';
import ApparateHere from './components/ApparateHere';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
      <Navbar />
      <Hero />
      <WhatIsTechnetics />
      <Events />
      <InfoSections />
      <Sponsors />
      <ContactUs />
      <ApparateHere />
      <Footer />
    </div>
  );
}

export default App;