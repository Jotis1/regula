# Design

## Context

En `apps/docs`, la guía de diseño vive en dos colecciones de Astro: `foundations` (MDX) y `components` (MD). La estructura de la web sale de `src/lib/catalog.ts`, que define las secciones, los grupos y el orden. Ya hay piezas para enseñar reglas con veredicto:
- `compose/Pair.astro` y `compose/Rule.astro`, que montan una `ExampleCard` inerte pintada en el servidor;
- `compose/Code.astro`, que monta un `CodeSnippet` como isla `client:visible`.

El índice de búsqueda se genera en `src/pages/search-index.json.ts`. El CI ya corre scripts de Bun propios, como `check:reference`, `check:colors` y `check:size`.

Estado de los nombres y los commits:
- Ningún script ni workflow filtra por nombre de paquete, salvo `release.yml`, que usa `--filter=./packages/*`, una ruta.
- El historial de `main` tiene commits fuera de formato: los «Versión de los paquetes» del bot y otros a mano.

## Goals / Non-Goals

**Goals:**
- Que añadir un área o una norma sea solo añadir datos: las páginas, el JSON y la búsqueda salen solos.
- Que el formato se valide en el build y en los tests, sin revisión humana.
- Que el MCP (cambio posterior) pueda servir las normas desde la misma colección sin migrarla.

**Non-Goals:**
- Traducir y podar los comentarios existentes, y pasar al inglés los identificadores que no lo están (como el atributo `data-tema` de `ThemeMenu`). Va en un cambio aparte antes de la beta. Las URLs sí se arreglan aquí (D10), porque son pocas.
- Hooks de Git locales: commitlint solo corre en el CI.
- Comprobar en el CI el idioma de los commits y de los comentarios. Se queda en revisión.

## Decisions

### D1. Un YAML por área en una colección de Astro

Las normas viven en `apps/docs/src/content/standards/<area>.yaml`: un fichero por área, con los datos del área y su lista `rules`. Se cargan con el `glob` loader y se validan con un esquema Zod en `content.config.ts`. Los campos van en inglés:

```yaml
# naming.yaml: el nombre del fichero es el slug de la URL (`/standards/naming/`)
prefix: NOM
title: Nombres
description: …
order: 1
rules:
  - id: NOM-001
    title: …
    level: must     # must | should | may
    appliesTo: all  # all | app | package
    statement: …
    rationale: …
    examples:
      good: [{ caption: …, lang: json, code: … }]
      bad:  [{ caption: …, lang: json, code: … }]
    verification:
      kind: ci      # biome | ci | test | review
      check: Nombres de paquete   # obligatorio salvo con review
      # review: qué mira quien revisa (obligatorio con review)
```

El esquema obliga a lo que se puede ver dentro de una sola norma: los campos, el formato del ID, al menos un ejemplo `good` y otro `bad`, y `check` o `review` según `kind`. Lo que cruza normas lo comprueba un test de Vitest en `apps/docs`, junto a los del catálogo: IDs únicos, prefijo igual al del área y áreas iguales a las del catálogo.

**Alternativas descartadas:**
- **MDX por norma:** cómodo para la prosa, pero los campos quedan en el frontmatter y los ejemplos en el cuerpo, más difíciles de validar y de servir por el MCP.
- **Módulo TypeScript:** valida con los tipos, pero es más ruidoso de escribir y de leer para quien no programa.

YAML se lee bien en un diff y lo escribe bien un agente.

### D2. Catálogo y páginas

- `catalog.ts` gana:
  - la sección `standards` (`Normas`, `/standards/`), al final de `SECTIONS`. Las normas no son de diseño, así que no van entre Fundamentos y Componentes;
  - `STANDARD_AREAS` (slug y etiqueta, en orden).
- Un test comprueba que `STANDARD_AREAS` y la colección tienen las mismas áreas, igual que se hace hoy con los grupos de componentes. `nav.ts` añade la sección con el índice y las áreas.
- Las páginas son `src/pages/standards/index.astro` y `src/pages/standards/[area].astro`. El área usa `layouts/StandardsPage.astro`, con las mismas piezas que `FoundationPage` (`PageHeader`, índice de la página, `Pager`); no se generalizó `FoundationPage` para no tocar los fundamentos. Cada norma se pinta con `components/StandardRule.astro`.
- **En la página de un área**, cada norma es una sección `h2` con `id` igual a su ID en minúsculas. Lleva:
  - un `Badge` con el nivel en texto: «Debe» en color de marca, «Debería» en aviso y «Puede» en gris;
  - otro `Badge` con a qué se aplica;
  - el enunciado y el porqué;
  - dos `ExampleCard` sin damero («Esto sí» y «Esto no»), una sobre otra: las líneas de código de los ejemplos no caben en dos columnas;
  - una línea «Cómo se verifica».
