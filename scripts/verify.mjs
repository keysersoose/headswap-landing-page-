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
requireMatch((html.match(/9-f\.webp/g) || []).length === 1, "Workspace must show one approved 9-f reference.");
requireMatch((html.match(/9-t\.webp/g) || []).length >= 2, "Workspace and inspector must use the corresponding 9-t target.");
requireMatch((html.match(/9-r\.webp/g) || []).length >= 2, "Workspace and inspector must use the corresponding 9-r result.");
requireMatch(html.includes("data-run-demo"), "SaaS generation preview control is missing.");
requireMatch((html.match(/<details>/g) || []).length === 3, "Expected three FAQ accordions.");
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

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Verified Headloom dark site: ${new Set(assetNames).size} referenced media assets.`);
