---
"@jotis-me/react": patch
---

`StreamScene` admite `width`, el ancho del lienzo lógico (1920 por defecto; el alto sigue en 1080), para escenas que no son 16:9: para 3440×1440, `width={2580}` con `scale={4/3}`. `HeaderNav` admite `mobileActions`, que pinta `actions` también en la fila móvil, junto al botón de menú. En `ProgressSteps` con `onChange`, la descripción de cada paso sale del botón y va debajo, como su descripción accesible: lo visible del botón coincide con su nombre (WCAG 2.5.3).
