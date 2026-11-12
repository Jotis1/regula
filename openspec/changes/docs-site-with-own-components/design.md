# Design

## Context

Lo que hay hoy, en `apps/docs/src`:

- **Layout.** `Base.astro` envuelve la barra lateral (`w-72`) y `main` en `max-w-[1440px]`, y el pie va a `max-w-[1280px]`. `ComponentPage.astro` añade el índice derecho (`w-[184px]`, desde `xl`). El token ya genera `--container-container` (1280), así que existe la utilidad `max-w-container`.
- **Muestras del índice.** `LivePreview.astro` pinta `THUMBNAILS[name]` (`visual/thumbnails.tsx`) en una caja de 288 × 180 (`PREVIEW_BOX`). 54 muestras llevan `scale` menor que 1 y 6 usan `ScaledPreview`. `thumbOf` (escala de un ejemplo entero) solo queda como respaldo y hoy no se usa: los 121 componentes tienen muestra.
- **Ejemplo interactivo.**
  - Hoy: `playgroundOf` (`lib/playground.ts`) saca los controles de `propsOf`, es decir, de las filas de react-docgen. Solo da control a uniones de cadenas y booleanos.
  - El punto de partida está en `STARTS` (62 componentes).
  - `Playground.tsx` pinta con `playgroundComponents`, un mapa estático de unos 60 componentes que cada página de componente carga entero. Esa es la causa del límite de 380 kB.
  - «Variantes y estados» monta `VisualExample` (registro de `/visual/`). Ese registro ya se carga por fichero, con `import.meta.glob` y `lazy` (D11 de `complete-figma-coverage`), y `check:js` suma ese trozo a la página.
- **Estructura.** `SiteHeader.astro`, `SideNav.astro` y `SiteFooter.astro` están hechos a mano. `MobileMenu` usa `Slideout`, `SiteSearch` usa `CommandMenu` y `ThemeMenu` usa `Dropdown`. La portada (`pages/index.astro`) no importa nada del paquete, salvo `HeroForm`.
- **Componentes candidatos del paquete:**
  - `HeaderNav`: `brand`, `items` con `current`, `search`, `actions` y `mobile`.
  - `SidebarNav`: `sections`, `search`, `items` con `children`, `badge` y `shortcut`.
  - `Footer`: `brand`, `description`, `columns` y `legal`.
  - `CommandMenu`.

## Goals / Non-Goals

**Goals:**
- Cada página de componente lleva un único bloque interactivo, configurado por componente en un fichero tipado y probado.
- Que el JS de `/components/*/` baje claramente del límite actual (380 kB). El objetivo es volver a unos 200–250 kB.
- Que la estructura de la web la monten componentes del paquete, de modo que un fallo de la web sea un fallo del paquete.

**Non-Goals:**
- Cambiar `/visual/`, sus capturas aprobadas o el artefacto.
- Rediseñar la portada. Se monta con componentes del paquete con el mismo contenido y orden.
- Simular hover, foco o pulsado como controles. Se prueban con el ratón y el teclado sobre el ejemplo.
- Editar texto libre en los controles. Las cadenas (`children`, `label`…) salen del punto de partida o de valores preparados.

## Decisions

### D1. Ancho: barra lateral fuera, contenedor de 1280 para el resto

`Base.astro` deja de envolver todo en 1440. La barra lateral va pegada a la izquierda, a toda la altura, como ahora. A su derecha, el contenido va centrado en `max-w-container` con el padding del contenedor de la guía (`container-padding-*`). La cabecera y el pie usan el mismo `max-w-container`. La cabecera ocupa todo el ancho de la ventana, pero su contenido va centrado. El índice derecho sigue dentro del contenedor.

Con 1280 de contenedor, el contenido útil en una página de componente queda en unos 1280 − 64 − 232 = 984 px desde 1568 px de ventana. Por debajo de ese ancho mide lo que deje la barra lateral, igual que ahora.

- *Alternativa:* meter la barra lateral dentro de los 1280. Descartada: el contenido quedaría en unos 696 px, menos que hoy. La descartó el usuario.

### D2. Muestras a tamaño real: recortar en vez de encoger

`Thumbnail` deja de aceptar `scale` y `ScaledPreview` desaparece. Cada muestra se rediseña para enseñar una pieza a tamaño real:
- `Table`: la cabecera y tres filas.
- `CalendarView`: una semana.
- `LineChart`: seis puntos y dos series a ancho de la caja.
- `Banner`: el flotante.

