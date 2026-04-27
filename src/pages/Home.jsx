import Navbar from "../components/Navbar";
import HeroWithPreview from "../components/HeroWithPreview";
import Analytics from "../components/Analytics";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroWithPreview />
      <Features />
      <Analytics />
      <Pricing />
      <CookieConsent />
      <Footer />
    </div>
  );
}
