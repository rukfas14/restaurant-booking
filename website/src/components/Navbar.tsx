import { useState } from "react";
import { Menu, X, Globe, CalendarCheck2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useLang } from "@/i18n/LanguageContext";
import { translations as t } from "@/i18n/translations";
import { openBookingWidget } from "@/lib/booking";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();

  const links = [
    { label: t.nav.menu[lang], href: "/menu" },
    { label: t.nav.reviews[lang], href: "/#reviews" },
    { label: t.nav.contact[lang], href: "/#contact" },
  ];

  const toggleLang = () => setLang(lang === "bs" ? "en" : "bs");

  const renderLink = (l: { label: string; href: string }, onClick?: () => void) => {
    const cls = "font-body text-sm text-cream/70 hover:text-cream transition-colors block";
    return l.href.startsWith("/") && !l.href.startsWith("/#") ? (
      <Link key={l.label} to={l.href} onClick={onClick} className={cls}>
        {l.label}
      </Link>
    ) : (
      <a key={l.label} href={l.href} onClick={onClick} className={cls}>
        {l.label}
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-dark/80 backdrop-blur-md border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Margherita logo" width={36} height={36} className="w-9 h-9" />
          <span className="font-heading text-xl text-cream">Margherita</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => renderLink(l))}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream/20 font-body text-xs text-cream/70 hover:text-cream hover:border-cream/40 transition-colors"
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "bs" ? "EN" : "BS"}
          </button>
          <button
            type="button"
            onClick={openBookingWidget}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-accent text-accent-foreground font-body text-sm rounded-full hover:opacity-90 transition-opacity"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            {t.reservation.ctaPrimary[lang]}
          </button>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-cream/20 font-body text-xs text-cream/70 hover:text-cream transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "bs" ? "EN" : "BS"}
          </button>
          <button className="text-cream" onClick={() => setOpen(!open)} aria-label={t.nav.openMenu[lang]}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-warm-dark/95 backdrop-blur-md border-t border-cream/10 px-6 py-6 flex flex-col space-y-4">
          {links.map((l) => renderLink(l, () => setOpen(false)))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openBookingWidget();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-accent text-accent-foreground font-body text-sm rounded-full hover:opacity-90 transition-opacity"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            {t.reservation.ctaPrimary[lang]}
          </button>
          <a
            href="tel:+38762001144"
            className="px-5 py-2 border border-cream/20 text-cream font-body text-sm rounded-full text-center"
          >
            {t.nav.callOrder[lang]}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
