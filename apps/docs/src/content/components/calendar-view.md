---

name: CalendarView
description: "Calendario con vistas de mes, semana y día, eventos en cada día o en su hora, cabecera con la fecha de hoy y navegación."
interactive: true
astroNote: "Sin directiva pinta el mes sin JavaScript. Cambiar de mes y `onSelectDate` necesitan una isla `.tsx` con `client:load`. Las vistas de semana y día y el selector necesitan hidratación."
---

**Props.** `events` [{`date`, `title`, `time`, `color` (colores de `Badge`), `duration` (minutos)}], `today`, `month`, `maxEvents` (3; el resto como "N más…"), `onSelectDate(date)`, `view` / `defaultView` / `onViewChange` (`month`, `week`, `day`), `onSelectEvent(event)`, `startHour` (8), `hours` (`[0, 24]`; el tramo de horas que se pinta), `aside`, `subtitle`, `actions`.

**Visual.** Celdas de 112px con borde `border-secondary`; días de otro mes en `bg-secondary`; hoy en círculo `bg-brand-solid`. Eventos como chips utility (`-50` fondo, `-200` borde, `-700` texto).

**Vistas.** Las del Figma (`Calendar`, `8022:24550`). Con `view`, `defaultView` o `onViewChange` aparece el selector de vista (el `Dropdown` de elección única) y los botones de navegación avanzan un mes, una semana o un día.
- `month`: la de siempre.
- `week`: cabecera con los siete días (hoy en círculo), columna de horas y una columna por día, de lunes a domingo. Cada hora mide 96 px y se ve desde `startHour`; el resto se desplaza.
- `day`: una sola columna; `aside` pinta a su derecha (debajo en pantallas estrechas) el panel que quieras, como el mini calendario y el detalle del evento del Figma.

**Eventos de hora.** La hora de inicio sale de `date` y el alto de `duration` (60 min por defecto; el Figma pinta de 30 a 120). Cada evento toma uno de los colores de `Badge`. Los que se pisan se reparten el ancho de la columna. Con `onSelectEvent`, cada evento es un botón.

**Hora actual.** Una línea de `brand` cruza la semana o el día de hoy a la hora de `today` (la hora del sistema si no se pasa), con la hora en la columna de horas. No sale en una semana o un día que no contienen hoy.

**Móvil.** Por debajo de 576 px de ancho del propio calendario (no de la ventana), la semana pasa a una tira con los siete días y la columna del día elegido; pulsar un día cambia de columna.


**Accesibilidad.** Las vistas de semana y día son una lista por día (con su fecha como nombre) con un elemento por evento, nombrado «título, 10:00–11:30»; la línea de hora actual es un separador con la hora. La vista de mes es una tabla de verdad: cabeceras Lu…Do y una fila por semana (en la guía era una rejilla sin filas, que no es ARIA válido). Cada día lleva su fecha completa para lectores de pantalla ("jueves, 29 de octubre, hoy"). Con `onSelectDate`, el número de cada día es un botón (teclado) y la celda entera responde al clic. Al cambiar de mes se anuncia el nuevo.

**Detalles.** El "hoy" sale de la prop `today` (por defecto, la fecha actual); fíjala si el servidor y el navegador pueden estar en días distintos.

**Contraste de "N más…".** En la guía va en `utility-neutral-500`, que en oscuro no llega a 4,5:1 (3,8:1 sobre los días de otro mes). Aquí va en `text-quaternary`: el mismo gris en claro y más claro en oscuro (7,7:1).
