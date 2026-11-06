# Design

## Context

Ver proposal.md (Why). Estado actual que condiciona el diseño:

- **`Input`, `Textarea` y `Select`** comparten `internal/field.tsx`: `FieldShell` pinta la etiqueta, el asterisco y la pista o el error, y los enlaza por `id`; `controlClasses` pinta el marco. El marco es un `div` con `inset-shadow` (no un borde) que cambia en `focus-within` y `has-[:focus-visible]`. Los tres son componentes de servidor: no llevan `"use client"`.
- **`Select`** es un `<select>` nativo y su ficha lo limita a listas cortas.
- **`RadioGroup`, `Toggle` y `Checkbox`** comparten `internal/choice.tsx` (`choiceLabel`, `choiceBox`, `ChoiceText`) y usan `react-aria-components` (`RadioGroup`, `Switch`), con `"use client"`.
- **`Tag`** ya tiene X para quitarse (`onRemove`) y nombre accesible «Quitar …».
- **`react-aria-components` 1.22.1** ya es dependencia y exporta `NumberField`, `Autocomplete`, `ListBox`, `Popover`, `TagGroup` y `TokenField`.
- **Los textos por defecto** viven en `internal/strings.ts` (`defaultStrings`) y cada componente deja sustituirlos por props.
- **Un componente nuevo** necesita su ejemplo en `apps/docs/src/visual/registry.ts`, su página, su grupo en `catalog.ts` y sus dos PNG aprobadas, capturadas en Windows (D4 de `adopt-repo-as-source`). El test de catálogo falla si falta alguna pieza.
- **El Figma** usa la paleta de Tailwind v3, no los tokens. De él se toman forma, medidas y estados, y el color se traduce al token semántico que ya usan los campos.

Nodos del Figma («Yoruverse UI v8.0», `WybK3J9Wu3crF84nKwrN1z`):

| Componente | Nodo |
|---|---|
| Input field | `1090:57817` |
| Verification code input field | `1106:66757` |
| Multi-select | `12206:577041` |
| Multi-select menu item | `12206:575660` |
| Radio group item | `124:2838` |
| Radio group | `1142:87213` |
| Toggle base | `122:3294` |
| Toggle | `1102:4208` |

## Goals / Non-Goals

**Goals:**
- Que todos los campos nuevos tengan la misma etiqueta, pista, error, marco y alturas que `Input`, reutilizando `internal/field.tsx`.
- No romper nada: las props existentes no cambian ni de nombre ni de valor por defecto, y las capturas de los ejemplos actuales no se mueven salvo donde el ejemplo enseña la variante nueva.

**Non-Goals:**
- Sustituir el `Select` nativo por uno propio.
- Validación de formularios (formato de correo, IBAN…). Los componentes muestran el `error` que les pasan.
- Los tipos de campo que el proposal deja fuera.

## Decisions

### D1. Lo que es texto de una línea se queda en `Input`; lo que cambia el valor, componente aparte
El texto fijo delante, el desplegable delante o detrás y la contraseña siguen siendo un `<input>` con un valor de texto, así que son props de `Input`. El contador numérico (su valor es un número con mínimo, máximo y paso) y las etiquetas (su valor es una lista) cambian el tipo del valor y la API de `onChange`, así que son `NumberInput` y `TagInput`. Así `InputProps` sigue extendiendo `InputHTMLAttributes` sin excepciones.
*Alternativa:* un `Input` con `type="number"`/`type="tags"` y un `value` que cambia de tipo según `type`. Se descarta porque los tipos de TypeScript se vuelven condicionales y el atributo nativo `type` deja de significar lo que dice.

### D2. Props nuevas de `Input`
- **`prefix`** (`ReactNode`): texto fijo delante, en `text-tertiary`, separado del valor por un borde `border-primary`, como en el Figma («Leading text»). Va fuera del `<input>`, así que no forma parte del valor.
- **`leadingSelect` y `trailingSelect`** (`{ options, value?, defaultValue?, onChange?, label }`): un `<select>` nativo sin marco propio, dentro del marco del campo, con su `aria-label` (`label`), que es obligatorio en el tipo. Es nativo por la misma razón que `Select`: listas cortas (prefijos, divisas) y teclado del sistema en móvil.
- **Contraseña:** con `type="password"`, `Input` pinta detrás un botón con icono `eye`/`eye-off`, `aria-pressed` y el nombre `defaultStrings.showPassword`/`hidePassword` («Mostrar contraseña»/«Ocultar contraseña»), sustituibles por `revealLabels`. `revealable={false}` lo quita. Al pulsarlo, el campo cambia de `type` entre `password` y `text` y el foco se queda en el botón. Este botón obliga a `Input` a tener estado, así que pasa a llevar `"use client"`. Sigue pintándose en el servidor y, sin JavaScript, el campo funciona como un `<input>` nativo.

