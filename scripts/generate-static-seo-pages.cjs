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
  },
  {
    outputPath: path.join(distDir, "about", "index.html"),
    title: "About Von Apalusso poodle kennel in Serbia",
    description:
      "About Von Apalusso, a Serbian kennel focused on red, fawn, toy and miniature poodles raised in home conditions.",
    canonical: "https://poodlesvonapalusso.com/about",
  },
  {
    outputPath: path.join(distDir, "puppies", "index.html"),
    title: "Available red toy and miniature poodle puppies | Von Apalusso",
    description:
      "Available and upcoming red toy and miniature poodle puppies from Von Apalusso kennel in Serbia.",
    canonical: "https://poodlesvonapalusso.com/puppies",
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

  const seoBlock = [
    `    <link rel="canonical" href="${canonical}" />`,
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
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />\n${seoBlock}`
    );
};

pages.forEach((page) => {
  fs.mkdirSync(path.dirname(page.outputPath), { recursive: true });
  fs.writeFileSync(page.outputPath, applySeo(baseHtml, page));
});
