# Proposal

## Why

Desde que un test inestable hace fallar el CI (`TST-004`), el CI de `main` se ha puesto en rojo por algo que no es un test inestable: en el runner de Windows, abrir la conexión con el servidor de pruebas local falla de vez en cuando. Ha salido como `net::ERR_CONNECTION_REFUSED` (ya arreglado en parte al fijar `127.0.0.1`) y como `net::ERR_NO_BUFFER_SPACE`, siempre en un `page.goto` y siempre salvado por el reintento del test.

Medido el 2026-11-18 con un workflow de diagnóstico en el runner (18 pasadas del trozo 3 de 3 de los e2e):
- el error salió en 1 de 18, en la pasada más lenta (4,3 minutos frente a entre 2,2 y 3,5);
- no se agotan los puertos (pico de unos 3100 sockets de 16 384, sin rangos reservados) ni la memoria (más de 11 GB libres de 16).

La causa de fondo no se ha encontrado. El usuario decidió el 2026-11-18 que, en ese caso, la navegación se reintenta una vez y la norma lo recoge por escrito.

## What Changes

- **`TST-004` gana una excepción escrita:** la navegación de un e2e al servidor de pruebas local se reintenta una sola vez, dentro del mismo test, cuando el runner rechaza la conexión. El reintento queda anotado en el informe. Cualquier otro fallo, y un segundo fallo de conexión, cuentan como siempre: un test que pasa solo al reintentarlo sigue haciendo fallar el CI.
- **Regula lo aplica en un solo sitio:** el `test` que importan todos los e2e de la web (`e2e/fixtures.ts`, antes `e2e/hydration.ts`) reintenta `page.goto` con esos dos errores, y tres e2e nuevos lo prueban: se reintenta una vez, un segundo fallo falla y otro error de red no se reintenta.
- `failOnFlakyTests` no cambia.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`: el requisito «Área de tests: tests deterministas» admite el reintento de una navegación que el runner rechaza.
- `standards-compliance`: cómo aplica Regula ese reintento y cómo lo prueba.

## Impact

- **Norma:** `apps/docs/src/content/standards/testing.yaml` (`exceptions` de `TST-004`).
- **Tests:** `apps/docs/e2e/fixtures.ts` (el reintento; el módulo se renombra desde `hydration.ts`), los imports de todos los e2e de la web y `apps/docs/e2e/navigation-retry.spec.ts`.
- **Paquetes publicados:** no cambian.
- **Fuera de alcance:**
  - los recursos de una página que no cargan por el mismo motivo: no se ha visto, y se añadiría con datos;
  - otros errores de red: la lista se amplía solo con errores vistos en el runner;
  - mover los e2e a otro sistema: las capturas aprobadas son de Chromium en Windows.
