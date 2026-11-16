# Tasks

Comandos: `bunx biome ci .`, `bunx turbo run typecheck test build`, `bun run check:names`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. Fuente de normas

- [x] 1.1 Colección `standards` en `content.config.ts` con el esquema Zod de D1: campos, formato del ID, al menos un ejemplo `good` y otro `bad`, y `check` o `review` según `kind`
- [x] 1.2 `naming.yaml`, `language.yaml`, `git.yaml` y `process.yaml` con las doce normas de la tabla del diseño, con sus ejemplos y su verificación. Los ejemplos tienen que cubrir los escenarios de la spec `engineering-standards`: `me.jotis.regula.docs`, un nombre publicado en dominio inverso, la función con nombre en español, `?tema=oscuro` frente a `?theme=dark`, el comentario que sobra, el commit con varios cambios, `feat(react): ChatBox dice qué hace el clic`, `Arreglos en la propuesta`, `feat/chat-select-affordance` y la PR sin cambio de OpenSpec
- [x] 1.3 `STANDARD_AREAS` en `catalog.ts` y sección `standards` al final de `SECTIONS` (D2)
- [ ] 1.4 Tests de Vitest de la colección: IDs únicos, prefijo igual al del área, áreas iguales a las de `STANDARD_AREAS`, y cada `check` existe en `ci.yml`, en `biome.json` o como fichero de test (D9). Comprobar que fallan con un ID repetido, con un `check` inexistente y con un ejemplo `bad` que falta

## 2. Web

- [ ] 2.1 Sección Normas en `nav.ts` (índice y áreas) y en la cabecera
- [ ] 2.2 Páginas `/standards/` y `/standards/[area]/`: esqueleto común, un `h2` por norma con su ancla, `Badge` de nivel y de ámbito, `Pair`/`Rule` con el código y «Cómo se verifica» (D2 y D3)
- [ ] 2.3 Endpoint `/standards.json` con `version` y las áreas en orden (D4), y su test
- [ ] 2.4 Normas en la búsqueda: grupo `standards` en `SearchEntry` y en `SiteSearch` (D5)
- [ ] 2.5 e2e: escenarios «Índice», «Enlace a una norma», «Buscar una norma» (Ctrl+K con `NOM-001` y con «dominio inverso») y axe en los dos temas para `/standards/` y `/standards/git/`
- [ ] 2.6 `check:js` de las páginas de normas dentro de su límite. Si el `CodeSnippet` pintado en el servidor no resalta, pasar a la isla y volver a medir (D3)

## 3. Regula cumple

- [ ] 3.1 `scripts/check-package-names.ts` con la función pura, su test de `bun test` y el script `check:names` en la raíz (D6)
- [ ] 3.2 Renombrar los cinco paquetes privados, `bun install` para regenerar `bun.lock` y actualizar los nombres antiguos que aparezcan en el repo (D8). `check:names` en verde
- [ ] 3.3 Paso «Nombres de paquete» en el job de comprobaciones de `ci.yml`
- [ ] 3.4 commitlint: dependencias, `.commitlintrc.json` (D7) y job «Commits» en `ci.yml` solo en `pull_request`. Comprobar en local que rechaza `Arreglos en la propuesta` y acepta `fix(docs): el historial pinta las tablas` con cuerpo y `Co-Authored-By:`
- [ ] 3.5 `release.yml`: `title` y `commit` del PR de versión a `chore(release): versión de los paquetes`
- [ ] 3.6 URLs en inglés (D10): `composiciones.astro` → `compositions.astro` con redirección desde la ruta antigua, enlace de `ComponentPage`, `js-budget.json`, `?icono=` → `?icon=` en `AssetGallery` y en la búsqueda, `?tema=oscuro` → `?theme=dark` en `/visual/`, `/showcase/`, los scripts de captura y los e2e. e2e de los escenarios «Composiciones de Modal», «Icono desde la búsqueda» y «Ejemplo en oscuro»

## 4. Cierre

- [ ] 4.1 Comprobaciones completas en local y `openspec validate add-standards-foundation --strict` sin errores
- [ ] 4.2 PR con todos sus commits en Conventional Commits y el CI en verde, incluido el job «Commits»
- [ ] 4.3 El usuario añade «Commits» a las comprobaciones obligatorias del ruleset de `main`. Verificar con el visto bueno del usuario
