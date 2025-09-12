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
