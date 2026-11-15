# Decayed Hours — skin para rolea.es

Skin oscura con acentos neón para un foro de rol de La Purga ambientado en un parque de diversiones.

| Archivo | Para qué sirve |
|---|---|
| `skin.css` | Todos los estilos. La paleta está en `:root` (variables `--dh-*`). |
| `template.html` | Estructura HTML: cabecera, aviso de la Purga, categorías, foros con imagen y subforos, estadísticas, conectados, afiliados y una vista de tema de ejemplo. |
| `preview.html` | `skin.css` + `template.html` en un solo archivo para verlo en el navegador. Se regenera desde los dos anteriores. |

## Paleta

Terror de feria abandonada, a juego con la imagen de cabecera: noche con niebla verde azulada, bombillas ámbar, lonas de rojo desvaído y letras color hueso.

**Modo oscuro** (por defecto):

- Fondos: `#070b0a` → `#0d1312` → `#121a18` → `#18221f`, con un leve resplandor verde azulado y grano de textura
- Texto color hueso: `#cfc8b6` (normal), `#959b90` (secundario), `#ebe3cc` (títulos)
- Rojo óxido `#d95a47`: botones, títulos de sección, primera letra de las respuestas
- Verde cardenillo `#6fb7a5`: lugares, widgets laterales
- Ámbar de farol `#e2a94c`: aviso y reloj de la Purga

**Modo claro** (botón en la cabecera; se guarda la elección de cada usuario):

- Texto: `#3b3540` (normal), `#5f5765` (secundario), `#26212b` (títulos)
- Fondos hueso con un velo verde grisáceo: `#e7e3d7` → `#f1eee4` → `#e9e5d9` → `#ddd8ca`
- Acentos en tinta, sin brillo: rojo de lona vieja `#8e1c22`, verde cardenillo `#2f6359`, ámbar de farol `#7d5a10`

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

**Toda la plataforma:** `skin.css` redefine las variables de diseño de rolea.es (`--color-*` y `--font-family-*`) con la paleta y las fuentes de la skin, así que se tiñen todas las páginas, también las que no tienen reglas propias. Además hay reglas concretas para la barra lateral, la lista de escenas, filtros, estadísticas, facciones, widgets, pie y aviso de cookies.

**Escenas** (`data-route="scene"`): diseño inmersivo. De fondo va la foto del lugar de la escena, oscurecida y difuminada; `javascript.js` la busca sola en la página del lugar. Si quieres otra imagen para un lugar, añádela en `PLACE_IMAGES` dentro de `javascript.js`. El texto va en letra Crimson Pro sobre un panel translúcido con el borde del color de la facción, la primera letra de cada respuesta en rojo LED, el retrato con líneas de pantalla y una cruz entre respuestas. La cabecera de la skin se reduce a una barra fina.

`template.html` y `preview.html` son una maqueta de referencia de foro clásico; no se pegan en rolea.es.

**Cabecera con imagen:** con la clase `dh-header--art` la cabecera toma la proporción de la imagen (3 : 1 por defecto, ajustable con `--dh-header-ratio`), oculta el logo de la skin porque la imagen ya trae el título y se funde con la página por abajo. En `img/` hay una versión comprimida de la cabecera actual (JPG de 330 KB y WebP de 230 KB, en lugar del PNG de 2,5 MB).

Imágenes: `style="--dh-header-img:url('...'); --dh-header-img-light:url('...')"` en `.dh-header` (la del modo claro es opcional); `style="--img:url('...')"` en los enlaces de `.dh-affiliates`.
