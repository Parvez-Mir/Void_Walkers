import { Navbar } from '../components/propsight/Navbar';
import { HeroSection } from '../components/propsight/HeroSection';
import { FeaturedProperties } from '../components/propsight/FeaturedProperties';
import { StatsSection, FeaturesSection, HowItWorks, TrustSection, CTASection } from '../components/propsight/StaticSections';
import { Footer } from '../components/propsight/Footer';

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
