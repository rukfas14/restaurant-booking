import { Flame, Wheat, Sprout } from "lucide-react";
import napoletana from "@/assets/napoletana.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { translations as tr } from "@/i18n/translations";

const ICONS = [
  <Flame key="flame" className="w-5 h-5" />,
  <Sprout key="sprout" className="w-5 h-5" />,
  <Wheat key="wheat" className="w-5 h-5" />,
];

const Story = () => {
  const { lang } = useLang();
  const t = tr.story;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src={napoletana}
              alt="Napoletana pizza"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl px-6 py-4 shadow-sm hidden md:block">
            <p className="font-heading text-3xl text-foreground leading-none">
              450°C
            </p>
            <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">
              {lang === "bs" ? "Peć na drva" : "Wood-fired"}
            </p>
          </div>
        </div>

        <div>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">
            {t.label[lang]}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-6">
            {t.title[lang]}
          </h2>
          <p className="font-body text-muted-foreground font-light leading-relaxed mb-10">
            {t.body[lang]}
          </p>

          <div className="space-y-5">
            {t.bullets[lang].map((b, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  {ICONS[i]}
                </div>
                <div>
                  <p className="font-heading text-lg text-foreground">{b.h}</p>
                  <p className="font-body text-sm text-muted-foreground font-light">
                    {b.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
