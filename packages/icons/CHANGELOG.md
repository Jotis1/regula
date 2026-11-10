# @jotis-me/icons

## 0.6.0

### Minor Changes

- a9768ec: Logos de servicios de terceros en una entrada nueva, `@jotis-me/icons/logos`: los 232 de apps («App icons» del Figma), los 16 de integraciones (Next.js, React, Tailwind CSS, GitHub, Claude…) y los 34 sociales, estos dos en color y en gris. Cada uno es un componente suelto (`AppZapierLogo`, `SocialGithubLogo`, `SocialGithubLogoGray`…) que un bundler deja fuera si no se importa, y un SVG en `@jotis-me/icons/logos/<set>/<nombre>.svg` para Astro o HTML sin JavaScript. Sin `title` son decorativos; con `title`, una imagen con ese nombre. Los grises de un solo color siguen el color del texto (`currentColor`). La entrada principal no cambia. El paquete pasa de 1,37 a 2,91 MB sin comprimir (los 332 SVG y sus componentes); lo que cargas en tu app es solo el logo que importes.

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
