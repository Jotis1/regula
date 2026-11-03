# Design

## Context

Motivación y alcance, en `proposal.md`; requisitos, en `specs/`.

**Lo que hay hoy en `apps/docs`:**
- Astro + MDX + `@astrojs/react` y Tailwind v4 sobre `@jotis-me/tokens`.
- Layouts `Base`, `Prose` y `ComponentPage`.
- Colecciones `foundations` (10 `.md`) y `components` (74 `.md`, cada una con la ficha de la guía como párrafos con etiqueta en negrita).
- Tabla de props con `react-docgen-typescript` (`src/lib/props.ts`), fragmentos en `src/lib/snippets.ts` y ejemplos del registro de paridad (`src/visual/`).
- Búsqueda con CommandMenu + Pagefind, conmutador de tema con script en `<head>` y precarga de fuentes.

**El diseño** es un proyecto de Claude Design (`.dc.html` con estilos en línea sobre el bundle de la guía, versión `1793561361-ae73`, la misma que `reference/`). Sirve de referencia de composición; no es código que se pueda copiar.

**Restricciones:**
- la web es estática;
- Lighthouse móvil ≥ 90 y axe sin fallos serios;
- la paridad visual de los componentes (`/visual/` y su arnés) no cambia;
- las fichas no se reescriben (decisión del usuario).

## Goals / Non-Goals

**Goals:**
- Llevar la composición del diseño a la web con los componentes reales y los datos reales.
- Una sola fuente para la estructura (qué componente va en qué grupo) que alimente navegación, índice, búsqueda, migas, relacionados y anterior/siguiente.
- Que añadir un componente o un token siga sin exigir tocar la web.

**Non-Goals:**
- Paridad píxel a píxel con el diseño. Se compara a ojo con capturas, porque el diseño son maquetas con datos de ejemplo.
- Cambiar componentes de `@jotis-me/react`, salvo `AppIcon`.
- Redirecciones de las URLs antiguas (decisión del usuario).
- Un playground a mano por componente.

## Decisions

### 1. Copia congelada del diseño en `reference/docs-design/`
Se importan los `.dc.html`, `lib/regula.css` y `canvas.json` del artefacto, con un `VERSION`, igual que la guía en `reference/`. Así cada tarea compara con una versión fija y el diseño puede seguir cambiando en Claude Design.

*Alternativa descartada:* leer el artefacto en vivo en cada tarea; los cambios no serían reproducibles.

### 2. Catálogo único de la estructura
`src/lib/catalog.ts` define, en el orden del diseño:
- las secciones de la cabecera;
- los grupos de componentes (Acciones, Formularios, Navegación, Capas, Avisos y carga, Etiquetas e identidad, Datos, Gráficas, Estructura de página, Contenido y medios, Fondos y maquetas, y Stream: Alertas, Escenas, Overlay, Canal);
- el orden de fundamentos.

De ahí salen la navegación, `/components/`, las descripciones de la búsqueda, las migas, los relacionados (los vecinos de su grupo) y anterior/siguiente. Un test comprueba que cada componente de la colección está en un solo grupo y que no hay grupos con componentes que no existen.

*Alternativa descartada:* el grupo en el frontmatter de cada ficha. Reparte el orden en 74 ficheros y no impide grupos mal escritos.

### 3. Fichas repartidas por etiqueta, sin tocar el texto
En el build, cada párrafo de la ficha que empieza por `**Etiqueta.**` se asigna a una sección con un diccionario de etiquetas:

| Sección | Etiquetas |
|---|---|
| Úsalo así | "Cuándo…", "Uso", "Regla(s)", "Reglas del archivo", "Cuál", "X o Y", "Destructivas"… |
| Evita | "Evita", "No", "Límites" |
| Accesibilidad | "Accesibilidad", "Teclado", "Foco" |
| Amplía o difiere de la guía | "Ampliaci…", "Diferencia(s)…" |
| Detalles | todas las demás, como pares de título y texto (la etiqueta es el título) |

El párrafo "Props." no se pierde: va junto a la tabla de props como resumen de la guía. Hay un test que comprueba que todos los párrafos de las 74 fichas acaban en la página, una sola vez y sin cambios.

