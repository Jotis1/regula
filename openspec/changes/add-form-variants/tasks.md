# Tasks

Cada grupo trae sus propios tests y su documentación. La referencia visual de cada pieza es su nodo del Figma (tabla del Context de design.md), siempre traducida a los tokens semánticos. Los tests del paquete se corren con `bun run --cwd packages/react test`; los de la web, con `bunx playwright test` en `apps/docs`.

## 1. Base común

- [x] 1.1 Añadir a `packages/react/src/internal/strings.ts` los textos de D9 (`showPassword`, `hidePassword`, `decrement`, `increment`, `digitOf`, `addTag`), sin duplicar `noResults`. Comprobar que `bun run --cwd packages/react typecheck` pasa y que `test/content.test.tsx` sigue verde.
- [x] 1.2 Sacar de `Input` a `internal/field.tsx` lo que van a compartir los campos nuevos: el marco con hueco para prefijo y botones, y el separador con borde `border-primary`. Comprobar que `test/fields.test.tsx` pasa sin cambios y que la captura aprobada de `Input` no cambia (`bunx playwright test e2e/visual.spec.ts -g Input`).

## 2. Input: prefijo, desplegables y contraseña

- [x] 2.1 Añadir `prefix` a `Input` (D2) mirando «Leading text» del nodo `1090:57817`. Test en `test/fields.test.tsx`: el prefijo se ve, va separado por el borde y no forma parte del valor.
- [x] 2.2 Añadir `leadingSelect` y `trailingSelect` con `<select>` nativo y `label` obligatorio en el tipo. Tests:
  - elegir una opción llama a su `onChange` sin tocar el texto escrito;
  - cada control tiene su nombre accesible;
  - un `@ts-expect-error` comprueba que falla sin `label`.
- [x] 2.3 Añadir el botón de contraseña con `aria-pressed`, nombres de `defaultStrings` sustituibles por `revealLabels` y `revealable={false}`. Pasar `Input` a `"use client"`. Tests:
  - al pulsar, el campo cambia entre `password` y `text`, el texto no se pierde y el foco se queda en el botón;
  - con `revealable={false}` no hay botón;
  - `renderToString` de `Input` sigue dando el mismo HTML para un campo de texto;
  - actualizar en `test/build.test.ts` la lista de componentes con `"use client"`.
- [x] 2.4 Actualizar la ficha `apps/docs/src/content/components/input.md` con las props nuevas, sus reglas y la nota de Astro: sin directiva funciona, pero el botón de contraseña necesita `client:load`. Añadir al ejemplo de `Input` en `src/visual/examples/forms.tsx` una fila con prefijo, desplegable y contraseña, y recapturar sus dos PNG en Windows. Revisar que la parte antigua del ejemplo se ve igual que antes.

## 3. NumberInput

- [x] 3.1 Crear `NumberInput` sobre `NumberField` (D3), en horizontal y vertical, mirando «Number counter horizontal» y «Number counter vertical» del nodo `1090:57817`. Llevar `I18nProvider` `es-ES`, `FieldShell`, `size` y `disabled`, y exportarlo en `index.ts`. Tests en `test/rich-inputs.test.tsx`:
  - las flechas respetan mínimo, máximo y paso;
  - `12,5` se lee como 12.5 y se muestra con coma;
  - el botón de sumar se deshabilita en el máximo;
  - el error queda enlazado con `aria-invalid`.
- [x] 3.2 Página `apps/docs/src/content/components/number-input.md`, grupo «Formularios» en `src/lib/catalog.ts`, ejemplo en el registro con su alto en `CARD_HEIGHTS` y sus dos PNG aprobadas. Comprobar que el test de catálogo y `e2e/visual.spec.ts -g NumberInput` pasan.

## 4. TagInput

- [x] 4.1 Crear `TagInput` con `Tag` del paquete en una lista más un `<input>` nativo (D4), con `placement` `inside`/`outside` y `value`/`defaultValue`/`onChange` de tipo `string[]`, mirando «Tags inner» y «Tags outer» del nodo `1090:57817`. Exportarlo. Tests:
  - Enter y coma añaden la etiqueta;
  - no entran repetidas ni vacías;
  - Retroceso con el campo vacío quita la última;
  - la X quita la suya y devuelve el foco al campo;
  - el campo crece en alto con muchas etiquetas.
- [x] 4.2 Página `tag-input.md`, catálogo, ejemplo (las dos posiciones, con error y deshabilitado) y sus dos PNG aprobadas. Comprobar el test de catálogo y `e2e/visual.spec.ts -g TagInput`.

## 5. VerificationCodeInput

- [x] 5.1 Crear `VerificationCodeInput` (D5) con `digits` 4 o 6, `size` `sm`/`md`/`lg`, `value`/`onChange`, `onComplete`, el separador decorativo con 6 dígitos y `autoComplete="one-time-code"` en la primera casilla, mirando el nodo `1106:66757`. Exportarlo. Tests:
  - escribir avanza el foco y Retroceso borra y retrocede;
  - pegar `482913` rellena todo y llama a `onComplete` una sola vez;
  - las letras no entran;
  - cada casilla se llama «Dígito n de 6» dentro de un grupo con la etiqueta.
