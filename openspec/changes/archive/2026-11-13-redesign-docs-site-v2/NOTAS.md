# Notas de la implementación

- **0.1.** Los tres cambios previos (`unblock-docs-redesign`, `add-docs-variants`, `add-docs-pieces`) están hechos en la misma rama, sin archivar ni publicar: se decidió juntar todo en un solo despliegue. `apps/docs` usa el paquete del monorepo.
- **Menú móvil (D2).** `SidebarNav` anida un solo nivel, así que los bloques Componentes y Stream del menú llevan «Todos los componentes» (o la guía) y los grupos como enlaces a su ancla del índice, como en el lienzo. El filtro del menú encuentra un grupo por los componentes que contiene («tabla» enseña «Datos»).
- **Fundamentos en el lateral.** Son nueve páginas; la guía de Stream va en la sección Stream.
- **Sin lateral.** Portada (`wide`), iconos (por sección) y 404 (`noindex`); `Base` admite `sidebar` para forzarlo.
- **Esqueleto (D1).** Piezas de la web: `SectionTitle.astro` (`SectionHeader` `sm` con su `id`), `MdxH2.astro` (los `##` de los `.mdx`), `PageToc.astro` («En esta página») y `lib/layout.ts` (columna de 720 px y 56 px entre secciones). La importación se copia con el `CopyTooltip` global (`data-copy`), sin JavaScript nuevo. «En esta página» se pinta desde 1.280 px; por debajo no hay índice.
- **Test de estructura.** Ya no hay excepción para el lateral: comprueba que es `SidebarNav` con `disclosure="native"` y sin isla.

## Página de componente (D3)

- **Campos de texto en el inspector.** La spec no los nombraba, pero sin ellos ningún componente pasaba de nueve controles y «Muchas props» no se podía dar: hay un control `text` (`Input`) para las props `string` no técnicas, para los `ReactNode` que suelen ser texto (`label`, `hint`, `title`…) y para `children`. `Input` queda en 13 controles.
- **Grupos y atajos.** Van en `starts/grupos.ts` y `starts/atajos.ts` (este, generado de `test/fixtures/figma-types.json` con `scripts/generate-shortcuts.ts`; un test falla si no está al día). Un test falla si un componente con más de doce controles queda sin grupos.
- **Props cerradas.** Siempre con `Select`; el lienzo pinta `size` con `Tabs`.
- **Etiquetas de la tira.** El botón de cada `Tag` se llama «Quitar el cambio de <prop>», para no repetir el nombre del «Restablecer <prop>» de la fila.
- **Barra móvil.** Es `sticky` dentro del ejemplo: queda pegada abajo mientras el ejemplo sigue por debajo. A 390 px el recuento va en una línea sobre los dos botones.
- **Cuándo usarlo y Evita.** Pares de `ExampleCard` en Button, Input, Badge, Modal y EmptyState; el pie es una frase literal de la ficha y los especímenes salen de `examples` en el arranque. Los demás componentes siguen con el texto. Con pares, «Evita» es sección propia.
- **Relacionados.** Tres `LinkCard` al final (los siguientes del grupo), ya no en la columna derecha.

## Portada (D4)

- **Titulares de «reglas» y «así se ve».** Son `SectionHeader`, más discretos que los de 36/44 del lienzo.
- **Botón de avanzar.** Dice siempre «Siguiente regla» (el lienzo ponía «Aplicar la primera regla» en el paso 0): el escenario pide pulsarlo dos veces desde el principio.
- **`ProgressSteps`** con marcador `check`; el lienzo numeraba de 0 a 5.
- **JavaScript.** `/` pasa de 191 a 238,3 kB (tres islas nuevas y el desplegable de divisa); límite a 262, con su motivo en `js-budget.json`.

## Índice (D5)

- **Página plana.** Cada grupo es un `h2`; los de Stream se titulan «Stream: Alertas», etc. Desaparecen las anclas `#seccion-components` y `#seccion-stream`.
- **`Select` de grupo.** Navega al ancla, no filtra, y su código se carga a demanda. El buscador es un script pequeño, sin isla.
- **Mapa también en móvil**, a dos columnas.

## Fundamentos (D6)

- **Familias del explorador.** Las siete reales por prefijo (Texto, Fondos, Bordes, Iconos, Utility, Alfa, Componentes), no las seis del lienzo: «Estados» no existe como prefijo y sin Alfa y Componentes quedarían 38 tokens fuera.
- **Tabla de dos columnas** («Token, valores y utilidad» y «Cuándo se usa»), con `TokenSwatch`. El contraste se conserva en escritorio.
- **Copiar.** `TokenSwatch` se pinta sin isla; el script le pone `data-copy` al pulsar y copia el `CopyTooltip` global.
- **Pares.** En principios, color, tipografía, espaciado, sombras, iconografía y fondos. Algunas frases de «esto no» son nuevas (ilustran la regla de su página); conviene repasar el tono.
- **Contenido y tono.** Seis casos, cada uno con su par `instead`/`better`.
- **Guía del artefacto.** `scripts/artifact/src/guide.ts` convierte los pares (`<Pair>` y `<Rule>`) en líneas con su veredicto.

