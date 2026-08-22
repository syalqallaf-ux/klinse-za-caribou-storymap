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

document.querySelectorAll(".waffle").forEach((waffle) => {
  const filled = Number(waffle.dataset.fill || 0);
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 100; index += 1) {
    const cell = document.createElement("span");
    if (index < filled) cell.className = "filled";
    cell.setAttribute("aria-hidden", "true");
    fragment.appendChild(cell);
  }
  waffle.appendChild(fragment);
});

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
