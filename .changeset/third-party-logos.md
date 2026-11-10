---
"@jotis-me/icons": minor
---

Logos de servicios de terceros en una entrada nueva, `@jotis-me/icons/logos`: los 232 de apps («App icons» del Figma), los 16 de integraciones (Next.js, React, Tailwind CSS, GitHub, Claude…) y los 34 sociales, estos dos en color y en gris. Cada uno es un componente suelto (`AppZapierLogo`, `SocialGithubLogo`, `SocialGithubLogoGray`…) que un bundler deja fuera si no se importa, y un SVG en `@jotis-me/icons/logos/<set>/<nombre>.svg` para Astro o HTML sin JavaScript. Sin `title` son decorativos; con `title`, una imagen con ese nombre. Los grises de un solo color siguen el color del texto (`currentColor`). La entrada principal no cambia. El paquete pasa de 1,37 a 2,91 MB sin comprimir (los 332 SVG y sus componentes); lo que cargas en tu app es solo el logo que importes.
