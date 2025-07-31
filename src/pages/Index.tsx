import { HeroSection } from '@/components/hero-section';
import { Navbar } from '@/components/navbar';

/**
 * Developer Portfolio Homepage
 * Features a CRO-optimized hero section designed for maximum conversion
 */
const Index = () => {
  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
    </main>
  );
};

export default Index;