*Alternativa para la contraseña:* un `PasswordInput` aparte para que `Input` siga sin `"use client"`. Se descarta porque el Figma lo trata como un tipo de `Input`, y porque `"use client"` no impide el render en el servidor de Next ni de Astro: solo añade la hidratación donde se usa.

### D3. `NumberInput` sobre `NumberField` de React Aria
`NumberField` ya resuelve el formato `es-ES` (coma decimal), las flechas, Inicio/Fin, la rueda, los límites y el anuncio a lectores de pantalla. Lo envolvemos en `FieldShell` y en el marco de `controlClasses`.
- **Formas:** `orientation="horizontal"` pone los botones − y + a los lados, separados por bordes, como «Number counter horizontal»; `"vertical"` los apila detrás, como «Number counter vertical».
- **Textos:** el locale se fija con `I18nProvider locale="es-ES"` dentro del componente, así que no depende del navegador. Los nombres de los botones («Restar», «Sumar») salen de `defaultStrings`.

### D4. `TagInput` con el `Tag` del paquete en una lista y un `<input>` nativo
Las etiquetas son el `Tag` del paquete (tamaño `md`, como en el Figma) dentro de una lista `<ul>`, cada una con su X: un `<button>` nativo que entra en el orden de Tab, como pide el spec. El texto se escribe en un `<input>` normal.
- **Al escribir:** Enter o coma añade la etiqueta si no está vacía ni repetida. Retroceso con el campo vacío quita la última. Al quitar una con su X, el foco vuelve al campo.
- **Posición:** `placement="inside"` (por defecto) las pone en el marco, delante del texto, y el campo crece en alto. `"outside"` las pone debajo.
- **Valor:** controlado o no, `string[]`. Con `name`, un `<input type="hidden">` lleva las etiquetas separadas por comas.

*Alternativas:*
- `TagGroup` de React Aria. Era la idea inicial y se cambió al implementar: en un `TagGroup` las X no reciben foco con Tab (se recorre con flechas), y el spec pide llegar a la X con Tab.
- `TokenField`. Se descarta porque es un campo `contenteditable` con tokens dentro del texto, pensado para fórmulas y menciones, y su API es la más nueva del paquete.

### D5. `VerificationCodeInput` con casillas nativas propias
React Aria no tiene un campo OTP. Cada dígito es un `<input inputMode="numeric" maxLength={1}>` dentro de un `role="group"` con la etiqueta del campo. Cada casilla tiene `aria-label` «Dígito n de N» (plantilla sustituible) y la primera lleva `autoComplete="one-time-code"`.
- **Teclado:** escribir avanza; Retroceso borra y retrocede; las flechas se mueven entre casillas.
- **Pegar o autocompletar:** se reparte el código entero desde la casilla donde cae.
- **Valor:** es la cadena entera. `onComplete(code)` se llama una vez cada vez que se llena.
- **Formas:** `digits` admite 4 o 6, y `size` los tres tamaños del Figma (`sm`, `md`, `lg`, con casillas de 64, 80 y 96px y texto display).
- **Separador:** con 6 dígitos se pinta un guion entre el tercero y el cuarto, como en el Figma. Es decorativo (`aria-hidden`).

*Alternativa:* un solo `<input>` de seis caracteres pintado como casillas. Se descarta porque el foco visible por casilla y el borrado casilla a casilla, que es lo que dibuja el Figma, son más difíciles de clavar así, y porque el lector de pantalla no puede decir en qué dígito está.

### D6. `MultiSelect` con `Autocomplete`, `ListBox` múltiple, `Popover` y `TagGroup`
El campo muestra las elegidas como `Tag` con X y un buscador. Al enfocarlo o escribir, se abre un `Popover` con un `ListBox` de `selectionMode="multiple"` filtrado por `Autocomplete`, con `useFilter({ sensitivity: "base" })` para que «mar» encuentre «Mará». Las opciones elegidas llevan el check del Figma («_Multi-select menu item»).
- **Lista:** elegir no la cierra, y Escape la cierra sin tocar la selección.
- **Búsqueda:** el texto buscado se vacía al elegir. Sin resultados, se ve `defaultStrings.noResults`, sustituible por `emptyLabel`.
- **Valor:** `string[]` (`value`/`defaultValue`/`onChange`). Las opciones son las mismas `SelectOption` que en `Select`.

*Alternativa:* `ComboBox`. Se descarta porque en 1.22.1 solo admite una opción. `Select` de React Aria con selección múltiple tampoco sirve: no tiene búsqueda.

