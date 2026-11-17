## ADDED Requirements

### Requirement: CI de Regula con detección y puerta
El CI de Regula SHALL decidir en un job de detección si hay que comprobar código: SHALL saltarse los jobs pesados solo si todo lo cambiado está en `openspec/**` o `.claude/**`. Un job puerta llamado «CI» SHALL depender de todos los demás y fallar si alguno falló o se canceló. El ruleset de `main` SHALL exigir solo «CI».

#### Scenario: PR solo de OpenSpec
- **WHEN** una PR solo cambia archivos de `openspec/`
- **THEN** los jobs de comprobaciones y de navegador salen saltados, «Commits» corre, y «CI» pasa en menos de 5 minutos

#### Scenario: PR que toca el CI
- **WHEN** una PR cambia `openspec/` y `.github/workflows/ci.yml`
- **THEN** corren todos los jobs

#### Scenario: Un job falla
- **WHEN** falla uno de los shards de navegador
- **THEN** «CI» falla y la PR no se puede fusionar

### Requirement: Normas de CI comprobadas
El paso «Normas de CI» SHALL fallar, nombrando archivo y norma, si:
- el workflow del CI filtra `pull_request` por rutas o ramas;
- falta el job «CI» con `if: always()` y todos los demás jobs en sus `needs`;
- falta `concurrency` con `cancel-in-progress`;
- un `vercel.json` no tiene `ignoreCommand` con `turbo query affected`;
- un job que ejecuta Turbo no recibe `TURBO_TOKEN` ni `TURBO_TEAM`.

#### Scenario: Job nuevo fuera de la puerta
- **WHEN** una PR añade un job al CI y no lo añade a los `needs` de «CI»
- **THEN** el paso «Normas de CI» falla y nombra el job

#### Scenario: Repo actual
- **WHEN** corre el CI en la rama principal
- **THEN** el paso «Normas de CI» pasa

### Requirement: Navegador repartido
Los e2e de la web SHALL correr en varios shards de Windows en paralelo. Cada shard que falle SHALL subir sus resultados. Lighthouse, los e2e de tokens y assets, los ejemplos y el artefacto SHALL ir en un job aparte, también en Windows. Ninguno de esos jobs SHALL pasar de 15 minutos en una PR con código.

#### Scenario: PR con código
- **WHEN** una PR cambia un componente
- **THEN** todos los e2e corren repartidos en los shards, y desde el primer job hasta «CI» pasan menos de 15 minutos

### Requirement: Caché remota de Turbo en el CI
Los jobs del CI que ejecutan Turbo SHALL usar la caché remota del equipo de Vercel con `TURBO_TOKEN` y `TURBO_TEAM`. Sin el secreto, como en las PR desde forks, SHALL construir sin caché remota y no fallar por eso.

#### Scenario: Segundo job de la misma ejecución
- **WHEN** el job de comprobaciones ya construyó los paquetes y un shard de navegador ejecuta `turbo run build`
- **THEN** el shard restaura el build de la caché remota en lugar de construirlo

### Requirement: Web desplegada solo si cambia
El proyecto de Vercel de la web SHALL saltarse el build cuando `me.jotis.regula.docs` no está afectado por el cambio, según `turbo query affected` desde el commit anterior desplegado. Si la historia no basta para compararlo, SHALL construir.

#### Scenario: Fusión solo de OpenSpec
- **WHEN** se fusiona en `main` una PR que solo cambia `openspec/`
- **THEN** Vercel no construye y `regula.jotis.me` sigue sirviendo el despliegue anterior

#### Scenario: Fusión que cambia Turbo
- **WHEN** se fusiona en `main` una PR que cambia `turbo.json`
- **THEN** Vercel construye y despliega la web