Si la pieza es más grande que la caja, `LivePreview` la ancla (arriba a la izquierda, o al centro según la muestra) y aplica `mask-image` con un degradado en los bordes que se salen. La muestra declara su ancla (`crop: "top-left" | "top" | "center"`).

Un test unitario recorre `THUMBNAILS` y falla si alguna declara una escala. Un e2e sobre `/components/` comprueba con `getComputedStyle` que ninguna vista previa tiene `transform` con escala menor que 1. Las capturas aprobadas de `/components/` (si las hay en e2e) se rehacen y se revisan en claro y oscuro.

- *Alternativa:* agrandar la caja de la card. Descartada: cambia la rejilla del índice y no arregla `Table` ni `CalendarView`.

### D3. Configuración del ejemplo interactivo por componente

`STARTS` y las reglas implícitas se sustituyen por un fichero por componente, `src/playground/<Componente>.tsx`, que exporta una `PlaygroundConfig`:

```ts
interface PlaygroundConfig<P> {
  component: ComponentType<P>;          // el componente del paquete (import directo)
  start: Partial<P>;                     // punto de partida
  children?: string;
  frame?: { wide?: boolean; height?: number; dark?: boolean };
  controls?: {                           // ajustes sobre los generados de propsOf
    [K in keyof P]?:
      | { kind: "number"; min?: number; max?: number; step?: number }
      | { kind: "icon"; options?: IconName[] }
      | { kind: "content"; options: { label: string; value: P[K]; code: string }[] }
      | { kind: "hidden" };
  };
  presets?: { label: string; figma?: string; props: Partial<P> }[];
  rules?: { when: Partial<P> | ((p: P) => boolean); disable: (keyof P)[]; reason: string }[];
}
```

- **Los controles base** se siguen generando de `propsOf`:
  - uniones de cadenas, a selector;
  - `boolean`, a interruptor;
  - `number`, a campo numérico;
  - `IconName | ReactNode`, a selector de icono.

  La config solo ajusta (rango, opciones o `hidden`) y añade los de contenido. Así una prop nueva aparece sin tocar la config, y un test avisa si una prop no tiene control ni está oculta.
- **El contenido preparado lleva su `code`**: el JSX que se escribe en el fragmento. Así el código sigue siendo copiable aunque el valor sea un nodo. El fragmento añade los imports que pidan los `code` elegidos.
- **Las reglas** usan `when` con un objeto parcial (la forma normal, que se puede comprobar contra la tabla de props) o con una función para los casos raros. `disable` lista las props, y `reason` es el texto que se muestra y se anuncia (`aria-describedby` en el control). Mientras una regla esté activa, la prop desactivada no se pasa ni se escribe, pero su valor se guarda para cuando vuelva.
- **Los atajos** salen de la tabla de cobertura del Figma (NOTAS 13.1 de `complete-figma-coverage`). Un atajo está marcado mientras todas sus props coinciden con el estado.
- **Tests (`test/playground-config.test.ts`):**
  - cada componente del catálogo tiene config;
  - cada prop de `start`, `presets`, `rules` y `controls` existe en `propsOf` con un valor válido para su tipo;
  - ninguna prop configurable queda sin control y sin `hidden`;
  - cada atajo pinta sin errores (`renderToStaticMarkup`);
  - el código de cada atajo es JSX que compila (con el comprobador de fragmentos que ya usan los snippets).

- *Alternativa:* deducir las incompatibilidades de los tipos (uniones discriminadas). Descartada: casi ningún componente las usa, y cambiarlo rompe la API pública.

### D4. Carga por componente

La isla `Playground` recibe solo JSON (nombre, estado inicial y controles serializados) y carga la config de su componente con `import.meta.glob("../playground/*.tsx")` y `lazy`. Es el mismo patrón que `VisualExample` (D11): el servidor espera al `lazy` y pinta el HTML completo, y en el cliente solo baja el trozo de ese componente. Como cada config importa su componente directamente de `@jotis-me/react`, Rolldown deja en el trozo solo ese componente y sus dependencias. No hacen falta subrutas en el paquete.

`playground-components.ts` y su test desaparecen. Las partes que no son JSON (funciones `when` y `code` de contenido) viven en la config, en el cliente. El servidor solo pasa lo serializable.

