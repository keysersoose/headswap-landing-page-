// Builds the static site from src/ and site.config.mjs.
// Output: index.html, about/index.html, privacy/index.html, terms/index.html,
// responsible-use/index.html and llms.txt at the repo root. Commit the output; Vercel serves it as-is.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../site.config.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const read = (path) => readFileSync(resolve(root, path), "utf8");

const escape = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CITY = "Chennai, Tamil Nadu, India";
const office = config.registeredAddress.trim()
  ? `${config.registeredAddress.trim()}, Thoraipakkam, ${CITY}`
  : CITY;
const email = config.email;

const DEMO_URL = config.demoUrl.trim() || `mailto:${email}?subject=Headloom%20demo`;
const demoIsBooking = Boolean(config.demoUrl.trim());
const demoAttrs = `href="${escape(DEMO_URL)}"${demoIsBooking ? ' target="_blank" rel="noopener noreferrer"' : ""}`;

const linkedinLink = (url, label) =>
  url ? ` <a class="inline-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : "";

const founderEmail = (address) =>
  address ? ` <a class="inline-link" href="mailto:${escape(address)}">${escape(address)}</a>` : "";

const clients = config.clients.filter(Boolean);
const clientList =
  clients.length > 1 ? `${clients.slice(0, -1).join(", ")} and ${clients.at(-1)}` : clients[0] || "";
const volume = (config.monthlyVolume || "").trim();
const proofParagraph = clientList
  ? `<p class="company-copy company-proof">Headloom is not starting from zero. The head-swap engine inside the workspace already runs in production on fashion catalogue work for ${escape(clientList)}${volume ? `, at ${escape(volume)} approved images a month` : ""}, with human review on every frame.</p>`
  : "";
const proofFact = [
  clientList ? `<div><dt>Delivered for</dt><dd>${escape(clientList)}</dd></div>` : "",
  volume ? `<div><dt>Production volume</dt><dd>${escape(volume[0].toUpperCase() + volume.slice(1))} approved catalogue images a month</dd></div>` : "",
].filter(Boolean).join("\n            ");
const PROOF_CLIENTS_PLAIN = clientList || "confidential fashion catalogue programmes";
const PROOF_VOLUME_PLAIN = volume || "production";

const header = (home) => {
  const p = home ? "" : "/";
  return `<header class="site-header">
      <a class="brand" href="${home ? "#hero" : "/"}" aria-label="Headloom home">
        <svg class="brand-mark" viewBox="0 0 28 44" aria-hidden="true">
          <path d="M4 2v40M24 2v40M4 13h20M4 31h20" />
          <path d="M14 7v30" stroke-dasharray="2 4" />
        </svg>
        <span>Headloom</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="${p}#claude">Claude</a>
        <a href="${p}#product">Product</a>
        <a href="${p}#features">Results</a>
        <a href="${p}#roadmap">Roadmap</a>
        <a href="/about">Company</a>
      </nav>
      <a class="button button-solid button-small" {{DEMO_ATTRS}}>{{DEMO_LABEL}}</a>
    </header>`;
};

const footer = `<footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <p class="footer-brand">Headloom</p>
          <p>AI head-swap and image-quality tools for fashion and catalogue production.</p>
        </div>
        <nav class="footer-col" aria-label="Footer">
          <p class="footer-label">Links</p>
          <ul>
            <li><a href="/#product">Product</a></li>
            <li><a href="/about">Company</a></li>
            <li><a href="/#pricing">Pricing</a></li>
            <li><a href="/responsible-use">Responsible use</a></li>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
          </ul>
        </nav>
        <div class="footer-col">
          <p class="footer-label">Contact</p>
          <ul>
            <li><a href="mailto:{{EMAIL}}">{{EMAIL}}</a></li>
            <li>{{OFFICE}}</li>${
              config.linkedin.company
                ? `\n            <li><a href="${escape(config.linkedin.company)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>`
                : ""
            }
          </ul>
        </div>
      </div>
      <p class="footer-legal">© 2026 Headloom · headloom.com · {{OFFICE}}</p>
    </footer>`;

const tokens = {
  HEADER_HOME: header(true),
  HEADER: header(false),
  FOOTER: footer,
  DEMO_ATTRS: demoAttrs,
  DEMO_LABEL: demoIsBooking ? "Book a demo" : "Request a demo",
  DEMO_LABEL_LIVE: demoIsBooking ? "Book a live demo" : "Request a demo",
  EMAIL: escape(email),
  OFFICE: escape(office),
  OFFICE_PLAIN: office,
  PROOF_PARAGRAPH: proofParagraph,
  PROOF_FACT: proofFact,
  PROOF_CLIENTS: PROOF_CLIENTS_PLAIN,
  PROOF_VOLUME: PROOF_VOLUME_PLAIN,
  EMAIL_PLAIN: email,
  LAST_UPDATED: escape(config.legalLastUpdated),
  LINKEDIN_VISHAAL: linkedinLink(config.linkedin.vishaal, "LinkedIn"),
  EMAIL_VISHAAL: founderEmail(config.founderEmail.vishaal),
  ANSWER_BUILDING: escape(config.claudeAnswers.building),
  ANSWER_BUILDING_PLAIN: config.claudeAnswers.building,
};

// Tokens can contain other tokens (header -> demo link), so render until stable.
const render = (template) => {
  let out = template;
  for (let pass = 0; pass < 3; pass += 1) {
    out = out.replace(/\{\{([A-Z_]+)\}\}/g, (match, name) => {
      if (!(name in tokens)) throw new Error(`Unknown template token ${match}`);
      return tokens[name];
    });
  }
  return out;
};

const subpage = ({ slug, title, description, body }) => `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#050505" />
    <title>${title}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="https://headloom.com/${slug}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="https://headloom.com/${slug}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://headloom.com/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>

    {{HEADER}}

    <main id="main" class="page-main section-shell">
${body.trimEnd()}
    </main>

    {{FOOTER}}
  </body>
</html>
`;

const pages = [
  {
    slug: "about",
    title: "About | Headloom",
    description: "Headloom makes AI fashion images catalogue-ready, using Claude to find and retouch garment artifacts. Built in Chennai, India.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy | Headloom",
    description: "How Headloom collects, uses and protects personal data and face images.",
  },
  {
    slug: "terms",
    title: "Terms of Use | Headloom",
    description: "The terms that govern use of headloom.com and Headloom services.",
  },
  {
    slug: "responsible-use",
    title: "Responsible use | Headloom",
    description: "How Headloom handles consent, human review and customer images in AI head-swap work.",
  },
];

const write = (path, html) => {
  const file = resolve(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`built ${path}`);
};

write("index.html", render(read("src/index.html")));
// Plain-text summary for AI assistants and crawlers (llmstxt.org format).
write("llms.txt", render(read("src/llms.txt")));
for (const page of pages) {
  write(`${page.slug}/index.html`, render(subpage({ ...page, body: read(`src/pages/${page.slug}.html`) })));
}
