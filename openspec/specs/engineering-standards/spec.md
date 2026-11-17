# engineering-standards Specification

## Purpose
Las normas de desarrollo de la suite jotis.me: qué campos tiene cada norma, cómo se verifica, dónde vive su fuente y cómo se publica, para que personas y agentes trabajen con las mismas reglas.

## Requirements

### Requirement: Campos de una norma
Cada norma SHALL tener:
- un ID estable con el prefijo de su área y tres cifras (`NOM-001`);
- un título;
- un nivel: DEBE, DEBERÍA o PUEDE, con el sentido de RFC 2119;
- a qué proyectos se aplica: todos, solo apps o solo paquetes publicados;
- el enunciado y el porqué;
- al menos un ejemplo que la cumple y otro que no.

Un ID SHALL NOT reutilizarse para otra norma, ni siquiera si la norma desaparece.

#### Scenario: Norma completa
- **WHEN** se abre la norma `NOM-001`
- **THEN** muestra su nivel DEBE, que se aplica a todos los proyectos, el enunciado, el porqué, un ejemplo que la cumple y otro que no

### Requirement: Verificación de una norma
Cada norma SHALL decir cómo se verifica: Biome, CI, test o revisión manual.
- Las verificables por máquina SHALL nombrar la comprobación concreta: la regla de Biome, el paso de CI o el test.
- Las de revisión SHALL decir qué tiene que mirar quien revisa.

#### Scenario: Norma automática
- **WHEN** se abre la norma `NOM-001`
- **THEN** dice que la verifica el CI con la comprobación de nombres de paquete

#### Scenario: Norma de revisión
- **WHEN** se abre una norma que no se puede comprobar por máquina, como la del idioma de los comentarios
- **THEN** dice que se verifica en revisión y qué tiene que mirar quien revisa

### Requirement: Fuente única y validada
Las normas SHALL escribirse en una sola fuente estructurada. De ella SHALL salir las páginas de la web y el JSON público. El build y los tests SHALL fallar si:
- una norma no tiene algún campo obligatorio;
- dos normas comparten ID;
- un ID no lleva el prefijo de su área;
- una norma automática no nombra su comprobación.

#### Scenario: ID repetido
- **WHEN** dos normas de la fuente tienen el ID `GIT-002`
- **THEN** los tests fallan y nombran el ID repetido

#### Scenario: Sin ejemplo que no la cumple
- **WHEN** a una norma le falta el ejemplo que no la cumple
- **THEN** el build falla y nombra la norma

### Requirement: Normas en JSON
La web SHALL publicar todas las normas en `https://regula.jotis.me/standards.json`, con sus áreas y todos sus campos. Los nombres de campo SHALL ir en inglés y los textos en español. El JSON SHALL llevar la versión de Regula que lo publica.

#### Scenario: Leer una norma
- **WHEN** un programa descarga `/standards.json` y busca `GIT-001`
- **THEN** encuentra su título, su nivel, a qué se aplica, el enunciado, el porqué, los ejemplos y cómo se verifica, todo en una misma entrada

### Requirement: Área de nombres
El área de nombres SHALL fijar dos normas de nivel DEBE:
- **Paquetes privados:** su `name` es el dominio del producto escrito al revés. Si el paquete no se despliega con dominio propio, es el nombre de su padre más un segmento. Los segmentos van separados por puntos y en minúsculas, con guiones dentro de cada uno.
- **Paquetes publicados en npm:** usan el scope de la organización (`@jotis-me/<nombre>`).

#### Scenario: App de la docs
- **WHEN** se mira el ejemplo que cumple la norma de los paquetes privados
- **THEN** la app de `regula.jotis.me` se llama `me.jotis.regula.docs` y su ejemplo Astro `me.jotis.regula.example.astro`

#### Scenario: Paquete publicado
- **WHEN** se mira el ejemplo que no cumple la norma de los paquetes publicados
- **THEN** enseña un paquete publicado con nombre en dominio inverso, y la norma explica que sin scope cualquiera podría registrar ese nombre en npm

### Requirement: Idioma del código y de los textos
El área de idioma SHALL fijar, con nivel DEBE:
- que el código, los identificadores, los nombres de fichero y los comentarios van en inglés;
- que la guía, los mensajes de commit, los títulos de PR y los changesets van en español.