*Alternativa descartada:* reescribir las fichas en listas; el usuario la descartó.

### 4. Playground genérico desde los tipos
`propsOf` ya da, para cada prop, el tipo, los valores de las uniones y el valor por defecto.
- **Controles:** una prop con valores cerrados (que no sean nombres de icono) da un selector: `ButtonGroup` hasta seis valores, `Select` a partir de siete. Un booleano da un `Toggle`.
- **Props excluidas:** las controladas y de estado (`open`, `value`, `checked`, `defaultValue`, `defaultOpen`…), las funciones, los nodos y los números.
- **Punto de partida:** las props mínimas de cada componente (por ejemplo `children="Nuevo gasto"`) salen de `src/lib/playground.ts`. Sin entrada ahí ni props que mover, no hay playground y la página enseña sus ejemplos.
- **Cómo se pinta:** una isla de React (`client:visible`) recibe los controles y el punto de partida serializados, pinta el componente y genera su JSX. El código solo lleva las props que cambian respecto a su valor por defecto.
- **Test de humo:** cada playground se monta con el primer y el último valor de cada control, sin errores en consola.

*Alternativa descartada:* playground a mano en los más usados; el usuario eligió el genérico.

### 5. Fundamentos en MDX con piezas de composición
Las páginas de fundamentos pasan a `.mdx` con piezas propias de la web:
- tarjetas de "lo esencial";
- tarjetas de "Cabe / No cabe";
- tabla "En lugar de / Escribe";
- lista de pares de título y texto;
- ejemplos vivos.

El texto sale de `reference/GUIA.md` sin reescribir. Un test, ampliando `e2e/foundations.spec.ts`, comprueba que cada apartado de la guía tiene su página y su texto clave.

### 6. Tokens de Color con contraste calculado
La tabla se genera desde `@jotis-me/tokens`, como ahora:
- filtro de texto y familias (Texto, Fondo, Borde, Icono, Utility, Alfa, Componentes) con sus recuentos;
- contraste WCAG de los tokens de texto e icono contra `bg-primary` de cada tema, calculado en el build y marcado "bajo" por debajo de 4,5:1 (texto) o 3:1 (icono);
- la tabla de excepciones sale de la sección de contraste de la guía.

No hace falta JavaScript para leerla. El filtro y la copia son una isla pequeña.

### 7. Navegación lateral sin depender de JavaScript
- **Grupos:** `<details>` abiertos en el grupo de la página actual. Así se puede navegar sin JavaScript.
- **Filtro:** un script de unas pocas líneas lo añade, con el atajo `/`.
- **Móvil:** el menú es un `Slideout` de `@jotis-me/react`, que trae ya foco atrapado, Escape y foco de vuelta. Lleva la búsqueda, la misma navegación y el tema (Sistema, Claro, Oscuro).
- **Índice "En esta página":** se marca con un `IntersectionObserver` y, sin JavaScript, queda como lista de enlaces.

### 8. Tema en tres estados
`localStorage` guarda `claro`, `oscuro` o nada (sistema). El script de `<head>` ya resuelve el sistema cuando no hay valor. El conmutador de la cabecera alterna claro y oscuro; el selector del menú móvil añade "Sistema", que borra el valor guardado.

