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
