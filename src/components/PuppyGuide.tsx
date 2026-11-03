import { useEffect, useRef, useState } from "react";
import classes from "./PuppyGuide.module.css";

type Language = "en" | "sr";
type Topic = { title: string; points: string[] };

const guides: Record<Language, { title: string; intro: string; topics: Topic[]; note: string }> = {
  en: {
    title: "A guide for your new toy or miniature poodle puppy",
    intro: "Your puppy has just left its litter and arrived in a new home. Give it a quiet place to sleep, a steady routine and time to get to know your family. Short periods of play, rest and gentle practice being alone can help it settle in.",
    topics: [
      { title: "Prepare your home", points: [
        "Put away cables, medicines, cleaning products, small objects, shoes and plants that may be unsafe for dogs.",
        "Offer safe chew toys while your puppy is teething.",
        "Prevent jumps from beds, sofas and other high places."
      ] },
      { title: "Food and water", points: [
        "Choose a complete, balanced food made for growing small-breed puppies. Follow the feeding guide for your puppy's age and weight, and ask your veterinarian if you are unsure about portions.",
        "Divide the daily amount into several small meals. Introduce a different food gradually.",
        "Keep fresh drinking water available at all times."
      ] },
      { title: "Toilet routine", points: [
        "Give your puppy a chance to relieve itself after waking, eating, playing and drinking, and before bedtime.",
        "Use a consistent outdoor spot or puppy pad, and praise success right away.",
        "Accidents happen. A calm, consistent routine works better than punishment."
      ] },
      { title: "Veterinary care and parasite protection", points: [
        "Arrange a veterinary visit to discuss vaccinations and care for your individual puppy.",
        "Choose flea and tick prevention with your veterinarian; the right product depends on your puppy's age, weight and health."
      ] },
      { title: "Coat, ears and nails", points: [
        "Get your poodle used to short, gentle brushing sessions, especially around the ears, armpits and legs where the coat can mat.",
        "Introduce grooming gradually and agree on bathing and clipping intervals with your groomer.",
        "Check ears and nails regularly. Contact your veterinarian if an ear is painful, red, has discharge or smells unusual."
      ] },
      { title: "Walks and learning", points: [
        "Choose a well-fitting leash and collar or harness that is comfortable for your puppy. Avoid pulling on its neck.",
        "Introduce new people, sounds and places gradually, without forcing interactions.",
        "Reward good behaviour with praise, play or a small treat. Keep training sessions short and regular."
      ] }
    ],
    note: "This is a general starting guide. Ask your veterinarian about feeding, vaccinations, parasite prevention or any health concern specific to your puppy."
  },
  sr: {
    title: "Vodič za štene toy ili patuljaste pudle",
    intro: "Štene je upravo promenilo okruženje i odvojilo se od legla. Dajte mu mirno mesto za spavanje, ustaljen raspored i vreme da upozna ukućane. Kratki periodi igre, odmora i nežnog privikavanja na samoću mogu mu pomoći da se oseća sigurno.",
    topics: [
      { title: "Pripremite dom", points: [
        "Sklonite kablove, lekove, sredstva za čišćenje, sitne predmete, obuću i biljke koje mogu biti štetne za pse.",
        "Obezbedite bezbedne igračke za žvakanje dok štenetu rastu zubi.",
        "Ne dozvoljavajte skakanje sa kreveta, sofe i drugih većih visina."
      ] },
      { title: "Hrana i voda", points: [
        "Izaberite potpunu i uravnoteženu hranu namenjenu štencima malih rasa. Količinu prilagodite uzrastu i težini šteneta prema uputstvu za hranu, a za nedoumice pitajte veterinara.",
        "Dnevnu količinu podelite u više manjih obroka. Novu hranu uvodite postepeno.",
        "Sveža voda za piće treba da bude dostupna u svakom trenutku."
      ] },
      { title: "Navikavanje na nuždu", points: [
        "Ponudite štenetu priliku da obavi nuždu posle buđenja, obroka, igre i pijenja vode, kao i pred spavanje.",
        "Vodite ga na isto mesto napolju ili ga usmeravajte na pelenu i odmah pohvalite uspeh.",
        "Ne kažnjavajte ga za nezgode u kući. Dosledna rutina i strpljenje daju bolje rezultate."
      ] },
      { title: "Veterinar i zaštita od parazita", points: [
        "Dogovorite pregled kod veterinara i raspitajte se o vakcinaciji i nezi vašeg šteneta.",
        "Zaštitu od buva i krpelja birajte uz savet veterinara, prema uzrastu, težini i zdravstvenom stanju šteneta."
      ] },
      { title: "Nega dlake, ušiju i noktiju", points: [
        "Navikavajte pudlu na kratko i nežno četkanje, posebno oko ušiju, pazuha i nogu, gde se dlaka lako mrsi.",
        "Postepeno je upoznajte sa grumerom, a termine kupanja i šišanja dogovorite prema stanju dlake.",
        "Redovno proveravajte uši i nokte. Ako je uvo bolno, crveno, ima sekret ili neprijatan miris, obratite se veterinaru."
      ] },
      { title: "Šetnja i učenje", points: [
        "Izaberite povodac i ogrlicu ili am koji dobro pristaju i prijatni su štenetu. Izbegavajte povlačenje za vrat.",
        "Postepeno upoznajte štene sa ljudima, zvucima i novim mestima, bez forsiranja.",
        "Nagrađujte poželjno ponašanje pohvalom, igrom ili malom poslasticom. Vežbajte kratko i redovno."
      ] }
    ],
    note: "Ovo je opšti vodič za početak. Za ishranu, vakcinaciju, zaštitu od parazita i zdravstvena pitanja koja se tiču baš vašeg šteneta posavetujte se sa veterinarom."
  }
};

