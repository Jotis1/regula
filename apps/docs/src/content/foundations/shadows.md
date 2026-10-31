---

title: "Sombras y estados"
description: "Sombras, hover, deshabilitado y foco."
order: 6
---

- Sombras: `shadow-xs` inputs; `shadow-xs-skeuomorphic` botones e iconos destacados; `shadow-sm` mando del toggle; `shadow-lg` menús, tooltips, notificaciones; `shadow-xl` modales. Son las mismas en claro y oscuro; sobre fondos oscuros las exteriores casi no se ven y la separación la dan `bg-primary_alt` y los bordes.
- Hover: cambia el fondo un escalón (`bg-primary` → `bg-primary_hover`) o el color del texto a su `_hover`. Deshabilitado: 50% de opacidad en todo el control. Sin animaciones decorativas; transiciones de 100–150 ms en color y en el mando del toggle.
- Backdrop de modal: `bg-overlay` al 70% con `backdrop-blur-lg` (16px).
