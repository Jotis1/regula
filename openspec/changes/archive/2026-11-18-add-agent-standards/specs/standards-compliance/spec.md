# Spec Delta

## MODIFIED Requirements

### Requirement: CI de Regula con detección y puerta
El CI de Regula SHALL decidir en un job de detección si hay que comprobar código: SHALL saltarse los jobs pesados solo si todo lo cambiado está en `openspec/**`, `.claude/commands/**` o `.claude/skills/**`. Un job puerta llamado «CI» SHALL depender de todos los demás y fallar si alguno falló o se canceló. El ruleset de `main` SHALL exigir solo «CI».

#### Scenario: PR solo de OpenSpec
- **WHEN** una PR solo cambia archivos de `openspec/`
- **THEN** los jobs de comprobaciones y de navegador salen saltados, «Commits» corre, y «CI» pasa en menos de 5 minutos

#### Scenario: PR que toca el CI
- **WHEN** una PR cambia `openspec/` y `.github/workflows/ci.yml`
- **THEN** corren todos los jobs

#### Scenario: Un job falla
- **WHEN** falla uno de los shards de navegador
- **THEN** «CI» falla y la PR no se puede fusionar

#### Scenario: PR que toca la configuración del agente
- **WHEN** una PR solo cambia `.claude/settings.json`
- **THEN** corren todos los jobs, porque la comprobación de las normas de desarrollo lee ese fichero

## ADDED Requirements

### Requirement: Instrucciones de agentes comprobadas
La comprobación de las normas de desarrollo SHALL fallar, nombrando el fichero y la norma, si:
- no hay `AGENTS.md` en la raíz, no enlaza a la guía o no enseña los comandos del repo;
- no hay `CLAUDE.md`, o contiene algo más que la importación de `AGENTS.md`.

#### Scenario: CLAUDE.md con instrucciones propias
- **WHEN** `CLAUDE.md` trae un párrafo además de `@AGENTS.md`
- **THEN** `check:dev` falla y nombra `CLAUDE.md` y `AGT-002`

#### Scenario: AGENTS.md sin enlace a la guía
- **WHEN** `AGENTS.md` no enlaza a la guía de Regula
- **THEN** `check:dev` falla y nombra `AGENTS.md` y `AGT-001`

### Requirement: Configuración de agentes comprobada
La comprobación de las normas de desarrollo SHALL fallar, nombrando el fichero y la norma, si:
- `.mcp.json` no existe o no declara el servidor `regula` con la URL del MCP de Regula;
- `.gitignore` no ignora la configuración personal del agente, o Git la sigue;
- la configuración compartida del agente no existe o no deniega leer los ficheros `.env`.

#### Scenario: Sin la regla de los .env
- **WHEN** una PR quita de `.claude/settings.json` la regla que deniega leer los `.env`
- **THEN** `check:dev` falla y nombra el fichero y `AGT-006`

#### Scenario: MCP con otra URL
- **WHEN** `.mcp.json` declara `regula` con una URL que no es la del MCP de Regula
- **THEN** `check:dev` falla y nombra `.mcp.json` y `AGT-003`

### Requirement: Regula cumple las normas de agentes
Regula SHALL cumplir las normas del área de agentes el día que se publican, sin excepciones declaradas: tiene `AGENTS.md`, `CLAUDE.md`, `.mcp.json` y la configuración compartida del agente, e ignora la personal.

#### Scenario: Repo actual
- **WHEN** corre `check:dev` en la rama principal
- **THEN** pasa, y `standards-exceptions.json` no nombra ninguna norma `AGT`
