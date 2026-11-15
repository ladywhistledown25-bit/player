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
   búsquedas de personaje), escribe:
     [foto]https://enlace-a-la-imagen.jpg[/foto]
   y se mostrará como foto. Variantes: [foto ancha]…[/foto] para apaisadas
   y [foto cuadrada]…[/foto]. Solo enlaces https. Funciona aunque la
   etiqueta comparta párrafo con otro texto o el enlace se vuelva un link. */
(function () {
  var URL_RE = 'https:\\/\\/[^\\s"\'()\\\\<>\\[\\]]+';
  var FULL = new RegExp('\\[foto(?:\\s+(ancha|cuadrada))?\\]\\s*(' + URL_RE + ')\\s*\\[\\/foto\\]', 'gi');
  var OPEN_END = /\[foto(?:\s+(ancha|cuadrada))?\]\s*$/i;
  var CLOSE_START = /^\s*\[\/foto\]/i;
  var URL_ONLY = new RegExp('^\\s*(' + URL_RE + ')\\s*$', 'i');
  var SKIP = '[contenteditable="true"], textarea, input, script, style, .ProseMirror, .tiptap';
  var queued = false;

  function foto(kind, url) {
    var s = document.createElement('span');
    s.className = 'dh-foto' + (kind ? ' dh-foto--' + kind.toLowerCase() : '');
    s.style.setProperty('--dh-foto', 'url("' + url + '")');
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'Foto');
    return s;
  }

  // Quita el salto de línea que queda detrás de la foto
  function tidyAfter(node) {
    var n = node.nextSibling;
    if (n && n.nodeType === 3) n.data = n.data.replace(/^[ \t]*\n/, '');
    for (var k = 0; k < 2 && n && n.nodeName === 'BR'; k++) {
      var next = n.nextSibling; n.parentNode.removeChild(n); n = next;
    }
  }

  // Caso 1: la etiqueta entera está en un mismo texto
  function splitText(t) {
    var text = t.data, last = 0, m, frag = document.createDocumentFragment(), found = false;
    FULL.lastIndex = 0;
    while ((m = FULL.exec(text))) {
      found = true;
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      frag.appendChild(foto(m[1], m[2]));
      last = FULL.lastIndex;
    }
    if (!found) return false;
    var rest = text.slice(last).replace(/^[ \t]*\n/, '');
    if (rest) frag.appendChild(document.createTextNode(rest));
    var lastFoto = frag.lastChild && frag.lastChild.className ? frag.lastChild : null;
    t.parentNode.replaceChild(frag, t);
    if (lastFoto) tidyAfter(lastFoto);
    return true;
  }

  // Caso 2: el editor convirtió el enlace en <a>: "[foto]" <a>url</a> "[/foto]"
  function splitLink(t) {
    var open = t.data.match(OPEN_END), a = t.nextSibling, close = a && a.nextSibling;
    if (!open || !a || a.nodeType !== 1 || !close || close.nodeType !== 3) return false;
    var u = a.textContent.match(URL_ONLY) || (a.getAttribute('href') || '').match(URL_ONLY);
    if (!u || !CLOSE_START.test(close.data)) return false;
    var f = foto(open[1], u[1]);
    t.data = t.data.slice(0, open.index);
    close.data = close.data.replace(CLOSE_START, '');
    a.parentNode.replaceChild(f, a);
    tidyAfter(f);
    return true;
  }

  function scan() {
    queued = false;
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.data.indexOf('[foto') === -1) return NodeFilter.FILTER_SKIP;
        return n.parentElement && !n.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var list = [];
    while (walker.nextNode()) list.push(walker.currentNode);
    for (var i = 0; i < list.length; i++) {
      if (list[i].parentNode) splitText(list[i]) || splitLink(list[i]);
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
