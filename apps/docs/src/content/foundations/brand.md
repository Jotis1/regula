---

title: "Marca e iconos de app"
description: "La marca jotis.me y los iconos de cada app."
order: 10
---

No hay logotipo propio de jotis.me en el archivo: en la cabecera de cada app, escribe "jotis.me" en Bricolage Grotesque bold, `text-primary`. El grupo Logos guarda el logo y el logomark **Yoruverse** que trae el archivo (marca índigo con luna), con una versión de tinta blanca para fondos oscuros; úsalos solo si la app forma parte de Yoruverse.

## Iconos de app

Cada app de la suite tiene un icono de la misma familia: baldosa con las dos primeras letras del nombre, mayúscula + minúscula, en el tono de la app. La construcción no cambia nunca; el color sí. Componente `AppIcon`; SVG listos en el grupo App icons.

| App      | Letras | Tono         |
| -------- | ------ | ------------ |
| Ornatus  | Or     | `indigo`     |
| Vinculum | Vi     | `sky`        |
| Pecunia  | Pe     | `emerald`    |
| Emptor   | Em     | `orange`     |
| Regula   | Re     | `chartreuse` |

**Rasgos de la familia.** Tres cosas, siempre juntas, que distinguen un icono de jotis.me de cualquier baldosa oscura con letras:
- **Esquina.** Tres esquinas con radio del 22,5 % del lado y la inferior izquierda casi recta (6/128). Es la silueta de la familia y no depende del color.
- **Dos tonos.** La mayúscula en el tono claro y la minúscula en el medio.
- **Virgulilla.** Una tilde (~) centrada bajo las letras, del tono medio. Es simétrica respecto a su centro: sube a la izquierda y baja a la derecha, a partes iguales. Tiene siempre el mismo tamaño, sea cual sea el nombre: no se adapta a las letras. Es además un guiño al castellano, la ñ de la marca.

**Construcción** (sobre el lado L):
- Bricolage Grotesque SemiBold (600), tamaño óptico 14, cuerpo al 47 % de L, tracking −3 %.
- Horizontal: centrado por la caja de avance, incluido el tracking final.
- Vertical: línea base al 62,5 % de L con virgulilla y al 66,4 % sin ella. La virgulilla va 11/128 por debajo de la línea base, mide 40/128 de largo (fijo), trazo de 3,6/128 con extremos redondos y una amplitud de unos 3/128.
- En los SVG las letras van en curvas: no dependen de la fuente instalada.

**Variantes** (tono T de la paleta v4 de Tailwind, o `chartreuse`):

| Variante  | Fondo                      | Mayúscula / minúscula / virgulilla     | Uso                                                                    |
| --------- | -------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| Principal | `T-950`                    | `T-300` / `T-500` / `T-500`            | El icono de la app, en claro y en oscuro                               |
| Sólido    | `T-600`                    | blanco / blanco / sin virgulilla       | Favicon y tamaños pequeños: el 950 se empasta en pestañas oscuras      |
| Claro     | `T-50` + borde 1px `T-200` | `T-800` / `T-600` / `T-600`            | Dentro de la interfaz clara (selector de apps, ajustes, documentación) |
| Mono      | `neutral-950`              | blanco / `neutral-400` / `neutral-400` | Contextos de un solo color, sobre fondo claro (en oscuro se funde)     |

- **Tamaños:** 16, 20, 24, 32, 48, 64, 96 y 128 px. La virgulilla solo se dibuja desde 32px; por debajo queda la esquina y los dos tonos. Por debajo de 20px, si no pasas `variant`, sale `solid`.
- **PWA:** icono `maskable` a sangre, sin radio ni esquina, con la variante principal. Las letras y la virgulilla caen dentro de la zona segura. En el manifest, `any` es el principal y `maskable` el maskable. `apple-touch-icon` es el maskable a 180px.
- **El tono de la app solo vive en su icono** (y en el favicon). La interfaz de todas las apps sigue en `brand` índigo: el icono identifica la app, no la tiñe.
- **No:** degradados, sombras, contorno en las letras, tres letras, pictogramas dentro, otra fuente, ni una virgulilla distinta (nada de sonrisas ni subrayados rectos).
- **App nueva:**
  - Letras: las dos primeras del nombre. Si coinciden con otra app, la primera más la siguiente consonante.
  - Tono: uno de la paleta que no esté usado ni sea vecino de uno usado.
  - Nunca `red`, que es error.
  - Tampoco `yellow`, porque el blanco sobre `yellow-600` no llega a 3:1.
  - Ni grises: la variante mono ya es la gris.
  - Si ningún tono de Tailwind cumple lo anterior, la suite tiene escala propia: `chartreuse` (Regula).

**`chartreuse`, la paleta propia.** Verde amarillento en el hueco de tono entre `yellow` y `lime` (tono OKLCH ≈ 112–122), con la misma escalera de luminosidad que las demás: 50 `#fafde6`, 100 `#f4f9c3`, 200 `#eaf389`, 300 `#dce930`, 400 `#cada00`, 500 `#b1c300`, 600 `#829500`, 700 `#627200`, 800 `#4c5a00`, 900 `#404d0f`, 950 `#222b06`. Es más amarilla que `lime` (`#7ccf00` en 500) y no es neutra como `olive`. Contrastes de los iconos de Regula: mayúscula 300 sobre 950, 11,1:1; minúscula 500 sobre 950, 7,5:1; blanco sobre 600 (sólido), 3,4:1; 800 sobre 50 (claro), 7,3:1. En los tokens va como `utility-chartreuse-50…700`. Como no viene en Tailwind, el `theme.css` de las apps necesita las once variables `--color-chartreuse-50` … `--color-chartreuse-950` dentro de `@theme`; con eso Tailwind v4 genera `bg-chartreuse-600` y compañía. Blanco sobre `chartreuse-600` no pasa de 3,4:1: sirve para iconos y letras grandes, no para texto corrido.

**En el paquete.** `AppIcon` lleva los colores de cada tono en su código, `chartreuse` incluido, así que el icono de Regula no necesita nada en tu tema. El `theme.css` de `@jotis-me/tokens` no añade las variables `--color-chartreuse-*`: `bg-chartreuse-600` sería paleta cruda, que el sistema no expone. Para badges, etiquetas y gráficas en este tono usa la escala semántica, `bg-utility-chartreuse-50`, `border-utility-chartreuse-200` o `text-utility-chartreuse-700`, que ya cambia sola en oscuro.

**En esta web.** Esta documentación es una interfaz clara, así que su cabecera lleva el icono de Regula en la variante Claro en el tema claro, y la principal en el oscuro.
