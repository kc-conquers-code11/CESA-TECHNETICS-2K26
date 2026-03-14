import Navbar from '../components/technetics/Navbar'
import Hero from '../components/technetics/Hero'
import TechneticsInfo from '../components/technetics/TechneticsInfo'
import Events from '../components/technetics/Events'
import InfoSections from '../components/technetics/InfoSections'
import Sponsors from '../components/technetics/Sponsors'
import SponsorBanner from '../components/technetics/SponsorBanner'
import ContactUs from '../components/technetics/ContactUs'
import ApparateHere from '../components/technetics/ApparateHere'
import Footer from '../components/technetics/Footer'

const MainLayout = () => {
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

export default MainLayout