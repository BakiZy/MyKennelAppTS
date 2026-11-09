const https = require("https");

const origin = "https://poodlesvonapalusso.com";
const pageUrl = (url) => url.startsWith(`${origin}/`) && !url.endsWith("/") ? `${url}/` : url;
const listPath = (lang) => lang === "sr" ? "/stenci-pudle" : "/puppies";
const profilePath = (lang, id) => `${listPath(lang)}/${id}`;
const litterPath = (lang, id) => lang === "sr" ? `/stenci-pudle/legla/${id}` : `/puppies/litters/${id}`;
const imageUrl = (value) => /^https:\/\/[^\s"'<>]+$/i.test(value || "") ? value : "";
const photos = (puppy) => [puppy.imageUrl, puppy.imageUrl2, puppy.imageUrl3].map(imageUrl).filter(Boolean);
const description = (puppy, lang) => {
  const name = puppy.name || (lang === "sr" ? "Štene Von Apalusso" : "Von Apalusso puppy");
  if (lang === "sr") return puppy.descriptionSr?.trim()
    || `${name} je štene pudle iz odgajivačnice Von Apalusso u Novom Sadu. Pogledajte fotografije i informacije o leglu.`;
  return puppy.description?.trim()
    || `${name} is a poodle puppy from Von Apalusso kennel in Novi Sad, Serbia. View photos and litter details.`;
};
const date = (value, lang) => value
  ? new Date(value).toLocaleDateString(lang === "sr" ? "sr-RS" : "en-GB")
  : (lang === "sr" ? "Biće objavljeno" : "To be announced");
const status = (value, lang) => lang === "sr"
  ? ({ Available: "Dostupno", Reserved: "Rezervisano", Sold: "Prodato", Planned: "Planirano", Born: "Oštenjeno", Closed: "Zatvoreno" })[value] || value || "Dostupno"
  : value || "Available";
const sex = (value, lang) => lang === "sr"
  ? ({ Male: "Mužjak", Female: "Ženka" })[value] || value || "Biće potvrđeno"
  : value || "To be confirmed";
const color = (value, lang) => lang === "sr"
  ? localizedColor(value, lang) || "Biće potvrđeno"
  : (value || "").trim().toLowerCase() === "appricot" ? "Apricot" : value || "To be confirmed";

const fetchJson = (url) => new Promise((resolve, reject) => {
  https.get(url, { timeout: 10000, headers: { Accept: "application/json" } }, (response) => {
    if (response.statusCode !== 200) {
      response.resume();
      reject(new Error(`SEO data request returned ${response.statusCode}: ${url}`));
      return;
    }
    let body = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => { body += chunk; });
    response.on("end", () => { try { resolve(JSON.parse(body)); } catch (error) { reject(error); } });
  }).on("timeout", function () { this.destroy(new Error(`SEO data request timed out: ${url}`)); })
    .on("error", reject);
});

const alternateLinks = (en, sr) => [
  { hrefLang: "en", href: en },
  { hrefLang: "sr", href: sr },
  { hrefLang: "x-default", href: en },
];

const poodlePath = (lang, id) => lang === "sr" ? `/sr/poodles/${id}` : `/poodles/${id}`;
const localizedSize = (value, lang) => lang === "sr"
  ? ({ toy: "toy", miniature: "patuljasta", mini: "patuljasta", medium: "srednja", standard: "standardna" })[(value || "").toLowerCase()] || value || ""
  : value || "";
const localizedColor = (value, lang) => lang === "sr"
  ? ({ red: "crvena", "light red": "svetlocrvena", "dark red": "tamnocrvena", apricot: "aprikot", appricot: "aprikot", fawn: "riđa", black: "crna", white: "bela", brown: "braon", gray: "siva", "black and tan": "crna sa paležom", harelquin: "harlekin", harlequin: "harlekin" })[(value || "").trim().toLowerCase().replace(/\s+/g, " ")] || value || ""
  : (value || "").trim().toLowerCase() === "appricot" ? "Apricot" : value || "";
