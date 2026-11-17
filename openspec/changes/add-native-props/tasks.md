# Tasks

Comandos: `bunx biome ci .`, `bunx turbo run build typecheck test` y `bun run --cwd apps/docs check:js`.

## 1. Lectura de los tipos

- [x] 1.1 `nativeOf(file, name)` y el tipo `NativeTarget` en `apps/docs/src/lib/props.ts`, con un único parser sin `propFilter` y caché por archivo compartida con `propsOf` (D1), y el mapa de interfaces a elementos de D1. Globales sin listar; `RefAttributes` y `Attributes` ignorados; cualquier otra interfaz de `node_modules` lanza un error que la nombra
- [x] 1.2 Test nuevo `apps/docs/test/native-props.test.ts` sobre el fuente real:
  - `Button` trae `button` con `type` y `a` con `target`, en ese orden, sin `className`, `onClick` ni `aria-label`;
  - `Input` trae `input` con `placeholder` y `autoComplete`, sin `type` ni `size`;
  - `Checkbox` no trae `type` ni `size`;
  - `TransparencyGrid` trae `[{ element: null, attributes: [] }]`;
  - `Avatar` trae `[]`;
  - los componentes con entrada no vacía son exactamente los 11 de la propuesta.
- [x] 1.3 Medir el tiempo de `astro build` antes y después del segundo parser y anotarlo en la PR. Si sube más de unos segundos, cachear el resultado por archivo (D1, riesgos)

## 2. JSON y MCP

- [x] 2.1 `ComponentDeps` gana `nativeOf`; `componentsJson` añade `native` tras `props`. El endpoint `/components.json` pasa el `nativeOf` real. Actualizar `components-json.test.ts` y `mcp-fixture.ts`; el test comprueba el `native` de `Button` y que `Avatar` trae `[]`
- [x] 2.2 Descripción de `get_component` en `apps/docs/src/mcp/tools.ts`: nombrar los atributos nativos reenviados. Test del MCP: `get_component` con `button` trae `native` con `button` y `a`

## 3. Ficha de la web

- [x] 3.1 `PropsTable.astro` recibe `native` y pinta bajo la tabla y la lista móvil un párrafo por entrada con los textos de D3; `components/[slug].astro` le pasa `nativeOf(source, name)`
- [x] 3.2 En `component-page.test.ts` (o un test de `PropsTable`): con `native` de `button` y `a` salen dos párrafos con los atributos en `<code>`; con `element: null` sale la frase de los globales; con `[]` no sale párrafo
- [x] 3.3 Comprobar en el build que la página de `Button` y su entrada de `/components.json` nombran los mismos elementos y atributos (escenario «Mismos atributos en la web y en el JSON»), y que `check:js` sigue pasando

## 4. Cierre

- [x] 4.1 Pasar los comandos de arriba y abrir la PR sin changeset de `@jotis-me/*` (no cambia ningún paquete publicado)
