// Tone & Toon site script

// Auto-update the copyright year
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// Touch "hover" support for mobile (gallery cards)
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".gallery .card");
  cards.forEach((card) => {
    card.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") card.classList.add("touch-hover");
    }, { passive: true });
    ["pointerup","pointercancel","pointerleave"].forEach((ev) =>
      card.addEventListener(ev, () => card.classList.remove("touch-hover"), { passive: true })
    );
  });
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
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((el) => { el.classList.add("reveal"); io.observe(el); });

// Gentle parallax for hero decor
(() => {
  const decor = document.querySelector(".hero--room .room-decor");
  if (!decor) return;
  let raf;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY * 0.06;
      decor.style.transform = `translateY(${y}px)`;
      raf = null;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Tilt on gallery figures (desktop)
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

// Draggable reel (also auto-scrolls via CSS)
(() => {
  const reel = document.querySelector(".reel");
  if (!reel) return;

  let isDown = false, startX = 0, scrollLeft = 0;

  const start = (e) => {
    isDown = true;
    startX = (e.pageX || e.touches?.[0]?.pageX || 0);
    scrollLeft = reel.scrollLeft;
  };
  const move = (e) => {
    if (!isDown) return;
    const x = (e.pageX || e.touches?.[0]?.pageX || 0);
    const walk = (x - startX);
    reel.scrollLeft = scrollLeft - walk;
  };
  const end = () => { isDown = false; };

  reel.addEventListener("mousedown", start);
  reel.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);

  reel.addEventListener("touchstart", start, { passive: true });
  reel.addEventListener("touchmove", move, { passive: true });
  reel.addEventListener("touchend", end);
})();
