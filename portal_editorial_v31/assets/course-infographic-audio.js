document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-audio-infographic]').forEach((figure) => {
    const video = figure.querySelector('video');
    const source = video?.querySelector('source[data-src]');
    const button = figure.querySelector('[data-audio-infographic-toggle]');
    const label = figure.querySelector('[data-audio-infographic-label]');
    if (!video || !button || !label) return;

    let sourceLoaded = Boolean(video.currentSrc);

    const ensureSource = () => {
      if (sourceLoaded || !source) return;
      source.src = source.dataset.src;
      sourceLoaded = true;
      video.load();
    };

    const update = () => {
      const playing = !video.paused && !video.ended;
      figure.classList.toggle('is-playing', playing);
      label.textContent = playing ? 'Wstrzymaj' : 'Odtwórz komentarz';
      button.setAttribute('aria-label', playing ? 'Wstrzymaj komentarz do infografiki' : 'Odtwórz komentarz do infografiki');
    };

    button.addEventListener('click', async () => {
      if (video.paused || video.ended) {
        ensureSource();
        try { await video.play(); } catch (_) {}
      } else {
        video.pause();
      }
      update();
    });

    video.addEventListener('play', update);
    video.addEventListener('pause', update);
    video.addEventListener('ended', () => {
      // Po zakończeniu wracamy do statycznej infografiki (poster),
      // a sam plik wideo pozostaje ładowany dopiero po kolejnym kliknięciu.
      video.pause();
      if (source) {
        source.removeAttribute('src');
        sourceLoaded = false;
      }
      video.load();
      figure.classList.remove('is-playing');
      label.textContent = 'Odtwórz komentarz';
      button.setAttribute('aria-label', 'Odtwórz komentarz do infografiki');
    });
  });
});
