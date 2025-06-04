
import Hero from "@/components/Hero";
import AboutTrolls from "@/components/AboutTrolls";
import PrivacyWisdom from "@/components/PrivacyWisdom";
import CommunityValues from "@/components/CommunityValues";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Hero />
      <AboutTrolls />
      <PrivacyWisdom />
      <CommunityValues />
      <Footer />
    </div>
  );
};

export default Index;
