import Navbar from "@/components/layout/Navbar";
import Hero from "@/features/landing/Hero";
import TrustStrip from "@/components/TrustStrip";
import FeatureHighlights from "@/features/landing/FeatureHighlights";
import SecurityBadgeRow from "@/features/landing/SecurityBadgeRow";
import FooterCTA from "@/features/landing/FooterCTA";
import Footer from "@/components/layout/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#111827]">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <FeatureHighlights />
        <SecurityBadgeRow />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
