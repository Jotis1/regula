Calendario mensual con eventos en cada día, cabecera con fecha de hoy y navegación.

**Props.** `events` [{`date`, `title`, `time`, `color` (colores de `Badge`)}], `today`, `month`, `maxEvents` (3; el resto como "N más…"), `onSelectDate(date)`, `subtitle`, `actions`.

**Visual.** Celdas de 112px con borde `border-secondary`; días de otro mes en `bg-secondary`; hoy en círculo `bg-brand-solid`. Eventos como chips utility (`-50` fondo, `-200` borde, `-700` texto).

**Límites.** Solo vista de mes. Las vistas de semana y día del archivo no están: si una app las necesita, se añaden.