`check:js` ya suma los trozos dinámicos de la isla de la página (D11). Tras el cambio se mide y `/components/*/` baja a lo medido más un 10 %. También se quita el trozo de `VisualExample` de las páginas de componente, porque ya no hay galería.

### D5. Estructura con el paquete

- **Cabecera:** `HeaderNav` con `brand` (el icono y el nombre como hoy), `items` (las cinco secciones con `current`), `search` (`SiteSearch`) y `actions` (`ThemeMenu`). El enlace «Saltar al contenido» se queda fuera de `HeaderNav`, antes de él.
- **Barra lateral (descartado en 3.2, se queda `SideNav.astro` sin JS; ver NOTAS):** `SidebarNav` con `sections` (Empezar, Fundamentos, Iconos y los grupos de componentes con su número como `badge`), `search` para el filtro y el `active` de la página actual. Los grupos plegables usan `children` y `defaultOpen` en el del componente actual.
- **Menú móvil:** el `Slideout` actual con la misma `SidebarNav`, o el `mobile` de `HeaderNav` si cubre el caso.
- **Pie:** `Footer` con `brand`, `description` (el texto de ahora), `columns` (Documentación, Paquetes y Suite) y `legal`.
- **Portada:** `SectionHeader`, `LinkCard`, `FeaturedIcon`, `Badge`, `Button` y `BackgroundPattern` en las secciones que hoy son HTML con utilidades.

Cuando falte algo (por ejemplo, que `SidebarNav` no tenga filtro con el atajo `/` o el contador por grupo), se añade al componente como prop opcional retrocompatible, con su test de HTML idéntico sin la prop, su ficha, su ejemplo, su captura y el changeset de `@jotis-me/react`. Cada hueco encontrado se anota en `NOTAS.md`.

Las capturas aprobadas que cubren cabecera, barra lateral o pie (e2e de páginas) se rehacen y se revisan en claro, oscuro y móvil. Los e2e de navegación (filtro, grupo actual, Cmd+K, menú móvil, selector de tema) deben pasar sin cambiar lo que comprueban, solo sus selectores.

### D6. Qué pasa con los ejemplos del registro

El registro de `/visual/` (`visual/examples/*.tsx`) se queda: lo usan `/visual/`, la paridad, las composiciones y el artefacto. Solo deja de montarse en la página del componente. Las composiciones de Modal, Slideout y ColorPicker siguen en su sección, porque no son variantes de un componente.

### D7. Orden de implementación

1. Ancho (D1), que afecta a todo.
2. Muestras (D2).
3. Estructura (D5), antes del playground, porque cambia las capturas de todas las páginas una sola vez.
4. Motor del playground y carga por componente (D3 y D4), migrando los 62 existentes.
5. Configs de los 59 restantes y atajos y reglas de todos, por grupos del catálogo.
6. Por último, quitar «Variantes y estados» y bajar el límite de JS.

## Risks / Trade-offs

- [Rehacer 60 muestras y 121 configs es mucho trabajo manual] → Se trabaja por grupos con commit por grupo. El test de configs impide dejar componentes sin cubrir.
- [Al quitar la galería se pierde la vista de todos los tamaños de un vistazo] → Los atajos cubren los tipos del Figma. La paridad visual sigue en `/visual/` para quien la necesite.
- [`HeaderNav`, `SidebarNav` o `Footer` pueden necesitar cambios de API] → Solo props opcionales, con HTML idéntico sin ellas (test). Si algo exigiera romper la API, se para y se pregunta.
- [El `lazy` de la config puede retrasar la hidratación del ejemplo] → El HTML llega completo del servidor. Solo los controles esperan al trozo, como ya pasa con `VisualExample`.
- [Las reglas con función no se pueden comprobar contra los tipos] → Se prefiere la forma de objeto. El test cuenta las de función y exige un comentario con el motivo.
- [Cambian muchas capturas aprobadas a la vez] → Se rehacen por bloques (D7), revisando cada una en claro y oscuro antes de aprobarla.

## Migration Plan

Este cambio sale de `main` después de cerrar `complete-figma-coverage` (PR y archivo). No toca el paquete salvo los huecos de D5, que van con changeset `minor` o `patch`. Para volver atrás se revierte la PR, porque `apps/docs` es privado.
