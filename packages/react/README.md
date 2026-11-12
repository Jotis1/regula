# @jotis-me/react

Los componentes de la suite jotis.me para Next.js y Astro, con Tailwind CSS v4. Trae consigo `@jotis-me/tokens` (colores, tipografía, fuentes) y `@untitledui/icons` (los iconos).

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

## Iconos

Los iconos son los de [Untitled UI](https://www.untitledui.com/icons) (`@untitledui/icons`, MIT). Las props de icono (`icon`, `iconLeading`, `iconTrailing`, `iconOnly`…) aceptan el componente o un nodo ya pintado, no un nombre:

```tsx
import { Button } from "@jotis-me/react";
import { Plus, Rocket02 } from "@untitledui/icons";

<Button iconLeading={Plus}>Nuevo</Button>                         {/* el componente: el botón le pone tamaño y color */}
<Button iconLeading={<Rocket02 size={16} />}>Lanzar</Button>      {/* un nodo: se pinta tal cual, con su propio tamaño */}
```

Un componente es una función y **no cruza** de un Server Component (Next.js) ni de un `.astro` a un componente de cliente ni a una isla: ahí pasa el nodo (`<Plus size={16} />`) o envuelve el componente en un `.tsx` de cliente. Importa solo los iconos que uses: con `sideEffects: false` el resto no entra en tu bundle.

Iconos de archivo (`@untitledui/file-icons`) y banderas (`@untitledui/country-flags`) se usan igual, como nodo (`<FileIcon type="pdf" />`, `<FlagEs />`). Los logos de terceros, los iconos de pago y los cursores están en `@jotis-me/assets`.

El icono de app (`AppIcon`) y su geometría, también sin React, están aquí: `import { appIconSvg } from "@jotis-me/react/app-icon"`.

## Migrar desde 0.7

`@jotis-me/icons` desaparece. Cambia `icon="search-lg"` por `icon={SearchLg}` (kebab-case a PascalCase) y `<Icon name="x" />` por el componente: `bun run scripts/migrate-icons.ts <rutas>` del repo de Regula lo hace por ti. `IconRocket02` pasa a `Rocket02`; los logos, pagos y cursores, de `@jotis-me/icons/…` a `@jotis-me/assets/…`; los iconos de archivo y las banderas, a los paquetes de Untitled UI.

## Modo oscuro

Clase `dark-mode` en `<html>`. La variante `dark:` responde a esa clase.

## Licencia

MIT.
