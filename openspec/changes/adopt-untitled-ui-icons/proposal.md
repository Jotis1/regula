# Proposal

## Why

`@jotis-me/icons` copia a mano los iconos de línea, los de archivo y las banderas de Untitled UI (licencia MIT): 27 MB en el repo, 15 MB de `dist`, cinco scripts de importación y más de 3 MB de `.tsx` generado que hay que mantener, cuando Untitled UI ya los publica en npm. Además, la web tiene tres defectos visibles: las muestras en vivo del índice de componentes se ven atrofiadas, la fila «Tipos» del ejemplo interactivo no encaja (botones secundarios sueltos) y los controles se descolocan cuando alguno se desactiva.

## What Changes

**Iconos**

- **BREAKING** Se elimina `@jotis-me/icons`. Los iconos de línea pasan a ser los de `@untitledui/icons`, los de archivo los de `@untitledui/file-icons` y las banderas las de `@untitledui/country-flags` (los tres oficiales, MIT; el scope real en npm es `@untitledui`, sin guion).
- **BREAKING** Las props de icono de `@jotis-me/react` (`icon`, `iconLeading`, `iconTrailing`, `iconOnly`…) dejan de aceptar nombres en cadena (`icon="search-lg"`): aceptan un componente de icono (`icon={SearchLg}`) o un nodo (`icon={<SearchLg />}`). Desaparecen `Icon`, `IconName` e `iconNames` del paquete.
- **BREAKING** Lo que Untitled UI no publica en npm (logos de terceros, iconos de pago, cursores, trazos a mano y patrones) se muda a un paquete nuevo y más pequeño, `@jotis-me/assets`, con las mismas entradas (`/logos`, `/payments`, `/cursors`, `/hand-drawn/*`, `/patterns/*`).
- **BREAKING** Se eliminan sin sustituto propio: las banderas en cuadrado y rectángulo (el paquete oficial solo trae 234 en círculo, frente a las 261 × 3 formas de hoy), las variantes de carpeta (marca, gris, ruido, transparente, abierta y cerrada) y las extensiones de archivo que `@untitledui/file-icons` no tiene, y los SVG sueltos de iconos de línea (`@jotis-me/icons/svg/*`). Tres iconos de línea del Figma no existen en `@untitledui/icons`: `align-top-01`, `align-top-02` y `help-hexagon`.
- **BREAKING** La geometría del icono de app (`appIconSvg`, `apps`, `validateApps`…) pasa a `@jotis-me/react` (con una entrada sin React, `@jotis-me/react/app-icon`); los ficheros de favicon y PWA pasan a `@jotis-me/assets/app-icons/*`.
- Las galerías de `/icons/` se mantienen, leyendo de los paquetes nuevos; la de banderas enseña solo el círculo y el código que copian importa del paquete que toca.
- El artefacto generado deja de llevar los grupos de assets de iconos de línea, banderas y archivos.

**Web**

- Las cards de `/components/` vuelven a mostrar una captura: una imagen WebP por componente y tema (claro y oscuro), de una muestra tipo *showcase* (lo más característico, no una representación 1:1), generada con Playwright y optimizada con sharp por un script, y guardada en el repo. Sustituye a las muestras en vivo. Con ello desaparece la excepción de Lighthouse (0,80) del índice.
- Se elimina la fila «Tipos» (atajos) del ejemplo interactivo: quedan solo los controles de propiedades.
- Los controles del ejemplo interactivo se alinean por arriba: el motivo que aparece bajo un control desactivado ya no desplaza a los demás.

**Fuera de alcance**: los ajustes componente por componente que vendrán después (cada uno irá en su propio cambio o como tareas añadidas a este).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `icon-set`: se retiran el set propio de iconos de línea, banderas e iconos de archivo; se define el uso de los paquetes de Untitled UI y el paquete `@jotis-me/assets` con logos, pagos y cursores.
- `component-library`: las props de icono aceptan componente o nodo en lugar de nombre; los ejemplos que citan `@jotis-me/icons` cambian de paquete.
- `package-distribution`: los paquetes publicados pasan a ser `@jotis-me/tokens`, `@jotis-me/assets` y `@jotis-me/react`; `@jotis-me/react` depende de `@untitledui/icons`.
- `brand-assets`: de dónde se importa el icono de app y sus ficheros.
- `design-system-artifact`: grupos de assets que lleva el artefacto.
- `docs-site`: capturas WebP en las cards del índice (en lugar de la vista previa en vivo), playground sin atajos y con controles alineados, galerías y fragmentos de código con los paquetes nuevos, y umbral de Lighthouse de 90 en todas las páginas.

## Impact

- **Paquetes**: se borra `packages/icons` (assets, scripts de importación, generados, tests y e2e); se crea `packages/assets` con lo que se conserva. `@jotis-me/react` cambia la dependencia `@jotis-me/icons` por `@untitledui/icons`, y unas 45 ficheros de componente cambian el tipo de sus props de icono y sus iconos internos (unas 200 apariciones de nombres en cadena).
- **Apps de la suite** (Ornatus, Vinculum, Pecunia, Emptor, Scaena): al subir a 0.8.0 tienen que cambiar cada `icon="…"` por un componente, y las importaciones de `@jotis-me/icons/*` por `@jotis-me/assets/*` o los paquetes de Untitled UI. El changelog lleva la guía de migración.
- **Web** (`apps/docs`): playground (`Playground.tsx`, `lib/playground.ts`, los `lib/starts/*` con sus `presets`), el selector de icono del playground, las galerías de `/icons/`, los ejemplos de `src/visual/`, el índice de componentes (`LivePreview.astro`, `thumbnails.tsx`), los límites de JavaScript, Lighthouse y los e2e que dependen de todo ello. Dependencias nuevas de desarrollo: `sharp`, `@untitledui/file-icons`, `@untitledui/country-flags`.
- **Artefacto** (`scripts/artifact`): grupos de assets e índice.
- **CI y publicación**: `.changeset/config.json` (grupo fijo), `ci.yml` (lista de paquetes y e2e), y marcar `@jotis-me/icons` como obsoleto en npm tras publicar 0.8.0.
- **Riesgo**: `@untitledui/*` van por versiones `0.0.x`; se fijan versiones exactas y un test comprueba que los iconos que usa el paquete existen.