- **En el índice**, cada área es una lista de normas con ID, título y nivel.

### D3. Código de los ejemplos con la isla de `CodeSnippet`

Se probó pintar el `CodeSnippet` en el servidor dentro de un bloque `inert` (como las `Rule` de los fundamentos). No sirve: el código largo se recorta sin poder desplazarlo y el botón de copiar no funciona. Los ejemplos usan `CodeSnippetIsland` con `client:visible`, sin números de línea. Las páginas de normas quedan dentro del límite por defecto de `js-budget.json` (192 kB), medido con `check:js`.

### D4. `/standards.json`

Es un endpoint estático, `src/pages/standards.json.ts`, que lee la colección y devuelve:

```
{ version, areas: [{ id, prefix, title, description, url, rules: [{ …campos de la norma, url }] }] }
```

Las áreas van ordenadas por `order` y las normas, en el orden del fichero. `version` es la de `@jotis-me/react`, la misma que enseña el pie. `url` es la dirección absoluta del área y de la norma (con su ancla). No lleva fecha de generación, para que el build sea determinista. El MCP leerá la misma colección, no este JSON. El JSON es para quien no use MCP.

### D5. Búsqueda

- Las páginas de las áreas entran como páginas, porque salen de `nav`.
- Cada norma entra como un grupo nuevo `standards` («Normas») en `SearchEntry`:
  - etiqueta `NOM-001 · <título>`;
  - descripción con el área;
  - palabras clave con el enunciado;
  - `href` al ancla.
- Pagefind ya indexa el texto completo de las páginas.

### D6. Comprobación de nombres

`scripts/check-package-names.ts` (Bun) lee los `workspaces` de la raíz y sus `package.json`. El prefijo no se fija en el script: sale del `name` de la raíz, que tiene que ser `me.jotis.<producto>`. Así el mismo script sirve en otro repo de la suite. Las reglas:
- **Privado** (`private: true`): `name` es el prefijo o empieza por `prefijo.`, y cada segmento cumple `[a-z0-9]+(-[a-z0-9]+)*`.
- **Público:** `@jotis-me/[a-z0-9-]+`.

Al fallar, propone un nombre a partir de la ruta: `apps/x` → `prefijo.x`, `examples/x` → `prefijo.example.x` y `scripts/x` → `prefijo.x`. La lógica es una función pura con su test de `bun test`. Se ejecuta con `check:names` en la raíz, en el paso de CI «Nombres de paquete», que corre el test y el script.

### D7. commitlint en el CI

- Dependencias de desarrollo en la raíz: `@commitlint/cli` y `@commitlint/config-conventional`.
- Configuración en `.commitlintrc.json`, porque JSON evita los problemas de carga de módulos entre Bun en local y Node en CI. Extiende `config-conventional` con tres cambios:
  - `subject-case` desactivado: la descripción en minúscula se queda como norma de revisión, porque Conventional rechaza `ChatBox dice…`;
  - `body-max-line-length` desactivado;
  - `footer-max-line-length` desactivado.

  El cuerpo es prosa en español y GitHub lo ajusta solo. Se mantienen `type-enum` (los once tipos de la norma), `header-max-length` (100) y la línea en blanco antes del cuerpo.
- Job nuevo `commits` («Commits») en `ci.yml`, solo en `pull_request`: `checkout` con `fetch-depth: 0` y `bunx commitlint --from <base.sha> --to <head.sha> --verbose`.
- Los commits de fusión de GitHub (`Merge pull request …` y `Merge branch …`) ya los ignora commitlint por defecto.

### D8. PR de versión y renombrado

- En `release.yml`, `title` y `commit` de `changesets/action` pasan a `chore(release): versión de los paquetes`.
- El renombrado:
  - cambia los cinco `name`;
  - regenera `bun.lock` con `bun install`;
  - busca los nombres antiguos en el repo (README, docs y scripts) y los actualiza.

  Vercel construye por directorio, no por nombre de paquete, así que no le afecta. Turbo solo pierde la caché una vez.

### D9. Comprobaciones nombradas que existen

El test de la colección comprueba que cada `check` existe:
- `kind: ci`: un `name:` de paso o de job en `.github/workflows/ci.yml`;
- `kind: biome`: una regla nombrada en `biome.json`;
- `kind: test`: la ruta del fichero de test.

