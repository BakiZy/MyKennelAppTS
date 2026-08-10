const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
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
      "About Von Apalusso, a Serbian kennel focused on red, fawn, toy and miniature poodles raised in home conditions.",
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
          <p>Von Apalusso is a Serbian kennel with a long family tradition in dogs and dog shows. The kennel was founded in 1984, first through German Shepherd Dogs, and poodles have been part of our family since the early 1990s.</p>
          <p>Today we are focused on red, fawn, toy and miniature poodles. Our dogs are raised in home conditions, live with us as family, and are selected with temperament, health, structure and breed standards in mind.</p>
          <p>Our poodles take part in dog shows, have completed health checks, and their patellas are checked. We care about responsible breeding, good socialization and finding suitable homes for every puppy.</p>
          <section lang="sr">
            <h2>Toy, patuljaste i mini pudle u Srbiji</h2>
            <p>Von Apalusso je porodična odgajivačnica pudli u Srbiji, sa tradicijom dugom više od 30 godina. Nalazimo se u Novom Sadu i bavimo se toy pudlama, patuljastim pudlama i mini pudlama, posebno crvenim i aprikot linijama.</p>
            <p>Naše pudle odrastaju u kućnim uslovima i deo su porodice. Posebnu pažnju posvećujemo temperamentu, socijalizaciji, pedigreu, standardu rase, genetskim testovima i proveri patela.</p>
            <p>Ako tražite štene toy pudle, patuljastu pudlu, mini pudlu ili odgovornu odgajivačnicu pudli u Novom Sadu i Srbiji, na našem sajtu možete pronaći informacije o psima, leglima, dostupnim štencima i načinu rezervacije.</p>
          </section>
        </article>
      </main>
    `,
  },
  {
    outputPath: path.join(distDir, "o-nama", "index.html"),
    title: "O nama | Toy, patuljaste i mini pudle Novi Sad | Von Apalusso",
    description:
      "Von Apalusso je porodicna odgajivacnica toy, patuljastih i mini pudli u Novom Sadu, Srbija, sa vise od 30 godina iskustva.",
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
          <h1>O nama - Von Apalusso odgajivacnica pudli</h1>
          <p>Von Apalusso je porodicna odgajivacnica pudli u Novom Sadu, Srbija. Tradicija nase odgajivacnice traje vise od 30 godina, od prvih izlozbi pasa i nemackih ovcara do danasnjeg rada sa toy, patuljastim i mini pudlama.</p>
          <p>Bavimo se pre svega crvenim i aprikot pudlama koje odrastaju u kucnim uslovima. Nasi psi su deo porodice, naviknuti su na ljude, svakodnevni zivot u domu i pazljivo odabranu socijalizaciju.</p>
          <p>U odgoju nam nisu bitni samo izgled i boja, vec temperament, zdravlje, pedigre, standard rase, genetski testovi i provera patela. Zelimo da svako stene pudle ode u dom koji razume potrebe ove rase, negu dlake i odgovornost koju nosi kupovina psa.</p>
          <p>Ako trazite toy pudlu, patuljastu pudlu, mini pudlu, stene pudle ili odgovornu odgajivacnicu pudli u Novom Sadu i Srbiji, na nasem sajtu mozete pronaci informacije o nasim psima, leglima, dostupnim stencima i nacinu rezervacije.</p>
        </article>
      </main>
    `,
  },
  {
    outputPath: path.join(distDir, "puppies", "index.html"),
    title: "Available red toy and miniature poodle puppies | Von Apalusso",
    description:
      "Available and upcoming red toy and miniature poodle puppies from Von Apalusso kennel in Serbia.",
    canonical: "https://poodlesvonapalusso.com/puppies",
    staticHtml: `
      <main>
        <section>
          <p>Von Apalusso puppies</p>
          <h1>Available red toy and miniature poodle puppies</h1>
          <p>Follow current and upcoming litters from Von Apalusso kennel in Serbia.</p>
          <p>Our puppies are raised in home conditions and are prepared for families that understand the grooming, social and care needs of poodles.</p>
          <p>Contact us to ask about available puppies, planned litters, parent dogs, pedigree information and reservation details.</p>
        </section>
      </main>
    `,
  },
];

const escapeHtml = (value) =>
  value
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
    '    <meta name="robots" content="index,follow" />',
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:image" content="${defaultImage}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${defaultImage}" />`,
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
