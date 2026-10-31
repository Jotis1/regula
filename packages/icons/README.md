# @jotis-me/icons

Los 81 iconos de línea de la suite jotis.me (24×24, trazo de 2px redondeado) como componentes React y como SVG, y los iconos de app de cada producto.

Documentación y galería: [regula.jotis.me](https://regula.jotis.me).

## React (Next.js o Astro con islas)

```tsx
import { Icon, IconCalendar } from "@jotis-me/icons";

<Icon name="search-lg" />                  {/* decorativo: aria-hidden */}
<Icon name="search-lg" title="Buscar" />   {/* con nombre accesible */}
<IconCalendar size={24} className="text-fg-tertiary" />
<Icon name="loading-02" spin />            {/* gira; se para con movimiento reducido */}
```

El icono toma el color del texto (`currentColor`): ponle una utilidad `text-fg-*`. Tamaños de la guía: 20 en botones e inputs, 16 en botones xs y menús, 24 en navegación.

## SVG sin React (Astro, HTML)

```astro
---
import Calendar from "@jotis-me/icons/svg/calendar.svg?raw";
---
<span class="text-fg-tertiary" set:html={Calendar} />
```

## Iconos de app

```ts
import { appIconSvg, apps } from "@jotis-me/icons/app-icon";

appIconSvg({ app: "pecunia", variant: "light" });
```

Ficheros listos en `@jotis-me/icons/app-icons/`: `{app}-{default,solid,light,mono,maskable}.svg`, `{app}-favicon.svg`, `{app}-favicon-32.png`, `{app}-any-{192,512}.png`, `{app}-maskable-{192,512}.png` y `{app}-apple-touch-icon.png` (180 px).

```json
"icons": [
	{ "src": "/pecunia-any-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
	{ "src": "/pecunia-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

## Trazos a mano y patrones

`@jotis-me/icons/hand-drawn/*.svg` (87: subrayados, círculos, flechas, acentos) y `@jotis-me/icons/patterns/*.svg` (4 texturas). La tinta es `currentColor`: pon el SVG en línea dentro de un elemento con `text-primary` y saldrá en #171717 en claro y #FAFAFA en oscuro. Como imagen (`<img>`) no hereda color; usa `mask-image` con `background: currentColor`.

Uno o dos trazos por vista, nunca en pantallas de trabajo. Los patrones van en gris claro; en oscuro, bájales la opacidad al 10–20 %.

## Licencia

MIT.
