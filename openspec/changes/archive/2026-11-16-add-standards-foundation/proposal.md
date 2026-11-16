# Proposal

## Why

Regula solo tiene reglas de diseño. Cuando un agente programa en un producto de la suite jotis.me, no tiene escrito cómo se llaman los paquetes, en qué idioma va cada cosa, cómo son los commits ni cuándo hace falta una spec. Lo hace cada vez de una forma, y Regula tampoco cumple esas normas. Antes de la beta (`1.0.0-beta.1`) hace falta una base de normas que se puedan consultar, verificar y servir más tarde por un MCP. Este cambio pone esa base: el formato de una norma, dónde vive y las primeras normas, y deja a Regula cumpliéndolas.

## What Changes

- **Formato de norma:** cada norma tiene:
  - un ID estable por área (`NOM-001`),
  - un nivel (DEBE, DEBERÍA o PUEDE, como en RFC 2119),
  - a qué proyectos se aplica (todos, solo apps o solo paquetes publicados),
  - el enunciado y el porqué,
  - un ejemplo que la cumple y otro que no,
  - cómo se verifica (Biome, CI, test o revisión).
- **Una sola fuente estructurada** dentro de la web de docs. De ella salen las páginas, un JSON público que usará el MCP (cambio posterior) y los tests que la validan.
- **Sección nueva «Normas»** en la web: en la cabecera, en la navegación lateral y en la búsqueda. Tiene una página por área y un índice con todas las normas.
- **Primeras áreas y normas:**
  - **Nombres:** los paquetes privados usan notación de dominio inverso (`me.jotis.regula.docs`); los publicados en npm, el scope `@jotis-me`.
  - **Idioma:** la guía, los commits y los changesets van en español; el código, los identificadores, los comentarios y las rutas y parámetros de URL, en inglés.
  - **Git:** Conventional Commits completo (cabecera, cuerpo y pie); ramas `tipo/descripcion`; todo entra en `main` por PR con las comprobaciones en verde.
  - **Proceso:** todo cambio no trivial pasa por OpenSpec antes de tocar código, y la spec y el código se fusionan sincronizados.
- **Regula cumple sus normas:**
  - Se renombran los paquetes privados:
    - `regula` → `me.jotis.regula`
    - `docs` → `me.jotis.regula.docs`
    - `example-astro` → `me.jotis.regula.example.astro`
    - `example-next` → `me.jotis.regula.example.next`
    - `@jotis-me/artifact` → `me.jotis.regula.artifact`
  - El CI comprueba los nombres de paquete y los mensajes de commit de cada PR (commitlint).
  - El PR de versión de changesets pasa a `chore(release): versión de los paquetes`.
  - Las URLs de la web que estaban en español pasan al inglés:
    - `/components/<componente>/composiciones/` → `/compositions/`, con redirección desde la ruta antigua;
    - `?icono=` → `?icon=`;
    - `?tema=oscuro` → `?theme=dark`.
- Los commits ya fusionados no se reescriben.
- Fuera de alcance, para cambios posteriores:
  - el MCP,
  - las normas de desarrollo, tests, versionado, seguridad, rendimiento, SEO, accesibilidad, i18n, CI, documentación del código y programación con IA,
  - hooks de Git locales;
  - traducir al inglés y podar los comentarios existentes de Regula. Las normas de idioma se aplican al código nuevo, y la migración va en un cambio propio antes de la beta.

## Capabilities

### New Capabilities

- `engineering-standards`: el catálogo de normas de la suite. Recoge el formato de cada norma, su fuente única, su validación, el JSON público y el contenido de las áreas de nombres, idioma, Git y proceso.
- `standards-compliance`: cómo el repo de Regula demuestra que cumple las normas verificables. Incluye la comprobación de nombres de paquete y de commits en el CI, y el mensaje del PR de versión.

### Modified Capabilities

- `docs-site`: la cabecera pasa a tener una sección más («Normas»), con su navegación, sus páginas y su entrada en la búsqueda. Las rutas y los parámetros de URL de la web pasan al inglés.

## Impact

- `apps/docs`:
  - colección nueva de normas (datos y esquema),
  - páginas `/standards/` y `/standards/<area>/`,
  - JSON `/standards.json`,
  - `catalog.ts` y `nav.ts` (sección nueva),
  - índice de búsqueda,
  - tests de la colección y e2e de la sección.
- `package.json` de la raíz, `apps/docs`, `examples/*` y `scripts/artifact`: nombres nuevos. `bun.lock` se regenera.
- `.github/workflows/ci.yml`: paso de nombres de paquete y job de commitlint en PR. `release.yml`: título y commit del PR de versión.
- Dependencias de desarrollo nuevas: `@commitlint/cli` y `@commitlint/config-conventional`.
- No cambia ningún paquete publicado, así que no hay changeset.
