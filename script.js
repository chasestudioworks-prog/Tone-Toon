// ================================
// Tone & Toon — Full Site Script
// ================================

// 1) Year in footer
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// 2) Toggle "at-top" class for header styling
const setTopClass = () => {
  if (window.scrollY < 10) document.body.classList.add("at-top");
  else document.body.classList.remove("at-top");
};
setTopClass();
window.addEventListener("scroll", setTopClass, { passive: true });

// 3) Reveal-on-scroll
(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll("section, .card").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
})();

// 4) Gentle tilt on Work cards (desktop only)
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
      fig.style.transform = `rotateX(${(-dy * maxDeg).toFixed(2)}deg) rotateY(${(dx * maxDeg).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => { fig.style.transform = ""; });
  });
})();

// 5) Draggable Poster Wall (marquee version)
(() => {
  const marquee = document.querySelector(".marquee");
  const track = document.querySelector(".marquee .track");
  if (!marquee || !track) return;

  let dragging = false;
  let startX = 0;
  let baseOffset = 0;

  const getInlineTx = () => {
    const m = /translateX\(([-\d.]+)px\)/.exec(track.style.transform || "");
    return m ? parseFloat(m[1]) : 0;
  };

  const start = (e) => {
    dragging = true;
    track.style.animationPlayState = "paused";
    startX = e.pageX || (e.touches && e.touches[0]?.pageX) || 0;
    baseOffset = getInlineTx();
    marquee.classList.add("dragging");
  };

  const move = (e) => {
    if (!dragging) return;
    const x = e.pageX || (e.touches && e.touches[0]?.pageX) || 0;
    const dx = x - startX;
    track.style.transform = `translateX(${baseOffset + dx}px)`;
  };

  const end = () => {
    if (!dragging) return;
    dragging = false;
    track.style.transform = "";
    track.style.animationPlayState = "running";
    marquee.classList.remove("dragging");
  };

  marquee.addEventListener("mousedown", start);
  marquee.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  marquee.addEventListener("touchstart", start, { passive: true });
  marquee.addEventListener("touchmove", move, { passive: true });
  marquee.addEventListener("touchend", end);
})();
