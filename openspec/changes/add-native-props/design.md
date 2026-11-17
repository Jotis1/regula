# Design

## Context

`propsOf` (`apps/docs/src/lib/props.ts`) usa react-docgen-typescript con un `propFilter` que descarta toda prop cuyo `parent` está en `node_modules`. Así la tabla solo enseña las props propias, pero se pierden también los atributos que el componente reenvía con `...rest`.

Medido sobre los 130 componentes, sin filtro: solo 11 heredan de los tipos de React, y cada uno con 277–305 props. Casi todas son globales (`HTMLAttributes`, `AriaAttributes`, `DOMAttributes`); las útiles son las del elemento concreto, cuyo `parent.name` es `ButtonHTMLAttributes`, `AnchorHTMLAttributes`, `InputHTMLAttributes` o `TextareaHTMLAttributes`. `TransparencyGrid` solo hereda las globales (`HTMLAttributes<HTMLDivElement>`). Ninguno hereda `children`: los que extienden tipos nativos lo quitan con `Omit` o lo declaran.

## Goals / Non-Goals

**Goals:**
- Que la ficha, `/components.json` y `get_component` digan a qué elemento reenvía cada componente y qué atributos propios de ese elemento acepta.
- Que salga de los tipos, sin listas a mano que se desfasen.

**Non-Goals:**
- Listar uno a uno los atributos globales, `aria-*` o los eventos.
- Cambiar qué reenvía cada componente o sus tipos.

## Decisions

### D1. `nativeOf` y `propsOf` comparten un único análisis sin filtro

El parser de react-docgen de `props.ts` pierde el `propFilter` y guarda en caché, por archivo, lo que devuelve. `propsOf` descarta él mismo las props heredadas de `node_modules`; `nativeOf(file, name)` se queda con las props cuyo `parent` está en `node_modules` y cuyo `parent.name` está en un mapa fijo:

| `parent.name` | elemento |
|---|---|
| `ButtonHTMLAttributes` | `button` |
| `AnchorHTMLAttributes` | `a` |
| `InputHTMLAttributes` | `input` |
| `TextareaHTMLAttributes` | `textarea` |
| `SelectHTMLAttributes` | `select` |
| `FormHTMLAttributes` | `form` |
| `ImgHTMLAttributes` | `img` |

Agrupa por elemento y ordena los atributos por nombre. Si solo hay globales, devuelve una entrada con `element: null` y `attributes: []`. Si no hereda nada de `node_modules`, devuelve `[]`.

Lo que el componente quita con `Omit` no llega a docgen, y lo que declara él mismo tiene `parent` en el repo: los dos casos quedan fuera sin código especial.

Se tienen por globales `HTMLAttributes`, `AriaAttributes` y `DOMAttributes`, y se ignoran `RefAttributes` y `Attributes` (`ref` y `key`, que `Button` hereda). Una prop de `node_modules` que no es de ninguno de esos ni de un elemento del mapa (otro `*HTMLAttributes` que aún no se usa) hace fallar el build con un error que nombra la interfaz, para que se añada al mapa en vez de perderse en silencio.

**Alternativa descartada:** un segundo parser solo para `nativeOf`. Analizar un archivo cuesta ~0,3 s, así que duplicaría ~40 s en cada build y en cada test que arma el JSON. Con un análisis y caché, la firma de `propsOf` no cambia y `nativeOf` sale gratis tras él. Medido: `astro build` 91 s antes y 55 s después (hay ruido entre ejecuciones; no hay coste visible).

**Alternativa descartada:** sacar el elemento de `TransparencyGrid` del argumento genérico (`HTMLDivElement`) con el comprobador de TypeScript. Es un solo componente; se queda en `element: null` y la web dice «los atributos globales».

### D2. Forma del dato

```ts
interface NativeTarget {
  element: string | null; // "button", "a"…, o null si solo hereda los globales
  attributes: string[];   // propios del elemento, por orden alfabético
}
```

En `/components.json`, cada componente lleva `native: NativeTarget[]` justo después de `props`. `ComponentDeps` gana `nativeOf: (entry) => NativeTarget[]`, igual que `propsOf`, para que los tests sigan sin leer el fuente. `get_component` devuelve la entrada tal cual; solo cambia su descripción para nombrar el campo.

Solo los nombres, sin tipos ni descripciones: los tipos de React son los de siempre y repetirlos inflaría la respuesta del MCP (límite de «Límites de las respuestas»). `Input` ronda los 30 nombres.

### D3. Línea en la ficha

`PropsTable.astro` recibe `native` y, bajo la tabla y la lista móvil, pinta un párrafo por entrada:

- con elemento: «Reenvía al `<button>` sus atributos: `disabled`, `form`, `type`…, además de los globales de HTML, `aria-*` y los eventos.»
- con `element: null`: «Reenvía los atributos globales de HTML, `aria-*` y los eventos.»

Cada atributo con `InlineCode`, como el resto de la ficha. Sin desplegable: son a lo sumo dos párrafos. El orden de los elementos es el del mapa de D1, así que `button` va antes que `a`.

## Risks / Trade-offs

- **`Checkbox` y `Radio` aceptan `placeholder` o `accept`, que en un `<input type="checkbox">` no hacen nada** → la lista dice lo que acepta el tipo, que es lo cierto; filtrar por `type` sería una lista a mano.
- **Una versión nueva de `@types/react` cambia los nombres de las interfaces** → el error de D1 lo hace visible en el build.
- **Build más lento por analizar los tipos sin filtro** → un solo análisis por archivo, con caché; medido sin coste visible (D1).
