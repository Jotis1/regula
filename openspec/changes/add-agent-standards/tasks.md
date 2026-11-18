# Tasks

## 1. El CI deja de saltarse `.claude/**` entero

- [x] 1.1 Pasar `SKIP_PATHS` de `scripts/ci-changes.ts` a `["openspec/**", ".claude/commands/**", ".claude/skills/**"]` (design D6). Verificación: en `scripts/ci-changes.test.ts`, el caso de OpenSpec y una skill sigue saltándose y un caso nuevo con `.claude/settings.json` pide comprobar código; `bun test scripts/ci-changes.test.ts` en verde.
- [x] 1.2 Actualizar el ejemplo de `INT-002` en `apps/docs/src/content/standards/ci.yaml` con la lista nueva. Verificación: `grep -rn '".claude/\*\*"'` no encuentra nada fuera de `openspec/changes/archive/`, y `bun run check:ci` pasa.

## 2. Comprobaciones del área en `check:dev`

- [x] 2.1 Añadir a `Repo` y a `readRepo` lo que falta (`AGENTS.md`, `CLAUDE.md`, `.mcp.json` y `.claude/settings.json` de la raíz, `null` si no existen) y escribir `agentProblems(repo)` con los fallos de `AGT-001` y `AGT-002` (design D3), reutilizando la comprobación de comandos de `DOC-005`. Verificación: casos nuevos en `scripts/check-dev.test.ts` (sin `AGENTS.md`, sin enlace a la guía, sin comandos, sin `CLAUDE.md`, `CLAUDE.md` con texto de más y uno válido), en verde.
- [x] 2.2 Añadir a `agentProblems` los fallos de `AGT-003`, `AGT-005` y `AGT-006`. Verificación: casos nuevos (sin `.mcp.json`, JSON roto, otra URL, `.gitignore` sin la línea, `settings.local.json` seguido por Git, sin `settings.json`, sin cada una de las dos reglas de `deny` y uno válido), en verde.
- [x] 2.3 Llamar a `agentProblems` desde `devProblems`. Verificación: `bun run scripts/check-dev.ts` falla y lista los cinco ID, porque Regula todavía no tiene los ficheros (se arregla en el grupo 3).

## 3. Regula cumple las normas

- [x] 3.1 Escribir `AGENTS.md` en la raíz, en español, con el contenido del design D4 y sin copiar normas, y `CLAUDE.md` con la sola línea `@AGENTS.md`. Verificación: cada comando, comando de OpenSpec y herramienta del MCP que nombra `AGENTS.md` existe (scripts de `package.json` y de `apps/docs`, `.claude/commands/opsx/`, `list_standards` y `get_standard`). Que `/memory` enseñe `AGENTS.md` cargado a través de `CLAUDE.md` solo se ve en una sesión nueva: queda para que la mire el usuario.
- [x] 3.2 Crear `.mcp.json` con el servidor `regula` (el bloque de `/start/mcp/`). Verificación: `check:dev` lo valida (JSON y URL). `claude mcp list` no sirve para ver el fichero del proyecto en la máquina del usuario: `regula` ya está en su configuración local, que tiene prioridad.
- [x] 3.3 Crear `.claude/settings.json` con las dos reglas de `deny` (design D5) y añadir `.claude/settings.local.json` a `.gitignore`. Verificación: leer `examples/astro/.env` y `examples/astro/.env.agt-test` (ninguno existe) da «denied by your permission settings», y leer otro fichero que tampoco existe da «File does not exist»: la regla con `**/` deniega. `git check-ignore -v .claude/settings.local.json` lo nombra.
- [x] 3.4 Verificación del grupo: `bun run check:dev` pasa y Biome no avisa de los ficheros nuevos.

## 4. El área de normas

- [x] 4.1 Crear `apps/docs/src/content/standards/agents.yaml` (`AGT-001` a `AGT-012`, `order` 17) con enunciado, porqué, ejemplos y verificación según la tabla del design D2; las automáticas con `kind: ci` y `check: Normas de desarrollo`, y `AGT-012` diciendo que `Claude-Session` no se exige. Los `code:` de varias claves, en bloques `|-`. Verificación: `bun run test` de la web valida el esquema y encuentra el paso del CI.
- [x] 4.2 Añadir `{ slug: "agents", label: "Agentes" }` al final de `STANDARD_AREAS` y `agents` al orden que fijan `standards.test.ts` y `mcp-tools.test.ts`. Verificación: esos tests pasan, y tras `bun run build` `/standards.json` lista 17 áreas y 137 normas con `agents` la última.
- [x] 4.3 Revisar la página `/standards/agents/` construida y la navegación lateral, y añadir el caso del área a `apps/docs/e2e/standards.spec.ts` si el spec enumera las áreas. Verificación: la página se abre en la vista previa con sus 12 normas, y el e2e de normas pasa.

## 5. Comprobación final

- [x] 5.1 Pasar en local, guardando el código de salida de cada uno: `bunx turbo run build typecheck test`, Biome con `--error-on-warnings`, `check:dev`, `check:ci`, `check:audit` y `check:weight`. Verificación: todos terminan en 0.
- [x] 5.2 Pasar los e2e de la web con `CI=1`. Verificación: ningún test falla ni sale inestable.
- [x] 5.3 `openspec validate add-agent-standards --strict`. Verificación: sin errores.

## Workflow follow-up

- Abrir la PR de `feat/add-agent-standards`, esperar al CI y fusionar con permiso del usuario.
- Comprobar en producción `https://regula.jotis.me/standards/agents/`, `/standards.json` y `get_standard` de `AGT-001` por el MCP.
- Archivar el cambio en una PR aparte (`chore/archive-add-agent-standards`) con la sincronización de specs.
