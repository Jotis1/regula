---

title: "Color"
description: "Tokens semánticos de color en claro y oscuro."
order: 3
---

Los tokens son **semánticos**: elige por función, no por tono. Cada uno trae su valor claro y oscuro.

- **Fondos.** Página y tarjetas en `bg-primary`. Zonas secundarias (cabecera de tabla, shell de la app) en `bg-secondary`. Superficies elevadas (modales, menús, alertas) en `bg-primary_alt`, que en oscuro se separa del fondo. Hover de filas e ítems: `bg-primary_hover`.
- **Texto.** `text-primary` para títulos y valores; `text-secondary` para etiquetas y texto de botones; `text-tertiary` para apoyo y pistas; `text-quaternary` para metadatos; `text-placeholder` solo en placeholders. Enlaces: `text-brand-secondary`.
- **Bordes.** `border-primary` en controles (inputs, checkboxes, botones secundarios); `border-secondary` para separadores y tarjetas; `border-brand` en foco.
- **Iconos.** Familia `fg-*`: `fg-quaternary` dentro de controles, `fg-tertiary` en navegación, `fg-brand-primary` en indicadores activos.
- **Estados.** `error`, `warning`, `success` en tres capas: `bg-*-primary` (tinte de fondo), `bg-*-solid` (relleno), `text-*-primary` / `fg-*-primary` (texto e icono). Un estado siempre lleva palabra o icono además del color.
- **Escalas utility** (`utility-<tono>-50…700`): para badges, etiquetas y gráficas. Fondo `-50`, borde `-200`, texto `-700`, punto `-500`. El modo oscuro invierte la escala.
- **Foco.** `focus-ring-shadow`: hueco de 2px en `bg-primary` y anillo de 4px en `focus-ring` (#615FFF). En errores, `focus-ring-error-shadow`.

**Contraste.** Todos los pares de texto principales superan 4,5:1 en ambos temas. Excepciones heredadas del archivo, que se mantienen tal cual: `text-warning-primary` (2,9:1) y `text-success-primary` (3,2:1) sobre blanco valen para 24px+ o junto a un icono; `fg-quaternary` (2,6:1 en claro, 2,5:1 en oscuro) es solo decoración; `bg-success-solid` y `bg-warning-solid` no admiten texto blanco normal; `border-primary` (1,5:1) queda por debajo del 3:1 para bordes de control, así que **todo input lleva etiqueta visible**; `text-placeholder` baja a 4,2:1 en oscuro.

**Gráficas.** Las series usan, en este orden, `utility-brand-600`, `utility-brand-400`, `utility-brand-200`, `utility-sky-500`, `utility-pink-500`, `utility-neutral-400`. En oscuro la escala de marca se invierte, como en el archivo: la tercera serie queda oscura sobre fondo oscuro, así que con tres o más series añade siempre leyenda.
