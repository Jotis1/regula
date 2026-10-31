---

title: "Principios"
description: "Neutro primero, una acción principal, profundidad sutil."
order: 1
---

El sistema de diseño de la suite jotis.me (Vinculum, Pecunia, Emptor, Ornatus y lo que venga). Interfaz de aplicación sobria: grises neutros, un solo color de marca (índigo), Geist y Geist Mono para leer, Bricolage Grotesque para los titulares. Claro y oscuro desde el primer día.

- **Neutro primero, marca con intención.** Casi todo es gris: texto, bordes, fondos. El índigo (`bg-brand-solid`, `fg-brand-primary`, `text-brand-secondary`) marca lo interactivo y lo actual. Si una pantalla tiene más de dos o tres manchas de marca, sobra alguna.
- **Una acción principal.** Cada vista y cada modal tiene como mucho un `Button` `primary`. El resto, `secondary` o `tertiary`. Ver el componente Button.
- **Profundidad sutil.** Los controles llevan `shadow-xs-skeuomorphic` (sombra mínima + borde interior) para parecer pulsables sin volver al 2010. Las superficies flotantes suben por escala: menús `shadow-lg`, modales `shadow-xl`.
- **Lo justo en tablas y datos.** Sin adornos, una columna principal, separadores finos (`border-secondary`).
