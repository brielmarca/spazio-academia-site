import { isAuthenticated } from "@/services/auth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ModalitiesSection from "@/components/ModalitiesSection";
import TrainersSection from "@/components/TrainersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  const loggedIn = isAuthenticated();

  return (
    <>
      <Navbar />
      <HeroSection />
      {loggedIn && (
        <>
          <AboutSection />
          <ModalitiesSection />
          <TrainersSection />
          <TestimonialsSection />
          <LocationSection />
        </>
      )}
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

export default Index;
