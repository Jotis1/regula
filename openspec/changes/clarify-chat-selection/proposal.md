# Proposal

## Why

En el Mando de Scaena, el chat es seleccionable: pulsar un mensaje lo destaca en pantalla. Pero en un panel de moderación, un mensaje que se puede pulsar da miedo. Nada dice qué va a pasar, y quien lo usa puede pensar que va a borrar el mensaje o a banear a su autor. Además, el mensaje elegido se marca con «fondo activo y borde índigo», que no se parece a ningún otro «destacado» del sistema. `CodeSnippet` ya tiene su forma de destacar: las líneas marcadas llevan `bg-brand-primary_alt` y una raya de 2px en `fg-brand-primary`.

## What Changes

- **Qué hace el clic, a la vista:** con `onSelect`, cada mensaje seleccionable lleva a la derecha una marca con la chincheta de `StreamPinnedMessage` y el texto «Destacar».
  - Con ratón, sale al pasar por encima o con el foco.
  - En pantallas táctiles, que no tienen hover, se ve siempre la chincheta sola, discreta.
  - El elegido la lleva siempre, con «Destacado».
- **El elegido se destaca como en `CodeSnippet`:** raya de 2px en `fg-brand-primary` a la izquierda sobre un fondo de marca, en lugar de `bg-active` y `border-brand`.
- **Nombre accesible con la acción:** cada botón se llama «Destacar el mensaje de lucia_88: ¿Has mirado detrás del cuadro?», así que un lector de pantalla dice qué hace antes de leer el mensaje.
- **Textos editables:** `labels` (`select` y `selected`, «Destacar» y «Destacado» por defecto), para quien use la selección para otra cosa.
- Sin `onSelect`, `ChatBox` no cambia: el chat del overlay se ve igual.
- **Arreglos que salen a la vez:**
  - `ChatBox` con `onSelect` recortaba los mensajes por dentro cuando no cabían todos (en la ventana deslizante, en cuanto rotaba la primera vez). La marca solo quita sitio a la primera línea de cada mensaje, no a todas.
  - En `CodeSnippet`, el fondo de una línea destacada no llegaba al final si la línea no cabía en el bloque: se quedaba corto al desplazarse.
  - En `/changelog/`, las sublistas salían con los guiones del Markdown, una entrada que empezaba por una lista dejaba un guion suelto, la tabla de migración de la 0.8.0 salía como texto con barras, la negrita con código dentro salía con sus asteriscos, y las subidas de dependencias (`@jotis-me/tokens@0.9.0`) salían como arreglos.
- Fuera de alcance: acciones de moderación (borrar, banear) en `ChatBox`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: el requisito «Chat seleccionable» de `ChatBox` dice qué hace el clic y cómo se ve el elegido, y «Líneas destacadas en el código» pide que el fondo cubra todo el ancho desplazado.
- `docs-site`: «Historial de cambios» pinta sublistas y negrita con código.

## Impact

- `packages/react`: `ChatBox` (marca de la acción, aspecto del elegido, nombre accesible y `labels`) y `strings.ts`. Changeset `minor` (0.10.0), porque hay una prop nueva y cambia el aspecto del elegido.
- `apps/docs`: ficha de `ChatBox` y su ejemplo visual con un chat seleccionable. Su captura aprobada cambia a propósito y se aprueba en el PR.
- Artefacto: la ficha de `ChatBox`.
- Scaena sube `@jotis-me/react` a `^0.10.0`.