const poodleDescription = (poodle, lang) => {
  const name = poodle.nickName || poodle.name || (lang === "sr" ? "Pudla Von Apalusso" : "Von Apalusso poodle");
  return lang === "sr"
    ? `${name} je ${localizedColor(poodle.poodleColorName, lang)} ${localizedSize(poodle.poodleSizeName, lang)} pudla odgajivačnice Von Apalusso u Novom Sadu.`.replace(/\s+/g, " ")
    : `${name} is a ${poodle.poodleColorName || ""} ${poodle.poodleSizeName || ""} poodle from Von Apalusso kennel in Serbia.`.replace(/\s+/g, " ");
};

const renderHome = (lang, poodles, escapeHtml) => {
  const sr = lang === "sr";
  const cards = poodles.map((poodle) => `
    <article>
      <h2><a href="${poodlePath(lang, poodle.id)}">${escapeHtml(poodle.name)}</a></h2>
      ${imageUrl(poodle.imageUrl) ? `<img src="${escapeHtml(poodle.imageUrl)}" alt="${escapeHtml(poodle.name)}" loading="lazy" />` : ""}
      <p>${escapeHtml(localizedSize(poodle.poodleSizeName, lang))} · ${escapeHtml(localizedColor(poodle.poodleColorName, lang))}</p>
    </article>`).join("\n");
  return `<main>
    <section>
      <h1>${sr ? "Toy i patuljaste pudle Von Apalusso" : "Family-raised poodles Von Apalusso"}</h1>
      <p>${sr
        ? "Upoznajte naše toy i patuljaste pudle koje odrastaju sa nama kao deo porodice, uz pažnju posvećenu zdravlju, temperamentu i standardu rase."
        : "Meet the toy and miniature poodles who live with us as family, with health, temperament, and breed standards in focus."}</p>
      <nav aria-label="${sr ? "Stranice odgajivačnice" : "Kennel pages"}">
        <a href="${sr ? "/o-nama" : "/about"}">${sr ? "O nama" : "About Von Apalusso"}</a>
        <a href="${sr ? "/stenci-pudle" : "/puppies"}">${sr ? "Dostupni štenci pudle" : "Available poodle puppies"}</a>
      </nav>
    </section>
    <section aria-label="${sr ? "Naše pudle" : "Our poodles"}">${cards}</section>
  </main>`;
};

const renderPoodleProfile = (poodle, lang, escapeHtml) => {
  const sr = lang === "sr";
  const name = poodle.nickName || poodle.name || "Von Apalusso";
  return `<main><article>
    <a href="${sr ? "/sr" : "/"}">${sr ? "Sve pudle" : "All poodles"}</a>
    <h1>${escapeHtml(name)}</h1>
    <p>${escapeHtml(poodleDescription(poodle, lang))}</p>
    ${imageUrl(poodle.imageUrl) ? `<img src="${escapeHtml(poodle.imageUrl)}" alt="${escapeHtml(name)}" />` : ""}
    <dl>
      <dt>${sr ? "Veličina" : "Size"}</dt><dd>${escapeHtml(localizedSize(poodle.poodleSizeName, lang))}</dd>
      <dt>${sr ? "Boja" : "Color"}</dt><dd>${escapeHtml(localizedColor(poodle.poodleColorName, lang))}</dd>
      <dt>${sr ? "Datum rođenja" : "Date of birth"}</dt><dd>${escapeHtml(date(poodle.dateOfBirth, lang))}</dd>
      <dt>${sr ? "Rodovnik" : "Pedigree"}</dt><dd>${escapeHtml(poodle.pedigreeNumber || (sr ? "Dostupno na upit" : "Available on request"))}</dd>
    </dl>
    <p>${sr ? "Za informacije o ovom psu ili štencima, pošaljite nam upit preko formulara na ovoj stranici." : "For information about this dog or puppies, send an inquiry using the form on this page."}</p>
  </article></main>`;
};

