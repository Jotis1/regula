# Proposal

## Why

El rediseño de regula.jotis.me usa seis piezas que el sistema no tiene y que no son variantes de nada que exista. En el lienzo van montadas con tokens y marcado propio; llevarlas así a la web es mantener seis componentes de tapadillo. Dos de ellas (`CompareSlider` y `Spotlight`) sirven a cualquier app de la suite; las otras cuatro son las piezas de documentación que repite la propia web, y también las de cualquier app que enseñe ajustes, temas o iconos.

## What Changes

- **`CompareSlider`** (nuevo): dos capas, una encima de otra, con una línea que se arrastra para descubrir la de abajo. Por debajo es un `input type="range"`, así que va con teclado. Para claro y oscuro, antes y después, dos versiones de un diseño.
- **`Spotlight`** (nuevo): marco de foco alrededor de un trozo de interfaz, con una nota opcional. Para recorridos de bienvenida, novedades y para señalar lo que acaba de cambiar.
- **`Disclosure`** (nuevo): bloque plegable denso con título, contador o acompañante a la derecha y contenido libre, en `<details>` y sin JavaScript. `Accordion` sigue siendo el de preguntas frecuentes.
- **`ExampleCard`** (nuevo): un espécimen sobre el damero de transparencia con su pie: un veredicto (esto sí, esto no, en lugar de, mejor) y un texto. Para guías de uso y para las fichas de cualquier componente.
- **`IconTile`** (nuevo): baldosa con un icono y su nombre que se puede elegir, con estado elegido. Para galerías y selectores de icono.
- **`TokenSwatch`** (nuevo): muestra de un color con su nombre y su valor en claro y en oscuro, en fila o en tarjeta. Para páginas de tokens y ajustes de tema.
- El catálogo crece en seis componentes, cada uno con página, ficha, ejemplo, muestra y capturas aprobadas.
- Fuera de alcance: `Spotlight` con fondo oscurecido alrededor y con pasos encadenados (eso es un recorrido, y lo hace la app), `CompareSlider` vertical y `TokenSwatch` para tokens que no son de color.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: el catálogo crece con seis componentes, con un requisito para cada uno.

## Impact

- `packages/react`: seis componentes nuevos, textos en `defaultStrings`, tests y límites en `size-budget.json`. Changeset `minor`.
- `apps/docs`: seis páginas, ejemplos, muestras, fragmentos y capturas. El catálogo de `catalog.ts` las reparte en los grupos que ya existen (design D1); el test de catálogo sube en seis.
- Artefacto: seis componentes más en la próxima sincronización.
- Orden: después de `unblock-docs-redesign`; puede ir en la misma PR que `add-docs-variants`, y los dos antes de `redesign-docs-site-v2`.
