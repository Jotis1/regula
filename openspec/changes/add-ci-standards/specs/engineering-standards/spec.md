## ADDED Requirements

### Requirement: Commits atómicos
El área de Git SHALL fijar, con nivel DEBE y para todos los proyectos, que cada commit contiene un solo cambio lógico de un solo tipo (`feat`, `fix`, `test`, `docs`, `ci`…), se puede revertir sin arrastrar otros cambios y deja el repo compilando. Un cambio grande se parte en varios commits que la PR agrupa. El test va en el mismo commit que el código que prueba.

#### Scenario: Commit que mezcla cambios
- **WHEN** se mira el ejemplo que no cumple la norma de los commits atómicos
- **THEN** enseña un commit `feat: varias cosas` que mezcla una función nueva, un arreglo y un cambio del CI, y el que la cumple, los mismos cambios en tres commits de tipos distintos

#### Scenario: Revertir un cambio
- **WHEN** se lee el porqué de la norma de los commits atómicos
- **THEN** explica que `git revert` de un commit deshace un solo cambio sin tocar los demás de la PR

### Requirement: Área de CI: checks obligatorios
El área de CI SHALL tener el prefijo `INT` y fijar, con nivel DEBE y para todos los proyectos:
- que un workflow con checks obligatorios no se filtra por rutas ni por ramas: los jobs se saltan por dentro, con `if:`;
- que solo se saltan jobs cuando todo lo cambiado está en una lista explícita de rutas que ninguna comprobación lee;
- que el único check obligatorio es un job puerta con `if: always()`, que falla si algún job del que depende falló o se canceló.

#### Scenario: Filtro de rutas en el workflow
- **WHEN** se mira el ejemplo que no cumple la norma de los filtros
- **THEN** enseña un workflow con `on.pull_request.paths-ignore`, y la norma explica que entonces el check obligatorio queda en «Pending» y bloquea la PR

#### Scenario: Cambio fuera de la lista
- **WHEN** se lee la norma de la lista de rutas
- **THEN** dice que basta un archivo fuera de la lista para que corran todos los jobs, y que la config del CI y de Turbo nunca está en ella

#### Scenario: Dependencia fallida
- **WHEN** se lee el porqué de la norma del job puerta
- **THEN** explica que un job saltado porque falló el job del que depende cuenta como verde, y que la puerta lo impide mirando el resultado de cada job

### Requirement: Área de CI: caché y despliegues
El área de CI SHALL fijar:
- con nivel DEBE, que los `outputs` de una tarea de Turbo incluyen todo lo que lee un paso posterior o el despliegue, y su `env`, las variables que cambian la salida;
- con nivel DEBERÍA, que el CI usa la caché remota de Turbo;
- con nivel DEBERÍA y para las apps, que el despliegue se salta si la app no cambia, con `turbo query affected` y no con `turbo-ignore`.

#### Scenario: Salida que no se guarda
- **WHEN** se mira el ejemplo que no cumple la norma de los `outputs`
- **THEN** enseña una tarea `build` sin la carpeta que publica el adaptador de Vercel, y el porqué cuenta que un acierto de caché publica entonces un despliegue vacío

#### Scenario: Despliegue condicionado
- **WHEN** se mira el ejemplo que cumple la norma de los despliegues
- **THEN** enseña un `vercel.json` con `ignoreCommand` que llama a `turbo query affected --packages` con el nombre de la app y `--exit-code`

### Requirement: Área de CI: tiempos
El área de CI SHALL fijar, con nivel DEBERÍA y para todos los proyectos:
- que los e2e que pasan de 10 minutos se reparten en shards, y que las comprobaciones que no dependen unas de otras van en jobs paralelos;
- que una ejecución nueva en la misma rama cancela la anterior.

#### Scenario: Suite larga
- **WHEN** se mira el ejemplo que cumple la norma de los shards
- **THEN** enseña un job con una matriz de shards que pasa `--shard=${{ matrix.shard }}/${{ strategy.job-total }}` a Playwright, o un equivalente

#### Scenario: Pushes seguidos
- **WHEN** se mira el ejemplo que cumple la norma de las ejecuciones por rama
- **THEN** enseña un bloque `concurrency` con el grupo por rama y `cancel-in-progress: true`
