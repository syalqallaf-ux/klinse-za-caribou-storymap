const storySections = ["place", "decline", "recovery", "knowledge", "leadership", "tension", "future"];
const progressBar = document.querySelector(".reading-progress span");
const sectionLinks = new Map(
  [...document.querySelectorAll(".story-rail a")].map((link) => [link.getAttribute("href")?.slice(1), link]),
);

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sectionLinks.forEach((link, id) => {
        const active = id === visible.target.id;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-28% 0px -55% 0px", threshold: [0.05, 0.2, 0.5] },
  );
  storySections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
