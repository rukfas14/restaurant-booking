import { Star } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { translations as t } from "@/i18n/translations";

const Reviews = () => {
  const { lang } = useLang();
  const reviews = t.reviews.items[lang];

  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">{t.reviews.label[lang]}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground">{t.reviews.title[lang]}</h2>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-6xl font-medium text-foreground">4.7</span>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-golden text-golden" />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground">{t.reviews.reviewCount[lang]}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-background rounded-2xl p-6 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-golden text-golden" />
                ))}
              </div>
              <p className="font-body text-foreground/80 text-sm leading-relaxed flex-1">"{review.text}"</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-body text-sm font-medium text-foreground">{review.name}</p>
                <p className="font-body text-xs text-muted-foreground">{review.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