### D7. `RadioGroup` con `appearance="card"`
Es una prop nueva. `"default"` (por defecto) es el aspecto de hoy, y la captura aprobada no cambia.
- **Tarjeta:** cada opción es una tarjeta `rounded-xl` con borde `border-secondary`. La elegida pasa a borde de 2px `border-brand`, con el indicador a la derecha, como «Icon card».
- **Contenido de la opción:** `RadioGroupOption` gana `media` (`ReactNode`): un `FeaturedIcon`, un `Avatar` o un logo de pago, que pone el consumidor. Así las variantes del Figma son contenido y no props: «Icon simple», «Icon card», «Avatar» y «Payment icon» son tarjetas con distinto `media`.
- **Indicador:** `indicator="radio" | "checkbox"` elige el círculo o el check, porque el Figma también los dibuja así («Radio button», «Checkbox»).
- **Semántica:** el teclado y los roles son los del `RadioGroup` de React Aria, igual que hoy.

### D8. `Toggle` con `variant="slim"`
`"default"` es lo de hoy. `"slim"` es la pista fina del Figma (`_Toggle base`, Type=Slim): pista de 8px de alto en `sm` y 10px en `md`, con el tirador de su tamaño actual por encima y su sombra. Se cambian solo las clases de la pista; el `Switch` y su semántica no cambian.

### D9. Textos nuevos en `defaultStrings`

| Clave | Texto |
|---|---|
| `showPassword` | «Mostrar contraseña» |
| `hidePassword` | «Ocultar contraseña» |
| `decrement` | «Restar» |
| `increment` | «Sumar» |
| `digitOf` | «Dígito {n} de {total}» |
| `addTag` | «Añadir etiqueta» |

Todos se pueden sustituir por props. Para la búsqueda sin resultados de `MultiSelect` se reutiliza el `noResults` que ya existe («Sin resultados»), sin crear otro.

### D10. Ejemplos y capturas
- **Componentes nuevos:** un ejemplo cada uno en `visual/examples/forms.tsx`, con los estados que enseña el Figma: vacío, con valor, con error y deshabilitado; en `MultiSelect`, la lista abierta dentro de su caja.
- **`Input`, `RadioGroup` y `Toggle`:** su ejemplo suma una fila con las variantes nuevas y se recapturan sus PNG. El PR lo explica como «variante nueva del Figma», como pide el README de `apps/docs`.
- **Playground:** los cuatro componentes nuevos entran en él solo si su página tiene props sencillas (`size`, `orientation`, `digits`, `placement`). Los controlados quedan como ejemplos.

## Risks / Trade-offs

- **[`Input` pasa a llevar `"use client"` y algún uso de servidor deja de valer]** → Se comprueba con el test de Next (página de servidor que pinta `Input`) y con Astro sin directiva. El HTML de servidor es el mismo de hoy; solo el botón de contraseña necesita hidratarse.
- **[El Figma usa colores de Tailwind v3]** → Cada color se traduce al token semántico del campo equivalente. El test de «sin colores crudos» lo vigila.
- **[`Autocomplete` y `ListBox` múltiple en un `Popover` tienen casos raros de foco en móvil]** → El e2e de teclado y el de móvil a 390px cubren abrir, elegir, quitar y cerrar. Si falla en Safari iOS, se documenta en la ficha como «Límites», como hacen otras fichas.
- **[Recapturar `Input`, `RadioGroup` y `Toggle` mueve tres PNG de los 74 originales]** → Es el flujo previsto (D4 de `adopt-repo-as-source`). La revisión compara la PNG anterior con la nueva en el diff, y la parte antigua del ejemplo debe verse igual.
- **[Pegar en `VerificationCodeInput` en navegadores sin `clipboardData`]** → Las casillas no llevan `maxLength`. Si el evento `paste` llega sin datos legibles, se deja pegar al navegador y se reparte desde el evento `input` de la casilla, que trae el texto entero; el autocompletado entra por el mismo camino. Se prueba con pegado real (Ctrl+V) en Chromium, Firefox y WebKit: `e2e/cross-browser/` corre en los tres (proyectos de Playwright), el resto de e2e solo en Chromium, y el job «Navegador» del CI instala los tres (decisión del usuario).

## Migration Plan

1. Rama desde `main`. Componentes, textos e `index.ts`, con sus tests unitarios.
2. Ejemplos, páginas, catálogo y playground en `apps/docs`; capturas en Windows (local o el job «Capturas aprobadas»).
3. Changeset *minor* de `@jotis-me/react`. PR con CI verde y revisión de las PNG.
4. Tras el merge, el PR de versión de changesets. Su CI lo arranca una persona (cerrar y reabrir, o «Approve and run»).
5. Publicada la versión, se resincroniza el artefacto "Jotis.me" con `scripts/artifact/README.md`. Esta vez sube el bundle, la hoja, los tipos y cuatro fichas nuevas.

Vuelta atrás: el cambio solo añade. Si una variante sale mal, se revierte el PR y se publica un *patch*; el artefacto se republica desde la versión anterior.
