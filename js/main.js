function playAudioFrom(audio, seconds) {
  const seekAndPlay = () => {
    try {
      const duration =
        Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : seconds;
      audio.currentTime = Math.min(seconds, duration);
    } catch {
      return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        /* ignore autoplay block */
      });
    }
  };

  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
    seekAndPlay();
    return;
  }

  audio.preload = "metadata";
  audio.addEventListener("loadedmetadata", seekAndPlay, { once: true });
  audio.load();
}

// Timestamp -> seek in audio
document.addEventListener("click", (e) => {
  const target = e.target instanceof Element ? e.target : null;
  const btn = target ? target.closest("[data-seek][data-audio]") : null;
  if (!btn) return;
  e.preventDefault();
  const audio = document.querySelector(btn.getAttribute("data-audio"));
  if (audio) {
    const t = parseFloat(btn.getAttribute("data-seek"));
    if (!Number.isNaN(t)) {
      playAudioFrom(audio, t);
    }
  }
});
