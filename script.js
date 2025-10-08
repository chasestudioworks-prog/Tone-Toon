// Year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Toggle lime header color at very top
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

// include sections, work cards, and new pricing cards
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
  const start = (e) => { isDown = true; startX = (e.pageX || e.touches?.[0]?.pageX || 0); scrollLeft = reel.scrollLeft; };
  const move  = (e) => { if (!isDown) return; const x = (e.pageX || e.touches?.[0]?.pageX || 0); reel.scrollLeft = scrollLeft - (x - startX); };
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

// Lightbox: enlarge Poster Wall images
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
  console.log("TT build v15 loaded");
});

/* ===== Tone & Toon Pricing Config (edit here) ===== */
const TT_PRICING = {
  canvas: [
    { size: "Small", dims: '~ 8" × 10"', price: "$120 CAD" },
    { size: "Medium", dims: '~ 12" × 16"', price: "$180 CAD" },
    { size: "Large", dims: '~ 18" × 24"', price: "$250 CAD" },
    { size: "Extra-Large", dims: '24" × 36"+', price: "$350+ CAD" },
  ],
  fabric: [
    { type: "Single Design", price: "$70–$100 CAD", detail: "1 small logo or illustration" },
    { type: "Multiple Designs", price: "$120–$180 CAD", detail: "2–3 designs or larger coverage" },
    { type: "Full Back Designs", price: "$200–$300+ CAD", detail: "Depends on designs, materials & method" },
  ],
  rush: [
    { level: "Standard", time: "2–4 weeks", fee: "No extra charge" },
    { level: "Express",  time: "7–10 days", fee: "+20% of total price" },
    { level: "Priority", time: "3–5 days",  fee: "+40% of total price" },
  ],
};

function ttSafeHTML(text){ return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;"); }

function ttTableBodyFor(title){
  // Finds the table body in the card with the matching h3 title text
  const cards = document.querySelectorAll('#pricing .tt-card');
  for (const card of cards) {
    const h3 = card.querySelector('.tt-title');
    if (!h3) continue;
    if (h3.textContent.trim().toLowerCase() === title.toLowerCase()) {
      return card.querySelector('tbody');
    }
  }
  return null;
}

function applyPricingFromConfig(){
  // Canvas
  const canvasBody = ttTableBodyFor('Canvas Paintings');
  if (canvasBody && TT_PRICING.canvas) {
    canvasBody.innerHTML = TT_PRICING.canvas.map(r =>
      `<tr>
        <td>${ttSafeHTML(r.size)}</td>
        <td>${ttSafeHTML(r.dims)}</td>
        <td>${ttSafeHTML(r.price)}</td>
        <td>${ttSafeHTML(r.notes)}</td>
      </tr>`
    ).join('');
  }

  // Fabric / Apparel
  const fabricBody = ttTableBodyFor('Fabric / Apparel');
  if (fabricBody && TT_PRICING.fabric) {
    fabricBody.innerHTML = TT_PRICING.fabric.map(r =>
      `<tr>
        <td>${ttSafeHTML(r.type)}</td>
        <td>${ttSafeHTML(r.price)}</td>
        <td>${ttSafeHTML(r.detail)}</td>
      </tr>`
    ).join('');
  }

  // Rush Orders
  const rushBody = ttTableBodyFor('Rush Orders');
  if (rushBody && TT_PRICING.rush) {
    rushBody.innerHTML = TT_PRICING.rush.map(r =>
      `<tr>
        <td>${ttSafeHTML(r.level)}</td>
        <td>${ttSafeHTML(r.time)}</td>
        <td>${ttSafeHTML(r.fee)}</td>
      </tr>`
    ).join('');
  }

  console.log('[TT] Pricing applied from config.');
}

// Ensure DOM is ready and section exists before applying
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#pricing')) applyPricingFromConfig();
  });
} else {
  if (document.querySelector('#pricing')) applyPricingFromConfig();
}

// ===== Mobile hamburger menu toggle =====
(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  if (!header || !toggle) return;

  toggle.addEventListener("click", () => {
    header.classList.toggle("nav-open");
  });
})();
