# Design

## Context

Medido en la #41, una PR que solo toca `openspec/`:

| Job | Tiempo | Qué se lleva el tiempo |
|---|---|---|
| Comprobaciones (Ubuntu) | 4 min 42 s | `turbo run build typecheck test`: 251 s |
| Navegador (Windows) | 30 min 18 s | e2e de la web: 1251 s; Lighthouse: 210 s; build: 129 s; artefacto: 103 s; `bun install`: 59 s |
| Commits | 21 s | |

El ruleset de `main` (id 26397472) exige «Comprobaciones» y «Navegador». `release.yml` corre cuando el workflow `CI` termina bien tras un push a `main`.

Probado con `turbo query affected` (Turbo 2.11.10):

- La #41 (solo `openspec/`) solo afecta al paquete raíz (`//`), así que con `--packages --exit-code` sale 1. Con `--tasks build test typecheck` salen 0 tareas y código 0.
- La #40 (`turbo.json`) afecta a todos los paquetes (`DefaultGlobalFileChanged`), con 21 tareas.
- Un cambio solo en `ci.yml`, `biome.json` o `scripts/*.ts` de la raíz no afecta a ninguna tarea de Turbo, aunque «Comprobaciones» sí los usa. Turbo no sabe lo que ejecuta el CI fuera de él.

El proyecto de Vercel tiene `apps/docs` como raíz, con el preset Astro y sin `vercel.json`.

## Goals / Non-Goals

**Goals:**
- Normas de CI para toda la suite, en la fuente de normas, con su verificación.
- Que Regula las cumpla: una PR sin código, en ~2 min; una con código, en menos de 15.
- Que ningún atajo deje pasar código sin comprobar ni publique un despliegue vacío.

**Non-Goals:**
- Cambiar lo que comprueba cada job. Los mismos pasos, repartidos de otra forma.
- Saltar tareas sueltas de Turbo dentro de «Comprobaciones» con `--affected`. La caché remota ya evita repetir trabajo, y el salto fino tiene el mismo agujero con los archivos de la raíz.
- Normas de seguridad del CI (fijar acciones por SHA, permisos mínimos). Van en el área de seguridad.

## Decisions

### D1. Detección por lista de rutas seguras, no por `turbo query affected`

Un script, `scripts/ci-changes.ts`, compara la PR con su base o el push con su commit anterior, con `fetch-depth: 0`. Escribe `code=false` solo si todos los archivos cambiados casan con la lista `SKIP_PATHS = ["openspec/**", ".claude/**"]`. Con cualquier otro archivo, con una lista vacía de cambios o si falla el `git diff`, escribe `code=true`.

**Por qué no `turbo query affected` para los jobs:** con un cambio en `ci.yml`, `biome.json` o `scripts/` diría que no hay nada afectado, y se saltaría justo el CI que hay que probar. La lista funciona al revés: lo seguro es correrlo todo, y solo se salta lo que está declarado como inofensivo. Ampliar la lista es una decisión explícita en una PR, con su test.

**Alternativa descartada:** `dorny/paths-filter`. Es una acción de terceros en un job con acceso al repo, y para una sola condición basta un script de 30 líneas con test.

### D2. Jobs y puerta

```
changes ──┬─► checks (Ubuntu)          if: code
          ├─► browser-e2e ×3 (Windows) if: code
          ├─► browser-other (Windows)  if: code
          └─► commits                  solo en PR
CI (puerta): needs: todos · if: always()
```

La puerta pasa `toJSON(needs)` a `scripts/ci-gate.ts`, que tiene sus propios tests, junto con la lista de jobs de código. La decisión es código probado y no una expresión de YAML. Falla si alguno es `failure` o `cancelled`. Acepta `skipped` solo en los jobs que dependen de `code`, y solo cuando `changes` terminó en `success` con `code=false`. Si `changes` falla, la puerta falla: es el caso que lo de GitHub da por verde.

Los nombres visibles se mantienen («Comprobaciones», «Navegador (e2e 1/3)»…) para que los historiales se lean igual. La puerta se llama «CI».

**Ruleset:** se cambia con `gh api` al final, con la PR ya en verde (tarea 5.2). Primero se añade «CI» a los checks exigidos y después se quitan «Comprobaciones» y «Navegador», para que `main` nunca quede sin protección.

### D3. Navegador repartido

- `browser-e2e`: matriz `shard: [1, 2, 3]`. Cada shard ejecuta `bunx playwright test --shard=${{ matrix.shard }}/3` en `apps/docs`, con build e instalación de Chromium, Firefox y WebKit. Si falla, sube `test-results/` como `resultados-e2e-<shard>`.
- `browser-other`: los e2e de tokens y assets, los ejemplos de Next y Astro, el artefacto y Lighthouse, con su resumen. Solo instala Chromium.
- Todo en Windows, por las capturas aprobadas.
- Se reparte por archivo de test (Playwright con `fullyParallel: false`). Si un shard se desequilibra mucho, se ajusta el número de shards o se activa `fullyParallel` en el proyecto `chromium`. Se mide en la tarea 3.3.

Estimación: ~21 min de e2e entre 3, más ~2 min de preparación con caché, unos 9–10 min por shard. `browser-other`, unos 7 min.

### D4. Caché remota

`TURBO_TOKEN` (secreto) y `TURBO_TEAM` (variable, `jotis-projects-hobby`) en el `env` de los jobs que ejecutan Turbo. El token es de Vercel y lo crea el usuario con alcance al equipo. Sin el secreto, Turbo construye en local y no falla. Las builds de Vercel ya usan la misma caché remota sin configurar nada.

