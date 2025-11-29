import Header from "@/src/components/client/sections/Header";
import HeroSection from "@/src/components/client/sections/HeroSection";
import AboutSection from "@/src/components/client/sections/AboutSection";
import ServicesSection from "@/src/components/client/sections/ServicesSection";
import ProjectsSection from "@/src/components/client/sections/ProjectsSection";
import ClientsSection from "@/src/components/client/sections/ClientsSection";
import WhyChooseUsSection from "@/src/components/client/sections/WhyChooseUsSection";
import ContactSection from "@/src/components/client/sections/ContactSection";
import Footer from "@/src/components/client/sections/Footer";

export default function HomePage() {
    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <AboutSection />
                <ServicesSection />
                <ProjectsSection />
                <ClientsSection />
                <WhyChooseUsSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    );
}