### 9. Marca: icono de Regula en `fuchsia`
- **Registro y tono:** Regula entra en el registro de `@jotis-me/icons` con `fuchsia`, un tono de la paleta de Tailwind. La guía `1793561361-ae73` lo traía en una paleta propia, `chartreuse`; la `1793653059-466a` lo pasa a `fuchsia` y quita `chartreuse` de los tokens (decisión del usuario, 3 nov). Las tareas 2.1 a 2.4 se hicieron primero con `chartreuse` y se rehicieron con `fuchsia` (ver tasks.md).
- **Validación:** no cambia. `fuchsia` no lo usa otra app ni es vecino de ninguna (`indigo`, la más cercana, está a tres pasos en el círculo de tonos). Sus vecinos, `purple` y `pink`, dejan de valer para una app nueva.
- **Ficheros:** se generan sus SVG, el favicon y los PNG. La paridad se comprueba con `reference/assets/App icons/regula-*.svg`. Los de Regula de la guía nueva llevan las letras con `transform="translate(…) scale(…)"` en lugar de coordenadas absolutas: los tests de paridad aplican ese transform antes de comparar.
- **Paridad visual de AppIcon:** la vista previa deja de estar fijada (`e2e/visual/pinned/`) y se recaptura con la de la guía, que ya trae la fila de Regula.
- **Variante en la cabecera:** la guía dice que dentro de una interfaz clara, documentación incluida, va la variante `light` (claro). La cabecera usa `light` en el tema claro y la principal en el oscuro. El diseño usa siempre la principal; aquí manda la guía, y se anota en la página de marca.
- **Tema de Tailwind:** nada que añadir. AppIcon lleva los colores de cada tono en su código (excepción documentada en `check:colors`); el tema sigue sin exponer la paleta cruda.

### 10. Páginas nuevas
- **`/components/`:** grupos del catálogo con nombre y descripción de cada componente.
- **`/changelog/`:** lee en el build los `CHANGELOG.md` de los paquetes (Changesets en modo `fixed`: misma versión en los tres). Muestra cada versión una vez, con las entradas de los tres. Sin versiones publicadas, un `EmptyState`.
- **`/components/<slug>/full/`:** solo para StreamScene y ChannelBanner. El lienzo va con `scale={1}` sobre fondo oscuro, `noindex` y un enlace de vuelta.

### 11. Pie y portada con datos del build
- **Versión del pie:** sale del `package.json` de cada paquete.
- **Cifras de la portada y del mapa:** componentes, iconos, tokens de color y apartados de fundamentos se cuentan en el build.
- **"Proponer un cambio":** enlaza a la edición del fichero fuente en GitHub (`Jotis1/regula`).
- **Fragmentos de instalación:** salen del README de `@jotis-me/react`, igual que `/start/install/`.

## Risks / Trade-offs

- [El rediseño toca casi toda la web y sus e2e] → Tareas por página con su verificación (build, e2e, axe y captura comparada con el diseño). La paridad de componentes (`/visual/`) se ejecuta en cada tarea para asegurar que no se rompe.
- [Más JavaScript: playground, filtro, menú, índice] → Islas `client:visible`/`client:idle`, y la navegación y el índice funcionan sin JavaScript. Lighthouse en CI (≥ 90) lo vigila, como ahora.
- [El playground genérico puede dar combinaciones raras o romper componentes controlados] → Lista de props excluidas y test de humo de los 74.
- [Etiquetas de ficha no previstas] → Van a "Detalles" con su etiqueta como título: nada se pierde. El test de "todos los párrafos una vez" lo garantiza.
- [El diseño se inventa datos (paquetes, la prop `as`, Figma)] → Se usan los reales. Un e2e comprueba que ningún fragmento importa de un paquete que no sea `@jotis-me/*`.
- [Enlaces externos a las URLs antiguas] → Aceptado por el usuario: la web lleva menos de una semana publicada.
- [Este cambio modifica specs que aún no están en `openspec/specs/`] → Se archiva después de `create-regula-design-system`.

## Migration Plan

1. Rama `rediseno-web` desde `grupo-13-stream`; se rebasa sobre `main` cuando esta tenga `grupo-13-stream`.
2. Cada PR tiene su preview en Vercel para revisarla con el usuario.
3. Al fusionar en `main`, Vercel despliega la web nueva. CI sigue siendo obligatorio.
4. El changeset `minor` (Regula en AppIcon) entra en el siguiente PR de versión.
5. **Vuelta atrás:** revertir el merge en `main` devuelve la web anterior en el siguiente despliegue. Los paquetes no se ven afectados hasta que se publica la versión.

## Open Questions

- Qué componentes llevan "relacionados" fuera de su grupo (por ejemplo, Dropdown junto a Button, como en el diseño). Se empieza por los vecinos de grupo y se ajusta al revisar las previews, sin cambiar specs ni tareas.
