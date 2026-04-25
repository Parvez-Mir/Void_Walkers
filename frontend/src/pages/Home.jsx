import { Navbar } from '../components/globalghar/Navbar';
import { HeroSection } from '../components/globalghar/HeroSection';
import { FeaturedProperties } from '../components/globalghar/FeaturedProperties';
import { StatsSection, FeaturesSection, HowItWorks, TrustSection, CTASection } from '../components/globalghar/StaticSections';
import { Footer } from '../components/globalghar/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}
