import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import InfoSections from './components/InfoSections';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-[#021516] min-h-screen text-white font-sans selection:bg-[#d4af37] selection:text-black">
      <Navbar />
      <Hero />
      <Events />
      <InfoSections />
      <Footer />
    </div>
  );
}

export default App;