Así una norma no puede decir que se comprueba algo que no existe.

### D10. URLs de la web en inglés

- La ruta `pages/components/[slug]/composiciones.astro` pasa a `compositions.astro`. Se cambian también:
  - el enlace «Ver las N composiciones» de `ComponentPage`;
  - su entrada en `js-budget.json`;
  - los e2e;
  - los scripts de captura.

  La ruta antigua redirige con `redirects` de `astro.config` (`/components/[slug]/composiciones` → `/components/[slug]/compositions`), que en un sitio estático genera una página de redirección por ruta con composiciones. Astro no admite una barra final en el destino de una redirección dinámica, así que se llega a `/components/modal/compositions` y el hosting la normaliza. Las páginas de redirección no son páginas: el recorrido de `a11y.spec.ts` las salta.
- `?icono=` pasa a `?icon=` en `AssetGallery` y en el índice de búsqueda.
- `?tema=oscuro` pasa a `?theme=dark` en `/visual/[name]` y `/showcase/[name]`, en `capture-approved.ts`, en `capture-showcases.ts` y en los e2e.
- Los parámetros antiguos no se mantienen. Los de `/visual/` y `/showcase/` solo los usan los tests y las capturas. El de la galería solo lo genera la búsqueda, que cambia a la vez.
- El ancla `#composiciones` de la ficha es un título de la página y sigue el texto («Composiciones»). Las anclas de grupo de `/components/` (`#acciones`) también siguen su título.

### D11. La búsqueda de la cabecera, en icono hasta `xl`

Con seis secciones, el campo de búsqueda de 300 px ya no cabía a 1024 px: se cortaba por la derecha. `SiteSearch` pasa a ser el botón de icono de 44 px hasta `xl` (1280 px) y el campo completo desde `xl`. Es un cambio de las clases de `SiteSearch.tsx`, no del paquete.

### Normas iniciales

| ID | Título | Nivel | Se aplica a | Verificación |
|---|---|---|---|---|
| NOM-001 | Paquetes privados en dominio inverso | Debe | todos | CI «Nombres de paquete» |
| NOM-002 | Paquetes publicados con el scope `@jotis-me` | Debe | paquetes | CI «Nombres de paquete» |
| IDI-001 | Código, identificadores, ficheros y comentarios en inglés | Debe | todos | revisión |
| IDI-002 | Guía, commits, PR y changesets en español | Debe | todos | revisión |
| IDI-003 | Comentarios solo para el porqué | Debe | todos | revisión |
| IDI-004 | Rutas y parámetros de URL en inglés | Debe | apps | revisión |
| GIT-001 | Conventional Commits | Debe | todos | CI «Commits» |
| GIT-002 | El cuerpo explica el porqué y lista los cambios | Debería | todos | revisión |
| GIT-003 | Ramas `tipo/descripcion` | Debería | todos | revisión |
| GIT-004 | Todo entra por PR con las comprobaciones en verde | Debe | todos | revisión: el ruleset de la rama principal |
| PRO-001 | Cambios no triviales con OpenSpec antes del código | Debe | todos | revisión |
| PRO-002 | Spec y código sincronizados al fusionar | Debe | todos | revisión |

Las áreas y sus URLs son `naming` (NOM), `language` (IDI), `git` (GIT) y `process` (PRO).

## Risks / Trade-offs

- [El job «Commits» no es obligatorio hasta que el ruleset de `main` lo exija] → Tarea de cierre: el usuario lo añade al ruleset en GitHub.
- [Una PR con un commit mal formado se queda bloqueada] → Se arregla reescribiendo la rama (`git commit --amend` o un rebase no interactivo). La norma lo explica en su ejemplo.
- [La norma de la minúscula no la comprueba la máquina] → Queda en revisión. Es preferible a rechazar cabeceras que empiezan por un nombre de componente.
- [Las normas de idioma se publican sin que Regula las cumpla todavía] → La spec deja claro que se aplican al código nuevo y al que se toque, y la migración tiene su propio cambio antes de la beta.
- [El `CodeSnippet` pintado en el servidor puede no resaltar] → Se usa la isla y se mide con `check:js` (D3).

## Migration Plan

1. Se fusiona la PR. El CI de `main` ya pasa la comprobación de nombres.
2. El usuario añade «Commits» a las comprobaciones obligatorias del ruleset de `main`.
3. El siguiente PR de versión se abre con el título nuevo.

Para volver atrás basta con revertir la PR: no hay datos ni paquetes publicados de por medio.
