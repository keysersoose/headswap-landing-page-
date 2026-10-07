document.querySelectorAll("[data-split-card]").forEach((card) => {
  const control = card.querySelector(".split-control");
  const update = () => card.style.setProperty("--split", `${control.value}%`);
  control.addEventListener("input", update);
  update();
});

const LOOKS = [
  { id: "9", label: "SS26 catalogue / Look 09" },
  { id: "6", label: "SS26 catalogue / Look 06" },
  { id: "5", label: "SS26 catalogue / Look 05" },
  { id: "7", label: "SS26 catalogue / Look 07" },
  { id: "8", label: "SS26 catalogue / Look 08" },
  { id: "3", label: "SS26 catalogue / Look 03" },
  { id: "4", label: "SS26 catalogue / Look 04" },
  { id: "10", label: "SS26 catalogue / Look 10" },
  { id: "11", label: "SS26 catalogue / Look 11" },
];

const media = (id, kind) => `/assets/media/${id}-${kind}.webp`;

const workspace = document.querySelector("[data-workspace]");
const runButton = document.querySelector("[data-run-demo]");
const runStatus = document.querySelector("[data-run-status]");
const outputState = document.querySelector("[data-output-state]");
const generationStep = document.querySelector("[data-generation-step]");
const reviewStep = document.querySelector("[data-review-step]");
const lookLabel = document.querySelector("[data-look-label]");
const identityImg = document.querySelector("[data-identity-img]");
const targetImg = document.querySelector("[data-target-img]");
const outputImg = document.querySelector("[data-output-img]");
const outputPlaceholder = document.querySelector("[data-output-placeholder]");
const lookPicker = document.querySelector("[data-look-picker]");
const inspection = document.querySelector("[data-inspection]");
const scanner = inspection.querySelector(".scanner");
const inspectionBefore = inspection.querySelector(".inspection-before");
const inspectionResult = document.querySelector("#inspection-result");

let activeLook = LOOKS[0];
let generateTimer = null;

function resetGenerateState() {
  if (generateTimer) {
    window.clearTimeout(generateTimer);
    generateTimer = null;
  }
  workspace.classList.remove("is-processing", "is-complete");
  generationStep.classList.remove("is-active", "is-complete");
  reviewStep.classList.remove("is-active", "is-complete");
  generationStep.querySelector("small").textContent = "Not started";
  reviewStep.querySelector("small").textContent = "Waiting";
  runStatus.textContent = "Ready to generate";
  outputState.textContent = "Waiting to generate";
  runButton.textContent = "Generate preview";
  runButton.disabled = false;
  outputImg.hidden = true;
  outputImg.style.display = "none";
  outputPlaceholder.hidden = false;
  outputPlaceholder.setAttribute("aria-hidden", "false");
  outputPlaceholder.querySelector("span").textContent = "Output locked";
  outputPlaceholder.querySelector("strong").textContent = "Click Generate preview";
}

function applyLook(look, { preserveComplete = false } = {}) {
  activeLook = look;
  lookLabel.textContent = look.label;
  identityImg.src = media(look.id, "f");
  targetImg.src = media(look.id, "t");
  outputImg.src = media(look.id, "r");
  outputImg.alt = `Headloom result for look ${look.id}`;
  identityImg.alt = `Approved reference identity for look ${look.id}`;
  targetImg.alt = `Target image for look ${look.id}`;
  if (inspectionBefore) inspectionBefore.src = media(look.id, "t");
  if (inspectionResult) inspectionResult.src = media(look.id, "r");
  scanner.style.backgroundImage = `url("${media(look.id, "r")}")`;
  lookPicker.querySelectorAll(".look-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.look === look.id);
  });
  if (!preserveComplete) resetGenerateState();
}

lookPicker.innerHTML = "";
LOOKS.forEach((look) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "look-chip";
  button.dataset.look = look.id;
  button.setAttribute("aria-label", `Load look ${look.id}`);
  button.innerHTML = `<img src="${media(look.id, "f")}" alt="" /><span>${look.id}</span>`;
  button.addEventListener("click", () => applyLook(look));
  lookPicker.appendChild(button);
});

applyLook(activeLook);

runButton.addEventListener("click", () => {
  if (workspace.classList.contains("is-processing")) return;

  workspace.classList.remove("is-complete");
  workspace.classList.add("is-processing");
  generationStep.classList.add("is-active");
  generationStep.classList.remove("is-complete");
  reviewStep.classList.remove("is-complete", "is-active");
  generationStep.querySelector("small").textContent = "Running";
  reviewStep.querySelector("small").textContent = "Waiting";
  runStatus.textContent = "Generating";
  outputState.textContent = "Rendering output";
  runButton.disabled = true;
  outputImg.hidden = true;
  outputImg.style.display = "none";
  outputPlaceholder.hidden = false;
  outputPlaceholder.querySelector("span").textContent = "Generating";
  outputPlaceholder.querySelector("strong").textContent = "Building review-ready frame";

  generateTimer = window.setTimeout(() => {
    workspace.classList.remove("is-processing");
    workspace.classList.add("is-complete");
    generationStep.classList.remove("is-active");
    generationStep.classList.add("is-complete");
    reviewStep.classList.add("is-active");
    generationStep.querySelector("small").textContent = "Complete";
    reviewStep.querySelector("small").textContent = "Ready";
    runStatus.textContent = "Ready for review";
    outputState.textContent = "Review ready";
    runButton.textContent = "Generate again";
    runButton.disabled = false;
    outputPlaceholder.setAttribute("aria-hidden", "true");
    outputImg.hidden = false;
    outputImg.style.display = "block";
  }, 1400);
});

const inspectionRange = inspection.querySelector(".inspection-range");
inspectionRange.addEventListener("input", () => {
  inspection.style.setProperty("--compare", `${inspectionRange.value}%`);
});

const modeButtons = [...document.querySelectorAll("[data-mode]")];
const compareHelp = document.querySelector("[data-compare-help]");
const labHelp = document.querySelector("[data-lab-help]");

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isLab = button.dataset.mode === "lab";
    inspection.classList.toggle("lab-active", isLab);
    modeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    compareHelp.hidden = isLab;
    labHelp.hidden = !isLab;
  });
});

inspection.addEventListener("pointermove", (event) => {
  if (!inspection.classList.contains("lab-active")) return;
  const bounds = inspection.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
  const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
  inspection.style.setProperty("--scan-x", `${x}%`);
  inspection.style.setProperty("--scan-y", `${y}%`);
  scanner.style.backgroundPosition = `${x}% ${y}%`;
});

document.querySelectorAll(".matrix-card").forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => {
    const revealed = !card.classList.contains("is-revealed");
    card.classList.toggle("is-revealed", revealed);
    card.setAttribute("aria-pressed", String(revealed));
  });
});
