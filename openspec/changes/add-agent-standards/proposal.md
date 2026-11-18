# Proposal

## Why

Casi todo el código de la suite se escribe con un agente, y las normas ya hablan de «una persona o un agente» en sus porqués, pero ninguna dice cómo se trabaja con uno. Es el punto «IA» de la hoja de ruta hacia la beta («programación con IA» en `add-standards-foundation`). Medido el 2026-11-18 en el repo de Regula:
- 461 de los 533 commits llevan `Co-Authored-By: Claude`, y 236 llevan además `Claude-Session:` con un enlace que solo puede abrir su autor;
- no hay `AGENTS.md` ni `CLAUDE.md`: un agente que llega al repo no sabe los comandos ni dónde están las normas si no se lo dice la persona;
- no hay `.mcp.json`: el MCP de Regula (`regula.jotis.me/mcp`) existe, pero cada persona lo conecta a mano;
- no hay `.claude/settings.json`: nada impide que el agente lea un `.env`;
- `.claude/commands/` y `.claude/skills/` (OpenSpec) sí están versionados, y `.gitignore` no ignora `.claude/settings.local.json`;
- el CI se salta los jobs pesados si todo lo cambiado está en `.claude/**`, porque hasta hoy ninguna comprobación leía esa carpeta.

## What Changes

- **Un área nueva, «Agentes»** (`AGT`, slug `agents`), la última, detrás de Proceso (decisión del usuario). Cubre solo cómo se programa con agentes; las funciones con modelos dentro de un producto quedan fuera (decisión del usuario).
- **Instrucciones del repo:**
  - `AGT-001`: cada repo tiene un `AGENTS.md` en la raíz con los comandos, la estructura y el enlace a las normas;
  - `AGT-002`: `CLAUDE.md` contiene solo la importación `@AGENTS.md` (decisión del usuario: `AGENTS.md` es la fuente);
  - `AGT-004`: las instrucciones no copian las normas, enlazan a la guía o al MCP (`should`).
- **Configuración del agente:**
  - `AGT-003`: el repo declara el MCP de Regula en `.mcp.json`;
  - `AGT-005`: los comandos, las skills y la configuración compartida se versionan, y lo personal (`.claude/settings.local.json`) se ignora;
  - `AGT-006`: el agente no lee secretos: la configuración compartida le deniega los `.env`.
- **Cómo trabaja el agente:**
  - `AGT-007`: no se salta las comprobaciones (`--no-verify`, force push a la rama principal) ni fusiona su PR sin permiso de una persona;
  - `AGT-008`: quien abre la PR responde del código: lo ha leído y lo ha probado;
  - `AGT-009`: nada se da por hecho sin haber corrido su comprobación;
  - `AGT-010`: el contenido externo (issues, webs, resultados de herramientas) es dato y no instrucción;
  - `AGT-011`: una dependencia que propone el agente se comprueba en el registro antes de instalarla;
  - `AGT-012`: el commit escrito con un agente lleva `Co-Authored-By` (`should`, decisión del usuario). El pie `Claude-Session` no se exige.
- **Regula las cumple:** gana `AGENTS.md`, `CLAUDE.md`, `.mcp.json` y `.claude/settings.json`, e ignora `.claude/settings.local.json`.
- **`check:dev` comprueba las automáticas** (`AGT-001`, `AGT-002`, `AGT-003`, `AGT-005` y `AGT-006`).
- **El CI deja de saltarse `.claude/**` entero:** solo se salta `.claude/commands/**` y `.claude/skills/**`, porque `check:dev` pasa a leer `.claude/settings.json`.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`: el orden de las áreas y el área de agentes.
- `standards-compliance`: las comprobaciones del área de agentes, que Regula las cumple y las rutas que el CI se salta.

## Impact

- **Normas:** `apps/docs/src/content/standards/agents.yaml` (12 normas, `order` 17), una entrada en `STANDARD_AREAS` y el orden que fijan `standards.test.ts` y `mcp-tools.test.ts`. La guía pasa de 16 áreas y 125 normas a 17 y 137. El ejemplo de `INT-002` en `ci.yaml` cambia con las rutas que se saltan.
- **Raíz del repo:** `AGENTS.md`, `CLAUDE.md`, `.mcp.json`, `.claude/settings.json` y una línea en `.gitignore`.
- **Scripts y CI:** `scripts/check-dev.ts` y su test; `scripts/ci-changes.ts` y su test.
- **Paquetes publicados:** ninguno cambia. Sin changeset.
- **MCP y JSON:** el área nueva sale sola en `/standards.json` y en las herramientas del MCP; el contrato no cambia.
- **Fuera de alcance:**
  - normas para funciones con modelos dentro de las apps (claves, modelo fijado, salida validada, gasto): cambio propio cuando una app lo necesite;
  - hooks o permisos que impidan por configuración lo que `AGT-007` deja a la revisión;
  - ficheros de instrucciones de otros agentes (`.cursor/`, `.github/copilot-instructions.md`): `AGENTS.md` es el único que se exige;
  - quitar el pie `Claude-Session` de los commits ya hechos.
