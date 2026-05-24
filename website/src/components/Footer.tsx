import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone, MapPin, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLang } from "@/i18n/LanguageContext";
import { translations as tr } from "@/i18n/translations";
import { openBookingWidget } from "@/lib/booking";

const PHONE = "+387 62 001 144";
const PHONE_INTL = "+38762001144";
const EMAIL = "info@margheritasarajevo.ba";
const MAPS_URL =
  "https://maps.google.com/?q=Kranjčevićeva+33+Sarajevo";

const Footer = () => {
  const { lang } = useLang();
  const t = tr.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-warm-dark text-cream pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-cream/10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src={logo} alt="Margherita" width={40} height={40} className="w-10 h-10" />
              <span className="font-heading text-2xl">Margherita</span>
            </Link>
            <p className="font-body text-sm text-cream/60 font-light leading-relaxed">
              {t.tagline[lang]}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-cream/40 mb-4">
              {t.explore[lang]}
            </h3>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <Link to="/menu" className="text-cream/80 hover:text-cream transition-colors">
                  {t.navMenu[lang]}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openBookingWidget}
                  className="text-cream/80 hover:text-cream transition-colors text-left"
                >
                  {t.navReserve[lang]}
                </button>
              </li>
              <li>
                <a href="/#reviews" className="text-cream/80 hover:text-cream transition-colors">
                  {t.navReviews[lang]}
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-cream/80 hover:text-cream transition-colors">
                  {t.navContact[lang]}
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-cream/40 mb-4">
              {t.visit[lang]}
            </h3>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-start gap-2.5 text-cream/80">
                <MapPin className="w-4 h-4 mt-0.5 text-golden flex-shrink-0" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  Kranjčevićeva 33<br />
                  71000 Sarajevo
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-cream/80">
                <Phone className="w-4 h-4 text-golden flex-shrink-0" />
                <a
                  href={`tel:${PHONE_INTL}`}
                  className="hover:text-cream transition-colors"
                >
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-cream/80">
                <Mail className="w-4 h-4 text-golden flex-shrink-0" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="hover:text-cream transition-colors break-all"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours + social */}
          <div>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-cream/40 mb-4">
              {tr.contact.workingHours[lang]}
            </h3>
            <ul className="space-y-1 font-body text-sm text-cream/80 mb-6">
              {tr.contact.hours[lang].map((h, i) => (
                <li key={i} className="tabular-nums">
                  {h}
                </li>
              ))}
            </ul>
            <h3 className="font-body text-xs tracking-[0.25em] uppercase text-cream/40 mb-3">
              {t.follow[lang]}
            </h3>
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/margherita_sarajevo"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:bg-cream/10 hover:text-cream transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/margheritasarajevo"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:bg-cream/10 hover:text-cream transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 font-body text-xs text-cream/40">
          <p>{t.rights[lang](year)}</p>
          <p>{t.crafted[lang]}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
