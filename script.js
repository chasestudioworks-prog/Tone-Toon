// Year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Sticky header
document.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  if (window.scrollY > 10) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

// Reveal-on-scroll
const revealItems = document.querySelectorAll("section, .card");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealItems.forEach((el) => { el.classList.add("reveal"); io.observe(el); });

// Tilt on Work cards (desktop)
(() => {
  const figs = document.querySelectorAll("#work .gallery figure");
  const maxDeg = 6;
  figs.forEach((fig) => {
    const card = fig.closest(".card") || fig;
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = fig.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      fig.style.transform = `rotateX(${(-dy*maxDeg).toFixed(2)}deg) rotateY(${(dx*maxDeg).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => { fig.style.transform = ""; });
  });
})();

// Draggable Poster Wall reel
(() => {
  const reel = document.querySelector(".poster-reel");
  if (!reel) return;

  let isDown = false, startX = 0, scrollLeft = 0;
  const start = (e) => { isDown = true; startX = (e.pageX || e.touches?.[0]?.pageX || 0); scrollLeft = reel.scrollLeft; };
  const move  = (e) => { if (!isDown) return; const x = (e.pageX || e.touches?.[0]?.pageX || 0); reel.scrollLeft = scrollLeft - (x - startX); };
  const end   = () => { isDown = false; };

  reel.addEventListener("mousedown", start);
  reel.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  reel.addEventListener("touchstart", start, { passive:true });
  reel.addEventListener("touchmove", move, { passive:true });
  reel.addEventListener("touchend", end);
})();

// Hero parallax for paint PNGs (safe if images absent)
(() => {
  const hero = document.querySelector(".hero--splash-real");
  if (!hero) return;
  const s1 = hero.querySelector(".splash.s1");
  const s2 = hero.querySelector(".splash.s2");
  const s3 = hero.querySelector(".splash.s3");
  const tube = hero.querySelector(".tube");
  const overlay = hero.querySelector(".overlay");
  let raf;
  window.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const nx = (e.clientX / innerWidth - 0.5);
      const ny = (e.clientY / innerHeight - 0.5);
      if (s1) s1.style.transform = `translateX(calc(-50% + ${nx*14}px)) translateY(${ny*8}px) rotate(-2deg)`;
      if (s2) s2.style.transform = `translate(${nx*24}px, ${ny*16}px) rotate(18deg)`;
      if (s3) s3.style.transform = `translate(${nx*18}px, ${ny*18}px) rotate(-12deg)`;
      if (overlay) overlay.style.transform = `translateX(calc(-50% + ${nx*16}px)) translateY(${ny*10}px) rotate(-4deg)`;
      if (tube) tube.style.transform = `rotate(${20 + nx*8}deg) translate(${nx*22}px, ${-ny*10}px)`;
      raf = null;
    });
  }, { passive: true });
})();
