(() => {
  'use strict';

  const articleRoot = document.getElementById('newsArticle');
  const listRoot = document.getElementById('newsList');
  const lightbox = document.getElementById('newsLightbox');
  if (!articleRoot || !listRoot) return;

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const posts = () => (Array.isArray(window.portalSiteData?.news) ? window.portalSiteData.news : []).filter(post => post.published !== false).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const language = () => window.EBG_SITE_I18N?.getLanguage() || document.documentElement.dataset.siteLanguage || 'pl';
  const local = (post, field) => {
    const value = language() === 'en' && post[`${field}En`] ? post[`${field}En`] : post[field] || '';
    return language() === 'pl' ? String(value).replace(/\b([aiouwz])[ \t]+/gi, '$1\u00a0') : value;
  };
  const dateLabel = value => {
    const date = value ? new Date(`${value}T12:00:00`) : null;
    if (!date || Number.isNaN(date.valueOf())) return '';
    return new Intl.DateTimeFormat(language() === 'en' ? 'en-GB' : 'pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };
  const selectedId = () => new URLSearchParams(location.search).get('wpis') || posts()[0]?.id;

  function showImage(src, alt) {
    if (!lightbox || !src) return;
    const image = lightbox.querySelector('img');
    image.src = src; image.alt = alt || '';
    lightbox.querySelector('figcaption').textContent = alt || '';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  }

  function galleryHtml(post) {
    const gallery = Array.isArray(post.gallery) ? post.gallery.filter(item => item?.src) : [];
    if (!gallery.length) return '';
    return `<div class="news-gallery" aria-label="${language() === 'en' ? 'Photo gallery' : 'Galeria zdjęć'}">${gallery.map(item => `<button type="button" data-news-image="${escapeHtml(item.src)}" data-news-alt="${escapeHtml(language() === 'en' ? item.altEn || item.alt : item.alt)}"><img loading="lazy" src="${escapeHtml(item.src)}" alt="${escapeHtml(language() === 'en' ? item.altEn || item.alt : item.alt)}"></button>`).join('')}</div>`;
  }

  function render() {
    const allPosts = posts();
    if (!allPosts.length) {
      articleRoot.innerHTML = `<div class="news-empty">${language() === 'en' ? 'New stories will appear here soon.' : 'Wkrótce pojawią się tutaj pierwsze relacje.'}</div>`;
      listRoot.innerHTML = '';
      return;
    }
    const post = allPosts.find(item => item.id === selectedId()) || allPosts[0];
    const caption = local(post, 'imageAlt');
    articleRoot.innerHTML = `<article class="news-article"><div class="news-media-column"><figure class="news-cover"><button class="news-cover-button" type="button" data-news-image="${escapeHtml(post.image)}" data-news-alt="${escapeHtml(caption)}"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(caption)}"></button><figcaption>${escapeHtml(caption)}</figcaption></figure>${galleryHtml(post)}</div><div class="news-copy"><div class="news-meta"><span>${escapeHtml(local(post, 'category'))}</span><time datetime="${escapeHtml(post.date)}">${escapeHtml(dateLabel(post.date))}</time></div><h2>${escapeHtml(local(post, 'title'))}</h2><p class="news-lead">${escapeHtml(local(post, 'lead'))}</p><div class="news-body">${String(local(post, 'body')).split(/\n\s*\n/).filter(Boolean).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div></div></article>`;

    const archive = allPosts.map(item => `<article class="news-card ${item.id === post.id ? 'is-current' : ''}"><a class="news-card-media" href="?wpis=${encodeURIComponent(item.id)}" data-news-post="${escapeHtml(item.id)}"><img loading="lazy" src="${escapeHtml(item.image)}" alt="${escapeHtml(local(item, 'imageAlt'))}"></a><div class="news-card-copy"><div class="news-meta"><span>${escapeHtml(local(item, 'category'))}</span><time datetime="${escapeHtml(item.date)}">${escapeHtml(dateLabel(item.date))}</time></div><h3>${escapeHtml(local(item, 'title'))}</h3><p>${escapeHtml(local(item, 'lead'))}</p><a href="?wpis=${encodeURIComponent(item.id)}" data-news-post="${escapeHtml(item.id)}">${language() === 'en' ? 'Read the story' : 'Czytaj relację'}</a></div></article>`).join('');
    listRoot.innerHTML = archive || `<div class="news-empty">${language() === 'en' ? 'More stories will appear here after the next training sessions.' : 'Kolejne relacje pojawią się tutaj po następnych szkoleniach.'}</div>`;
    if (allPosts.length === 1) listRoot.innerHTML = `<div class="news-empty">${language() === 'en' ? 'More stories will appear here after the next training sessions.' : 'Kolejne relacje pojawią się tutaj po następnych szkoleniach.'}</div>`;

    document.querySelectorAll('[data-news-image]').forEach(button => button.addEventListener('click', () => showImage(button.dataset.newsImage, button.dataset.newsAlt)));
    document.querySelectorAll('[data-news-post]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault(); history.pushState({}, '', `?wpis=${encodeURIComponent(link.dataset.newsPost)}`); render(); articleRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  lightbox?.querySelector('.news-lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  window.addEventListener('popstate', render);
  document.addEventListener('ebg:site-language-changed', render);
  window.addEventListener('message', event => { if (event.data?.type !== 'ebg-cms-preview' || !event.data.data) return; window.portalSiteData = event.data.data; render(); });
  render();
})();
