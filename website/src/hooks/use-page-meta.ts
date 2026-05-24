import { useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";

const DEFAULT_DESC = {
  bs: "Autentična napoletanska pizza u srcu Sarajeva. Peć na drva, talijanske namirnice, online rezervacije.",
  en: "Authentic Neapolitan pizza in the heart of Sarajevo. Wood-fired oven, Italian ingredients, online reservations.",
};

export function usePageMeta(title: string, description?: string) {
  const { lang } = useLang();
  useEffect(() => {
    document.title = title;
    const desc = description ?? DEFAULT_DESC[lang];
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    document.documentElement.lang = lang;
  }, [title, description, lang]);
}