const renderList = (lang, puppies, litters, escapeHtml) => {
  const sr = lang === "sr";
  const puppyCards = puppies.map((puppy) => `
    <article>
      <h3><a href="${profilePath(lang, puppy.id)}">${escapeHtml(puppy.name || (sr ? "Štene" : "Puppy"))}</a></h3>
      ${photos(puppy)[0] ? `<img src="${escapeHtml(photos(puppy)[0])}" alt="${escapeHtml(puppy.name || (sr ? "Štene pudle" : "Poodle puppy"))}" loading="lazy" />` : ""}
      <p>${escapeHtml(description(puppy, lang))}</p>
      <p>${escapeHtml(status(puppy.status, lang))} · ${escapeHtml(color(puppy.color, lang))} · ${escapeHtml(date(puppy.dateOfBirth, lang))}</p>
    </article>`).join("\n");
  const litterCards = litters.map((litter) => `
    <article>
      <h3><a href="${litterPath(lang, litter.id)}">${escapeHtml(litter.name || (sr ? "Leglo" : "Litter"))}</a></h3>
      ${imageUrl(litter.coverImageUrl) ? `<a href="${litterPath(lang, litter.id)}"><img src="${escapeHtml(litter.coverImageUrl)}" alt="${escapeHtml(litter.name || (sr ? "Leglo" : "Litter"))}" loading="lazy" /></a>` : ""}
      <p>${escapeHtml((sr ? litter.descriptionSr : litter.description) || (sr ? "Više informacija o leglu uskoro." : "More details coming soon."))}</p>
      <p>${sr ? "Otac" : "Father"}: ${escapeHtml(litter.fatherName || (sr ? "Biće objavljeno" : "To be announced"))}; ${sr ? "Majka" : "Mother"}: ${escapeHtml(litter.motherName || (sr ? "Biće objavljeno" : "To be announced"))}</p>
    </article>`).join("\n");
  return `<main>
    <nav aria-label="Language / Jezik"><a href="/puppies">English</a> <a href="/stenci-pudle">Srpski</a></nav>
    <h1>${sr ? "Štenci toy i patuljastih pudli u Novom Sadu" : "Toy and miniature poodle puppies in Serbia"}</h1>
    <p>${sr ? "Upoznajte naše štence i pogledajte njihove fotografije. Ispod možete istražiti legla i roditelje, a za informacije o rezervaciji kontaktirajte odgajivačnicu Von Apalusso." : "Meet our puppies and explore their photos. Browse litters and parents below, then contact Von Apalusso kennel to ask about reservations."}</p>
    <section><h2>${sr ? "Štenci" : "Puppies"}</h2>${puppyCards}</section>
    <section><h2>${sr ? "Legla" : "Litters"}</h2>${litterCards}</section>
  </main>`;
};

const renderProfile = (puppy, lang, escapeHtml) => {
  const sr = lang === "sr";
  const name = puppy.name || (sr ? "Štene Von Apalusso" : "Von Apalusso puppy");
  return `<main>
    <nav aria-label="Language / Jezik"><a href="${profilePath("en", puppy.id)}">English</a> <a href="${profilePath("sr", puppy.id)}">Srpski</a></nav>
    <a href="${listPath(lang)}">${sr ? "Svi štenci" : "All puppies"}</a>
    <article>
      <h1>${escapeHtml(name)}</h1>
      <p>${escapeHtml(description(puppy, lang))}</p>
      <p>${sr ? "Status" : "Status"}: ${escapeHtml(status(puppy.status, lang))}</p>
      <p>${sr ? "Rođeno" : "Born"}: ${escapeHtml(date(puppy.dateOfBirth, lang))}</p>
      <p>${sr ? "Pol" : "Sex"}: ${escapeHtml(sex(puppy.sex, lang))}; ${sr ? "Boja" : "Color"}: ${escapeHtml(color(puppy.color, lang))}</p>
      <p>${sr ? "Leglo" : "Litter"}: ${puppy.litterId && puppy.litterName ? `<a href="${litterPath(lang, puppy.litterId)}">${escapeHtml(puppy.litterName)}</a>` : (sr ? "Nije dodeljeno" : "Not assigned")}</p>
      ${photos(puppy).map((photo, index) => `<img src="${escapeHtml(photo)}" alt="${escapeHtml(name)} ${sr ? "fotografija" : "photo"} ${index + 1}" loading="lazy" />`).join("\n")}
      <a href="${sr ? "/o-nama" : "/about"}">${sr ? "Pitajte nas o ovom štenetu" : "Ask about this puppy"}</a>
    </article>
  </main>`;
};

