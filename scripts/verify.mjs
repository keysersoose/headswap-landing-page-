import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "styles.css"), "utf8");
const js = readFileSync(resolve(root, "script.js"), "utf8");
const failures = [];

const requireMatch = (condition, message) => { if (!condition) failures.push(message); };
requireMatch(html.includes('class="dark"'), "Dark mode must be the document default.");
requireMatch(html.includes('id="features"'), "Explore target #features is missing.");
requireMatch(html.includes('id="product"'), "Product workspace target #product is missing.");
requireMatch(html.includes('id="workflow"'), "SaaS workflow target #workflow is missing.");
requireMatch(html.includes('id="demo"'), "Demo target #demo is missing.");
requireMatch(!html.includes('href="/demo"'), "Internal demo links must not target the old 404 route.");
requireMatch(!html.includes("data-result="), "The mismatched result selector gallery must stay removed.");
requireMatch((html.match(/data-identity-img src="\/assets\/media\/9-f\.webp"/g) || []).length === 1, "Workspace must show one approved 9-f reference.");
requireMatch((html.match(/9-t\.webp/g) || []).length >= 2, "Workspace and inspector must use the corresponding 9-t target.");
requireMatch((html.match(/9-r\.webp/g) || []).length >= 2, "Workspace and inspector must use the corresponding 9-r result.");
requireMatch(html.includes("data-run-demo"), "SaaS generation preview control is missing.");
requireMatch((html.match(/<details>/g) || []).length === 6, "Expected six closed FAQ accordions.");
requireMatch(!html.includes("Is this only a landing page?"), "The 'only a landing page' FAQ must stay removed.");
requireMatch(!html.includes("Landing page + working product"), "The old Status line must stay removed.");
requireMatch(html.includes('id="pricing"'), "Pricing target #pricing is missing.");
requireMatch(html.indexOf('id="faq"') < html.indexOf('id="pricing"') && html.indexOf('id="pricing"') < html.indexOf('class="cta-section'), "Pricing must sit between the FAQ and the final call to action.");
requireMatch(css.includes("--obsidian: #050505"), "Obsidian design token is missing.");
requireMatch(css.includes("--white: #ffffff"), "White design token is missing.");
requireMatch(!/212\s*,\s*175\s*,\s*55|#d4af37|45 80% 65%/i.test(css), "Gold styling remains in the recovered design.");
requireMatch(js.includes("aria-pressed"), "Mode and reveal controls must expose selection state.");
requireMatch(js.includes("Ready for review"), "Generation preview must finish in a review state.");
requireMatch(!html.includes("headswap.ai"), "Headloom calls to action must use the Headloom domain.");

const assetNames = [...html.matchAll(/\/assets\/media\/([^"')]+)/g)].map((match) => match[1]);
for (const name of new Set(assetNames)) {
  const file = resolve(root, "assets", "media", name);
  requireMatch(existsSync(file) && statSync(file).size > 0, `Missing media asset: ${name}`);
}

// Every built page: shared footer, no link to the old cal.com booking page, no visible placeholders, internal links resolve.
const pages = ["index.html", "about/index.html", "privacy/index.html", "terms/index.html", "responsible-use/index.html"];
const pageExists = (path) => path === "/" || existsSync(resolve(root, `.${path}`, "index.html")) || existsSync(resolve(root, `.${path}`));
for (const page of pages) {
  const file = resolve(root, page);
  if (!existsSync(file)) { failures.push(`Missing built page: ${page} (run npm run build)`); continue; }
  const source = readFileSync(file, "utf8");
  const visible = source.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
  requireMatch(source.includes('class="site-footer"') && source.includes('class="footer-legal"'), `${page}: site footer is missing.`);
  requireMatch(source.includes('class="site-header"'), `${page}: site header is missing.`);
  requireMatch(!/Latent\s*Mind|LLPIN/i.test(source), `${page}: must not name the legal entity.`);
  requireMatch(!/suraj/i.test(source), `${page}: must not name Suraj.`);
  requireMatch(!source.includes("cal.com/suraj-"), `${page}: links to the old cal.com booking page.`);
  requireMatch(!/\{\{|\[(FULL|HEADLOOM|DATE|LinkedIn)/.test(visible), `${page}: unfilled placeholder text is visible.`);
  for (const [, href] of source.matchAll(/href="(\/[^"#?]*)/g)) {
    requireMatch(pageExists(href), `${page}: internal link ${href} does not resolve.`);
  }
}

const llms = existsSync(resolve(root, "llms.txt")) ? readFileSync(resolve(root, "llms.txt"), "utf8") : "";
requireMatch(llms.startsWith("# Headloom"), "llms.txt is missing or malformed (run npm run build).");
requireMatch(!/\{\{|Latent\s*Mind|LLPIN|suraj|8m\s*studio/i.test(llms), "llms.txt has an unfilled token or names the legal entity.");

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Verified Headloom dark site: ${new Set(assetNames).size} referenced media assets.`);
