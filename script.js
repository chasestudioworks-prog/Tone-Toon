// Year auto update
document.getElementById("year").textContent = new Date().getFullYear();

// Parallax wobble for paint assets
(() => {
  const splash = document.querySelector(".paint-splash");
  const tube   = document.querySelector(".paint-tube");
  if (!splash || !tube) return;

  let raf;
  const onMove = (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      splash.style.transform = `translateX(calc(-50% + ${x * 0.6}px)) translateY(${y * 0.2}px)`;
      tube.style.transform   = `rotate(${18 + x * 0.2}deg) translate(${x * 0.4}px, ${-y * 0.2}px)`;
      raf = null;
    });
  };
  window.addEventListener("mousemove", onMove, { passive: true });
})();
