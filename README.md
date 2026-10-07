# Headloom web

Source-controlled Headloom product site. It presents the real reference, target, and result relationship inside a black-and-white SaaS workspace, with matched image comparisons and a human review step.

## Run locally

```powershell
npm run build
npm run verify
npm run dev
```

## Editing pages

Pages are generated from `src/` by `scripts/build.mjs`; the shared header and footer live there too.
Edit `src/index.html` or `src/pages/*.html`, never the generated `index.html` / `*/index.html`, then run `npm run build` and commit both.

Values still to be supplied (cal.com demo link, registered office street address, contact email, LinkedIn URLs, legal "Last updated" date) live in `site.config.mjs`. Change them there and rebuild.

Open `http://127.0.0.1:4173`.

## Design system

- Obsidian `#050505`
- Carbon `#0B0B0B`
- Graphite `#1A1A1A`
- Silver `#A3A3A3`
- Bone `#F5F5F5`
- White `#FFFFFF`

The original lossless images are preserved in the dated backup outside this repository. `assets/media/` contains optimized WebP delivery files; regenerate them with `scripts/convert_images.py` when the ignored lossless source folder is present.
