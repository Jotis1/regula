# @jotis-me/react

Los componentes de la suite jotis.me para Next.js y Astro, con Tailwind CSS v4. Trae consigo `@jotis-me/tokens` (colores, tipografía, fuentes) y `@jotis-me/icons`.

Documentación con ejemplos de cada componente: [regula.jotis.me](https://regula.jotis.me).

## Next.js (App Router)

```sh
bun add @jotis-me/react tailwindcss @tailwindcss/postcss
```

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`app/globals.css`:

```css
@import "tailwindcss";
@import "@jotis-me/react/styles.css";
```

Impórtalo en `app/layout.tsx` y úsalos donde quieras:

```tsx
import { Button } from "@jotis-me/react";

export default function Page() {
	return <Button>Guardar</Button>;
}
```

Los componentes sin estado funcionan como Server Components. Los interactivos ya llevan `"use client"`: impórtalos también desde páginas de servidor.

## Astro

```sh
bunx astro add react
bun add @jotis-me/react tailwindcss @tailwindcss/vite
```

`astro.config.mjs`:

```js
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({ integrations: [react()], vite: { plugins: [tailwindcss()] } });
```

`src/styles/global.css`, importado desde tu layout:

```css
@import "tailwindcss";
@import "@jotis-me/react/styles.css";
```

```astro
---
import { Button, ButtonGroup } from "@jotis-me/react";
---
<Button>Guardar</Button>                       <!-- HTML estático, sin JavaScript -->
<ButtonGroup client:load items={[…]} />        <!-- interactivo: necesita client:* -->
```

Las props que son funciones (`onChange`…) no pueden pasar de un `.astro` a una isla: envuelve el componente en un `.tsx` y pásale ahí la función.

## Modo oscuro

Clase `dark-mode` en `<html>`. La variante `dark:` responde a esa clase.

## Licencia

MIT.
