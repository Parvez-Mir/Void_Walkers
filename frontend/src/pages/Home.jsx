import { Navbar } from '../components/propintel/Navbar';
import { HeroSection } from '../components/propintel/HeroSection';
import { FeaturedProperties } from '../components/propintel/FeaturedProperties';
import { StatsSection, FeaturesSection, HowItWorks, TrustSection, CTASection } from '../components/propintel/StaticSections';
import { Footer } from '../components/propintel/Footer';

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
