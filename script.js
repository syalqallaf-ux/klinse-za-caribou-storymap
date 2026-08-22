const sectionIds = ["place", "evidence", "leadership", "knowledge", "argument", "future"];
const progress = document.querySelector(".reading-progress span");
const railLinks = new Map(
  [...document.querySelectorAll(".story-rail a")].map((link) => [
    link.getAttribute("href").slice(1),
    link,
  ]),
);

function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const amount = available > 0 ? (window.scrollY / available) * 100 : 0;
  if (progress) progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
}

const protectionMatrix = document.getElementById("protection-matrix");

if (protectionMatrix) {
  const cells = [];
  const fragment = document.createDocumentFragment();
  const percent = document.getElementById("protection-percent");
  const stage = document.getElementById("protection-stage");
  const description = document.getElementById("protection-description");
  const readout = document.querySelector(".protection-readout");
  const protectedLegend = document.querySelector(".legend-protected");
  const buttons = [...document.querySelectorAll("[data-protection-state]")];

  const states = {
    before: {
      fill: 2,
      percent: "1.8%",
      stage: "Before the 2020 agreement",
      description: "Only a small fraction of the Klinse-Za range was protected.",
      aria: "Approximately 1.8 percent of the Klinse-Za range was protected before the agreement.",
    },
    after: {
      fill: 85,
      percent: ">85%",
      stage: "After the 2020 agreement",
      description: "Protection measures cover most of the Klinse-Za range.",
      aria: "More than 85 percent of the Klinse-Za range is covered by protection measures after the agreement.",
    },
  };

  for (let index = 0; index < 100; index += 1) {
    const cell = document.createElement("span");
    cell.setAttribute("aria-hidden", "true");
    cells.push(cell);
    fragment.appendChild(cell);
  }
  protectionMatrix.appendChild(fragment);

  function showProtectionState(key) {
    const selected = states[key];
    cells.forEach((cell, index) => {
      cell.classList.toggle("filled", index < selected.fill);
    });
    protectionMatrix.classList.toggle("before", key === "before");
    protectionMatrix.classList.toggle("after", key === "after");
    protectionMatrix.setAttribute("aria-label", selected.aria);
    readout?.classList.toggle("before", key === "before");
    if (protectedLegend) {
      protectedLegend.style.background = key === "before" ? "var(--rust)" : "var(--forest-3)";
    }
    if (percent) percent.textContent = selected.percent;
    if (stage) stage.textContent = selected.stage;
    if (description) description.textContent = selected.description;
    buttons.forEach((button) => {
      const active = button.dataset.protectionState === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => showProtectionState(button.dataset.protectionState));
  });

  showProtectionState("after");
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      railLinks.forEach((link, id) => {
        const active = id === visible.target.id;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-28% 0px -58% 0px", threshold: [0.05, 0.2, 0.45] },
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
