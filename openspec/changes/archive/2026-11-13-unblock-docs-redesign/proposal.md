# Proposal

## Why

El rediseño de regula.jotis.me (lienzo «Regula - rediseño de la web» y su documento de dirección, 12 de noviembre de 2026) usa en todas las páginas tres cosas que el sistema no tiene. Sin ellas la web tendría que hacerlas a mano, que es justo lo que su propia spec prohíbe:

- La navegación lateral pasa a ser `SidebarNav`, pero `SidebarNav` despliega sus submenús con JavaScript, y la spec de la web exige que el lateral funcione sin él.
- La sección «Así se ve» de la portada enseña la misma pantalla en claro y en oscuro a la vez. Hoy los tokens solo permiten forzar oscuro dentro de una página clara (`.dark-mode`), no claro dentro de una oscura.
- «Las cinco reglas» de la portada son una historia por pasos que se pulsa. `ProgressSteps` solo enseña el avance: no se puede pulsar un paso ni poner contenido en el actual.

Los tres sirven también fuera de la web: menús que se ven antes de hidratar, vistas previas de tema en los ajustes de cualquier app y asistentes navegables.

## What Changes

- **`SidebarNav`**: prop `disclosure` (`"script"` por defecto, `"native"`). Con `"native"`, cada elemento con `children` se pinta como `<details>`/`<summary>` y se abre y se cierra sin JavaScript; el abierto de inicio es el que lleva `defaultOpen` o el que contiene el activo. Sin la prop, igual que ahora.
- **`.light-mode`** en `@jotis-me/tokens`: la pareja de `.dark-mode`. Redefine los tokens a su valor claro dentro de su contenedor, y la variante `dark:` deja de aplicarse dentro de él.
- **`ProgressSteps`**: props `onChange(index)` y `children` (una función que recibe el índice actual y pinta su contenido). Con `onChange`, cada paso es un botón que lleva a ese paso; con `children`, el contenido del actual va bajo su título en vertical, o bajo la fila en horizontal. Sin las props nuevas, igual que ahora.
- Fuera de alcance: anidar más de un nivel de tema (claro dentro de oscuro dentro de claro), `disclosure="native"` en el tipo `dual-tier` y `slim` (su segundo panel necesita JavaScript) y animar el despliegue nativo.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: `SidebarNav` gana los submenús nativos y `ProgressSteps` pasa a ser navegable, con un requisito para cada uno.
- `design-tokens`: los tokens publican `.light-mode` y la variante `dark:` lo respeta.

## Impact

- `packages/tokens`: un bloque más en `tokens.css`, generado igual que el oscuro, y la variante `dark` en `theme.css`. Tests de paridad. Changeset `minor`.
- `packages/react`: cambios retrocompatibles en `SidebarNav` y `ProgressSteps`, tests y límites en `size-budget.json` si crecen. Changeset `minor`.
- `apps/docs`: ejemplos interactivos y fichas de los dos componentes, y una nota en la página de color. Sin capturas nuevas salvo donde el ejemplo enseñe lo nuevo.
- Artefacto: `.light-mode` llega con la hoja en la próxima sincronización; el artefacto lo expone también como `data-theme="light"`, igual que `data-theme="dark"`.
- Orden: va antes que `add-docs-variants`, `add-docs-pieces` y `redesign-docs-site-v2`, que lo usan.
