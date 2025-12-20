import Header from "@/components/client/sections/Header";
import HeroSection from "@/components/client/sections/HeroSection";
import AboutSection from "@/components/client/sections/AboutSection";
import ServicesSection from "@/components/client/sections/ServicesSection";
import ProjectsSection from "@/components/client/sections/ProjectsSection";
import ClientsSection from "@/components/client/sections/ClientsSection";
import WhyChooseUsSection from "@/components/client/sections/WhyChooseUsSection";
import ContactSection from "@/components/client/sections/ContactSection";
import Footer from "@/components/client/sections/Footer";
import { Theme } from "@radix-ui/themes";
import "./globals.css"

export default function HomePage() {
  return (
      <Theme>
          <Header />
          <main>
              <HeroSection />
              <AboutSection />
              <ServicesSection />
              <ProjectsSection />
              {/*<ClientsSection />*/}
              <WhyChooseUsSection />
              <ContactSection />
          </main>
          <Footer />
      </Theme>
  );
}
