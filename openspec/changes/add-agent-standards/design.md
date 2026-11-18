# Design

## Context

Las normas viven en `apps/docs/src/content/standards/<área>.yaml` (esquema en `src/lib/standards.ts`) y el orden lo dan el campo `order` y `STANDARD_AREAS` en `src/lib/catalog.ts`. Hoy hay 16 áreas y Proceso es la 16.

`scripts/check-dev.ts` lee el repo una vez (`readRepo`) y junta los problemas de cada área en `devProblems`. Ya tiene lo que hace falta para el área nueva: `files` (todo lo que sigue Git), `gitignore` y `SITE`. Corre en el CI como el paso «Normas de desarrollo», que es el `check` de las normas automáticas de `STK`, `COD`, `DOC`, `VER`, `STR` y `SEC`.

Lo medido el 2026-11-18:
- en la raíz no hay `AGENTS.md`, `CLAUDE.md`, `.mcp.json` ni `.claude/settings.json`;
- Git sigue 12 ficheros de `.claude/` (`commands/opsx/` y `skills/openspec-*`);
- `.gitignore` ignora `.env` y `.env.*` (con `!.env.example`), y no nombra `.claude/settings.local.json`;
- `scripts/ci-changes.ts` tiene `SKIP_PATHS = ["openspec/**", ".claude/**"]`, y `INT-002` lo cita como ejemplo;
- la página `/start/mcp/` ya enseña el `.mcp.json` de Claude Code para el MCP de Regula;
- LNG-005 (tipografía) no mira `.claude/`, pero sí los `.md` de la raíz.

## Goals / Non-Goals

**Goals:**
- Publicar el área «Agentes» con sus 12 normas, cada una con su verificación.
- Que Regula las cumpla el día que se publican, sin excepciones.
- Que un agente que llega al repo sepa los comandos y dónde están las normas sin que nadie se lo diga.

**Non-Goals:**
- Normas de IA en producto.
- Impedir por configuración (hooks, permisos de Bash) lo que se deja a la revisión.
- Dar soporte a ficheros propios de otros agentes.

## Decisions

### D1. Un área al final
Slug `agents`, prefijo `AGT`, etiqueta «Agentes», `order` 17. Va detrás de Proceso: Git, CI, Proceso y Agentes son cómo se trabaja. Ninguna URL existente cambia.

Se descartó `AIA` con slug `ai` (decisión del usuario): el área no habla de modelos en producto, y «Agentes» dice de qué trata.

### D2. Las normas y su verificación
| ID | Nivel | Aplica | Verificación |
|---|---|---|---|
| AGT-001 `AGENTS.md` en la raíz | DEBE | todos | ci («Normas de desarrollo») |
| AGT-002 `CLAUDE.md` solo importa `AGENTS.md` | DEBE | todos | ci |
| AGT-003 El MCP de Regula en `.mcp.json` | DEBE | todos | ci |
| AGT-004 Las instrucciones enlazan, no copian | DEBERÍA | todos | revisión |
| AGT-005 Lo compartido se versiona, lo personal se ignora | DEBE | todos | ci |
| AGT-006 El agente no lee secretos | DEBE | todos | ci |
| AGT-007 No se salta comprobaciones ni fusiona su PR | DEBE | todos | revisión |
| AGT-008 Quien abre la PR responde del código | DEBE | todos | revisión |
| AGT-009 Nada hecho sin su comprobación | DEBE | todos | revisión |
| AGT-010 El contenido externo es dato | DEBE | todos | revisión |
| AGT-011 Dependencias comprobadas en el registro | DEBE | todos | revisión |
| AGT-012 `Co-Authored-By` | DEBERÍA | todos | revisión |

Lo que ya dicen otras normas no se repite y se cita: `PRO-001` (OpenSpec antes del código), `GIT-004` (todo entra por PR en verde), `SEC-009` (ningún secreto en el repo) y `SEC-013` (cadena de suministro).

