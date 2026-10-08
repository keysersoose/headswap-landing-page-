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

  // Claude Startups program answers. "building" is shown word for word on the homepage, /about
  // and llms.txt. "support" is form-only: the site never says what Headloom wants from Anthropic,
  // and never shows the form questions.
  claudeAnswers: {
    building: "AI image models often get the garment wrong: warped prints, broken buttons, changed collars, fake-looking fabric. We're building agentic refinement on Claude to fix this. Quality control in Headloom is done by Claude agents, and Claude is the only AI agent we use. Claude compares each AI image with the real product shot, finds these artifacts, and runs the retouch through our tools. A person approves every final image. Our head-swap engine already runs on Louis Philippe catalogue work.",
    support: "We want support from Anthropic in three areas. API credits, so our Claude agents can run quality control and agentic refinement on full catalogue volume in paid pilots, where every image takes several vision calls. Technical guidance on Claude's vision for fine garment detail like prints, stitching and logos, and on tool use so the agents drive our retouching tools reliably. And early access to new vision and agent features, to move from pilot to production faster.",
  },

  // Shown as "Last updated" on /privacy and /terms. Set to the deploy date.
  legalLastUpdated: "7 October 2026",
};