- [x] 5.2 Añadir un e2e de teclado y pegado en Chromium, Firefox y WebKit (`apps/docs/e2e/cross-browser/`, con proyectos de Playwright para Firefox y WebKit que solo corren esa carpeta, y el job «Navegador» del CI instalando los dos) sobre el ejemplo de la web. Página `verification-code-input.md`, catálogo, ejemplo (4 y 6 dígitos, relleno y con error) y sus dos PNG aprobadas. Comprobar que el e2e y el visual pasan.

## 6. MultiSelect

- [x] 6.1 Crear `MultiSelect` como el Figma (D6): campo con resumen, `Popover` con buscador (`Autocomplete` + `SearchField`), `ListBox` múltiple con casillas y pie con «Restablecer» y «Elegir todo». Props: `options` (`string` o `{ value, label, supporting? }`), `value`/`defaultValue`/`onChange` de tipo `string[]`, `summary`, `summarySupporting`, `placeholder`, los textos y `size`. Mirar los nodos `12206:577041` y `12206:575660` y exportarlo. Tests:
  - abrir con Enter, buscar `mar` y elegir con flechas y Enter marca la casilla, deja la lista abierta con la búsqueda y el campo dice «1 elegido»;
  - la búsqueda no distingue tildes;
  - sin resultados se ven «Sin resultados» y «Borrar búsqueda», que vacía el buscador, con textos sustituibles;
  - «Elegir todo» y «Restablecer»;
  - Escape cierra sin perder la selección y el foco vuelve al campo.
- [x] 6.2 Añadir un e2e de teclado y otro a 390px en `apps/docs/e2e/` sobre el ejemplo. Página `multi-select.md` con sus «Límites» si el e2e de móvil deja alguno, catálogo, ejemplo con la lista abierta dentro de su caja y sus dos PNG aprobadas. Comprobar que el e2e, el visual y `e2e/a11y.spec.ts` pasan.

## 7. RadioGroup en tarjetas

- [x] 7.1 Añadir a `RadioGroup` `appearance` (`"default"`/`"card"`), `indicator` (`"radio"`/`"checkbox"`) y `media` en `RadioGroupOption` (D7), mirando los nodos `124:2838` y `1142:87213`. Tests en `test/choices.test.tsx`:
  - con flechas cambia la tarjeta elegida y su borde pasa a `border-brand`;
  - `media` se pinta;
  - sin `appearance`, el HTML es el mismo de antes.
- [x] 7.2 Actualizar la ficha `radio-group.md` y añadir al ejemplo una fila con tarjetas de icono, avatar y pago. Recapturar sus dos PNG y revisar que la fila antigua se ve igual que antes.

## 8. Toggle slim

- [x] 8.1 Añadir `variant` (`"default"`/`"slim"`) a `Toggle` (D8) mirando los nodos `122:3294` y `1102:4208`. Tests en `test/choices.test.tsx`: Espacio lo enciende, el `role` sigue siendo `switch` y sin `variant` el HTML es el de antes.
- [x] 8.2 Actualizar la ficha `toggle.md` y añadir al ejemplo la variante fina en los dos tamaños, apagada y encendida. Recapturar sus dos PNG y revisar que la parte antigua se ve igual.

## 9. Comprobaciones de conjunto y versión

- [ ] 9.1 Actualizar `packages/react/size-budget.json` solo con las entradas nuevas (`bun run --cwd packages/react check:size --update` y revisar que las existentes no suben). Comprobar que `check:size`, `check:colors` y `check:package` pasan.
- [ ] 9.2 Comprobar la compatibilidad con Next y Astro de los campos: renderizar en servidor `Input`, `NumberInput`, `TagInput`, `VerificationCodeInput` y `MultiSelect` sin errores ni avisos de hidratación. Ampliar `test/react-aria-ssr.test.tsx` o el test equivalente.
- [ ] 9.3 Comprobar que `bun run artifact:build` genera las cuatro fichas nuevas y que `bun test ./test` de `scripts/artifact` pasa con 78 componentes.
- [ ] 9.4 Añadir un changeset *minor* de `@jotis-me/react` que liste los componentes y variantes nuevos. Comprobar que `bunx turbo run build test` y el CI completo del PR (los dos jobs) pasan.

## Workflow follow-up

- Mergear el PR y arrancar a mano el CI del PR de versión de changesets (cerrar y reabrir, o «Approve and run»). Mergearlo cuando pase.
- Con la versión publicada en npm, resincronizar el artefacto "Jotis.me" siguiendo `scripts/artifact/README.md`. Esta vez cambian el bundle, la hoja, los tipos y las fichas, y hay cuatro componentes nuevos. Revisar en claro y en oscuro las vistas previas de los cuatro nuevos y de Input, RadioGroup y Toggle.
- Archivar el cambio con `/opsx:archive` y proponer la fase 2 (navegación y progreso).
