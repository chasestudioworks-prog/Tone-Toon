// Year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Toggle lime header at top vs cream after scroll
const setTopClass = () => {
  if (window.scrollY < 10) document.body.classList.add("at-top");
  else document.body.classList.remove("at-top");
};
setTopClass();
window.addEventListener("scroll", setTopClass, { passive: true });

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll("section, .card").forEach((el) => {
  el.classList.add("reveal");
  io.observe(el);
});

// Gentle tilt on Work cards (desktop only)
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

// Draggable Poster Wall
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

// Trigger the hero sequence once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // one frame later so CSS initial state is painted first
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
});