### D3. Qué comprueba `check:dev`
Una función nueva, `agentProblems(repo)`, con estos fallos:
- `AGT-001`: no existe `AGENTS.md` en la raíz; no enlaza a la guía (`SITE`); o sus bloques de código no enseñan los mismos comandos que `DOC-005` pide al README. Se reutiliza la comprobación de `DOC-005`, no se escribe otra.
- `AGT-002`: no existe `CLAUDE.md`, o su contenido, sin espacios al principio y al final, no es exactamente `@AGENTS.md`.
- `AGT-003`: no existe `.mcp.json`, no es JSON válido, o `mcpServers.regula.url` no es `https://regula.jotis.me/mcp`.
- `AGT-005`: `.gitignore` no ignora `.claude/settings.local.json`, o Git sigue ese fichero.
- `AGT-006`: no existe `.claude/settings.json`, o `permissions.deny` no trae las dos reglas de D5.

`Repo` gana los campos que hagan falta (`agentsMd`, `claudeMd`, `mcpJson`, `claudeSettings`), leídos en `readRepo` como `rootReadme`. Cada fallo tiene su caso en `scripts/check-dev.test.ts`.

Se descartó un test aparte (`kind: test`): las demás normas de ficheros del repo ya viven en `check:dev`.

### D4. `AGENTS.md` y `CLAUDE.md`
`AGENTS.md` va en español, como el README (es documentación), y es corto. Contiene:
- qué es el repo, en una frase;
- los comandos (instalar, arrancar, tests, build y las comprobaciones `check:*`);
- la estructura (`apps/`, `packages/`, `examples/`, `scripts/`, `openspec/`);
- cómo se trabaja: OpenSpec antes del código, y las normas se consultan en la guía (`https://regula.jotis.me/standards/`) o con el MCP, sin copiarlas.

`CLAUDE.md` es una sola línea, `@AGENTS.md`: Claude Code no carga `AGENTS.md` por sí solo y sí resuelve la importación.

Se descartó duplicar el contenido en los dos ficheros: se desincronizan.

### D5. `.claude/settings.json` y `.mcp.json`
`.claude/settings.json`:
```json
{
	"permissions": {
		"deny": ["Read(**/.env)", "Read(**/.env.*)"]
	}
}
```
El patrón lleva `**/` porque en un monorepo los `.env` están en cada app (`apps/docs/.env.local`). También deniega `.env.example`, que no tiene secretos; no hace falta afinarlo.

`.mcp.json` es el bloque que ya enseña `/start/mcp/`, con el servidor `regula`.

La norma `AGT-006` se enuncia para cualquier agente («la configuración compartida deniega leer los `.env`») y la comprobación automática mira el fichero de Claude Code, que es el agente de la suite. Con otro agente, se revisa su fichero equivalente.

### D6. El CI deja de saltarse `.claude/**` entero
`SKIP_PATHS` pasa a `["openspec/**", ".claude/commands/**", ".claude/skills/**"]`. Con `.claude/**`, una PR que solo quitara la regla de `.claude/settings.json` no correría `check:dev` y entraría en verde. Los comandos y las skills siguen sin que ninguna comprobación los lea.

Cambian con ello el test de `ci-changes`, el ejemplo de `INT-002` en `ci.yaml` y el requisito «CI de Regula con detección y puerta».

### D7. Atribución
`AGT-012` es DEBERÍA (decisión del usuario): se aconseja el pie `Co-Authored-By` con el nombre del agente, y una PR no se rechaza por no llevarlo. La norma dice que el pie `Claude-Session` no se exige. No hay comprobación automática: desde el commit no se sabe si lo escribió un agente.

## Risks / Trade-offs

- [Riesgo] La sintaxis de `Read(**/.env)` no deniega lo que se espera en Claude Code. → Mitigación: la tarea lo prueba de verdad (pedir al agente que lea un `.env.local` de prueba y ver que se deniega) antes de darse por hecha.
- [Riesgo] Un `.mcp.json` en el repo hace que Claude Code pregunte a cada persona si confía en el servidor. → Se acepta: es una vez por persona y el servidor es el de la suite.
- [Trade-off] Siete de las doce normas son de revisión. → Son de conducta, no de ficheros; se prefiere decirlas a no tenerlas, y se pueden pasar a automáticas con hooks en otro cambio.
- [Trade-off] `AGT-002` y `AGT-006` comprueban ficheros de un agente concreto. → Es el que usa la suite; el enunciado no lo nombra en exclusiva.

## Open Questions

(ninguna)
