// Single place for site-wide values that are still to be confirmed.
// Edit here, then run `npm run build` to regenerate every page.

export default {
  // Headloom cal.com booking link, e.g. "https://cal.com/headloom/demo".
  // Leave empty to fall back to an email link and the label "Request a demo".
  demoUrl: "",

  // Company street address, WITHOUT the
  // "Thoraipakkam, Chennai, Tamil Nadu, India" part (that is added automatically).
  // While empty, the site shows only "Chennai, Tamil Nadu, India".
  registeredAddress: "",

  // Public contact address used everywhere on the site.
  email: "vishaal@headloom.com",

  // Production track record. monthlyVolume is the approved public figure; leave empty to hide.
  monthlyVolume: "around 8,000",

  // Companies the head-swap technology has already been delivered for in production.
  // Only list names approved for public use. Empty list = proof lines hidden.
  clients: ["Louis Philippe"],

  // Founders' own email addresses, shown on their team cards. Empty = not shown.
  founderEmail: {
    vishaal: "vishaal@headloom.com",
  },

  // LinkedIn URLs. Any left empty are simply not shown.
  linkedin: {
    company: "",
    vishaal: "https://www.linkedin.com/in/vishaal-r",
  },

  // Shown as "Last updated" on /privacy and /terms. Set to the deploy date.
  legalLastUpdated: "7 October 2026",
};
