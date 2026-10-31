---

name: CalendarView
description: "Calendario mensual con eventos en cada día, cabecera con fecha de hoy y navegación."
interactive: true
astroNote: "Sin directiva pinta el mes sin JavaScript. Cambiar de mes y `onSelectDate` necesitan una isla `.tsx` con `client:load`."
---

**Props.** `events` [{`date`, `title`, `time`, `color` (colores de `Badge`)}], `today`, `month`, `maxEvents` (3; el resto como "N más…"), `onSelectDate(date)`, `subtitle`, `actions`.

**Visual.** Celdas de 112px con borde `border-secondary`; días de otro mes en `bg-secondary`; hoy en círculo `bg-brand-solid`. Eventos como chips utility (`-50` fondo, `-200` borde, `-700` texto).

**Límites.** Solo vista de mes. Las vistas de semana y día del archivo no están: si una app las necesita, se añaden.

**Accesibilidad.** Es una tabla de verdad: cabeceras Lu…Do y una fila por semana (en la guía era una rejilla sin filas, que no es ARIA válido). Cada día lleva su fecha completa para lectores de pantalla ("jueves, 29 de octubre, hoy"). Con `onSelectDate`, el número de cada día es un botón (teclado) y la celda entera responde al clic. Al cambiar de mes se anuncia el nuevo.

**Detalles.** El "hoy" sale de la prop `today` (por defecto, la fecha actual); fíjala si el servidor y el navegador pueden estar en días distintos.

**Contraste de "N más…".** En la guía va en `utility-neutral-500`, que en oscuro no llega a 4,5:1 (3,8:1 sobre los días de otro mes). Aquí va en `text-quaternary`: el mismo gris en claro y más claro en oscuro (7,7:1).
