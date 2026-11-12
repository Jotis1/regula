# @jotis-me/assets

Lo que la suite jotis.me usa además de los componentes: logos de terceros, iconos de métodos de pago, cursores, trazos a mano, texturas y los ficheros de icono de cada app (favicon y PWA). Todo como componentes React sueltos y como SVG.

Los iconos de línea, los de tipo de archivo y las banderas **no están aquí**: se toman de [Untitled UI](https://www.untitledui.com/icons) (`@untitledui/icons`, `@untitledui/file-icons` y `@untitledui/country-flags`, MIT).

Documentación y galerías: [regula.jotis.me](https://regula.jotis.me).

## React

```tsx
import { SocialGithubLogo } from "@jotis-me/assets/logos";
import { PaymentVisaMd } from "@jotis-me/assets/payments";
import { CursorHandGrab } from "@jotis-me/assets/cursors";

<SocialGithubLogo title="GitHub" />   {/* con `title` es una imagen con nombre; sin él, decorativo */}
<PaymentVisaMd />
```

Cada entrada es independiente: importar un logo no trae los demás.

## SVG sin React (Astro, HTML)

```astro
---
import Github from "@jotis-me/assets/logos/social/github.svg?raw";
---
<span set:html={Github} />
```

`@jotis-me/assets/payments/<nombre>.svg`, `@jotis-me/assets/cursors/<nombre>.svg` (usable como `cursor: url(…) 6 4, grab`), `@jotis-me/assets/hand-drawn/*.svg` (87 trazos) y `@jotis-me/assets/patterns/*.svg` (4 texturas). La tinta de los trazos es `currentColor`: ponlos en línea dentro de un elemento con `text-primary` y saldrán en #171717 en claro y #FAFAFA en oscuro. Uno o dos trazos por vista, nunca en pantallas de trabajo.

## Iconos de app

Ficheros listos en `@jotis-me/assets/app-icons/`: `{app}-{default,solid,light,mono,maskable}.svg`, `{app}-favicon.svg`, `{app}-favicon-32.png`, `{app}-any-{192,512}.png`, `{app}-maskable-{192,512}.png` y `{app}-apple-touch-icon.png` (180 px). Para generarlos al vuelo, `appIconSvg` de `@jotis-me/react/app-icon`.

```json
"icons": [
	{ "src": "/pecunia-any-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
	{ "src": "/pecunia-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

## Licencia

MIT. Los logos y los iconos de pago son marcas de sus dueños: se usan para representar una integración o un método de pago, sin cambiar su forma ni sus colores.