const renderLitterProfile = (litter, puppies, lang, escapeHtml) => {
  const sr = lang === "sr";
  const name = litter.name || (sr ? "Leglo Von Apalusso" : "Von Apalusso litter");
  const summary = (sr ? litter.descriptionSr : litter.description)?.trim()
    || (sr ? "Više informacija o leglu uskoro." : "More details coming soon.");
  const puppyCards = puppies.filter((puppy) => puppy.litterId === litter.id).map((puppy) => `
    <article>
      <h3><a href="${profilePath(lang, puppy.id)}">${escapeHtml(puppy.name || (sr ? "Štene" : "Puppy"))}</a></h3>
      ${photos(puppy)[0] ? `<img src="${escapeHtml(photos(puppy)[0])}" alt="${escapeHtml(puppy.name || (sr ? "Štene" : "Puppy"))}" loading="lazy" />` : ""}
      <p>${escapeHtml(description(puppy, lang))}</p>
    </article>`).join("\n");
  return `<main>
    <nav aria-label="Language / Jezik"><a href="${litterPath("en", litter.id)}">English</a> <a href="${litterPath("sr", litter.id)}">Srpski</a></nav>
    <a href="${listPath(lang)}">${sr ? "Svi štenci i legla" : "All puppies and litters"}</a>
    <article>
      <h1>${escapeHtml(name)}</h1>
      <p>${escapeHtml(summary)}</p>
      ${imageUrl(litter.coverImageUrl) ? `<img src="${escapeHtml(litter.coverImageUrl)}" alt="${escapeHtml(name)}" />` : ""}
      <p>${sr ? "Datum rođenja" : "Born"}: ${escapeHtml(date(litter.dateOfBirth, lang))}</p>
      <p>${sr ? "Otac" : "Father"}: ${litter.fatherId && litter.fatherName ? `<a href="${poodlePath(lang, litter.fatherId)}">${escapeHtml(litter.fatherName)}</a>` : (sr ? "Biće objavljeno" : "To be announced")}</p>
      <p>${sr ? "Majka" : "Mother"}: ${litter.motherId && litter.motherName ? `<a href="${poodlePath(lang, litter.motherId)}">${escapeHtml(litter.motherName)}</a>` : (sr ? "Biće objavljeno" : "To be announced")}</p>
      <p>${sr ? "Dostupno" : "Available"}: ${escapeHtml(litter.availablePuppyCount)}</p>
    </article>
    <section><h2>${sr ? "Štenci iz ovog legla" : "Puppies in this litter"}</h2>${puppyCards || `<p>${sr ? "Štenci iz ovog legla još nisu pojedinačno objavljeni." : "Puppies from this litter have not been listed individually yet."}</p>`}</section>
  </main>`;
};

