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