Las normas de idioma SHALL aplicarse al código nuevo y al que se toque desde su publicación. El código anterior se adapta en un cambio aparte antes de la beta.

#### Scenario: Identificador en español
- **WHEN** se mira el ejemplo que no cumple la norma del código en inglés
- **THEN** enseña una función con nombre en español, y el que la cumple, la misma función con nombre en inglés

### Requirement: URLs en inglés
El área de idioma SHALL fijar, con nivel DEBE, que los segmentos de ruta de las URLs y los nombres y valores de sus parámetros van en inglés, aunque el texto de la página esté en español. Las anclas que salen de los títulos de la página siguen el texto del título.

#### Scenario: Parámetro en español
- **WHEN** se mira el ejemplo que no cumple la norma de las URLs
- **THEN** enseña `/visual/button/?tema=oscuro`, y el que la cumple, `/visual/button/?theme=dark`

### Requirement: Comentarios solo para el porqué
El área de idioma SHALL fijar, con nivel DEBE, que un comentario solo se escribe cuando el código no se explica por sí mismo: dice el porqué y no repite lo que hace el código.

#### Scenario: Comentario que sobra
- **WHEN** se mira el ejemplo que no cumple la norma de los comentarios
- **THEN** enseña un comentario que repite lo que hace la línea de debajo, y el que la cumple enseña un comentario en inglés que explica una decisión que el código no deja ver

### Requirement: Formato de los commits
El área de Git SHALL fijar, con nivel DEBE, que todo commit sigue Conventional Commits 1.0:
- una cabecera `tipo(ámbito): descripción` de 100 caracteres como máximo, sin punto final y en minúscula salvo un identificador del código al principio;
- un cuerpo y un pie opcionales tras una línea en blanco;
- solo los tipos de Conventional Commits;
- `!` o `BREAKING CHANGE:` en los cambios que rompen.

#### Scenario: Tipos admitidos
- **WHEN** se lee la norma de Conventional Commits
- **THEN** lista los tipos `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `style` y `revert`

#### Scenario: Identificador al principio
- **WHEN** se mira el ejemplo que cumple la norma con una cabecera que empieza por un componente
- **THEN** enseña `feat(react): ChatBox dice qué hace el clic`

#### Scenario: Commit fuera de formato
- **WHEN** se mira el ejemplo que no cumple la norma de Conventional Commits
- **THEN** enseña una cabecera sin tipo, como `Arreglos en la propuesta`

### Requirement: Cuerpo de los commits
El área de Git SHALL fijar, con nivel DEBERÍA, que el cuerpo del commit explica el porqué y lista los cambios cuando hay más de uno.

#### Scenario: Commit con varios cambios
- **WHEN** se mira el ejemplo que cumple la norma del cuerpo
- **THEN** enseña una cabecera `fix(docs): …`, una línea en blanco, una frase con el porqué y una lista con un cambio por línea

### Requirement: Ramas y PR
El área de Git SHALL fijar:
- con nivel DEBE, que todo entra en la rama principal por PR con las comprobaciones en verde;
- con nivel DEBERÍA, que las ramas se llaman `tipo/descripcion-en-kebab`.

#### Scenario: Nombre de rama
- **WHEN** se mira el ejemplo que cumple la norma de las ramas
- **THEN** enseña `feat/chat-select-affordance`

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
- **THEN** enseña un `vercel.json` con `ignoreCommand` que llama a `turbo query affected --packages` con el nombre de la app y `--exit-code`, terminado en `|| exit 1`

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

### Requirement: Área de proceso
El área de proceso SHALL fijar, con nivel DEBE:
- que todo cambio no trivial se propone con OpenSpec (propuesta, specs, diseño y tareas) antes de tocar el código;
- que la PR que lo implementa deja la spec sincronizada con el código.

SHALL decir qué cuenta como trivial: erratas, cambios de formato, subidas de dependencias sin cambios de API y arreglos de una línea sin cambio de comportamiento.

#### Scenario: Componente nuevo sin propuesta
- **WHEN** se mira el ejemplo que no cumple la norma de OpenSpec
- **THEN** enseña una PR que añade una prop a un componente sin un cambio de OpenSpec que la describa
