document.querySelectorAll("[data-split-card]").forEach((card) => {
  const control = card.querySelector(".split-control");
  const update = () => card.style.setProperty("--split", `${control.value}%`);
  control.addEventListener("input", update);
  update();
});

const inspection = document.querySelector("[data-inspection]");
const scanner = inspection.querySelector(".scanner");
scanner.style.backgroundImage = 'url("/assets/media/9-r.webp")';

const workspace = document.querySelector(".workspace");
const runButton = document.querySelector("[data-run-demo]");
const runStatus = document.querySelector("[data-run-status]");
const outputState = document.querySelector("[data-output-state]");
const generationStep = document.querySelector("[data-generation-step]");
const reviewStep = document.querySelector("[data-review-step]");

runButton.addEventListener("click", () => {
  if (workspace.classList.contains("is-processing")) return;

  workspace.classList.remove("is-complete");
  workspace.classList.add("is-processing");
  generationStep.classList.add("is-active");
  reviewStep.classList.remove("is-complete");
  generationStep.querySelector("small").textContent = "Running";
  reviewStep.querySelector("small").textContent = "Waiting";
  runStatus.textContent = "Generating";
  outputState.textContent = "Rendering output";
  runButton.disabled = true;

  window.setTimeout(() => {
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
  }, 1300);
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
