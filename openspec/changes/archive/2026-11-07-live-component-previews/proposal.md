# Proposal

## Why

Las fotos de las cards de `/components/` son las capturas aprobadas de la paridad visual, recortadas en el build con `sharp` (`apps/docs/src/lib/previews.ts`). Eso ata el build de la web a las PNG: un componente nuevo no se puede construir hasta que alguien pone una captura provisional, y una foto se queda desfasada hasta que se recaptura. Scaena resuelve lo mismo en su estudio sin capturas: pinta el componente real con datos de ejemplo y lo encoge con CSS (`Scaled`, en `components/studio/OverlaySources.tsx`). Aquí ya tenemos el ejemplo de cada componente en el registro visual, así que la foto puede ser el propio ejemplo.

## What Changes

- Cada card de `/components/` muestra, en lugar de una imagen, una muestra con lo más característico del componente (un botón, un campo, unas filas de tabla…), pintada en el servidor dentro de un recuadro fijo y sobre un fondo de cuadros sutil, como las vistas previas de Scaena. Las muestras son propias de la card: el ejemplo del registro visual, que tiene todas las variantes, no se toca.
- La vista previa es decorativa:
  - va en un contenedor `inert` y `aria-hidden`;
  - no se puede enfocar ni se puede usar con el ratón;
  - no cambia el nombre accesible de la card.
- Sigue el tema de la página. Los componentes de Stream van siempre en oscuro, como en su vista previa.
- No envía JavaScript: se pinta en el servidor, sin isla.
- Se quitan el recorte de fotos (`src/lib/previews.ts`), el endpoint `/components/previews/<nombre>-<tema>.webp`, su test y la dependencia `sharp` de la web.
- El build de la web deja de leer `e2e/visual/approved/`. Las PNG aprobadas siguen siendo la referencia de la paridad visual, y el test de catálogo sigue exigiéndolas.

Fuera de este cambio:
- Las páginas de cada componente y el artefacto "Jotis.me", que ya pintan los ejemplos en vivo.
- Cambiar los ejemplos del registro. Si alguno no se ve bien en miniatura, se encuadra con un ajuste de la vista previa, no tocando el ejemplo, porque el ejemplo es lo que compara la paridad visual.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities
- `docs-site`: junto al «Índice de componentes», tres requisitos nuevos. Cada card lleva una vista previa en vivo del componente, sin JavaScript; esa vista previa es decorativa; y el build de la web no depende de las capturas aprobadas.

## Impact

- **Código** (`apps/docs`):
  - `src/pages/components/index.astro`;
  - un componente nuevo de vista previa y un fichero de encuadre por componente;
  - se borran `src/lib/previews.ts`, `src/pages/components/previews/[file].webp.ts` y `test/previews.test.ts`;
  - cambia el e2e de las cards en `e2e/components.spec.ts`.
- **Dependencias:** sale `sharp` de `apps/docs`, que solo lo usaba el recorte de fotos.
- **Rendimiento:** la página deja de descargar unos 560 KB de WebP, pero su HTML crece con 78 ejemplos pintados. El design fija cómo se mide y se contiene.
- **Un arreglo en `@jotis-me/react`** (changeset *patch*): `Dropdown` abierto de inicio repetía ids y dejaba referencias ARIA rotas en su HTML de servidor. En su página lo tapaba la hidratación; en la muestra del índice, que no se hidrata, no. Decisión del usuario durante la implementación: arreglarlo en el paquete.
