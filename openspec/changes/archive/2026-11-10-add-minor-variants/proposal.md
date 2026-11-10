# Proposal

## Why

Es la fase 3 del inventario del Figma «Yoruverse UI v8.0» (6 de noviembre de 2026): las variantes menores. Las apps ya piden un aviso de novedad junto a un badge, una etiqueta de sección para los ajustes, botones pequeños de herramienta con tooltip, más estilos de carga y estados vacíos con algo más que un icono, y hoy los hacen a mano. Además, varias apps enseñan logos de servicios de terceros (integraciones, redes, inicio de sesión) y Regula no los tiene: cada app los busca y los pega por su cuenta.

## What Changes

- **`BadgeGroup`** (nuevo): un badge dentro de otro con un mensaje y una flecha («Nuevo · Hemos publicado una función →»). Badge delante o detrás, tipos `pill` y `modern`, colores gris, marca, error, aviso y éxito, tamaños `md` y `lg`, y enlace o botón con su hover.
- **`SectionLabel`** (nuevo): el título de una sección de ajustes con marca de obligatorio, icono de ayuda, texto de apoyo y acciones de enlace debajo, en `sm` y `md`.
- **`ButtonUtility`** (nuevo): botón de solo icono pequeño (`xs`, `sm`), `secondary` o `tertiary`, que enseña su nombre en un tooltip al pasar el ratón o enfocarlo.
- **`Spinner`**: dos estilos nuevos además del actual: solo el arco, sin pista (`line-spinner`), y un círculo de puntos que se desvanecen (`dot-circle`). Sin la prop nueva, igual que ahora.
- **`EmptyState`**: las ocho cabeceras del Figma (icono destacado, que es la de hoy; ilustración de nube, caja, documentos o tarjeta; icono de archivo sobre cuadrícula; carpeta; carpeta translúcida; usuarios en círculos; usuarios en fila; e integraciones) y tamaños `sm`, `md` y `lg`. Las de usuarios e integraciones reciben sus avatares o logos de quien lo usa: en una app pueden ser fotos; en los ejemplos de Regula van avatares con iniciales, sin fotos, para no cargar peso.
- **Logos de terceros** en `@jotis-me/icons` (petición del usuario): los tres sets del Figma, «App icons» (232), «Integration icon» (16) y «Social icon» (34), con sus variantes en color y en gris, como componentes React sueltos y como SVG, en una entrada propia que no engorda la de los iconos.
- `/icons/` enseña también los logos, con el mismo buscador y panel de copiar.
- El catálogo pasa de 91 a 94 componentes, cada uno con página, ficha, ejemplo, muestra y capturas aprobadas.
- Fuera de alcance: el set completo de iconos de tipo de archivo del Figma (153; aquí solo el dibujo que usa `EmptyState`), los logos de empresas ficticias y de prensa de la página «Logos» del Figma, las banderas, los badges de tiendas de apps y los botones de redes sociales.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: el catálogo crece con tres componentes, y `Spinner` y `EmptyState` ganan variantes, con un requisito para cada pieza.
- `icon-set`: el paquete de iconos publica los logos de terceros.
- `docs-site`: la galería de `/icons/` incluye los logos.
- `design-system-artifact`: el artefacto lleva los logos como grupo de assets.

## Impact

- `packages/react`: tres componentes nuevos, cambios retrocompatibles en `Spinner` y `EmptyState`, textos en `defaultStrings`, tests y límites en `size-budget.json`. Changeset `minor`.
- `packages/icons`: una entrada nueva (`@jotis-me/icons/logos`) con los componentes generados y sus SVG, generada desde SVG guardados en `assets/logos/`. Changeset `minor`. El tarball crece: se mide y se anota.
- `apps/docs`: tres páginas, ejemplos, muestras, fragmentos y capturas, capturas nuevas de `Spinner` y `EmptyState` si cambian sus ejemplos, y la galería de iconos con los logos. Debe quedar dentro del límite de JS por página de `trim-docs-js`.
- Artefacto: tres componentes más y un grupo nuevo de assets con los logos en la próxima sincronización (cientos de assets que subir, en tandas de 25).
- Orden: va en la misma PR que `trim-docs-js`, después de él. Los dos modifican `docs-site`, en requisitos distintos.
