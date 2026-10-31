# @jotis-me/tokens

Tokens de diseño de la suite jotis.me: colores semánticos en claro y oscuro, escala tipográfica, radios, sombras y las fuentes (Geist, Geist Mono y Bricolage Grotesque), listos para Tailwind CSS v4.

Documentación: [regula.jotis.me](https://regula.jotis.me).

## Instalación

```sh
bun add @jotis-me/tokens
```

Si usas `@jotis-me/react` no hace falta: ya lo trae y su `styles.css` importa todo lo de aquí.

## Con Tailwind v4 (Next.js o Astro)

En tu hoja principal:

```css
@import "tailwindcss";
@import "@jotis-me/tokens/fonts.css";
@import "@jotis-me/tokens/tokens.css";
@import "@jotis-me/tokens/theme.css";
```

Cada token es la utilidad del mismo nombre: `bg-primary`, `bg-brand-solid`, `text-secondary`, `border-secondary`, `text-fg-quaternary`, `bg-utility-brand-50`, `bg-alpha-white/10`, `rounded-lg`, `shadow-xs-skeuomorphic`, `text-display-sm`, `font-display`, `max-w-container`. La paleta cruda (`bg-indigo-600`) no existe a propósito.

## Modo oscuro

Pon la clase `dark-mode` en `<html>` (o en cualquier ancestro). La variante `dark:` también responde a esa clase.

## Variables CSS

Sin Tailwind, usa las variables directamente: `var(--bg-primary)`, `var(--text-tertiary)`, `var(--spacing-xl)`, `var(--radius-lg)`.

## Desde código

```ts
import { tokens, seriesColors } from "@jotis-me/tokens";

tokens["text-primary"]; // { light: "#171717", dark: "#fafafa", usage: "…" }
```

## Licencia

MIT. Las fuentes de `fonts/` tienen licencia SIL Open Font License 1.1 (ver `fonts/LICENSE-*.txt`).
