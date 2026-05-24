import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import MenuHighlights from "@/components/MenuHighlights";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Reservation from "@/components/Reservation";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useLang } from "@/i18n/LanguageContext";

const Index = () => {
  const { lang } = useLang();
  usePageMeta(
    lang === "bs"
      ? "Margherita Sarajevo · Napoletana pizza · Rezerviši online"
      : "Margherita Sarajevo · Neapolitan pizza · Reserve online"
  );
  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <div id="story">
      <Story />
    </div>
    <MenuHighlights />
    <div id="reviews">
      <Reviews />
    </div>
    <div id="reservation">
      <Reservation />
    </div>
    <div id="contact">
      <Contact />
    </div>
    <Footer />
  </div>
  );
};

export default Index;
