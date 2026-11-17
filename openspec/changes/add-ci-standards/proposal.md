# Proposal

## Why

Hoy una PR que solo toca `openspec/` tarda unos 50 minutos en poder fusionarse: «Comprobaciones» tarda 5 y «Navegador» 30, y todo eso para comprobar código que no ha cambiado. A la vez, la #38 demostró que una caché mal declarada publica un despliegue vacío: Turbo no guardaba `apps/docs/.vercel/output` y `regula.jotis.me` dio 404 en todo. Las dos cosas valen para cualquier proyecto de la suite, así que se resuelven como normas de Regula, publicadas en la guía y en el MCP, y Regula las cumple.

## What Changes

- Área nueva de normas **CI**, con prefijo `INT` de «integración continua» (los prefijos son tres letras en español, como `NOM` o `IDI`), para todos los proyectos:
  - **Checks obligatorios sin filtros de ruta en el workflow:** un workflow que no arranca deja sus checks en «Pending» y bloquea la PR. El salto se decide dentro, con `if:` en cada job.
  - **Saltar solo lo que nada lee:** un job de detección compara lo cambiado con una lista explícita de rutas que ninguna comprobación lee (`openspec/**`, `.claude/**`). Basta un archivo fuera de la lista para que corra todo. Esto incluye el propio CI, la config de Turbo y los scripts de la raíz.
  - **Un job puerta como único check obligatorio:** con `if: always()`, falla si algún job del que depende falló o se canceló. Si no, un job saltado porque falló su dependencia contaría como verde.
  - **Caché de Turbo declarada entera:** los `outputs` incluyen todo lo que lee un paso posterior o el despliegue, y `env` incluye las variables que cambian la salida.
  - **Despliegues solo si la app cambia:** Ignored Build Step con `turbo query affected --packages <app> --exit-code`. `turbo-ignore` está obsoleto.
  - **Caché remota de Turbo en el CI**, compartida con Vercel.
  - **e2e largos repartidos en shards**, y las comprobaciones independientes en jobs paralelos.
  - **Una ejecución por rama:** la nueva cancela la anterior.
- Norma nueva en el área Git, **GIT-005** (DEBE, todos los proyectos): commits atómicos. Cada commit lleva un solo cambio lógico de un tipo y se puede revertir solo. La PR los agrupa. Se verifica en revisión.
- Regula las cumple:
  - `ci.yml` gana el job de detección, el job puerta «CI» y «Navegador» repartido en shards más un job aparte para Lighthouse, ejemplos y artefacto;
  - el ruleset de `main` pasa a exigir solo «CI»;
  - `apps/docs/vercel.json` lleva el `ignoreCommand`;
  - el CI usa la caché remota de Turbo;
  - una comprobación nueva (`check:ci`) verifica en el CI lo que de estas normas se puede comprobar por máquina.
- **BREAKING** para el repo, no para los paquetes: los checks obligatorios de `main` dejan de ser «Comprobaciones» y «Navegador». Las PR abiertas al cambiar el ruleset necesitan un push nuevo.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`: tres requisitos nuevos para el área de CI y uno para los commits atómicos del área Git.
- `standards-compliance`: requisitos nuevos para que el CI de Regula cumpla el área: detección y job puerta, shards, caché remota y despliegue condicionado de la web.

## Impact

- `apps/docs/src/content/standards/ci.yaml` (área nueva) y su entrada en `STANDARD_AREAS`. La página, `/standards.json` y el MCP salen solos de la fuente.
- `.github/workflows/ci.yml`, `release.yml` (solo si depende del nombre del workflow o de sus jobs), `turbo.json` y `apps/docs/vercel.json` (nuevo).
- Un script nuevo `scripts/check-ci.ts` con su test, y `scripts/ci-changes.ts` para la detección.
- Configuración fuera del repo, que hace el usuario o se hace con su permiso:
  - un token de Vercel como secreto `TURBO_TOKEN` y la variable `TURBO_TEAM`;
  - el cambio del ruleset de `main`.
- Tiempos esperados: una PR sin código pasa de ~50 min a ~2. Una PR con código baja de ~30 min a ~10–12, sobre todo por los shards y la caché.

Prueba del CI (tarea 5.1): esta línea solo existe en una PR de prueba que se cerrará sin fusionar.