const guideAsText = (language: Language) => {
  const guide = guides[language];
  return [guide.title, guide.intro, ...guide.topics.flatMap((topic) => [topic.title, ...topic.points.map((point) => `• ${point}`)]), guide.note].join("\n\n");
};

const PuppyGuide = ({ initialLanguage = "en" }: { initialLanguage?: Language }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => { setLanguage(initialLanguage); }, [initialLanguage]);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const guide = guides[language];

  const copyGuide = async () => {
    try {
      await navigator.clipboard.writeText(guideAsText(language));
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <section className={classes.entry} aria-labelledby="puppy-guide-heading">
      <div>
        <p className={classes.eyebrow}>{initialLanguage === "sr" ? "Za nove vlasnike" : "For new puppy families"}</p>
        <h2 id="puppy-guide-heading">{initialLanguage === "sr" ? "Saveti za prve dane šteneta u novom domu" : "A little help for the first days at home"}</h2>
        <p>{initialLanguage === "sr" ? "Pročitajte ili kopirajte vodič za negu šteneta na srpskom ili engleskom." : "Read or copy our puppy care guide in English or Serbian."}</p>
      </div>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>{initialLanguage === "sr" ? "Otvori vodič za štene" : "Open puppy guide"}</button>

      <dialog ref={dialogRef} className={classes.dialog} aria-labelledby="guide-title" onClose={() => { setCopied(false); setCopyError(false); }} onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}>
        <div className={classes.dialogContent} lang={language}>
          <div className={classes.topbar}>
            <div className={classes.languages} aria-label={language === "sr" ? "Jezik vodiča" : "Guide language"}>
              <button type="button" aria-pressed={language === "en"} onClick={() => { setLanguage("en"); setCopied(false); setCopyError(false); }}>English</button>
              <button type="button" aria-pressed={language === "sr"} onClick={() => { setLanguage("sr"); setCopied(false); setCopyError(false); }}>Srpski</button>
            </div>
            <button type="button" className={classes.close} onClick={() => dialogRef.current?.close()} aria-label={language === "sr" ? "Zatvori vodič" : "Close guide"}>×</button>
          </div>
          <h2 id="guide-title">{guide.title}</h2>
          <p>{guide.intro}</p>
          {guide.topics.map((topic) => (
            <section key={topic.title} className={classes.topic}>
              <h3>{topic.title}</h3>
              <ul>{topic.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </section>
          ))}
          <p className={classes.note}>{guide.note}</p>
          <button type="button" className={classes.copy} onClick={() => void copyGuide()}>
            {copied ? (language === "sr" ? "Kopirano" : "Copied") : (language === "sr" ? "Kopiraj vodič" : "Copy guide")}
          </button>
          <span role="status" aria-live="polite" className={classes.copyStatus}>
            {copyError ? (language === "sr" ? "Automatsko kopiranje nije uspelo. Možete označiti i kopirati tekst ručno." : "Automatic copying failed. You can select and copy the text manually.") : ""}
          </span>
        </div>
      </dialog>
    </section>
  );
};

export default PuppyGuide;
