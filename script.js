// Tone & Toon site script

// Auto-update the copyright year
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ---- Touch "hover" support for mobile ----
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".gallery .card");

  // For touch devices: add a temporary 'touch-hover' class while finger is down
  cards.forEach((card) => {
    // Use pointer events so it works for both touch and pen
    card.addEventListener("pointerdown", (e) => {
      // only apply for touch/pen, not mouse
      if (e.pointerType !== "mouse") {
        card.classList.add("touch-hover");
      }
    }, { passive: true });

    card.addEventListener("pointerup", () => {
      card.classList.remove("touch-hover");
    }, { passive: true });

    card.addEventListener("pointercancel", () => {
      card.classList.remove("touch-hover");
    }, { passive: true });

    // Also clean up when finger leaves the element
    card.addEventListener("pointerleave", () => {
      card.classList.remove("touch-hover");
    }, { passive: true });
  });
});

// === Sticky header color change ===
document.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  if (window.scrollY > 10) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

// === Reveal-on-scroll for sections ===
const revealItems = document.querySelectorAll("section, .card");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((el) => el.classList.add("reveal") && io.observe(el));

// === Gentle parallax for hero shapes ===
(() => {
  const decor = document.querySelector(".hero .decor");
  if (!decor) return;
  let raf;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY * 0.08; // parallax intensity
      decor.style.transform = `translateY(${y}px)`;
      raf = null;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// === Subtle tilt on gallery cards (desktop) ===
(() => {
  const cards = document.querySelectorAll("#work .gallery figure");
  const maxDeg = 6;
  cards.forEach((fig) => {
    const card = fig.closest(".card") || fig;
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return; // skip on touch
      const rect = fig.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      fig.style.transform = `rotateX(${(-dy * maxDeg).toFixed(2)}deg) rotateY(${(dx * maxDeg).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      fig.style.transform = "";
    });
  });
})();
