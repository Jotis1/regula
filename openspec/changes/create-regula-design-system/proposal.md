# Proposal

## Why

La guía de diseño de la suite jotis.me (Vinculum, Pecunia, Emptor, Ornatus…) vive hoy solo como un artefacto de Claude ("Jotis.me", Design System): tokens, 62 componentes con ficha, iconos, fuentes y reglas de tono. Cada app tiene que reimplementar botones, inputs y colores a mano, lo que duplica trabajo y hace que las apps diverjan. Hace falta una fuente única, publicada y consultable, que las apps instalen en lugar de copiar.

## What Changes

- Nuevo monorepo `regula` con paquetes npm públicos bajo el scope `@jotis-me`:
  - **Tokens y tema Tailwind v4**: variables CSS semánticas en claro y oscuro, `@theme` de Tailwind con los mismos nombres que la guía (`bg-primary`, `text-brand-secondary`, `rounded-lg`, `text-display-sm`…), las tres familias tipográficas (Geist, Geist Mono, Bricolage Grotesque) y los tokens también en JSON/TS.
  - **Iconos**: los 81 iconos de línea del set, como componentes React y como SVG sueltos.
  - **Componentes React**: los 62 componentes de la guía, con las props de sus fichas, compatibles con Next.js (App Router y SSR) y con Astro mediante islas de `@astrojs/react`.
  - **Recursos de marca**: `AppIcon` de cada app (Or, Vi, Pe, Em) en sus cuatro variantes, fondos, patrones y trazos a mano.
- Nueva web **regula.jotis.me** que documenta todo lo de la guía: principios, contenido y tono, color, tipografía, espaciado, sombras, iconografía, marca e iconos de app, y una página por componente con ejemplos vivos, props, cuándo usarlo y qué evitar, en claro y oscuro.
- Proyectos de ejemplo Next.js y Astro que consumen los paquetes publicados y sirven de prueba de integración.
- Versionado semántico y publicación automatizada en el registro público de npm.

## Capabilities

### New Capabilities

- `design-tokens`: tokens semánticos de color, tipografía, espaciado, radios y sombras en claro y oscuro, el tema de Tailwind v4 que los expone como utilidades y las fuentes de la suite.
- `icon-set`: el set de iconos de línea (24×24, trazo 2px) consumible desde React, Astro y como SVG.
- `component-library`: los componentes React de la guía, su API pública, estados, accesibilidad y compatibilidad con Next.js y Astro.
- `brand-assets`: iconos de app de la suite (construcción, variantes, tamaños, PWA) y adornos (fondos, patrones, trazos a mano).
- `docs-site`: la web regula.jotis.me con las reglas de diseño y la documentación viva de cada componente.
- `package-distribution`: cómo se versionan, publican e instalan los paquetes y qué garantiza cada versión.

### Modified Capabilities

Ninguna: el proyecto no tiene specs previas.

## Impact

- **Código nuevo**: todo el repositorio (aún no es repo git). Monorepo con paquetes, web y ejemplos.
- **Dependencias**: React 18/19 como peer, Tailwind CSS v4 como peer, Astro para la web, librería headless de accesibilidad para los componentes interactivos (ver design.md).
- **Sistemas externos**: registro público de npm (scope `@jotis-me`), Vercel para regula.jotis.me y su registro DNS bajo jotis.me, CI en GitHub Actions.
- **Apps de la suite**: podrán sustituir sus componentes propios por los paquetes; la migración de cada app queda fuera de este cambio.
- **Fuente de verdad**: el artefacto "Jotis.me" de Claude se importa al repo como referencia; a partir de aquí manda el repo y el artefacto se actualiza desde él si hace falta.
