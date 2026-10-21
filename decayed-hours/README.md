# Decayed Hours — skin para rolea.es

Skin oscura con acentos neón para un foro de rol de La Purga ambientado en un parque de diversiones.

| Archivo | Para qué sirve |
|---|---|
| `skin.css` | Todos los estilos. La paleta está en `:root` (variables `--dh-*`). |
| `template.html` | Estructura HTML: cabecera, aviso de la Purga, categorías, foros con imagen y subforos, estadísticas, conectados, afiliados y una vista de tema de ejemplo. |
| `preview.html` | `skin.css` + `template.html` en un solo archivo para verlo en el navegador. Se regenera desde los dos anteriores. |

## Paleta

Estética slasher y grunge con toques cyberpunk: las máscaras de LED de la Purga (ojos en cruz, bocas cosidas) sobre negro sucio.

**Modo oscuro** (por defecto):

- Fondos: `#08090a` → `#0f1012` → `#15161a` → `#1c1d21`, con grano de textura encima
- Texto: `#c8c5bf` (normal), `#8e8a84` (secundario), `#ebe7df` (títulos)
- Rojo LED `#ff2d3f`: logo, máscara, botones, secciones principales, mensajes nuevos
- Verde tóxico `#8fe03a`: lugares, widgets laterales
- Amarillo de peligro `#ffd23f`: aviso y reloj de la Purga, con franja amarilla y negra
- Logo en Rubik Glitch con parpadeo de LED averiado (se desactiva si el sistema pide reducir animaciones); lema en Special Elite, de máquina de escribir

El brillo sólo aparece en el logo, la máscara, las líneas bajo los títulos, el punto de "nuevo" y al pasar el ratón.

**Modo claro** (botón en la cabecera; se guarda la elección de cada usuario):

- Fondos color hueso: `#e9e2d5` → `#f2ece1` → `#ebe3d5` → `#e0d6c5`, nunca blanco puro
- Texto: `#3b3540` (normal), `#5f5765` (secundario), `#26212b` (títulos)
- Los LED pasan a tinta sin brillo: rojo sangre seca `#a3141f`, verde musgo `#4a6a0c`, ocre `#7a5a00`

El modo claro está definido en el bloque `:root[data-theme="light"]` de `skin.css`.

## Cómo instalarlo en rolea.es

| Archivo | Dónde va |
|---|---|
| `skin.css` | CSS personalizado (el `@import` de las fuentes tiene que quedar arriba del todo) |
| `rolea/javascript.js` | JavaScript personalizado |
| `rolea/1-antes-del-contenido.html` | «Antes del contenido»: cabecera con el logo y el botón de modo claro/oscuro |
| `rolea/2-antes-del-inicio.html` | «Antes del inicio»: aviso de la Purga |
| `rolea/3-despues-del-inicio.html` | «Después del inicio»: afiliados |
| `rolea/4-despues-del-contenido.html` | «Después del contenido»: pie de página |

«Antes de la página» y «Después de la página» quedan vacíos.

`skin.css` también viste las piezas propias de rolea.es (barra lateral, lista de escenas, filtros, estadísticas, facciones, widgets de Lugares y Equipo, pie y aviso de cookies), a partir del HTML de la portada con el diseño moderno. Otras páginas (escena abierta, ficha de personaje, foro, documentación) y el diseño clásico usan otras clases y quedan pendientes.

`template.html` y `preview.html` son una maqueta de referencia de foro clásico; no se pegan en rolea.es.

Imágenes: `style="--dh-header-img:url('...')"` en `.dh-header`; `style="--img:url('...')"` en los enlaces de `.dh-affiliates`.
