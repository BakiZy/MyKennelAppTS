const fs = require("fs");
const path = require("path");

const distDir = process.env.SEO_DIST_DIR
  ? path.resolve(process.env.SEO_DIST_DIR)
  : path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");
const baseHtml = fs.readFileSync(indexPath, "utf8");

const defaultImage = "https://i.imgur.com/6Ll5PQL.jpeg";

const pages = [
  {
    outputPath: indexPath,
    title: "Red toy and miniature poodle kennel in Serbia | Von Apalusso",
    description:
      "Red toy and miniature poodle kennel in Serbia. Meet Von Apalusso poodles raised with health, temperament, and breed standards in focus.",
    canonical: "https://poodlesvonapalusso.com/",
    staticHtml: `
      <main>
        <section>
          <p>Von Apalusso kennel</p>
          <h1>Red toy and miniature poodle kennel in Serbia</h1>
          <p>Von Apalusso is a Serbian poodle kennel focused on red, fawn, toy and miniature poodles raised in home conditions.</p>
          <p>Our poodles live with us as family, with health, temperament, socialization and breed standards in focus.</p>
          <p>Explore our adult poodles, available puppies, upcoming litters and the story of the Von Apalusso kennel.</p>
          <nav aria-label="Main kennel pages">
            <a href="/about">About Von Apalusso</a>
            <a href="/puppies">Available poodle puppies</a>
          </nav>
        </section>
      </main>
    `,
  },
  {
    outputPath: path.join(distDir, "about", "index.html"),
    title: "About Von Apalusso poodle kennel in Serbia",
    description:
      "About Von Apalusso, a kennel in Novi Sad, Serbia, focused on red, fawn, toy and miniature poodles raised in home conditions.",
    canonical: "https://poodlesvonapalusso.com/about",
    alternates: [
      {
        hrefLang: "en",
        href: "https://poodlesvonapalusso.com/about",
      },
      {
        hrefLang: "sr",
        href: "https://poodlesvonapalusso.com/o-nama",
      },
      {
        hrefLang: "x-default",
        href: "https://poodlesvonapalusso.com/about",
      },
    ],
    staticHtml: `
      <main>
        <article>
          <h1>About Von Apalusso poodle kennel in Serbia</h1>
          <p>Von Apalusso is a kennel in Novi Sad, Serbia, with a long family tradition in dogs and dog shows. The kennel was founded in 1984, first through German Shepherd Dogs, and poodles have been part of our family since the early 1990s.</p>
          <p>Today we are focused on red, fawn, toy and miniature poodles. Our dogs are raised in home conditions, live with us as family, and are selected with temperament, health, structure and breed standards in mind.</p>
          <p>Our poodles take part in dog shows, have completed health checks, and their patellas are checked. We care about responsible breeding, good socialization and finding suitable homes for every puppy.</p>
          <p>On our site you can learn about our dogs, litters, available puppies and how to make a reservation.</p>
          <a href="/o-nama">O nama</a>
        </article>
      </main>
    `,
  },
  {
    outputPath: path.join(distDir, "o-nama", "index.html"),
    title: "O nama | Toy i patuljaste (mini) pudle Novi Sad | Von Apalusso",
    description:
      "Von Apalusso je porodična odgajivačnica toy i patuljastih pudli u Novom Sadu, sa tradicijom od 1984. godine.",
    canonical: "https://poodlesvonapalusso.com/o-nama",
    lang: "sr",
    alternates: [
      {
        hrefLang: "en",
        href: "https://poodlesvonapalusso.com/about",
      },
      {
        hrefLang: "sr",
        href: "https://poodlesvonapalusso.com/o-nama",
      },
      {
        hrefLang: "x-default",
        href: "https://poodlesvonapalusso.com/about",
      },
    ],
    staticHtml: `
      <main>
        <article>
          <h1>O nama - odgajivačnica pudli Von Apalusso u Srbiji</h1>
          <p>Von Apalusso je odgajivačnica u Novom Sadu, u Srbiji, sa dugom porodičnom tradicijom u odgoju i izlaganju pasa. Osnovana je 1984. godine, najpre sa nemačkim ovčarima, a pudle su deo naše porodice od početka devedesetih godina.</p>
          <p>Danas se bavimo prvenstveno crvenim i aprikot toy i patuljastim pudlama. Naši psi odrastaju u kućnim uslovima, žive sa nama kao deo porodice, a pri odabiru vodimo računa o temperamentu, zdravlju, građi i standardu rase.</p>
          <p>Naše pudle učestvuju na izložbama pasa, imaju obavljene zdravstvene preglede i proverene čašice kolena. Važni su nam odgovoran odgoj, dobra socijalizacija i pronalaženje odgovarajućeg doma za svako štene.</p>
          <p>Na našem sajtu možete pronaći informacije o našim psima, leglima, dostupnim štencima i načinu rezervacije.</p>
          <a href="/about">English</a>
        </article>
      </main>
    `,
  },
  {
    outputPath: path.join(distDir, "puppies", "index.html"),
    title: "Available red toy and miniature poodle puppies | Von Apalusso",
    description:
      "Meet toy and miniature poodle puppies from Von Apalusso kennel in Novi Sad, Serbia. Explore litters, parents, photos and availability.",
    canonical: "https://poodlesvonapalusso.com/puppies",
    alternates: [
      { hrefLang: "en", href: "https://poodlesvonapalusso.com/puppies" },
      { hrefLang: "sr", href: "https://poodlesvonapalusso.com/stenci-pudle" },
      { hrefLang: "x-default", href: "https://poodlesvonapalusso.com/puppies" },
    ],
    staticHtml: `
      <main>
        <section>
          <p>Von Apalusso puppies</p>
          <h1>Toy and miniature poodle puppies in Serbia</h1>
          <p>Follow current and upcoming litters from Von Apalusso kennel in Serbia.</p>
          <p>Our puppies are raised in home conditions and are prepared for families that understand the grooming, social and care needs of poodles.</p>
          <p>Contact us to ask about available puppies, planned litters, parent dogs, pedigree information and reservation details.</p>
        </section>
      </main>
    `,
  },
];

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const applySeo = (html, page) => {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonical = escapeHtml(page.canonical);
  const lang = escapeHtml(page.lang || "en");
  const staticHtml = page.staticHtml ? page.staticHtml.trim() : "";
  const alternateBlock = (page.alternates || [])
    .map(
      (alternate) =>
        `    <link rel="alternate" hreflang="${escapeHtml(
          alternate.hrefLang
        )}" href="${escapeHtml(alternate.href)}" />`
    )
    .join("\n");

  const seoBlock = [
    `    <link rel="canonical" href="${canonical}" />`,
    alternateBlock,
    `    <meta name="robots" content="${escapeHtml(page.robots || "index,follow")}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:image" content="${escapeHtml(page.image || defaultImage)}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${escapeHtml(page.image || defaultImage)}" />`,
    page.structuredData
      ? `    <script type="application/ld+json">${JSON.stringify(page.structuredData).replace(/</g, "\\u003c")}</script>`
      : "",
  ].join("\n");

  const withoutManagedSeo = html.replace(
    /\n\s*<link rel="canonical"[\s\S]*?<meta name="twitter:image"[^>]*>/,
    ""
  );

  return withoutManagedSeo
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />\n${seoBlock}`
    )
    .replace(
      /<div id="root"><\/div>/,
      staticHtml ? `<div id="root">\n${staticHtml}\n    </div>` : '<div id="root"></div>'
    );
};

pages.forEach((page) => {
  fs.mkdirSync(path.dirname(page.outputPath), { recursive: true });
  fs.writeFileSync(page.outputPath, applySeo(baseHtml, page));
});

require("./generate-dynamic-seo-pages.cjs")({ fs, path, distDir, baseHtml, pages, applySeo, escapeHtml })
  .catch((error) => { console.error(error); process.exitCode = 1; });
