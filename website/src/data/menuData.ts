export type MenuItem = {
  name: { bs: string; en: string };
  desc: { bs: string; en: string };
  price: string;
  veg?: boolean;
  gf?: boolean;
  unavailable?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  emoji: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    id: "napoletana",
    title: "Napoletana",
    emoji: "",
    items: [
      { name: { bs: "Bufala", en: "Bufala" }, desc: { bs: "San Marzano (DOP), Mozzarella di bufala, svježi bosiljak, maslinovo ulje", en: "San Marzano (DOP), buffalo Mozzarella, fresh basil, olive oil" }, price: "18", veg: true },
      { name: { bs: "Margherita", en: "Margherita" }, desc: { bs: "San Marzano (DOP), Mozzarella fior di latte, svježi bosiljak, maslinovo ulje", en: "San Marzano (DOP), Mozzarella fior di latte, fresh basil, olive oil" }, price: "13.5", veg: true },
      { name: { bs: "Marinara", en: "Marinara" }, desc: { bs: "San Marzano (DOP), origano, mornarska marinada, maslinovo ulje", en: "San Marzano (DOP), oregano, marinara sauce, olive oil" }, price: "10", veg: true },
      { name: { bs: "Organic", en: "Organic" }, desc: { bs: "Pesto od špinata, mix sezonskog povrća, sušeni paradajz, masline, šampinjoni", en: "Spinach pesto, seasonal vegetable mix, sun-dried tomato, olives, mushrooms" }, price: "15", veg: true },
      { name: { bs: "Pizza Pepperoni", en: "Pepperoni Pizza" }, desc: { bs: "San Marzano (DOP), Mozzarella Fior di Latte, goveđi kulen i ljute peperoncine", en: "San Marzano (DOP), Mozzarella Fior di Latte, beef pepperoni & hot peppers" }, price: "15.5" },
      { name: { bs: "Sashimi", en: "Sashimi" }, desc: { bs: "Mozzarella fior di latte, Ricotta, tartar sashimi (tuna), kapari, masline", en: "Mozzarella fior di latte, Ricotta, tuna sashimi tartare, capers, olives" }, price: "24" },
      { name: { bs: "Say Cheese", en: "Say Cheese" }, desc: { bs: "Mozzarella fior di latte, Ricotta, Kupreški sir, Provola, Gorgonzola, Grana Padano", en: "Mozzarella fior di latte, Ricotta, Kupreški cheese, Provola, Gorgonzola, Grana Padano" }, price: "17", veg: true },
      { name: { bs: "Vrganj", en: "Porcini" }, desc: { bs: "Mozzarella fior di latte, Ricotta, vrganj (1.klasa), cherry paradajz, bosiljak", en: "Mozzarella fior di latte, Ricotta, porcini mushroom (1st class), cherry tomato, basil" }, price: "18.5", veg: true },
      { name: { bs: "Bufala sa rukolom", en: "Bufala with Arugula" }, desc: { bs: "San Marzano (DOP), Mozzarella di bufala, rukola, maslinovo ulje", en: "San Marzano (DOP), buffalo Mozzarella, arugula, olive oil" }, price: "20", veg: true },
      { name: { bs: "Margherita Special", en: "Margherita Special" }, desc: { bs: "San Marzano (DOP), dimljena Provola, Kupreški sir, Grana Padano", en: "San Marzano (DOP), smoked Provola, Kupreški cheese, Grana Padano" }, price: "17" },
      { name: { bs: "Boscaiola", en: "Boscaiola" }, desc: { bs: "Mozzarella fior di latte, Gorgonzola, šampinjoni, sušena zarebnica, pureća šunka Premium", en: "Mozzarella fior di latte, Gorgonzola, mushrooms, dried porcini, premium turkey ham" }, price: "21" },
      { name: { bs: "San Martino", en: "San Martino" }, desc: { bs: "Mozzarella fior di latte, sicilijanska pistacija, pureća šunka Premium, masline", en: "Mozzarella fior di latte, Sicilian pistachio, premium turkey ham, olives" }, price: "23" },
      { name: { bs: "Bresaola Bianca", en: "Bresaola Bianca" }, desc: { bs: "Mozzarella fior di latte, bresaola originale (IGP), rukola, Grana Padano", en: "Mozzarella fior di latte, bresaola originale (IGP), arugula, Grana Padano" }, price: "24" },
      { name: { bs: "La Tartufata", en: "La Tartufata" }, desc: { bs: "Mozzarella fior di latte, tartufata, masline", en: "Mozzarella fior di latte, truffle sauce, olives" }, price: "18.5" },
      { name: { bs: "Pizza Funghi", en: "Mushroom Pizza" }, desc: { bs: "Mozzarella fior di latte, selekcija gljiva, maslinovo ulje", en: "Mozzarella fior di latte, mushroom selection, olive oil" }, price: "16" },
      { name: { bs: "La Genovese", en: "La Genovese" }, desc: { bs: "Mozzarella fior di latte, pesto od bosiljka, sušena zarebnica, cherry paradajz", en: "Mozzarella fior di latte, basil pesto, dried porcini, cherry tomato" }, price: "20" },
      { name: { bs: "Pizza Popeye", en: "Popeye Pizza" }, desc: { bs: "Mozzarella fior di latte, Ricotta, pesto od špinata, špinat, Grana Padano", en: "Mozzarella fior di latte, Ricotta, spinach pesto, spinach, Grana Padano" }, price: "15.5" },
      { name: { bs: "Capri Originale", en: "Capri Originale" }, desc: { bs: "San Marzano (DOP), šampinjoni, artičoke, masline, pureća šunka Premium", en: "San Marzano (DOP), mushrooms, artichokes, olives, premium turkey ham" }, price: "18" },
      { name: { bs: "Dia Vola", en: "Dia Vola" }, desc: { bs: "San Marzano (DOP), Edamer i Gouda, salsiccia, masline, biber", en: "San Marzano (DOP), Edam & Gouda, salsiccia, olives, pepper" }, price: "15.5" },
      { name: { bs: "Frutti di Mare", en: "Frutti di Mare" }, desc: { bs: "San Marzano (DOP), marinirani plodovi mora u Sous Vide, masline", en: "San Marzano (DOP), Sous Vide marinated seafood, olives" }, price: "17" },
      { name: { bs: "Pizza Napoli", en: "Napoli Pizza" }, desc: { bs: "San Marzano (DOP), Mozzarella fior di latte, inćuni, luk, kapari", en: "San Marzano (DOP), Mozzarella fior di latte, anchovies, onion, capers" }, price: "18.5" },
      { name: { bs: "Pizza Vesuvio", en: "Vesuvio Pizza" }, desc: { bs: "San Marzano (DOP), Mozzarella Fior di Latte, pureća šunka Premium, bosiljak", en: "San Marzano (DOP), Mozzarella Fior di Latte, premium turkey ham, basil" }, price: "17" },
      { name: { bs: "Pizza Parmigiana", en: "Parmigiana Pizza" }, desc: { bs: "San Marzano (DOP), Edamer i Gouda, patlidžan, Grana Padano", en: "San Marzano (DOP), Edam & Gouda, eggplant, Grana Padano" }, price: "15.5" },
      { name: { bs: "Bolognese", en: "Bolognese" }, desc: { bs: "San Marzano (DOP), Bolognese (teleće i juneće meso), mileram, Grana Padano", en: "San Marzano (DOP), Bolognese (veal & beef), sour cream, Grana Padano" }, price: "18" },
    ],
  },
  {
    id: "romana",
    title: "Romana",
    emoji: "",
    items: [
      { name: { bs: "Pizza Margherita", en: "Margherita Pizza" }, desc: { bs: "San Marzano (DOP), Edamer i Gouda, origano, maslinovo ulje", en: "San Marzano (DOP), Edam & Gouda, oregano, olive oil" }, price: "13.5", veg: true },
      { name: { bs: "Pizza Funghi", en: "Mushroom Pizza" }, desc: { bs: "Edamer i Gouda, selekcija gljiva, maslinovo ulje", en: "Edam & Gouda, mushroom selection, olive oil" }, price: "16", veg: true },
      { name: { bs: "Pizza Pepperoni", en: "Pepperoni Pizza" }, desc: { bs: "San Marzano (DOP), Edamer i Gouda, goveđi kulen i ljute peperoncine", en: "San Marzano (DOP), Edam & Gouda, beef pepperoni & hot peppers" }, price: "15.5" },
      { name: { bs: "Bresaola Bianca", en: "Bresaola Bianca" }, desc: { bs: "Edamer i Gouda, bresaola originale (IGP), rukola, Grana Padano", en: "Edam & Gouda, bresaola originale (IGP), arugula, Grana Padano" }, price: "24" },
      { name: { bs: "Boscaiola", en: "Boscaiola" }, desc: { bs: "Edamer i Gouda, Gorgonzola, šampinjoni, sušena zarebnica, pureća šunka Premium", en: "Edam & Gouda, Gorgonzola, mushrooms, dried porcini, premium turkey ham" }, price: "21" },
      { name: { bs: "La Genovese", en: "La Genovese" }, desc: { bs: "Edamer i Gouda, pesto od bosiljka, sušena zarebnica, cherry paradajz", en: "Edam & Gouda, basil pesto, dried porcini, cherry tomato" }, price: "20" },
      { name: { bs: "Organic", en: "Organic" }, desc: { bs: "Pesto od špinata, mix sezonskog povrća, sušeni paradajz, masline, šampinjoni", en: "Spinach pesto, seasonal vegetable mix, sun-dried tomato, olives, mushrooms" }, price: "15", veg: true },
      { name: { bs: "Popeye", en: "Popeye" }, desc: { bs: "Edamer i Gouda, Ricotta, pesto od špinata, špinat, Grana Padano", en: "Edam & Gouda, Ricotta, spinach pesto, spinach, Grana Padano" }, price: "15.5" },
      { name: { bs: "Bufala", en: "Bufala" }, desc: { bs: "San Marzano (DOP), Mozzarella di bufala, origano, maslinovo ulje", en: "San Marzano (DOP), buffalo Mozzarella, oregano, olive oil" }, price: "18", veg: true },
      { name: { bs: "Capri Originale", en: "Capri Originale" }, desc: { bs: "San Marzano (DOP), Edamer i Gouda, šampinjoni, artičoke, masline, pureća šunka", en: "San Marzano (DOP), Edam & Gouda, mushrooms, artichokes, olives, turkey ham" }, price: "18" },
      { name: { bs: "Dia Vola", en: "Dia Vola" }, desc: { bs: "San Marzano (DOP), Edamer i Gouda, salsiccia, masline, biber", en: "San Marzano (DOP), Edam & Gouda, salsiccia, olives, pepper" }, price: "15.5" },
      { name: { bs: "Frutti di Mare", en: "Frutti di Mare" }, desc: { bs: "San Marzano (DOP), plodovi mora u Sous Vide, masline, mornarska marinada", en: "San Marzano (DOP), Sous Vide seafood, olives, marinara sauce" }, price: "17" },
      { name: { bs: "Marinara", en: "Marinara" }, desc: { bs: "San Marzano (DOP), origano, mornarska marinada, maslinovo ulje", en: "San Marzano (DOP), oregano, marinara sauce, olive oil" }, price: "10", veg: true },
      { name: { bs: "La Tartufata", en: "La Tartufata" }, desc: { bs: "Edamer i Gouda, tartufata, masline", en: "Edam & Gouda, truffle sauce, olives" }, price: "18.5" },
      { name: { bs: "Margherita Special", en: "Margherita Special" }, desc: { bs: "San Marzano (DOP), dimljena Provola, Kupreški sir, Grana Padano", en: "San Marzano (DOP), smoked Provola, Kupreški cheese, Grana Padano" }, price: "17" },
      { name: { bs: "San Martino", en: "San Martino" }, desc: { bs: "Edamer i Gouda, sicilijanska pistacija, pureća šunka Premium, masline", en: "Edam & Gouda, Sicilian pistachio, premium turkey ham, olives" }, price: "23" },
      { name: { bs: "Sashimi", en: "Sashimi" }, desc: { bs: "Edamer i Gouda, Ricotta, tartar sashimi (tuna), kapari, masline", en: "Edam & Gouda, Ricotta, tuna sashimi tartare, capers, olives" }, price: "24" },
      { name: { bs: "Bolognese", en: "Bolognese" }, desc: { bs: "San Marzano (DOP), Bolognese, mileram, Grana Padano", en: "San Marzano (DOP), Bolognese, sour cream, Grana Padano" }, price: "18" },
    ],
  },
  {
    id: "sendvici",
    title: "Sendviči",
    emoji: "",
    items: [
      { name: { bs: "Sendvič Vegan", en: "Vegan Sandwich" }, desc: { bs: "Mix sezonskog povrća i šampinjoni, zeleni pesto, maslinovo ulje", en: "Seasonal vegetable mix & mushrooms, green pesto, olive oil" }, price: "9.5", veg: true },
      { name: { bs: "Retro Classic", en: "Retro Classic" }, desc: { bs: "Pileći file, Edamer i Gouda, kupus salata i Thomy majoneza", en: "Chicken fillet, Edam & Gouda, coleslaw & Thomy mayonnaise" }, price: "9.5" },
      { name: { bs: "Retro Funghi", en: "Retro Funghi" }, desc: { bs: "Pileći file, Edamer i Gouda, šampinjoni, Thomy majoneza", en: "Chicken fillet, Edam & Gouda, mushrooms, Thomy mayonnaise" }, price: "10" },
      { name: { bs: "Retro Chili", en: "Retro Chili" }, desc: { bs: "Pileći file, Edamer i Gouda, kupus salata i pikant Thomy majoneza", en: "Chicken fillet, Edam & Gouda, coleslaw & spicy Thomy mayonnaise" }, price: "9.5" },
      { name: { bs: "Margherita Caprese", en: "Margherita Caprese" }, desc: { bs: "Mozzarella Fior di Latte, paradajz, pesto od bosiljka, maslinovo ulje", en: "Mozzarella Fior di Latte, tomato, basil pesto, olive oil" }, price: "9.5" },
      { name: { bs: "Pepperoni sendvič", en: "Pepperoni Sandwich" }, desc: { bs: "Edamer i Gouda, goveđi kulen, ajvar", en: "Edam & Gouda, beef pepperoni, ajvar" }, price: "9.5" },
      { name: { bs: "Funky Tuka", en: "Funky Turkey" }, desc: { bs: "Pureća šunka Premium, Edamer i Gouda, mix zelenih salata, Thomy majoneza", en: "Premium turkey ham, Edam & Gouda, mixed greens, Thomy mayonnaise" }, price: "10" },
      { name: { bs: "Tuna Classic", en: "Tuna Classic" }, desc: { bs: "Tuna sendvič", en: "Tuna sandwich" }, price: "11" },
    ],
  },
  {
    id: "salate",
    title: "Salate",
    emoji: "",
    items: [
      { name: { bs: "Caprese Classic", en: "Caprese Classic" }, desc: { bs: "Mozzarella fior di latte, svježi paradajz, maslinovo ulje, bosiljak", en: "Mozzarella fior di latte, fresh tomato, olive oil, basil" }, price: "15" },
      { name: { bs: "Funky Pollo", en: "Funky Pollo" }, desc: { bs: "Piletina u Sous Vide, rukola, zelena salata, špinat, mrkva, paradajz", en: "Sous Vide chicken, arugula, lettuce, spinach, carrot, tomato" }, price: "14.5" },
      { name: { bs: "Zeleniššš", en: "Greens" }, desc: { bs: "Mix zelenih salata, citronett, maslinovo ulje, svježi limun", en: "Mixed greens, citronette, olive oil, fresh lemon" }, price: "6" },
    ],
  },
  {
    id: "gourmet-salate",
    title: "Gourmet Salate",
    emoji: "",
    items: [
      { name: { bs: "Sashimi salata", en: "Sashimi Salad" }, desc: { bs: "Tartar sashimi (tuna), rukola, zelena salata, špinat, mrkva, paradajz", en: "Tuna sashimi tartare, arugula, lettuce, spinach, carrot, tomato" }, price: "25" },
      { name: { bs: "Caprese con Burrata", en: "Caprese con Burrata" }, desc: { bs: "Burata sir od bivoljeg mlijeka, cherry paradajz, maslinovo ulje, bosiljak", en: "Buffalo milk Burrata, cherry tomato, olive oil, basil" }, price: "22" },
      { name: { bs: "Frutti di Mare salata", en: "Frutti di Mare Salad" }, desc: { bs: "Marinirani plodovi mora u Sous Vide, rukola, salate, masline", en: "Sous Vide marinated seafood, arugula, mixed greens, olives" }, price: "16.5" },
      { name: { bs: "Gamberi salata", en: "Shrimp Salad" }, desc: { bs: "Grillovani škampi, rukola, zelena salata, špinat, masline", en: "Grilled shrimp, arugula, lettuce, spinach, olives" }, price: "26" },
      { name: { bs: "Fitness salata alla chef", en: "Chef's Fitness Salad" }, desc: { bs: "Chef-ova selekcija fitness salate", en: "Chef's fitness salad selection" }, price: "18" },
    ],
  },
  {
    id: "deserti",
    title: "Marshall's Deserti",
    emoji: "",
    items: [
      { name: { bs: "Pistacija - Vanilija", en: "Pistachio - Vanilla" }, desc: { bs: "Krema od vanilije Madagascar, sicilijanskih pistacija, svježe vrhnje", en: "Madagascar vanilla cream, Sicilian pistachio, fresh cream" }, price: "7.5", gf: true },
      { name: { bs: "Pizza Nougat Pistachio", en: "Nougat Pistachio Pizza" }, desc: { bs: "Nougat krema, komadići pistacije, amarena", en: "Nougat cream, pistachio pieces, amarena" }, price: "16" },
      { name: { bs: "Carrot Cake", en: "Carrot Cake" }, desc: { bs: "Krema od svježeg sira sa limunom i narandžom, lješnjak, bademi, đumbir", en: "Fresh cheese cream with lemon & orange, hazelnut, almonds, ginger" }, price: "6.5", gf: true },
      { name: { bs: "Choco Locco", en: "Choco Locco" }, desc: { bs: "Tamna čokoladna krema, čokoladni biskvit i biskvit od lješnjaka", en: "Dark chocolate cream, chocolate biscuit & hazelnut biscuit" }, price: "7.5", gf: true },
      { name: { bs: "Tiramisu", en: "Tiramisu" }, desc: { bs: "Talijanski mascarpone, kafa arabica, marsala, homemade biskvit, kakao", en: "Italian mascarpone, arabica coffee, marsala, homemade biscuit, cocoa" }, price: "8", gf: true },
      { name: { bs: "Palačinak Nougat", en: "Nougat Crêpe" }, desc: { bs: "Nutella", en: "Nutella" }, price: "8" },
      { name: { bs: "Palačinak Nougat sa orasima", en: "Nougat Crêpe with Walnuts" }, desc: { bs: "Nutella, orasi", en: "Nutella, walnuts" }, price: "8.5" },
      { name: { bs: "Palačinak Nougat sa lješnjakom", en: "Nougat Crêpe with Hazelnuts" }, desc: { bs: "Nutella, komadići lješnjaka Piemonte IGP", en: "Nutella, Piemonte IGP hazelnut pieces" }, price: "9" },
    ],
  },
];
