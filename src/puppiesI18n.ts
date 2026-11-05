import { LitterModel, PuppyModel } from "./interfaces/IPuppyModel";
import { localizedColor } from "./i18n/siteLanguage";

export type PuppyLanguage = "en" | "sr";

export const puppyListPath = (language: PuppyLanguage) =>
  language === "sr" ? "/stenci-pudle" : "/puppies";

export const puppyDetailPath = (language: PuppyLanguage, id: number) =>
  `${puppyListPath(language)}/${id}`;

export const litterDetailPath = (language: PuppyLanguage, id: number | string) =>
  language === "sr" ? `/stenci-pudle/legla/${id}` : `/puppies/litters/${id}`;

export const puppyListTitle = (language: PuppyLanguage) => language === "sr"
  ? "Štenci toy i patuljastih pudli u Novom Sadu | Von Apalusso"
  : "Toy and miniature poodle puppies in Serbia | Von Apalusso";

export const puppyListDescription = (language: PuppyLanguage) => language === "sr"
  ? "Upoznajte štence toy i patuljastih pudli odgajivačnice Von Apalusso u Novom Sadu. Pogledajte legla, roditelje, fotografije i dostupnost štenaca."
  : "Meet toy and miniature poodle puppies from Von Apalusso kennel in Novi Sad, Serbia. Explore litters, parents, photos and availability.";

export const puppyDescription = (puppy: PuppyModel, language: PuppyLanguage) => {
  const name = puppy.name || (language === "sr" ? "Štene Von Apalusso" : "Von Apalusso puppy");
  if (language === "sr") return puppy.descriptionSr?.trim()
    || `${name} je štene pudle iz odgajivačnice Von Apalusso u Novom Sadu. Pogledajte fotografije i informacije o leglu.`;
  return puppy.description?.trim()
    || `${name} is a poodle puppy from Von Apalusso kennel in Novi Sad, Serbia. View photos and litter details.`;
};

export const litterDescription = (litter: LitterModel, language: PuppyLanguage) =>
  (language === "sr" ? litter.descriptionSr : litter.description)?.trim()
  || (language === "sr" ? "Više informacija o leglu uskoro." : "More details coming soon.");

export const puppyStatus = (status: string | undefined, language: PuppyLanguage) => {
  if (language === "en") return status || "Available";
  const values: Record<string, string> = {
    Available: "Dostupno", Reserved: "Rezervisano", Sold: "Prodato",
    Planned: "Planirano", Born: "Oštenjeno", Closed: "Zatvoreno",
  };
  return values[status || "Available"] || status || "Dostupno";
};

export const puppySex = (sex: string | undefined, language: PuppyLanguage) => {
  if (!sex) return language === "sr" ? "Biće potvrđeno" : "To be confirmed";
  if (language === "en") return sex;
  return ({ Male: "Mužjak", Female: "Ženka" } as Record<string, string>)[sex] || sex;
};

export const puppyColor = (color: string | undefined, language: PuppyLanguage) => {
  if (!color) return language === "sr" ? "Biće potvrđeno" : "To be confirmed";
  const translated = localizedColor(color, language);
  return language === "sr" ? translated.toLocaleLowerCase("sr-RS") : translated;
};
