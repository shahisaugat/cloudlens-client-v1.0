import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import Navbar from "../../components/layout/Navbar.jsx";
import HeroWithPreview from "../../components/ui/HeroWithPreview.jsx";
import Analytics from "../../components/ui/Analytics.jsx";
import Features from "../../components/ui/Features.jsx";
import Pricing from "../../components/ui/Pricing.jsx";
import CookieConsent from "../../components/ui/CookieConsent.jsx";
import Footer from "../../components/layout/Footer.jsx";

export default function Home() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
