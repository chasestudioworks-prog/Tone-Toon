// Year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Sticky header color change
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

// 3D tilt on Work cards (desktop)
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

// Draggable Poster Wall reel (kept)
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

// HERO: gentle parallax for splash PNGs so they feel alive
(() => {
  const container = document.querySelector(".hero--splash-real");
  if (!container) return;

  const s1 = container.querySelector(".splash.s1");
  const s2 = container.querySelector(".splash.s2");
  const s3 = container.querySelector(".splash.s3");
  const tube = container.querySelector(".tube");
  const overlay = container.querySelector(".overlay");

  let raf;
  const onMove = (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const nx = (e.clientX / window.innerWidth - 0.5);
      const ny = (e.clientY / window.innerHeight - 0.5);

      if (s1) s1.style.transform = `translateX(${nx*10}px) translateY(${ny*6}px) rotate(-2deg)`;
      if (s2) s2.style.transform = `translateX(${nx*16}px) translateY(${ny*10}px) rotate(18deg)`;
      if (s3) s3.style.transform = `translateX(${nx*12}px) translateY(${ny*12}px) rotate(-12deg)`;
      if (overlay) overlay.style.transform = `translateX(calc(-50% + ${nx*12}px)) translateY(${ny*6}px) rotate(-4deg)`;
      if (tube) tube.style.transform = `rotate(${20 + nx*6}deg) translate(${nx*20}px, ${-ny*8}px)`;

      raf = null;
    });
  };
  window.addEventListener("mousemove", onMove, { passive: true });
})();
