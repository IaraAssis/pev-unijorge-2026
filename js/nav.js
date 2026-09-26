(function () {
  const nav = document.querySelector("nav.toc");
  const progress = document.getElementById("scrollProgress");
  const links = [...document.querySelectorAll("nav.toc a[href^='#']")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  let lastY = window.scrollY;
  let suppressHideUntil = 0;

  function onScroll() {
    const y = window.scrollY;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : "0%";

    // Esconde o menu ao rolar pra baixo, mostra ao rolar pra cima:
    // fica fora do caminho enquanto lê, mas nunca some de vez.
    if (Date.now() < suppressHideUntil) {
      nav.classList.remove("nav-hidden");
    } else if (y > lastY + 4 && y > 120) {
      nav.classList.add("nav-hidden");
    } else if (y < lastY - 4 || y < 120) {
      nav.classList.remove("nav-hidden");
    }
    nav.classList.toggle("nav-elevated", y > 8);
    lastY = y;
  }

  // Clicar num link do menu não pode fazer o próprio menu sumir no meio do
  // pulo: segura o menu visível por um instante pra dar tempo de clicar em
  // outro link em seguida, sem precisar rolar pra cima antes.
  links.forEach((a) => {
    a.addEventListener("click", () => {
      suppressHideUntil = Date.now() + 1000;
      nav.classList.remove("nav-hidden");
    });
  });

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
