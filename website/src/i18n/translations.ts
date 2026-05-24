export type Lang = "bs" | "en";

export const translations = {
  nav: {
    menu: { bs: "Meni", en: "Menu" },
    reviews: { bs: "Recenzije", en: "Reviews" },
    contact: { bs: "Kontakt", en: "Contact" },
    callOrder: { bs: "Pozovi i naruči", en: "Call & Order" },
    openMenu: { bs: "Otvori meni", en: "Open menu" },
  },
  hero: {
    subtitle: { bs: "Pizza · Catering · Sweets", en: "Pizza · Catering · Sweets" },
    description: {
      bs: "Autentična napoletanska pizza pripremljena sa strašću u srcu Sarajeva",
      en: "Authentic Neapolitan pizza crafted with passion in the heart of Sarajevo",
    },
    rating: { bs: "(Google & Korpa.ba prosjek)", en: "(Google & Korpa.ba average)" },
    hours: { bs: "Uto–Ned · Zatvara se u 23h", en: "Tue–Sun · Closes at 11 PM" },
    orderNow: { bs: "Naruči odmah", en: "Order Now" },
    viewMenu: { bs: "Pogledaj meni", en: "View Menu" },
  },
  story: {
    label: { bs: "Naša priča", en: "Our story" },
    title: {
      bs: "Tradicija iz Napolja, u srcu Sarajeva",
      en: "Tradition from Napoli, in the heart of Sarajevo",
    },
    body: {
      bs: "Naše tijesto raste 24 sata, peče se u peći na drva na 450°C i gotovo je za 60 sekundi — kako se i radi u Napulju. San Marzano tomate, fior di latte i maslinovo ulje extra vergine donosimo direktno iz Italije. Svaka pizza je rezultat strpljenja, jednostavnosti i poštovanja prema namirnicama.",
      en: "Our dough rests for 24 hours, then bakes in a wood-fired oven at 450°C and is ready in 60 seconds — the way it's done in Napoli. San Marzano tomatoes, fior di latte and extra-virgin olive oil come straight from Italy. Each pizza is the result of patience, simplicity and respect for the ingredient.",
    },
    bullets: {
      bs: [
        {
          h: "Peć na drva",
          d: "Originalna peć na 450°C — testo se peče za 60–90 sekundi.",
        },
        {
          h: "Talijanske namirnice",
          d: "San Marzano paradajz, brašno 00, fior di latte iz Kampanije.",
        },
        {
          h: "Tijesto od 24 sata",
          d: "Sporo fermentirano, lakše za varenje, savršena hrskavica.",
        },
      ],
      en: [
        {
          h: "Wood-fired oven",
          d: "Authentic 450°C oven — pizza is ready in 60–90 seconds.",
        },
        {
          h: "Italian ingredients",
          d: "San Marzano tomatoes, 00 flour, fior di latte from Campania.",
        },
        {
          h: "24-hour dough",
          d: "Slow-fermented — easy to digest, perfectly crisp.",
        },
      ],
    },
  },
  menuHighlights: {
    label: { bs: "Naša Ponuda", en: "Our Selection" },
    title: { bs: "Izdvajamo iz menija", en: "Menu Highlights" },
    desc: {
      bs: "Svako jelo priprema se od uvezenih talijanskih namirnica i peče u našoj peći na drva.",
      en: "Every dish is prepared with imported Italian ingredients and baked in our wood-fired oven.",
    },
    viewFull: { bs: "Pogledaj kompletan meni", en: "View Full Menu" },
  },
  reviews: {
    label: { bs: "Šta kažu gosti", en: "What Guests Say" },
    title: { bs: "Recenzije gostiju", en: "Guest Reviews" },
    reviewCount: { bs: "1.103 recenzije", en: "1,103 reviews" },
    items: {
      bs: [
        { name: "Talha Uyanık", time: "prije mjesec dana", text: "Jedna od najboljih pizza koje sam ikad jeo. Bilo bi sjajno da je moguće dati više zvjezdica za uslugu. Naš konobar je bio najsimpatičnija osoba u Bosni. Odlična atmosfera, super usluga. Jedva čekam da se vratim. 🇧🇦🇹🇷" },
        { name: "Ljubitelj lokalne hrane", time: "prije 3 godine", text: "Samo kratki update. Opet sam bio ovdje i bilo je još bolje nego što sam se sjećao. Pizza je bila apsolutno nevjerovatna, mogu reći najbolja koju sam jeo u Sarajevu." },
        { name: "Entuzijast za pizzu", time: "prije 2 mjeseca", text: "Autentična napoletanska pizza sa savršenom korom. Tiramisu je također bio izvanredan. Toplo preporučujem svima koji posjete Sarajevo." },
      ],
      en: [
        { name: "Talha Uyanık", time: "1 month ago", text: "One of the best pizzas I've ever had. It would be great if it were possible to give more stars for the service. Our waiter was the friendliest person in Bosnia. Great atmosphere, amazing service. Can't wait to come back. 🇧🇦🇹🇷" },
        { name: "Local food lover", time: "3 years ago", text: "Just a quick update. I was here again and it was even better than I remembered. The pizza was absolutely incredible, I can say the best I've eaten in Sarajevo." },
        { name: "Pizza enthusiast", time: "2 months ago", text: "Authentic Neapolitan pizza with a perfect crust. The tiramisu was also outstanding. Highly recommend to anyone visiting Sarajevo." },
      ],
    },
  },
  contact: {
    label: { bs: "Posjetite nas", en: "Visit Us" },
    title: { bs: "Pronađite nas u Sarajevu", en: "Find Us in Sarajevo" },
    address: { bs: "Adresa", en: "Address" },
    addressLine: { bs: "Kranjčevićeva 33, Sarajevo 71000\nBosna i Hercegovina", en: "Kranjčevićeva 33, Sarajevo 71000\nBosnia and Herzegovina" },
    phone: { bs: "Telefon", en: "Phone" },
    workingHours: { bs: "Radno vrijeme", en: "Working Hours" },
    hours: {
      bs: ["Uto–Čet: 8:00 – 23:00", "Pet: 8:00 – 23:30", "Sub: 9:00 – 23:30", "Ned: 12:00 – 23:00", "Pon: Zatvoreno"],
      en: ["Tue–Thu: 8:00 AM – 11:00 PM", "Fri: 8:00 AM – 11:30 PM", "Sat: 9:00 AM – 11:30 PM", "Sun: 12:00 PM – 11:00 PM", "Mon: Closed"],
    },
    dineIn: { bs: "U restoranu", en: "Dine In" },
    takeaway: { bs: "Za ponijeti", en: "Takeaway" },
    delivery: { bs: "Dostava", en: "Delivery" },
  },
  reservation: {
    label: { bs: "Rezervacija", en: "Reservation" },
    title: { bs: "Rezervišite stol", en: "Reserve a Table" },
    desc: {
      bs: "Trenutna dostupnost u stvarnom vremenu, potvrda odmah putem e-maila — bez čekanja.",
      en: "Real-time availability with instant email confirmation — no waiting.",
    },
    ctaPrimary: { bs: "Rezerviši sto", en: "Reserve a table" },
    ctaWhatsapp: { bs: "Ili poruči putem WhatsApp-a", en: "Or message us on WhatsApp" },
  },
  menuPage: {
    title: { bs: "Naš Meni", en: "Our Menu" },
    desc: {
      bs: "Autentična napoletanska pizza pripremljena od uvezenih talijanskih namirnica i pečena u našoj peći na drva.",
      en: "Authentic Neapolitan pizza prepared with imported Italian ingredients and baked in our wood-fired oven.",
    },
    categories: {
      sendvici: { bs: "Sendviči", en: "Sandwiches" },
      salate: { bs: "Salate", en: "Salads" },
      gourmetSalate: { bs: "Gourmet Salate", en: "Gourmet Salads" },
      deserti: { bs: "Marshall's Deserti", en: "Marshall's Desserts" },
    },
    readyToOrder: { bs: "Spremni za narudžbu?", en: "Ready to order?" },
    readyToOrderDesc: {
      bs: "Pozovite nas direktno ili naručite putem Korpa.ba za dostavu",
      en: "Call us directly or order via Korpa.ba for delivery",
    },
    callOrder: { bs: "Pozovi i naruči", en: "Call & Order" },
    orderKorpa: { bs: "Naruči na Korpa.ba", en: "Order on Korpa.ba" },
  },
  footer: {
    copyright: { bs: "Kranjčevićeva 33, Sarajevo", en: "Kranjčevićeva 33, Sarajevo" },
    tagline: {
      bs: "Autentična napoletanska pizza u Sarajevu od 2015.",
      en: "Authentic Neapolitan pizza in Sarajevo since 2015.",
    },
    explore: { bs: "Istraži", en: "Explore" },
    visit: { bs: "Posjetite nas", en: "Visit us" },
    follow: { bs: "Pratite nas", en: "Follow us" },
    rights: {
      bs: (year: number) => `© ${year} Margherita Sarajevo. Sva prava pridržana.`,
      en: (year: number) => `© ${year} Margherita Sarajevo. All rights reserved.`,
    },
    crafted: { bs: "Napravljeno s ljubavlju u Sarajevu.", en: "Made with love in Sarajevo." },
    navMenu: { bs: "Meni", en: "Menu" },
    navReserve: { bs: "Rezerviši sto", en: "Reserve a table" },
    navReviews: { bs: "Recenzije", en: "Reviews" },
    navContact: { bs: "Kontakt", en: "Contact" },
  },
} as const;
