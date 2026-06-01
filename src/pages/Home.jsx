// src/pages/Home.jsx
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import MenuSection from "../components/sections/MenuSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
