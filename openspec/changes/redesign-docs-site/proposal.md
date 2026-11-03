# Proposal

## Why

La web de documentación (regula.jotis.me) se montó con un diseño provisional: cabecera, barra lateral alfabética y páginas que vuelcan la ficha de la guía tal cual. Con 74 componentes cuesta encontrar las cosas, y la página de componente no deja probar ni copiar variantes. El usuario encargó a Claude Design un diseño propio de la web, el proyecto "Regula · web de documentación" (artefacto `242dc7f2-8bea-4c9f-87b8-a34506d57a6f`, versión `1793652886-4c32`). Este cambio lo lleva a la web antes de migrar las apps, que es cuando más se va a consultar.

## What Changes

- **Estructura y navegación.**
  - Cabecera con cinco secciones (Empezar, Fundamentos, Componentes, Stream, Iconos), búsqueda con aspecto de campo y conmutador de tema.
  - Navegación lateral con filtro, componentes agrupados por tipo (Acciones, Formularios, Navegación…) y Stream como sección propia, con sus cuatro grupos.
  - Menú móvil a pantalla completa, con búsqueda y tema en tres estados (Sistema, Claro, Oscuro).
  - Migas de pan, índice "En esta página", anterior/siguiente y relacionados.
- **Marca de la web.** La cabecera, el pie y el menú muestran "Regula" con su icono de app, en lugar de "jotis.me" junto a "Regula". **BREAKING** para el requisito actual de `docs-site`.
- **Regula en la familia de iconos de app.** Se porta lo que la guía añadió y `create-regula-design-system` dejó fuera (su design §12): Regula (`Re`, tono `fuchsia`) en el registro de apps, con sus SVG, favicon y PNG. La versión `1793561361-ae73` lo traía en una paleta propia, `chartreuse`; la `1793653059-466a` (decisión del usuario, 3 nov) lo pasa a `fuchsia`, de la paleta de Tailwind, y quita `chartreuse` de los tokens. `reference/` se reimporta a esa versión.
- **Portada nueva:**
  - mensaje principal con un formulario de componentes reales;
  - instalación en tres pasos;
  - mapa de secciones con sus cifras;
  - "Cinco reglas que se olvidan";
  - las apps de la suite.
- **Página de componente nueva:**
  - **playground** generado desde las props (un selector por unión, un interruptor por booleano) que pinta el componente y su código;
  - la ficha de la guía repartida, sin reescribir, en "Úsalo así", "Evita", "Detalles" y "Accesibilidad";
  - variantes, props, código para Next.js y Astro con la nota de isla, y lo que amplía o difiere de la guía.
- **Páginas de fundamentos** con la composición del diseño (tarjetas de "lo esencial", tablas, ejemplos vivos) y el texto de la guía. La de Color filtra los tokens, los agrupa por familia y muestra el contraste calculado.
- **Galería de iconos** con tamaño de vista previa y un panel del icono elegido (tamaños, uso por contexto, código React, importación SVG y SVG en bruto).
- **Páginas nuevas:**
  - índice de componentes (`/components/`);
  - historial de cambios (`/changelog/`), desde los CHANGELOG de Changesets;
  - vista a tamaño real de los lienzos de Stream (`/components/stream-scene/full/` y `/components/channel-banner/full/`).
- **URLs nuevas, sin redirecciones** (decisión del usuario: la web lleva menos de una semana publicada). **BREAKING** para los enlaces antiguos:
  - `/usage/tailwind/` → `/start/install/`;
  - `/foundations/spacing/` → `/foundations/layout/`;
  - `/foundations/shadows/` → `/foundations/states/`.
- **Pie** con enlaces de documentación y de la suite, la versión de los paquetes y el enlace al historial.
- **Datos reales, no los del diseño.** El diseño trae ejemplos inventados que no se llevan a la web:
  - nombres de paquete (`@jotis/regula`, `@jotis/regula/stream`, `@untitledui/icons`);
  - una prop `as` en Button que no existe;
  - "tokens v2 sincronizados con Figma".

  La web usa `@jotis-me/react`, `@jotis-me/tokens` y `@jotis-me/icons`, las props de los tipos y los textos de la guía.

Fuera de este cambio:
- las fuentes de reserva ajustadas (seguimiento de `create-regula-design-system`);
- cambiar los componentes de `@jotis-me/react`, salvo `AppIcon` y el nombre accesible de la barra de tono de `ColorPicker` (decisión del usuario, 3 nov: la ficha repartida dejó a la vista un fallo de su HTML de servidor, ver design §3);
- la paridad visual de los componentes con la guía, que no cambia.

## Capabilities

### New Capabilities
Ninguna.

### Modified Capabilities
- `docs-site`:
  - estructura de secciones y URLs;
  - contenido de la página de componente (playground, ficha repartida, relacionados);
  - galería de iconos con panel;
  - tema en tres estados;
  - marca de la cabecera;
  - navegación agrupada con filtro y menú móvil;
  - pie con historial;
  - páginas nuevas: portada, índice de componentes, historial y tamaño real.
- `brand-assets`: el registro de apps incluye Regula (`Re`, `fuchsia`).

## Impact

- **`apps/docs`:**
  - se rehacen el layout, la cabecera, la navegación, el pie, la portada, la página de componente, las de fundamentos y la de iconos;
  - nuevos playground, índice de componentes, historial y vistas a tamaño real;
  - cambian las rutas;
  - los e2e (`components`, `foundations`, `icons`, `search`, `theme`, `tokens`, `a11y`) se adaptan a la nueva estructura;
  - la paridad visual (`/visual/`) y su arnés no cambian.
- **`packages/tokens`:** regenerar `src/tokens.json` desde la guía `1793653059-466a` con `translate-usage.ts` y quitar la exclusión `UNPORTED` de `test/usage.test.ts`: la guía ya no trae tokens sin portar.
- **`packages/icons` y `packages/react`:** Regula (`fuchsia`) en el registro de apps y los SVG/PNG de Regula. `AppIcon` deja de compararse con la vista previa fijada (`e2e/visual/pinned/AppIcon.preview.html`) y se recaptura su referencia.
- **Changeset:** `minor` para `@jotis-me/icons` y `@jotis-me/react` (Regula en `AppIcon`); y `patch` para `@jotis-me/react` (ColorPicker); los tres suben juntos (Changesets en modo `fixed`).
- **Dependencia de orden:** `docs-site` y `brand-assets` solo existen todavía como deltas de `create-regula-design-system`. Este cambio se archiva después de ese.
- **Rama:** `rediseno-web`, creada desde `grupo-13-stream`. Se rebasa sobre `main` cuando `grupo-13-stream` esté fusionada.
