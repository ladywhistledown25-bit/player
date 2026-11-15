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
   etiqueta comparta párrafo con otro texto, el enlace se vuelva un link o
   el editor parta el texto (por ejemplo, guiones bajos como cursiva). */
(function () {
  var FULL = /\[foto(?:\s+(ancha|cuadrada))?\]\s*(https:\/\/[^\s"'()\\<>\[\]]+)\s*\[\/foto\]/gi;
  var EDITING = '[contenteditable="true"], [contenteditable=""], textarea, input';
  var BLOCK = 'p, li, blockquote, td, th, dd, h1, h2, h3, h4, h5, h6, div, section, article';
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
    while (n && n.nodeType === 3 && n.data === '') n = n.nextSibling;
    if (n && n.nodeType === 3) n.data = n.data.replace(/^[ \t]*\n/, '');
    for (var k = 0; k < 2 && n && n.nodeName === 'BR'; k++) {
      var next = n.nextSibling; n.parentNode.removeChild(n); n = next;
    }
  }

  // Une el texto de un bloque, busca las etiquetas y las cambia por fotos
  // con un rango, aunque crucen <a>, <em>, <span>…
  function processBlock(block) {
    var nodes = [], text = '', w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { nodes.push({ n: w.currentNode, start: text.length }); text += w.currentNode.data; }
    var matches = [], m;
    FULL.lastIndex = 0;
    while ((m = FULL.exec(text))) matches.push({ s: m.index, e: FULL.lastIndex, kind: m[1], url: m[2] });
    function at(pos, isEnd) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        if (isEnd ? nodes[i].start < pos : nodes[i].start <= pos) return { n: nodes[i].n, o: pos - nodes[i].start };
      }
      return null;
    }
    for (var j = matches.length - 1; j >= 0; j--) {
      var a = at(matches[j].s, false), b = at(matches[j].e, true);
      if (!a || !b) continue;
      var r = document.createRange();
      r.setStart(a.n, a.o); r.setEnd(b.n, b.o);
      r.deleteContents();
      var f = foto(matches[j].kind, matches[j].url);
      r.insertNode(f);
      tidyAfter(f);
    }
    return matches.length;
  }

  function scan() {
    queued = false;
    if (!document.body) return;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.data.indexOf('[foto') === -1 && n.data.indexOf('foto]') === -1 ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT; }
    });
    var blocks = [];
    while (w.nextNode()) {
      var el = w.currentNode.parentElement;
      if (!el || el.closest(EDITING) || el.closest('script, style')) continue;
      var block = el.closest(BLOCK) || el;
      if (blocks.indexOf(block) === -1) blocks.push(block);
    }
    for (var i = 0; i < blocks.length; i++) processBlock(blocks[i]);
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(scan);
  }

  queue();
  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  // Diagnóstico: añade ?dhdebug al final del enlace de la página y aparece
  // un recuadro con lo que el script encontró. Sirve para enviar una captura.
  if (location.search.indexOf('dhdebug') !== -1) {
    var log = [];
    var describe = function (el) {
      var out = [];
      for (var k = 0; el && k < 7; k++, el = el.parentElement) {
        var c = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
        var ce = el.getAttribute('contenteditable');
        out.push(el.tagName.toLowerCase() + (c ? '.' + c : '') + (ce !== null ? '[ce=' + ce + ']' : ''));
      }
      return out.join(' < ');
    };
    var report = function (when) {
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), found = 0;
      while (w.nextNode()) {
        var n = w.currentNode;
        if (n.data.indexOf('foto') === -1 || !n.parentElement || n.parentElement.closest('#dh-debug')) continue;
        found++;
        log.push(when + ' · texto: "' + n.data.slice(0, 60) + '"\n   en: ' + describe(n.parentElement));
      }
      log.push(when + ' · fotos ya convertidas: ' + document.querySelectorAll('.dh-foto').length + ' · textos con "foto": ' + found);
      var box = document.getElementById('dh-debug') || document.body.appendChild(document.createElement('pre'));
      box.id = 'dh-debug';
      box.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;max-height:45vh;overflow:auto;margin:0;padding:10px;font:12px/1.4 monospace;white-space:pre-wrap;background:#111;color:#9f9;border:1px solid #9f9';
      box.textContent = 'DECAYED HOURS · diagnóstico de [foto]\n' + log.join('\n');
    };
    setTimeout(function () { report('1s'); }, 1000);
    setTimeout(function () { report('4s'); }, 4000);
  }
})();
