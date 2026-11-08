# Proposal

## Why

La web de documentación ha ido creando piezas que cualquier app de la suite necesita, y algunas ya están copiadas en otro proyecto. El damero de transparencia está escrito a mano en las cards de `/components/`, en el ejemplo de CamFrame y en Scaena. La vista previa encogida existe como `Scaled` en Scaena. La tecla de atajo está duplicada: privada en el paquete y repetida a mano en cuatro sitios de la web. La card con enlace estirado, el «Anterior / Siguiente» y el aviso de «Copiado» viven solo en la web. Al llevarlas a `@jotis-me/react` se escriben una vez, con sus tests y sus fichas, y la web pasa a usarlas como una app más.

## What Changes

- **`TransparencyGrid`** (nuevo): fondo de damero que indica transparencia y sigue el tema. Sustituye al de las cards de `/components/` y al del ejemplo de CamFrame, que pasan a ser el mismo. El de CamFrame cambia un poco de aspecto.
- **`ScaledPreview`** (nuevo): pinta una pieza a su ancho real y la encoge para que quepa en una caja, como el `Scaled` de Scaena.
- **`Kbd`** (nuevo, público): tecla o atajo con dos variantes. `menu` es la de los atajos de Dropdown y CommandMenu, que ya existe privada en el paquete. `field` es la de «Ctrl K» en la búsqueda, el filtro de la navegación y la portada, que hoy está repetida a mano en la web. Lo que ya se ve no cambia.
- **`LinkCard`** (nuevo): card cuyo enlace cubre toda la superficie, con una zona de vista previa opcional que no es interactiva. La usan las cards de `/components/`.
- **`Pager`** (nuevo): navegación «Anterior / Siguiente» al final de una página. Sustituye a `Pager.astro` de la web.
- **`useCopy`** (hook nuevo) y **`CopyTooltip`** (nuevo): copiar al portapapeles y avisarlo con una burbuja «Copiado», como la de `Tooltip`, junto al elemento pulsado. No repite el valor, que podría desbordarla. Hoy la web pone «Copiado: <valor>» en un aviso en la esquina; decisión del usuario: una burbuja junto a lo copiado y no un toast. Sustituye al aviso global de la web (`CopyToast.astro`, botones con `data-copy` en tokens e iconos). **`CodeSnippet` no cambia**: conserva su propio ✓ y «Copiado».
- El catálogo pasa de 78 a 84 componentes. Cada nuevo tiene su página, ficha, ejemplo y captura aprobada, y llega al artefacto en la próxima sincronización.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: el catálogo crece con seis componentes, y hay requisitos nuevos para el damero, la vista previa encogida, la tecla de atajo, la card enlazada, el «Anterior / Siguiente» y la burbuja de copia.

`docs-site` no cambia de requisitos: la web ya pide que copiar una utilidad «se confirma con un aviso breve», y lo seguirá haciendo, ahora con las piezas del paquete.

## Impact

- `packages/react`: seis componentes y un hook nuevos en `src/components/` (y `src/hooks/`), exportados desde `src/index.ts`, con sus tests. `internal/kbd.tsx` pasa a ser el `Kbd` público y lo siguen usando Dropdown y CommandMenu. Changeset `minor`.
- `apps/docs`: seis páginas de componente, con sus ejemplos (`src/visual/examples`), muestras para las cards (`thumbnails.tsx`) y capturas aprobadas. `LivePreview.astro`, `components/index.astro`, `Pager.astro`, `CopyToast.astro`, `SideNav.astro`, `SiteSearch.tsx`, `pages/index.astro` y el ejemplo de CamFrame pasan a usar las piezas del paquete; `Pager.astro` y `CopyToast.astro` desaparecen. Catálogo y grupos en `src/lib/catalog.ts`.
- Artefacto: seis componentes más en la próxima sincronización, sin assets nuevos.
- Scaena puede usar `TransparencyGrid` y `ScaledPreview` después. Queda fuera de este cambio, que es de este repo.
