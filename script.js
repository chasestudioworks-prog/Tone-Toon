// Year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Toggle lime header color at very top (restored)
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

document.querySelectorAll("section, .card, .tt-card").forEach((el) => {
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

// Drag-to-scroll Poster Wall + pause on hover
(() => {
  const reel = document.querySelector(".poster-reel");
  if (!reel) return;
  const track = reel.querySelector(".track");

  let isDown = false, startX = 0, scrollLeft = 0;
  const pageX = (e) => (e.pageX ?? e.touches?.[0]?.pageX ?? 0);

  const start = (e) => { isDown = true; startX = pageX(e); scrollLeft = reel.scrollLeft; };
  const move  = (e) => { if (!isDown) return; reel.scrollLeft = scrollLeft - (pageX(e) - startX); };
  const end   = () => { isDown = false; };

  reel.addEventListener("mousedown", start);
  reel.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  reel.addEventListener("touchstart", start, { passive:true });
  reel.addEventListener("touchmove", move, { passive:true });
  reel.addEventListener("touchend", end);

  const pause = () => track.style.animationPlayState = "paused";
  const play  = () => track.style.animationPlayState = "running";
  reel.addEventListener("mouseenter", pause);
  reel.addEventListener("mouseleave", play);
  reel.addEventListener("touchstart", pause, { passive:true });
  reel.addEventListener("touchend", play,   { passive:true });
})();

// Lightbox
(() => {
  const modal = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightbox-img");
  const captionEl = document.getElementById("lightbox-caption");
  const backBtn = document.getElementById("lightbox-back");
  if (!modal || !imgEl) return;
  const closeTargets = modal.querySelectorAll("[data-close]");

  const open = (src, alt) => {
    imgEl.src = src;
    imgEl.alt = alt || "";
    captionEl.textContent = alt || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  document.querySelectorAll(".poster-reel .puck").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const img = a.querySelector("img");
      if (img) open(img.src, img.alt);
    });
  });

  closeTargets.forEach(el => el.addEventListener("click", close));
  modal.addEventListener("click", (e) => {
    if (e.target.matches(".lightbox__backdrop")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
  if (backBtn) backBtn.addEventListener("click", close);
})();

// Kick off staggered hero fade-ins
document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
  console.log("TT build v30 loaded");
});

/* ===== Mobile Menu Toggle (hamburger only on mobile) ===== */
(() => {
  const header = document.querySelector('[data-mobile-nav]');
  const btn = header?.querySelector('.menu-toggle');
  const nav = header?.querySelector('#site-nav');
  if (!header || !btn || !nav) return;

  const toggleMenu = () => {
    header.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', header.classList.contains('nav-open'));
  };

  btn.addEventListener('click', toggleMenu);

  // Close when a link is tapped
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
  }));

  // Force-close when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) header.classList.remove('nav-open');
  }, { passive:true });
})();
