import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/i18n/LanguageContext";
import { translations as t } from "@/i18n/translations";
import { menuData, type MenuCategory } from "../data/menuData.ts" ;

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const { lang } = useLang();

  const getCategoryTitle = (cat: MenuCategory) => {
    const map: Record<string, { bs: string; en: string }> = {
      sendvici: t.menuPage.categories.sendvici,
      salate: t.menuPage.categories.salate,
      "gourmet-salate": t.menuPage.categories.gourmetSalate,
      deserti: t.menuPage.categories.deserti,
    };
    return map[cat.id] ? map[cat.id][lang] : cat.title;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">
            Pizza · Catering · Sweets
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-medium text-foreground mb-4">
            {t.menuPage.title[lang]}
          </h1>
          <p className="font-body text-muted-foreground max-w-lg font-light">
            {t.menuPage.desc[lang]}
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm transition-colors ${
                  activeCategory === cat.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {getCategoryTitle(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {menuData.map((category) => (
          <div key={category.id} id={category.id}>
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mb-2">
              {getCategoryTitle(category)}
            </h2>
            <div className="h-px bg-border mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {category.items.map((item) => (
                <div
                  key={item.name.bs}
                  className={`flex justify-between gap-4 group ${item.unavailable ? "opacity-50" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-lg text-foreground group-hover:text-accent transition-colors">
                        {item.name[lang]}
                      </h3>
                      {item.veg && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-body font-medium bg-primary/10 text-primary uppercase tracking-wider">
                          Veg
                        </span>
                      )}
                      {item.gf && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-body font-medium bg-golden/20 text-foreground uppercase tracking-wider">
                          BG
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
                      {item.desc[lang]}
                    </p>
                  </div>
                  <span className="font-heading text-lg text-accent font-medium whitespace-nowrap self-start pt-0.5">
                    {item.price} KM
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="py-16 px-6 bg-card">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mb-4">
            {t.menuPage.readyToOrder[lang]}
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            {t.menuPage.readyToOrderDesc[lang]}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+38762001144"
              className="inline-flex items-center px-8 py-3 bg-accent text-accent-foreground font-body text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              {t.menuPage.callOrder[lang]}
            </a>
            <a
              href="https://www.korpa.ba/partner/pizzeria-margherita"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border border-border text-foreground font-body text-sm font-medium rounded-full hover:bg-card transition-colors"
            >
              {t.menuPage.orderKorpa[lang]}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
