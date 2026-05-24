import { Link } from "react-router-dom";
import napoletana from "@/assets/napoletana.jpg";
import tiramisu from "@/assets/tiramisu.jpg";
import pepperoni from "@/assets/pepperoni.jpg";
import pannacotta from "@/assets/pannacotta.jpg";
import burrata from "@/assets/burrata.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { translations as t } from "@/i18n/translations";

const items = {
  bs: [
    { name: "Napoletana Bufala", tag: "Popularna", image: napoletana, desc: "San Marzano (DOP), Mozzarella di bufala, bosiljak", price: "18 KM" },
    { name: "Pizza Pepperoni", tag: "Klasik", image: pepperoni, desc: "San Marzano, goveđi kulen i ljute peperoncine", price: "15.5 KM" },
    { name: "Retro Chilli", tag: "Sendvič", image: burrata, desc: "Pileći file, Edamer i Gouda, kupus salata i pikant Thomy majoneza", price: "9.5 KM" },
    { name: "Tiramisu", tag: "Desert", image: tiramisu, desc: "Mascarpone, kafa arabica, marsala, kakao", price: "8 KM" },
    { name: "Pistacija - Vanilija", tag: "Bez glutena", image: pannacotta, desc: "Krema od vanilije Madagascar i sicilijanskih pistacija", price: "7.5 KM" },
  ],
  en: [
    { name: "Napoletana Bufala", tag: "Popular", image: napoletana, desc: "San Marzano (DOP), Buffalo mozzarella, basil", price: "18 KM" },
    { name: "Pizza Pepperoni", tag: "Classic", image: pepperoni, desc: "San Marzano, beef pepperoni & hot peppers", price: "15.5 KM" },
    { name: "Retro Chilli", tag: "Sandwich", image: burrata, desc: "Chicken fillet, Edam & Gouda, coleslaw & spicy Thomy mayo", price: "9.5 KM" },
    { name: "Tiramisu", tag: "Dessert", image: tiramisu, desc: "Mascarpone, arabica coffee, marsala, cocoa", price: "8 KM" },
    { name: "Pistachio - Vanilla", tag: "Gluten free", image: pannacotta, desc: "Madagascar vanilla cream & Sicilian pistachio", price: "7.5 KM" },
  ],
};

const MenuHighlights = () => {
  const { lang } = useLang();
  return (
    <section id="menu" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-3">
          {t.menuHighlights.label[lang]}
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
          {t.menuHighlights.title[lang]}
        </h2>
        <p className="font-body text-muted-foreground max-w-lg mb-16 font-light">
          {t.menuHighlights.desc[lang]}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items[lang].map((item) => (
            <div key={item.name} className="group relative overflow-hidden rounded-2xl bg-card">
              <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block text-xs font-body tracking-wider uppercase text-accent">{item.tag}</span>
                  <span className="font-heading text-lg font-medium text-accent">{item.price}</span>
                </div>
                <h3 className="font-heading text-xl text-foreground">{item.name}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/menu" className="inline-flex items-center px-8 py-3 bg-accent text-accent-foreground font-body text-sm font-medium rounded-full hover:opacity-90 transition-opacity">
            {t.menuHighlights.viewFull[lang]}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuHighlights;
