# Regula

El sistema de diseño de la suite jotis.me: tokens, iconos, componentes React y la web [regula.jotis.me](https://regula.jotis.me). Este repo es la fuente de verdad del sistema y de las normas de la suite.

## Comandos

Requiere [Bun](https://bun.sh). Todo se lanza desde la raíz.

```sh
bun install                  # instala las dependencias de todos los workspaces
bun run build                # construye los paquetes y la web (la web necesita los paquetes construidos)
bun run --cwd apps/docs dev  # arranca la web (por defecto en http://localhost:4321)
bun run test                 # pasa los tests de todos los workspaces
bun run typecheck            # comprueba los tipos de todos los workspaces
bun run lint                 # Biome: lint y formato
bun run format               # Biome: formatea
```

Antes de subir, además de los anteriores, corren las comprobaciones de las normas:

```sh
bun run check:dev    # normas de desarrollo (stack, código, tests, seguridad, agentes...)
bun run check:ci     # normas del CI
bun run check:audit  # auditoría de dependencias
```

## Estructura

| Carpeta      | Contenido                                           |
| ------------ | --------------------------------------------------- |
| `packages/`  | Paquetes publicados en npm (`@jotis-me/*`)          |
| `apps/docs`  | La web regula.jotis.me (Astro)                      |
| `examples/`  | Proyectos Next.js y Astro que consumen los paquetes |
| `scripts/`   | Comprobaciones del repo y herramientas del CI       |
| `openspec/`  | Specs y cambios                                     |
| `reference/` | Copia congelada de la guía original: no se toca     |

## Cómo se trabaja

- Las normas son la guía en <https://regula.jotis.me/standards/>. No se copian aquí: se consultan en la web, en `/standards.json` o con el MCP de Regula (`.mcp.json`, herramientas `list_standards` y `get_standard`).
- Todo cambio no trivial pasa por OpenSpec antes del código: `/opsx:propose`, `/opsx:apply` y `/opsx:archive`.
- Todo entra en `main` por PR, con las comprobaciones en verde.
