# juego-bot-Null — guía para cada sesión de Claude

> Léela antes de tocar algo. Si agregas algo, anótalo aquí en el mismo cambio.

## Qué es
Páginas web de **Moros** publicadas en GitHub Pages (`https://morosdev.github.io/juego-bot-Null/`), conectadas a su bot de WhatsApp **Null** (`MorosDev/null2`). Moros es principiante y está aprendiendo: respuestas en español, cortas, sin tecnicismos; comentarios del código en español explicando el *porqué*; cuando algo sea nuevo, explícale en 2-3 líneas la idea clave. (Él escribirá su próximo bot, **ghost-bot**, solo: ahí Claude enseña, no escribe.)

## Cómo se trabaja
- Rama principal: **`main`** (Pages publica desde ahí, sin paso de construcción: los `.html` se sirven tal cual).
- Cambios chicos y probados (abrir la página con Playwright, sin errores en consola), PR a `main` y unirlo uno mismo al pasar las pruebas (como en null2).
- Sin librerías de servidor ni pasos de build: cada página es HTML + CSS + JS en el mismo archivo (o con `base.js`).

## Qué hay
- **Arcade** (`index.html` + un `.html` por juego, `base.js` compartido): `.arcade` en Null da un link con boleto (`?n=Nombre&t=BOLETO`); al terminar, el juego muestra un código firmado que se cobra con `.arcade cobrar`. La función `firma()` de cada juego es idéntica a `J.firma` del bot: **si cambias una, cambia la otra**. Detalles en el `CLAUDE.md` de null2 ("Arcade conectado").
- **Forja ANSI** (`forja/index.html`, `https://morosdev.github.io/juego-bot-Null/forja/`): taller de arte ANSI/ASCII estilo "scene" de los 90 (NFO, BBS) para decorar Termux, la terminal de la laptop y a Null. Null la comparte con **`.forja`**. Tres modos:
  - **Logo:** texto → se dibuja en un canvas con una letra de Google Fonts (15 en `FUENTES`) → se muestrea en una rejilla de 2×4 sub-celdas por carácter (`promediar`/`subs`) → bloques `░▒▓█▀▄`, ASCII `@#%*`, medios bloques o braille `⣿`. Relleno (sólido, degradado, trama, rayas, hueco), sombra en trama (1 fila abajo, 2 columnas a la derecha = 45°, porque la celda mide el doble de alto que de ancho: `ASPECTO = 2`) y contorno.
  - **Imagen:** foto → ANSI. El mejor modo es `▀` con color de letra = mitad de arriba y fondo = mitad de abajo (doble detalle vertical). Brillo, contraste, invertir. Trae una luna de ejemplo dibujada en código.
  - **Marco NFO:** ficha con bordes `═║╔╗` (4 estilos), título, `Campo: [ valor ]`, renglones centrados, separadores y pie dentro del borde; puede llevar el logo arriba.
  - **Color:** gris de NFO, degradado vertical/horizontal, arcoíris, colores de la foto o sin color. Salida: copiar texto, copiar para WhatsApp (con ```), **copiar/descargar `banner.sh`** (bash con `printf` y colores de 24 bits `\033[38;2;R;G;Bm`; `%` y `\` escapados), con los pasos para ponerlo al abrir Termux (`~/.banner.sh` + `~/.bashrc` + `touch ~/.hushlogin`).
  - La vista previa usa Noto Sans Mono con `line-height` calculado para que cada celda mida el doble de alto que de ancho, como una terminal.

## Pendientes de la Forja (ideas de Moros, 15–16 nov 2026: "quiero decorar mi Termux, el bot, ampliarla")
1. **Menú de terminal**: un script `null` con banner y opciones (prender Null, apagar bien, actualizar, ver errores, respaldo) que se elige con número.
2. **Animar el banner** al abrir Termux (aparece por renglones / efecto glitch).
3. **Video y GIF → animación ANSI** (cuadro por cuadro en el navegador; exportar como script que reproduce en la terminal). En Termux directo existe `pkg install chafa`.
4. **ASCII de trazos** (como las referencias de Moros: sigue los bordes con `/ \ | _ ( )` en vez de rellenar; detección de bordes + carácter según la dirección).
5. **Decorar a Null**: exportar arte para el `.menu`/banners del bot y textos dentro de ``` para WhatsApp (ancho ~30-35 en el celular).
6. **Prompt y colores de Termux** (`~/.termux/colors.properties`, PS1) con vista previa.
7. Guardar diseños (localStorage) y plantillas.
8. Más adelante: juntarla con otras herramientas en una sola app instalable ("Null Tools").