module.exports = async ({ fs, path, distDir, baseHtml, pages, applySeo, escapeHtml }) => {
  const apiBase = (process.env.SEO_API_BASE_URL || process.env.VITE_API_BASE_URL || "https://api.poodlesvonapalusso.com").replace(/\/$/, "");
  const data = process.env.SEO_DATA_FILE
    ? JSON.parse(fs.readFileSync(process.env.SEO_DATA_FILE, "utf8"))
    : {
        puppies: await fetchJson(`${apiBase}/api/puppies`),
        litters: await fetchJson(`${apiBase}/api/puppies/litters`),
        poodles: await fetchJson(`${apiBase}/api/poodles`),
      };
  if (!Array.isArray(data.puppies) || !Array.isArray(data.litters) || !Array.isArray(data.poodles))
    throw new Error("SEO site data has an unexpected shape.");

  const englishHome = pages.find((candidate) => candidate.canonical === `${origin}/`);
  englishHome.alternates = alternateLinks(`${origin}/`, `${origin}/sr`);
  englishHome.staticHtml = renderHome("en", data.poodles, escapeHtml);
  englishHome.structuredData = { "@context": "https://schema.org", "@type": "WebSite", name: "Poodles Von Apalusso", url: `${origin}/`, inLanguage: "en" };
  pages.push({
    outputPath: path.join(distDir, "sr", "index.html"),
    title: "Odgajivačnica toy i patuljastih pudli Novi Sad | Von Apalusso",
    description: "Odgajivačnica crvenih toy i patuljastih pudli Von Apalusso u Novom Sadu. Upoznajte naše pudle, legla i dostupne štence.",
    canonical: `${origin}/sr`,
    lang: "sr",
    alternates: alternateLinks(`${origin}/`, `${origin}/sr`),
    structuredData: { "@context": "https://schema.org", "@type": "WebSite", name: "Poodles Von Apalusso", url: `${origin}/sr`, inLanguage: "sr" },
    staticHtml: renderHome("sr", data.poodles, escapeHtml),
  });

  for (const lang of ["en", "sr"]) {
    const canonical = `${origin}${listPath(lang)}`;
    const page = lang === "en" ? pages.find((candidate) => candidate.canonical === canonical) : {
      outputPath: path.join(distDir, "stenci-pudle", "index.html"),
      title: "Štenci toy i patuljastih pudli u Novom Sadu | Von Apalusso",
      description: "Upoznajte štence toy i patuljastih pudli odgajivačnice Von Apalusso u Novom Sadu. Pogledajte legla, roditelje, fotografije i dostupnost štenaca.",
      canonical,
      lang,
      alternates: alternateLinks(`${origin}/puppies`, `${origin}/stenci-pudle`),
    };
    if (lang === "sr") pages.push(page);
    page.title = lang === "en" ? "Toy and miniature poodle puppies in Serbia | Von Apalusso" : page.title;
    page.staticHtml = renderList(lang, data.puppies, data.litters, escapeHtml);
    page.structuredData = { "@context": "https://schema.org", "@type": "CollectionPage", name: page.title, url: canonical, inLanguage: lang };
  }

  for (const puppy of data.puppies) {
    if (!Number.isSafeInteger(puppy.id) || puppy.id <= 0) continue;
    for (const lang of ["en", "sr"]) {
      const canonical = `${origin}${profilePath(lang, puppy.id)}`;
      pages.push({
        outputPath: path.join(distDir, listPath(lang).slice(1), String(puppy.id), "index.html"),
        title: lang === "sr"
          ? `${puppy.name || "Štene"} | Štene toy ili patuljaste pudle | Von Apalusso`
          : `${puppy.name || "Puppy"} | Toy or miniature poodle puppy | Von Apalusso`,
        description: description(puppy, lang),
        canonical,
        lang,
        image: photos(puppy)[0],
        alternates: alternateLinks(`${origin}${profilePath("en", puppy.id)}`, `${origin}${profilePath("sr", puppy.id)}`),
        structuredData: { "@context": "https://schema.org", "@type": "ProfilePage", name: puppy.name || "Puppy", url: canonical, inLanguage: lang, image: photos(puppy) },
        staticHtml: renderProfile(puppy, lang, escapeHtml),
      });
    }
  }

  for (const litter of data.litters) {
    if (!Number.isSafeInteger(litter.id) || litter.id <= 0) continue;
    for (const lang of ["en", "sr"]) {
      const canonical = `${origin}${litterPath(lang, litter.id)}`;
      const name = litter.name || (lang === "sr" ? "Leglo Von Apalusso" : "Von Apalusso litter");
      const summary = (lang === "sr" ? litter.descriptionSr : litter.description)?.trim()
        || (lang === "sr" ? "Više informacija o leglu uskoro." : "More details coming soon.");
      pages.push({
        outputPath: path.join(distDir, lang === "sr" ? "stenci-pudle" : "puppies", lang === "sr" ? "legla" : "litters", String(litter.id), "index.html"),
        title: lang === "sr" ? `${name} | Leglo pudli | Von Apalusso` : `${name} | Poodle litter | Von Apalusso`,
        description: summary,
        canonical,
        lang,
        image: imageUrl(litter.coverImageUrl),
        alternates: alternateLinks(`${origin}${litterPath("en", litter.id)}`, `${origin}${litterPath("sr", litter.id)}`),
        structuredData: { "@context": "https://schema.org", "@type": "CollectionPage", name, url: canonical, inLanguage: lang },
        staticHtml: renderLitterProfile(litter, data.puppies, lang, escapeHtml),
      });
    }
  }

  for (const poodle of data.poodles) {
    if (!Number.isSafeInteger(poodle.id) || poodle.id <= 0) continue;
    const displayName = poodle.nickName || poodle.name || "Von Apalusso";
    for (const lang of ["en", "sr"]) {
      const canonical = `${origin}${poodlePath(lang, poodle.id)}`;
      pages.push({
        outputPath: path.join(distDir, lang === "sr" ? "sr" : "", "poodles", String(poodle.id), "index.html"),
        title: lang === "sr"
          ? `${displayName} | ${localizedColor(poodle.poodleColorName, lang)} ${localizedSize(poodle.poodleSizeName, lang)} pudla | Von Apalusso`
          : `${displayName} | ${poodle.poodleColorName || "Poodle"} ${poodle.poodleSizeName || ""} | Von Apalusso`,
        description: poodleDescription(poodle, lang),
        canonical,
        lang,
        image: imageUrl(poodle.imageUrl),
        alternates: alternateLinks(`${origin}${poodlePath("en", poodle.id)}`, `${origin}${poodlePath("sr", poodle.id)}`),
        structuredData: { "@context": "https://schema.org", "@type": "ProfilePage", name: displayName, url: canonical, inLanguage: lang, image: imageUrl(poodle.imageUrl) },
        staticHtml: renderPoodleProfile(poodle, lang, escapeHtml),
      });
    }
  }

  const accountPages = [
    ["login", "Login or create an account", "Prijava ili registracija"],
    ["profile", "Your profile", "Vaš profil"],
    ["forgot-password", "Forgot password", "Zaboravljena lozinka"],
    ["reset-password", "Reset password", "Promena lozinke"],
    ["confirm-email", "Confirm email", "Potvrda e-pošte"],
    ["resend-confirmation", "Resend confirmation email", "Ponovno slanje potvrde e-pošte"],
  ];
  for (const [segment, enTitle, srTitle] of accountPages) {
    for (const lang of ["en", "sr"]) {
      const title = lang === "sr" ? srTitle : enTitle;
      pages.push({
        outputPath: path.join(distDir, lang === "sr" ? "sr" : "", segment, "index.html"),
        title: `${title} | Von Apalusso`,
        description: lang === "sr" ? "Korisnički nalog odgajivačnice Von Apalusso." : "Von Apalusso kennel account.",
        canonical: `${origin}/${lang === "sr" ? "sr/" : ""}${segment}`,
        lang,
        robots: "noindex,follow",
        staticHtml: `<main><h1>${escapeHtml(title)}</h1></main>`,
      });
    }
  }

  for (const page of pages) {
    page.canonical = pageUrl(page.canonical);
    page.alternates = page.alternates?.map((alternate) => ({ ...alternate, href: pageUrl(alternate.href) }));
    if (page.structuredData?.url) page.structuredData.url = pageUrl(page.structuredData.url);
    fs.mkdirSync(path.dirname(page.outputPath), { recursive: true });
    fs.writeFileSync(page.outputPath, applySeo(baseHtml, page));
  }

  const links = pages.filter((page) => !page.robots?.startsWith("noindex")).map((page) => {
    const alternates = (page.alternates || []).map((alternate) =>
      `<xhtml:link rel="alternate" hreflang="${alternate.hrefLang}" href="${escapeHtml(alternate.href)}" />`).join("");
    return `<url><loc>${escapeHtml(page.canonical)}</loc>${alternates}</url>`;
  }).join("\n");
  fs.writeFileSync(path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${links}\n</urlset>`);
  console.log(`Generated ${pages.length} SEO pages and sitemap.`);
};
