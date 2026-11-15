/* DECAYED HOURS — cambio de modo claro/oscuro
   Pegar en: JavaScript personalizado.
   Recuerda la elección de cada usuario en su navegador. */
(function () {
  var root = document.documentElement;
  try { if (localStorage.getItem('dh-theme') === 'light') root.setAttribute('data-theme', 'light'); } catch (e) {}

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.dh-theme-toggle')) return;
    var light = root.getAttribute('data-theme') !== 'light';
    if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('dh-theme', light ? 'light' : 'dark'); } catch (e) {}
  });
})();

/* DECAYED HOURS — escena inmersiva
   En cada escena pone de fondo la foto de su lugar (la de rolea.es).
   Si quieres otra imagen para algún lugar, añádela aquí:
   'slug-del-lugar': 'https://…/imagen.jpg'  (el slug es lo que va tras /places/) */
(function () {
  var PLACE_IMAGES = {
    // 'feria': 'https://i.ibb.co/…/otra-foto.png',
  };
  var root = document.documentElement;
  var cache = {};
  try { cache = JSON.parse(sessionStorage.getItem('dh-place-img') || '{}'); } catch (e) {}

  function setBg(url) {
    if (url) root.style.setProperty('--dh-scene-bg', 'url("' + url + '")');
    else root.style.removeProperty('--dh-scene-bg');
  }

  function placeSlug() {
    var a = document.querySelector('.sceneView__placeLink');
    var m = a && (a.getAttribute('href') || '').match(/\/places\/([^\/?#]+)/);
    return m ? m[1] : null;
  }

  function load(slug) {
    if (PLACE_IMAGES[slug]) return setBg(PLACE_IMAGES[slug]);
    if (cache.hasOwnProperty(slug)) return setBg(cache[slug]);
    fetch('/places/' + slug, { credentials: 'same-origin' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        html = html.replace(/\\"/g, '"');
        var m = html.match(new RegExp('"slug":"' + slug + '"[^{}]*?"imageUrl":"(https?:[^"]+)"'));
        cache[slug] = m ? m[1] : null;
        try { sessionStorage.setItem('dh-place-img', JSON.stringify(cache)); } catch (e) {}
        if (placeSlug() === slug) setBg(cache[slug]);
      })
      .catch(function () {});
  }

  // La página se dibuja después de cambiar de ruta: se reintenta unos segundos
  var timer;
  function update() {
    clearTimeout(timer);
    if (root.getAttribute('data-route') !== 'scene') return setBg(null);
    var tries = 0;
    (function look() {
      var slug = placeSlug();
      if (slug) return load(slug);
      if (++tries < 20) timer = setTimeout(look, 250);
    })();
  }

  if (window.Rolea && window.Rolea.on) window.Rolea.on('page', update);
  else update();
})();

/* DECAYED HOURS — fotos con [foto]…[/foto]
   En textos donde rolea.es no deja subir imágenes (por ejemplo, las
   búsquedas de personaje), escribe en una línea aparte:
     [foto]https://enlace-a-la-imagen.jpg[/foto]
   y se mostrará como foto. Variantes: [foto ancha]…[/foto] para apaisadas
   y [foto cuadrada]…[/foto]. Solo enlaces https. */
(function () {
  var TAG = /^\s*\[foto(?:\s+(ancha|cuadrada))?\]\s*(https:\/\/[^\s"'()\\<>]+)\s*\[\/foto\]\s*$/i;
  var SKIP = '[contenteditable="true"], textarea, input, .ProseMirror, .tiptap';
  var queued = false;

  function scan() {
    queued = false;
    var blocks = document.querySelectorAll('p, div, li');
    for (var i = 0; i < blocks.length; i++) {
      var el = blocks[i];
      if (el.children.length > 2) continue;           // solo líneas sueltas
      var text = el.textContent;
      if (!text || text.indexOf('[foto') === -1) continue;
      if (el.closest(SKIP)) continue;
      var m = text.match(TAG);
      if (!m) continue;
      var url = 'url("' + m[2] + '")';
      if (el.style.getPropertyValue('--dh-foto') === url && el.classList.contains('dh-foto')) continue;
      el.classList.add('dh-foto');
      el.classList.toggle('dh-foto--ancha', (m[1] || '').toLowerCase() === 'ancha');
      el.classList.toggle('dh-foto--cuadrada', (m[1] || '').toLowerCase() === 'cuadrada');
      el.style.setProperty('--dh-foto', url);
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Foto');
    }
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(scan);
  }

  queue();
  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
