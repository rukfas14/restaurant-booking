import { CalendarCheck2, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { translations as tr } from "@/i18n/translations";
import { openBookingWidget } from "@/lib/booking";

const WHATSAPP = "38762001144";

const Reservation = () => {
  const { lang } = useLang();
  const t = tr.reservation;

  const features = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: {
        bs: "Dostupnost u realnom vremenu",
        en: "Real-time availability",
      },
      desc: {
        bs: "Vidite slobodne termine odmah — bez čekanja na odgovor.",
        en: "See open slots instantly — no waiting for a reply.",
      },
    },
    {
      icon: <CalendarCheck2 className="w-5 h-5" />,
      title: {
        bs: "Trenutna potvrda",
        en: "Instant confirmation",
      },
      desc: {
        bs: "E-mail odmah po rezervaciji.",
        en: "Email confirmation the moment you book.",
      },
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: {
        bs: "Bez čekanja na odgovor",
        en: "No waiting for a reply",
      },
      desc: {
        bs: "Rezervacija ide direktno u sistem restorana.",
        en: "Bookings go directly into the restaurant's system.",
      },
    },
  ];

  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">
            {t.label[lang]}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-3">
            {t.title[lang]}
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto font-light">
            {t.desc[lang]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="text-center px-4">
              <div className="inline-flex w-12 h-12 rounded-full bg-accent/10 items-center justify-center text-accent mb-4">
                {f.icon}
              </div>
              <h3 className="font-heading text-lg text-foreground mb-2">
                {f.title[lang]}
              </h3>
              <p className="font-body text-sm text-muted-foreground font-light">
                {f.desc[lang]}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={openBookingWidget}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            <CalendarCheck2 className="w-4 h-4" />
            {t.ctaPrimary[lang]}
          </button>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {t.ctaWhatsapp[lang]}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
