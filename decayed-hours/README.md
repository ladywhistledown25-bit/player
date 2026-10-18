# Decayed Hours — skin para rolea.es

Skin oscura con acentos neón para un foro de rol de La Purga ambientado en un parque de diversiones.

| Archivo | Para qué sirve |
|---|---|
| `skin.css` | Todos los estilos. La paleta está en `:root` (variables `--dh-*`). |
| `template.html` | Estructura HTML: cabecera, aviso de la Purga, categorías, foros con imagen y subforos, estadísticas, conectados, afiliados y una vista de tema de ejemplo. |
| `preview.html` | `skin.css` + `template.html` en un solo archivo para verlo en el navegador. Se regenera desde los dos anteriores. |

## Paleta

- Fondos: `#0b0a0e` → `#131118` → `#1a1720` → `#221e2a`
- Texto: `#cdc6d3` (normal), `#9a92a3` (secundario), `#ece6f0` (títulos)
- Neón rosa `#ff4f9a`: administración, botones, indicador de mensajes nuevos
- Neón cian `#4fd8d6`: lugares del parque, citas
- Ámbar `#e9b44c`: aviso y reloj de la Purga

**Modo oscuro** (por defecto). El brillo sólo aparece en el logo, la línea bajo cada categoría, el punto de "nuevo" y al pasar el ratón; el resto es mate.

**Modo claro** (botón «Modo claro» en la barra de menú; se guarda la elección de cada usuario):

- Fondos color hueso: `#e9e2d5` → `#f2ece1` → `#ebe3d5` → `#e0d6c5`, nunca blanco puro
- Texto: `#3b3540` (normal), `#5f5765` (secundario), `#26212b` (títulos)
- Los neones pasan a tonos tinta sin brillo: rosa `#b8326a`, cian `#176c69`, ámbar `#855610`
- Las fotos llevan un leve tono sepia

El modo claro está definido en el bloque `.dh-body[data-theme="light"]` de `skin.css`. Si la plataforma no permite JavaScript, el botón no funcionará y el foro se queda en modo oscuro.

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

**Escenas abiertas** (direcciones que empiezan por `/scenes/`): la skin se desactiva para respetar el formato inmersivo de rolea.es. No cambia el fondo ni ninguna pieza de la plataforma, y oculta la cabecera, el aviso y el pie de la skin. Lo controla el atributo `data-path` que rolea.es pone en `<html>`; si quieres excluir otra página, añade su ruta igual que `/scenes/`.

`template.html` y `preview.html` son una maqueta de referencia de foro clásico; no se pegan en rolea.es.

Imágenes: `style="--dh-header-img:url('...')"` en `.dh-header`; `style="--img:url('...')"` en los enlaces de `.dh-affiliates`.
