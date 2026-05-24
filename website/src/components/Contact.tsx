import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { translations as t } from "@/i18n/translations";

const Contact = () => {
  const { lang } = useLang();
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">{t.contact.label[lang]}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-8">{t.contact.title[lang]}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">{t.contact.address[lang]}</p>
                  <p className="font-body text-sm text-muted-foreground whitespace-pre-line">{t.contact.addressLine[lang]}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">{t.contact.phone[lang]}</p>
                  <a href="tel:+38762001144" className="font-body text-sm text-muted-foreground hover:text-accent transition-colors">+387 62 001 144</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">{t.contact.workingHours[lang]}</p>
                  <div className="font-body text-sm text-muted-foreground space-y-0.5">
                    {t.contact.hours[lang].map((h, i) => <p key={i}>{h}</p>)}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">Instagram</p>
                  <a href="https://www.instagram.com/margherita_sarajevo" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted-foreground hover:text-accent transition-colors">@margherita_sarajevo</a>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-10">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-xs font-medium">{t.contact.dineIn[lang]}</span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-xs font-medium">{t.contact.takeaway[lang]}</span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-xs font-medium">{t.contact.delivery[lang]}</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 lg:h-auto">
            <iframe title="Margherita lokacija" src="https://www.google.com/maps?q=Kranj%C4%8Devi%C4%87eva+33,+Sarajevo+71000,+Bosnia+and+Herzegovina&output=embed" width="100%" height="100%" style={{ border: 0, minHeight: 320 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
