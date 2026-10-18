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

## Cómo adaptarlo a rolea.es

Todas las clases usan el prefijo `dh-`, así que no chocan con las de la plataforma.

1. Pega `skin.css` en el apartado de CSS personalizado del panel.
2. Si rolea.es deja editar las plantillas HTML, usa la estructura de `template.html` y sustituye los textos de ejemplo por las variables de la plataforma.
3. Si sólo deja CSS, hay que cambiar los selectores `.dh-*` por las clases reales de rolea.es (por ejemplo `.dh-forum` → la clase de cada fila de foro).
4. Imágenes: `style="--img:url('...')"` en `.dh-forum__img`, `.dh-lastpost__av`, `.dh-post__avatar` y en los enlaces de `.dh-affiliates`; `style="--dh-header-img:url('...')"` en `.dh-header`.
5. Grupos de usuarios: `.g-admin`, `.g-staff`, `.g-purgador`, `.g-superviviente`, `.g-civil`.
