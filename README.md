# Regula

El sistema de diseño de la suite jotis.me (Vinculum, Pecunia, Emptor, Ornatus…): tokens, iconos, componentes React y la web [regula.jotis.me](https://regula.jotis.me).

## Paquetes

| Paquete            | Qué trae                                                           |
| ------------------ | ------------------------------------------------------------------ |
| `@jotis-me/tokens` | Tokens semánticos en claro y oscuro, tema de Tailwind v4 y fuentes |
| `@jotis-me/icons`  | Iconos de línea en React y SVG, iconos de app y adornos            |
| `@jotis-me/react`  | Los componentes de la guía para Next.js y Astro                    |

## Desarrollo

Requiere [Bun](https://bun.sh).

```sh
bun install
bunx turbo run build
bunx biome check .
```

| Carpeta      | Contenido                                                                           |
| ------------ | ----------------------------------------------------------------------------------- |
| `packages/`  | Paquetes publicados en npm                                                          |
| `apps/docs`  | La web regula.jotis.me (Astro)                                                      |
| `examples/`  | Proyectos Next.js y Astro que consumen los paquetes                                 |
| `reference/` | Copia congelada de la guía original (versión `9fe2`): solo procedencia, nada la lee |
| `openspec/`  | Specs y cambios                                                                     |

El repo es la fuente de verdad del sistema (tokens, iconos, marca, componentes, fichas y guía). El artefacto "Jotis.me" de Claude se genera desde aquí y es de solo lectura.

## Licencia

MIT. Las fuentes incluidas (Geist, Geist Mono, Bricolage Grotesque) tienen licencia SIL Open Font License 1.1.
