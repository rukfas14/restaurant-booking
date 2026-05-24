import heroPizza from "@/assets/hero-pizza.jpg";
import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { translations as t } from "@/i18n/translations";

const Hero = () => {
  const { lang } = useLang();
  return (
    <section className="relative min-h-[90vh] flex items-end">
      <div className="absolute inset-0">
        <img src={heroPizza} alt="Napoletanska Margherita pizza" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark/90 via-warm-dark/40 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        
        <p className="font-body text-sm tracking-[0.3em] uppercase text-golden mb-4">
          {t.hero.subtitle[lang]}
        </p>
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-medium text-cream leading-[0.9] mb-6">
          Margherita
        </h1>
        <p className="font-body text-cream/70 text-lg md:text-xl max-w-lg mb-8 font-light">
          {t.hero.description[lang]}
        </p>
        <div className="flex flex-wrap items-center gap-6 text-cream/80 text-sm font-body">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-golden text-golden" />
            <span className="font-medium text-cream">4.7</span>
            <span className="text-cream/50">{t.hero.rating[lang]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-golden" />
            <span>{t.hero.hours[lang]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-golden" />
            <span>Kranjčevićeva 33</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <a href="tel:+38762001144" className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground font-body text-sm font-medium rounded-full hover:opacity-90 transition-opacity">
            {t.hero.orderNow[lang]}
          </a>
          <Link to="/menu" className="inline-flex items-center px-6 py-3 border border-cream/30 text-cream font-body text-sm font-medium rounded-full hover:bg-cream/10 transition-colors">
            {t.hero.viewMenu[lang]}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