Turbo firma los artefactos solo si se activa `remoteCache.signature`. No se activa aquí: el token solo está en este repo y en Vercel.

### D5. Despliegue condicionado

`apps/docs/vercel.json`:

```json
{ "ignoreCommand": "npx -y turbo@2.11.10 query affected --packages me.jotis.regula.docs --base \"$VERCEL_GIT_PREVIOUS_SHA\" --exit-code || exit 1" }
```

- Turbo sale con 0 si la web no está afectada, con 1 si lo está y con 2 si no puede comparar. Vercel solo entiende 0 (no construir) y 1 (construir): con cualquier otro código marca el despliegue como fallido. Pasó en la primera preview de la #42. Por eso `|| exit 1` convierte el 2 en «construye», y `check:ci` lo exige.
- El paso corre antes de `install`, así que fija la versión de `turbo` en el propio comando. `check:ci` comprueba que coincide con la del `package.json` raíz.
- Sin `VERCEL_GIT_PREVIOUS_SHA` (primer despliegue de una rama), Turbo falla con `ambiguous argument ''` y, con el `|| exit 1`, Vercel construye. Con un clon demasiado corto, Turbo da todo por afectado y también construye. Es el lado seguro.
- La prueba de la #41 da `//` como afectado, pero no `me.jotis.regula.docs`: con `--packages me.jotis.regula.docs` sale 0.

**Alternativa descartada:** «Skip unaffected projects» de Vercel. Trata como global todo cambio fuera de los workspaces y construiría con `openspec/`.

### D6. `check:ci`

`scripts/check-ci.ts`, con test, lee `.github/workflows/*.yml`, `turbo.json` y los `vercel.json`, y falla nombrando archivo y norma (requisito «Normas de CI comprobadas»). Corre en «Comprobaciones» como paso «Normas de CI». Ese es el `check` de `INT-001`, `INT-003`, `INT-005`, `INT-006` y `INT-008`. `INT-002`, `INT-004` y `INT-007` se verifican en revisión: qué rutas son seguras, qué lee el despliegue y cuánto tarda una suite no se deduce del YAML.

### D7. Normas

| ID | Nivel | Aplica a | Verificación |
|---|---|---|---|
| INT-001 Sin filtros de ruta en workflows con checks obligatorios | DEBE | todos | CI: Normas de CI |
| INT-002 Saltar solo lo que está en la lista de rutas seguras | DEBE | todos | revisión |
| INT-003 Un job puerta es el único check obligatorio | DEBE | todos | CI: Normas de CI |
| INT-004 Turbo declara todo lo que lee el despliegue | DEBE | todos | revisión |
| INT-005 Despliegue solo si la app cambia | DEBERÍA | apps | CI: Normas de CI |
| INT-006 Caché remota de Turbo en el CI | DEBERÍA | todos | CI: Normas de CI |
| INT-007 e2e largos en shards y jobs paralelos | DEBERÍA | todos | revisión |
| INT-008 Una ejecución por rama | DEBERÍA | todos | CI: Normas de CI |

Área `ci.yaml`, `order: 4`, entre Git y Proceso, que pasa a `order: 5`.

En `git.yaml`, **GIT-005 Commits atómicos** (DEBE, todos, revisión): que cada commit tenga un solo tipo de cambio, se pueda revertir solo y deje el repo compilando. No se automatiza: si un commit mezcla dos cambios, no se ve en el formato del mensaje. Este cambio se aplica ya así: un commit por tarea o pieza coherente, con el código y su test juntos.

## Risks / Trade-offs

- **La lista de rutas seguras crece sin control** → cada ruta nueva necesita PR y test, e `INT-002` pide en revisión que nada la lea.
- **La puerta mal escrita deja pasar fallos** → el test de `check:ci` cubre los casos de D2: dependencia fallida, cancelada y `changes` fallido.
- **Cambio de ruleset con PR abiertas** → las PR abiertas necesitan un push nuevo para tener el check «CI». Se avisa en la PR.
- **`release.yml` tras un push sin código:** el CI sale verde sin construir. Publicar solo depende de que haya changesets, y los paquetes no han cambiado desde el último CI completo, así que no publica nada sin comprobar.
- **El token de Vercel en GitHub** da acceso al equipo → token propio, solo con alcance al equipo, y documentado en el README de CI.
- **Shards desequilibrados** → medirlo en la tarea 3.3 y ajustar.

## Medidas (tarea 3.3)

PR #42, con caché remota:

| Job | Por archivo | Por test (`--fully-parallel`) |
|---|---|---|
| e2e shard 1 / 2 / 3 (solo el paso de Playwright) | 885 / 303 / 219 s | 475 / 273 / 149 s |
| Navegador (web 1/3), job entero | 18 min 35 s | 9 min 33 s |
| Navegador (ejemplos, artefacto y Lighthouse) | 8 min 51 s | 7 min 20 s |
| Comprobaciones | 4 min 36 s | 3 min 17 s |

- Con la caché remota, el build de los shards baja de ~2 min a 5–7 s.
- El job más lento queda en 9 min 33 s, frente a 30 min antes, y cumple el límite de 15 de la spec.
- Los shards siguen desequilibrados (475 frente a 149 s). Playwright reparte los tests en tramos seguidos, y los más lentos, sobre todo los de paridad visual, caen juntos en el primero. Se acepta así.

## Open Questions

- Repartir mejor los e2e (más shards, o la paridad visual en un shard propio). Queda para un cambio futuro: el tiempo ya cumple la spec.
