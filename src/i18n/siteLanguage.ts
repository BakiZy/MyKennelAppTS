export type SiteLanguage = "en" | "sr";

export const languageForPath = (pathname: string): SiteLanguage =>
  pathname === "/sr" || pathname.startsWith("/sr/")
    || pathname === "/o-nama" || pathname === "/stenci-pudle" || pathname.startsWith("/stenci-pudle/")
    ? "sr" : "en";

export const homePath = (language: SiteLanguage) => language === "sr" ? "/sr" : "/";
export const aboutPath = (language: SiteLanguage) => language === "sr" ? "/o-nama" : "/about";
export const puppiesPath = (language: SiteLanguage) => language === "sr" ? "/stenci-pudle" : "/puppies";
export const accountPath = (language: SiteLanguage, page: string) =>
  language === "sr" ? `/sr/${page}` : `/${page}`;
export const poodlePath = (language: SiteLanguage, id: number | string) =>
  language === "sr" ? `/sr/poodles/${id}` : `/poodles/${id}`;

export const alternatePath = (pathname: string, language: SiteLanguage): string => {
  if (pathname === "/" || pathname === "/sr") return homePath(language);
  if (pathname === "/about" || pathname === "/o-nama") return aboutPath(language);
  if (pathname === "/puppies" || pathname === "/stenci-pudle") return puppiesPath(language);

  const litter = pathname.match(/^\/(?:puppies\/litters|stenci-pudle\/legla)\/(\d+)$/);
  if (litter) return language === "sr" ? `/stenci-pudle/legla/${litter[1]}` : `/puppies/litters/${litter[1]}`;

  const puppy = pathname.match(/^\/(?:puppies|stenci-pudle)\/(\d+)$/);
  if (puppy) return `${puppiesPath(language)}/${puppy[1]}`;
  const poodle = pathname.match(/^\/(?:sr\/)?poodles\/(\d+)$/);
  if (poodle) return poodlePath(language, poodle[1]);
  const account = pathname.match(/^\/(?:sr\/)?(login|profile|forgot-password|reset-password|confirm-email|resend-confirmation)$/);
  if (account) return accountPath(language, account[1]);
  return homePath(language);
};

export const localizedSize = (name: string, language: SiteLanguage) => {
  if (language === "en") return name;
  const sizes: Record<string, string> = { toy: "Toy", miniature: "Patuljasta", mini: "Patuljasta", medium: "Srednja", standard: "Standardna" };
  return sizes[name.trim().toLowerCase()] || name;
};

export const localizedColor = (name: string, language: SiteLanguage) => {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (language === "en") return normalized === "appricot" ? "Apricot" : name;
  const colors: Record<string, string> = {
    red: "Crvena", "light red": "Svetlocrvena", "dark red": "Tamnocrvena",
    apricot: "Aprikot", appricot: "Aprikot", fawn: "Riđa", black: "Crna", white: "Bela", brown: "Braon",
    gray: "Siva", "black and tan": "Crna sa paležom", harelquin: "Harlekin", harlequin: "Harlekin",
  };
  return colors[normalized] || name;
};

export const localizedSex = (name: string, language: SiteLanguage) => {
  if (language === "en") return name;
  return ({ Male: "Mužjak", Female: "Ženka" } as Record<string, string>)[name] || name;
};
