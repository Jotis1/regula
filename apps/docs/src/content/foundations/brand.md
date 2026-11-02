---

title: "Marca e iconos de app"
description: "La marca jotis.me y los iconos de cada app."
order: 10
---

No hay logotipo propio de jotis.me en el archivo: en la cabecera de cada app, escribe "jotis.me" en Bricolage Grotesque bold, `text-primary`. El grupo Logos guarda el logo y el logomark **Yoruverse** que trae el archivo (marca índigo con luna), con una versión de tinta blanca para fondos oscuros; úsalos solo si la app forma parte de Yoruverse.

## Iconos de app

Cada app de la suite tiene un icono de la misma familia: baldosa con las dos primeras letras del nombre, mayúscula + minúscula, en el tono de la app. La construcción no cambia nunca; el color sí. Componente `AppIcon`; SVG listos en el grupo App icons.

| App      | Letras | Tono      |
| -------- | ------ | --------- |
| Ornatus  | Or     | `indigo`  |
| Vinculum | Vi     | `sky`     |
| Pecunia  | Pe     | `emerald` |
| Emptor   | Em     | `orange`  |

**Rasgos de la familia.** Tres cosas, siempre juntas, que distinguen un icono de jotis.me de cualquier baldosa oscura con letras:
- **Esquina.** Tres esquinas con radio del 22,5 % del lado y la inferior izquierda casi recta (6/128). Es la silueta de la familia y no depende del color.
- **Dos tonos.** La mayúscula en el tono claro y la minúscula en el medio.
- **Virgulilla.** Una tilde (~) centrada bajo las letras, del tono medio. Es simétrica respecto a su centro: sube a la izquierda y baja a la derecha, a partes iguales. Tiene siempre el mismo tamaño, sea cual sea el nombre: no se adapta a las letras. Es además un guiño al castellano, la ñ de la marca.

**Construcción** (sobre el lado L):
- Bricolage Grotesque SemiBold (600), tamaño óptico 14, cuerpo al 47 % de L, tracking −3 %.
- Horizontal: centrado por la caja de avance, incluido el tracking final.
- Vertical: línea base al 62,5 % de L con virgulilla y al 66,4 % sin ella. La virgulilla va 11/128 por debajo de la línea base, mide 40/128 de largo (fijo), trazo de 3,6/128 con extremos redondos y una amplitud de unos 3/128.
- En los SVG las letras van en curvas: no dependen de la fuente instalada.

**Variantes** (tono T de la paleta v4 de Tailwind):

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
