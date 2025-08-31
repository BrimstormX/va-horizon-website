// Timestamp -> seek in audio
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-seek][data-audio]");
  if (!btn) return;
  e.preventDefault();
  const audio = document.querySelector(btn.getAttribute("data-audio"));
  if (audio) {
    const t = parseFloat(btn.getAttribute("data-seek"));
    if (!Number.isNaN(t)) {
      audio.currentTime = t;
      audio.play().catch(() => {
        /* ignore autoplay block */
      });
    }
  }
});
