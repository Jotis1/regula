# @jotis-me/icons

## 0.5.0

### Minor Changes

- 858d806: Icono nuevo `monitor-01` (pantalla), del archivo de Figma, para representar «Sistema» en el selector de tema. El set pasa de 81 a 82 iconos.

## 0.4.0

No changes in this release.

## 0.3.0

### Minor Changes

- 94ffbf3: Scaena entra en la suite: `apps.scaena` / `appIcons.scaena` (`Sc`, tono `lime`), con sus SVG y PNG en `dist/app-icons/` y `app="scaena"` en `AppIcon`. `lime` no bloquea ningún tono libre: sus vecinos (`yellow` y `green`) ya estaban vetados.

## 0.2.0

### Minor Changes

- f691517: Regula entra en la familia de iconos de app: `AppIcon app="regula"` pinta "Re" en `fuchsia`. `@jotis-me/icons` publica sus SVG, favicon y PNG en `app-icons/regula-*`. Como `purple` y `pink` son vecinos de `fuchsia`, dejan de valer para una app nueva.

## 0.1.0

### Minor Changes

- 060d186: Primera versión pública del sistema de diseño de la suite jotis.me: tokens semánticos en claro y oscuro con su tema de Tailwind v4 y las fuentes de la suite; los 81 iconos de línea como componentes React y SVG sueltos, con los iconos de app y los adornos; y los 74 componentes de la guía en React, compatibles con Next.js (App Router) y Astro.
