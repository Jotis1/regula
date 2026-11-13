---

name: ProgressSteps
description: "Pasos de un proceso con su estado (completo, actual, pendiente), en cinco tipos, dos tamaños y dos orientaciones."
interactive: false
astroNote: "Con `onChange` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`. Sin ella se pinta en el servidor."
---

**Cuándo usarlo.** Un proceso de varios pasos con orden fijo: un alta, un asistente de configuración, un pago. Para un avance continuo de un solo valor, `ProgressBar` o `ProgressCircle`; para cambiar entre paneles, `Tabs`.

**Props.** `steps` (`{ title, description?, icon? }[]`), `current` (índice del actual, desde 0; los anteriores están completos), `type`, `marker`, `size` (`sm` · `md`), `orientation` (`horizontal` · `vertical`), `labels` (el estado para lectores y «Paso n de N»), `onChange` (`(index: number) => void`, hace los pasos pulsables), `children` (`(current: number) => ReactNode`, el contenido del paso actual), `aria-label` y `className`.

**Tipos.** `icons-centered`: marcadores unidos por una línea de 2px, con título y apoyo centrados debajo (`text-xs` en `sm`, `text-sm` en `md`). `icons-text`: marcador a la izquierda y texto a la derecha, siempre en columna, con la línea vertical entre marcadores (`text-sm` en `sm`, `text-md` en `md`). `text-line`: una raya de 4px sobre el texto de cada paso, de marca hasta el actual y en `bg-quaternary` después. `minimal`: solo los marcadores, con «Paso 3 de 4» a la izquierda. `minimal-connected`: solo los marcadores, unidos por líneas cortas; el «Paso 3 de 4» queda para lectores.

**Marcadores.** `check`: el completo es un círculo `bg-brand-solid` con check blanco, el actual lleva un anillo de marca, un hueco y un disco de marca con un punto claro, y el pendiente es un anillo `border-primary` con un punto gris. `number`: el pendiente y el actual enseñan su número en un círculo con borde; el completo, un círculo verde (`bg-success-solid`) con check, y las líneas pasan a ir punteadas. `featured`: el `icon` de cada paso en un cuadrado de `FeaturedIcon` modern (40px en `sm`, 48 en `md`), atenuado si está pendiente, y la línea hasta el actual en `fg-secondary`. Los marcadores miden 24px en `sm` y 32 en `md`.

**Orientación.** En vertical, cada paso pone su marcador a la izquierda y su texto a la derecha, y la línea que los une va en vertical. El Figma da en móvil la versión vertical de cada tipo; aquí la elige quien lo usa (`orientation`), sin medir la pantalla. Los tipos mínimos no cambian con ella.

**Color del texto.** El título va en `text-secondary` y el apoyo en `text-tertiary`; el actual, en `text-brand-secondary` y `text-brand-tertiary`. Con marcadores `number` o `featured`, los pendientes se atenúan a `text-quaternary`.

**Accesibilidad.** Es una lista ordenada (`<ol>`). Cada paso empieza con su estado en texto solo para lectores («completo: », «actual: », «pendiente: ») y el actual lleva `aria-current="step"`. Los marcadores y las líneas son decorativos. En los tipos mínimos, que no enseñan los títulos, estos quedan para lectores junto al estado.

**Navegable.** Con `onChange`, cada paso (marcador y título) es un `<button type="button">` dentro de su `<li>`, con el anillo de foco del sistema, y llama a `onChange` con su índice. Su nombre accesible es el título del paso; el apoyo va debajo, fuera del botón, y es su descripción (`aria-describedby`), para que lo que se ve dentro del botón coincida con su nombre (WCAG 2.5.3); el estado («completo: », «actual: », «pendiente: ») sigue en texto para lectores y el actual conserva `aria-current="step"`. Funciona en los cinco tipos y en las dos orientaciones; en `minimal` y `minimal-connected` los botones son los propios marcadores. El componente no guarda el paso actual: `current` sigue siendo tuyo, y `onChange` es el sitio donde cambiarlo. Hazlo navegable cuando la persona pueda volver a un paso anterior o saltar entre ellos (un asistente de configuración). Los pasos pendientes también se pulsan: si en tu alta no deben poder saltarse, no pases `onChange` o ignora los índices que no quieras admitir.

**Contenido del paso.** Con `children`, una función que recibe el índice del paso actual, el contenido se pinta en una región `aria-live="polite"` para que los lectores lo anuncien al cambiar de paso. En vertical va dentro del `<li>` del actual, bajo su texto; en horizontal (y en los tipos mínimos), en un bloque bajo la lista, y entonces `className` pasa a un envoltorio que los contiene a ambos. Con todos los pasos completos (`current` igual a la longitud de `steps`), en horizontal recibe esa longitud y en vertical no se pinta nada, porque no hay paso actual. Las dos props son independientes: `children` sin `onChange` deja los pasos como texto.