## Iconos (D7)

- **Navegación de sets.** `Tabs` de enlaces también en móvil (el lienzo usaba un `Select`), con recuento en las seis.
- **`IconTile`** recibe como nodo la imagen perezosa de siempre; para archivos, cursores, pagos y logos (más grandes que 24 px) se ajusta con `className`.
- **Panel.** Se añade «Copiar nombre» y la nota de cada set; se quita el bloque de uso por contexto.

## Arreglos de paso

- **Fragmento de Next.js.** El código de cada página decía `$indent(code, 3)` en vez del fragmento (fallo anterior, ya publicado). Corregido en `lib/snippets.ts`.
- **`Carousel` en tira.** La lista se desplaza y no se podía enfocar (axe, `scrollable-region-focusable`): ahora lleva `tabIndex={0}` y anillo de foco.

## Faltas del paquete que han salido (sin hacer)

- `IconTile`: `size` solo admite 16, 20 y 24; no reenvía `ref` ni `data-*`.
- `Disclosure`: sin `open` controlado ni `onToggle`; el contenido lleva `pl-6` fijo.
- `ExampleCard`: `caption` obligatorio aunque entre por slot; sin forma de marcar el espécimen como `inert`.
- `TokenSwatch`: su botón no lleva `data-copy` ni acepta props de sobra; las muestras con alfa casi no se ven.
- `CompareSlider`: `height` fijo; anuncia «30 % Oscuro» cuando lo visible es un 30 % de claro.
- `Spotlight`: sin `className` ni ancho completo.
- `MetricCard`: sin tendencia neutra.
- `CodeSnippet`: no expone la pestaña activa.
- `Select` con búsqueda: el botón del chevron se llama «Show suggestions».
- `Tabs` con `href`: no gestiona el desbordamiento en móvil.
- `LinkCard` y `Table`: no pasan atributos a su raíz o a sus filas.

## Estados (D8)

- **Error al copiar.** `CopyTooltip` gana `onCopyError` (cambio en el paquete, con su changeset): la isla global de la web lo usa para enseñar una `Notification` de error, abajo a la derecha, que no se cierra sola. El aviso se carga solo cuando hace falta. El proposal decía «sin cambios en los paquetes»: este y el foco de la tira de `Carousel` son los dos que han hecho falta.
- **Carga.** `Skeleton` en el hueco de cada captura del índice (se retira al cargar la imagen) y `Spinner` con «Montando el ejemplo» en el lienzo del ejemplo interactivo.
- **Sin resultados.** `EmptyState` con lo buscado y «Limpiar búsqueda» en el índice, el explorador de tokens y las seis galerías; en la búsqueda global, el `emptyText` de `CommandMenu`, como estaba.

## Cierre (9.1): queda sin marcar

- **Hecho.** Biome limpio; typecheck, tests y build de todo el monorepo; `check:size` (126 componentes) y `check:js` dentro de límite; artefacto (22 tests); axe sin violaciones serias en todas las páginas (`a11y.spec`); e2e completo en Chromium más la selección de Firefox y WebKit: 1.446 pasan y falla 1 de forma intermitente («Restablecer» del ejemplo interactivo, que pasa solo tres veces seguidas; es el mismo fallo de carga que el «humo»).
- **Lighthouse, sin validar.** En este PC, accesibilidad pasa en las cuatro páginas; rendimiento da 0,79 en `/`, 0,81 en `/foundations/color/`, 0,67 en `/components/button/` y 0,82 en `/components/` (TBT 0 ms y CLS 0 en todas; lo que baja la nota es FCP y LCP simulados, 2,3–3,9 s y 4,5–7,1 s). Es el mismo rango que ya daba este PC antes del rediseño (ver NOTAS de `adopt-untitled-ui-icons`), así que el umbral de 90 lo decide CI. La página de componente es la que hay que mirar allí: carga 336 kB de JavaScript en 129 peticiones nada más abrir, porque el ejemplo interactivo queda a la vista. Si CI no llega a 90, las salidas son cargar el ejemplo al interactuar o partir el inspector en un trozo aparte.
- **4.3.** La portada da en local lo mismo que las páginas que no han ganado peso, así que la copia oscura de «Así se ve» se deja pintada en el servidor. Si CI baja de 90 en `/`, se monta al entrar en pantalla (`ThemeCompare.tsx`).
