(function () {
  const nav = document.querySelector("nav.toc");
  const progress = document.getElementById("scrollProgress");
  const links = [...document.querySelectorAll("nav.toc a[href^='#']")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // Menu sempre fixo no topo (position: sticky no CSS); aqui só atualiza a
  // barra de progresso e a sombra de "elevado" quando a página rola.
  function onScroll() {
    const y = window.scrollY;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : "0%";
    nav.classList.toggle("nav-elevated", y > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Destaca o link da seção visível no momento (scroll-spy).
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.find((a) => a.getAttribute("href") === `#${entry.target.id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));
})();
