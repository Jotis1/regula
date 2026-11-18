# engineering-standards Specification

## Purpose
Las normas de desarrollo de la suite jotis.me: qué campos tiene cada norma, cómo se verifica, dónde vive su fuente y cómo se publica, para que personas y agentes trabajen con las mismas reglas.

## Requirements

### Requirement: Campos de una norma
Cada norma SHALL tener:
- un ID con el prefijo en inglés de su área y tres cifras (`NAM-001`);
- un título;
- un nivel: DEBE, DEBERÍA o PUEDE, con el sentido de RFC 2119;
- a qué proyectos se aplica: todos, solo apps o solo paquetes publicados;
- el enunciado y el porqué;
- al menos un ejemplo que la cumple y otro que no;
- opcionalmente, las excepciones que pide un framework, cada una con dónde aplica y por qué.

#### Scenario: Norma completa
- **WHEN** se abre la norma `NAM-001`
- **THEN** muestra su nivel DEBE, que se aplica a todos los proyectos, el enunciado, el porqué, un ejemplo que la cumple y otro que no

#### Scenario: Norma con excepciones
- **WHEN** se abre la norma de los exports con nombre
- **THEN** lista como excepción los archivos especiales de Next (`page.tsx`, `layout.tsx`…) y los ficheros de configuración, y dice que el framework los importa por su export por defecto

### Requirement: IDs estables
Un ID de norma SHALL NOT reutilizarse para otra norma, ni siquiera si la norma desaparece. A partir de la 1.0, los IDs SHALL NOT cambiar.

#### Scenario: Norma retirada
- **WHEN** se retira una norma tras la 1.0
- **THEN** su ID no vuelve a usarse, y la norma nueva que la sustituye lleva el siguiente número libre del área

### Requirement: Verificación de una norma
Cada norma SHALL decir cómo se verifica: Biome, CI, test o revisión manual.
- Las verificables por máquina SHALL nombrar la comprobación concreta: la regla de Biome, el paso de CI o el test.
- Las de revisión SHALL decir qué tiene que mirar quien revisa.

#### Scenario: Norma automática
- **WHEN** se abre la norma `NAM-001`
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

Los commits, títulos y ramas que genera un bot (Dependabot) SHALL quedar fuera de la parte de idioma, porque el bot no deja elegirlo. Sí SHALL cumplir Conventional Commits.

#### Scenario: Identificador en español
- **WHEN** se mira el ejemplo que no cumple la norma del código en inglés
- **THEN** enseña una función con nombre en español, y el que la cumple, la misma función con nombre en inglés

#### Scenario: Commit de Dependabot
- **WHEN** Dependabot abre una PR con el commit `build(deps): bump astro from 7.0.1 to 7.1.0`
- **THEN** la PR cumple las normas aunque el commit esté en inglés

### Requirement: Alcance de las normas de idioma
Las normas de idioma SHALL aplicarse al código nuevo y al que se toque desde su publicación. El código anterior se adapta en un cambio aparte antes de la beta.

#### Scenario: Archivo que se mueve
- **WHEN** una PR mueve un componente con nombre en español a otra carpeta
- **THEN** el componente pasa a un nombre en inglés en la misma PR

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

### Requirement: Área de idioma: tipografía
El área de idioma SHALL fijar, con nivel DEBE y para todos los proyectos, una norma `LNG-005`: ningún texto del repo (la guía, los comentarios, el JSDoc, los textos de la interfaz, los tests, los changesets) ni ningún mensaje de commit usa el punto medio («·») ni las rayas («—» y «–»). En su lugar SHALL ir el guión simple («-»): con espacios como separador (`Donación - 5,00 €`) y sin espacios en los rangos (`0-100`, `10:00-11:00`).

#### Scenario: Separador de un evento
- **WHEN** se mira el ejemplo que no cumple la norma de tipografía
- **THEN** enseña un texto de evento con «·» como separador y un comentario con «—», y el que la cumple, los mismos textos con «-»

### Requirement: Excepciones de la tipografía
`LNG-005` SHALL permitir citar el carácter suelto entre comillas latinas o en código (`«·»`), para poder nombrarlo. Quedan fuera los commits de los bots, el historial (`CHANGELOG.md`, los cambios archivados de OpenSpec), lo congelado (`reference/`) y lo que genera una herramienta de fuera (`.claude/`).

#### Scenario: Nombrar el carácter
- **WHEN** el enunciado de la norma escribe «·» para decir qué carácter no se usa
- **THEN** la norma se cumple

### Requirement: Prefijos en inglés
El prefijo de cada área SHALL ser de tres letras y en inglés: `NAM` (nombres), `LNG` (idioma), `STK` (stack), `STR` (estructura), `COD` (código), `DOC` (documentación), `VER` (versiones), `GIT`, `INT` (CI) y `PRO` (proceso). Las normas `NOM-001`, `NOM-002` e `IDI-001` a `IDI-004` SHALL pasar a `NAM-001`, `NAM-002` y `LNG-001` a `LNG-004`, sin alias.

#### Scenario: ID antiguo
- **WHEN** se llama a `get_standard` con `NOM-001`
- **THEN** devuelve el error de norma que no existe

### Requirement: Normas compatibles con los frameworks
Ninguna norma SHALL obligar a algo que contradiga una convención de Next.js o de Astro. Cuando la convención pide otra cosa, la norma SHALL listarlo en sus excepciones, y la comprobación automática SHALL aplicar esas mismas excepciones. Una norma automática nueva SHALL publicarse solo si los dos ejemplos de Regula, uno de Next y otro de Astro, la cumplen sin supresiones.

#### Scenario: Página de Next
- **WHEN** un proyecto Next tiene `app/page.tsx` con `export default function Page()`
- **THEN** cumple la norma de los exports con nombre y Biome no avisa

### Requirement: Orden de las áreas
Las áreas de normas SHALL leerse en este orden en la navegación, en la página índice y en `/standards.json`: Nombres, Idioma, Stack, Estructura, Código, Tests, Documentación, Versiones, Seguridad, Git, CI y Proceso. Cambiar el orden SHALL NOT cambiar la URL de un área.

#### Scenario: Áreas en el JSON
- **WHEN** un programa descarga `/standards.json`
- **THEN** las áreas llegan con los ids `naming`, `language`, `stack`, `structure`, `code`, `testing`, `documentation`, `versioning`, `security`, `git`, `ci` y `process`, en ese orden

### Requirement: Área de nombres: archivos
El área de nombres SHALL fijar, con nivel DEBE y para todos los proyectos, que los archivos de componentes (`.tsx` y `.astro`) se llaman en PascalCase o en kebab-case, y el resto, en kebab-case. Las rutas de los frameworks (`page.tsx`, `[slug].astro`, `[...slug].astro`) SHALL cumplirla tal como las pide cada framework.

#### Scenario: Utilidad en camelCase
- **WHEN** se mira el ejemplo que no cumple la norma de los archivos
- **THEN** enseña `formatDate.ts`, y el que la cumple, `format-date.ts` junto a `DatePicker.tsx`

### Requirement: Área de stack: frameworks y gestor
El área de stack SHALL tener el prefijo `STK` y fijar, con nivel DEBE:
- para las apps, que se construyen con Next.js o con Astro;
- para todos los proyectos, que Bun es el gestor de paquetes y el runtime de los scripts, con la versión exacta en `packageManager`, y que el único lockfile es `bun.lock`. El CI SHALL instalar la versión que dice `packageManager`.

#### Scenario: Dos lockfiles
- **WHEN** se mira el ejemplo que no cumple la norma de Bun
- **THEN** enseña un repo con `bun.lock` y `package-lock.json`, y el porqué explica que cada gestor resolvería versiones distintas

### Requirement: Área de stack: Biome
El área de stack SHALL fijar, con nivel DEBE y para todos los proyectos:
- que Biome hace el lint y el formato, sin ESLint ni Prettier;
- que el CI ejecuta `biome ci --error-on-warnings .`;
- que `biome.json` añade a lo que genera el framework el bloque de la guía, con sus excepciones por framework;
- que en `biome.json` las reglas se ponen en `error` o en `off`, nunca en `warn`.

#### Scenario: Regla en warn
- **WHEN** se mira el ejemplo que no cumple la norma de los niveles
- **THEN** enseña `"noExplicitAny": "warn"`, y el porqué explica que un aviso no hace fallar el CI y acaba ignorándose

#### Scenario: Bloque de Biome
- **WHEN** se mira el ejemplo que cumple la norma de `biome.json`
- **THEN** enseña el bloque completo, con los `overrides` de Next y de Astro, listo para copiar sobre lo que genera `biome init`

### Requirement: Área de stack: formato
La norma del bloque de Biome SHALL nombrar el formato de la suite: sangría con tabuladores de ancho 4, líneas de hasta 110, comillas dobles y punto y coma.

#### Scenario: Sangría
- **WHEN** se lee el enunciado de la norma del bloque de Biome
- **THEN** dice que la sangría es con tabuladores de ancho 4, y el bloque de ejemplo lleva `"indentStyle": "tab"` e `"indentWidth": 4`

### Requirement: Área de stack: Turbo y Node
El área de stack SHALL fijar:
- con nivel DEBE y para todos los proyectos, que build, typecheck y test se ejecutan con Turbo, y que los scripts de la raíz los llaman con `turbo run`;
- con nivel DEBERÍA y para las apps desplegadas, que declaran en `engines.node` la versión mayor de Node con la que se despliegan.

#### Scenario: Script de la raíz
- **WHEN** se mira el ejemplo que cumple la norma de Turbo
- **THEN** enseña un `package.json` raíz con `"build": "turbo run build"`

### Requirement: Área de stack: Dependabot
El área de stack SHALL fijar, con nivel DEBE y para todos los proyectos, que Dependabot revisa cada semana las dependencias de Bun y las acciones de GitHub. Las versiones menores y los parches SHALL ir agrupados en una PR por ecosistema, y los commits SHALL llevar el prefijo `build` con el ámbito `deps`.

#### Scenario: Configuración
- **WHEN** se mira el ejemplo que cumple la norma de Dependabot
- **THEN** enseña un `.github/dependabot.yml` con los ecosistemas `bun` y `github-actions`, `interval: weekly`, un grupo para `minor` y `patch` y `commit-message.prefix: build`

### Requirement: Área de código: tsconfig y typecheck
El área de código SHALL tener el prefijo `COD` y fijar, con nivel DEBE y para todos los proyectos:
- que cada tsconfig, sobre el del framework, tiene `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` y `verbatimModuleSyntax`;
- que cada workspace con TypeScript tiene una tarea `typecheck` y el CI la ejecuta.

#### Scenario: Índice sin comprobar
- **WHEN** se mira el ejemplo que no cumple la norma del tsconfig
- **THEN** enseña `const first = items[0]; first.name` y el porqué explica que sin `noUncheckedIndexedAccess` el tipo no avisa de que `first` puede ser `undefined`

### Requirement: Área de código: escapes del tipado
El área de código SHALL fijar, con nivel DEBE y para todos los proyectos:
- que no se escribe `any`; lo que no se conoce es `unknown` y se estrecha;
- que no se usa la aserción no nula `!`;
- que no se usan `@ts-ignore` ni `@ts-nocheck`, y que todo `@ts-expect-error` o `biome-ignore` dice por qué.

#### Scenario: Aserción no nula
- **WHEN** se mira el ejemplo que no cumple la norma de `!`
- **THEN** enseña `items[0]!.name`, y el que la cumple, una comprobación que decide qué hacer si no hay elemento

#### Scenario: Supresión sin motivo
- **WHEN** se mira el ejemplo que no cumple la norma de las supresiones
- **THEN** enseña un `// @ts-ignore`, y el que la cumple, un `// @ts-expect-error: <motivo>` en un test de tipos

### Requirement: Área de código: paquetes ESM
El área de código SHALL fijar, con nivel DEBE y para los paquetes publicados, que son solo ESM, con `exports` y sus tipos correctos para quien los importa, y que compilan con `module` y `moduleResolution` en `NodeNext`, así que los imports relativos llevan la extensión `.js`.

#### Scenario: Import sin extensión
- **WHEN** se mira el ejemplo que no cumple la norma de `NodeNext`
- **THEN** enseña `import { cx } from "./cx"` en un paquete publicado, y el porqué explica que Node no lo resuelve aunque el bundler sí

### Requirement: Área de código: imports y exports
El área de código SHALL fijar, con nivel DEBE y para todos los proyectos:
- exports con nombre, y `export default` solo en las excepciones del framework;
- `import type` para lo que solo es un tipo;
- sin `export *`, para que lo público se vea en el archivo;
- sin `import * as`, salvo cuando el código recorre todos los exports del módulo, con una supresión que lo diga.

#### Scenario: Isla de React
- **WHEN** se mira el ejemplo que cumple la norma de los exports con nombre
- **THEN** enseña `export function SiteSearch()` importado como `import { SiteSearch } from "…"` desde una página Astro

#### Scenario: Catálogo de iconos
- **WHEN** se mira la excepción de `import * as`
- **THEN** enseña `import * as lineIcons from "@untitledui/icons"` en una galería que recorre todos los iconos, con su `biome-ignore` y el motivo

### Requirement: Área de código: estilo
El área de código SHALL fijar, con nivel DEBE y para todos los proyectos:
- que los conjuntos de valores son uniones de literales y no `enum`;
- que el código de `src/` no usa `console.log` ni `console.debug`. `console.error` y `console.warn` se permiten, y los scripts, tests y configuraciones quedan fuera.

#### Scenario: Enum
- **WHEN** se mira el ejemplo que cumple la norma de los conjuntos de valores
- **THEN** enseña `type ButtonSize = "sm" | "md" | "lg"` en lugar de un `enum`

### Requirement: Área de código: simplicidad
El área de código SHALL fijar, con nivel DEBE, para todos los proyectos y con verificación en revisión, `COD-014`, lo simple primero (KISS): la solución más directa que resuelve el caso de hoy, sin capas, opciones ni abstracciones para casos que aún no existen.

#### Scenario: Opciones de más
- **WHEN** se mira el ejemplo que no cumple la norma de lo simple
- **THEN** enseña una función de formato con una fábrica y opciones que nadie usa, y el que la cumple, la función que hace lo único que se pide

### Requirement: Área de código: lo nativo primero
El área de código SHALL fijar, con nivel DEBE, para todos los proyectos y con verificación en revisión, `COD-015`: un elemento HTML o una API de la plataforma antes que una dependencia o código propio que haga lo mismo. SHALL contar como nativos los componentes que da el framework (`next/link`, `next/image`, `<Image>` de Astro), para no chocar con sus convenciones.

#### Scenario: Plegable
- **WHEN** se mira el ejemplo que cumple la norma de lo nativo
- **THEN** enseña un `<details>` con su `<summary>`, y el que no la cumple, un `div` con estado de React, `onClick` y `aria-expanded` a mano

### Requirement: Área de documentación: JSDoc
El área de documentación SHALL tener el prefijo `DOC` y fijar, con nivel DEBE y para los paquetes publicados:
- que todo export público (componente, función, constante o clase) lleva un JSDoc que dice para qué sirve, salvo el código generado con un generador documentado;
- que cada prop lleva JSDoc, con `@default` si tiene valor por defecto;
- que todo `@deprecated` dice qué usar en su lugar.

No SHALL repetir la norma de los comentarios del área de idioma: la enlazan.

#### Scenario: Prop con valor por defecto
- **WHEN** se mira el ejemplo que cumple la norma de las props
- **THEN** enseña una prop `size` con su JSDoc y `@default "md"`

#### Scenario: Deprecado sin sustituto
- **WHEN** se mira el ejemplo que no cumple la norma de `@deprecated`
- **THEN** enseña `@deprecated` solo, y el que la cumple, `@deprecated Use \`hierarchy\` instead.`

### Requirement: Área de documentación: README
El área de documentación SHALL fijar, con nivel DEBE:
- para los paquetes publicados, un README con cómo instalarlo, un uso mínimo y el enlace a la guía;
- para todos los proyectos, un README en la raíz con los comandos para instalar, arrancar, construir y probar.

#### Scenario: README de paquete
- **WHEN** se mira el ejemplo que cumple la norma del README de paquete
- **THEN** enseña un README con `bun add @jotis-me/react`, un import de un componente y el enlace a `https://regula.jotis.me`

### Requirement: Área de versiones: SemVer y deprecación
El área de versiones SHALL tener el prefijo `VER` y fijar, con nivel DEBE y para los paquetes publicados:
- SemVer, con la lista de lo que rompe: quitar o renombrar un export, una prop, un token o una variable CSS; cambiar un valor por defecto; estrechar un tipo que se acepta; subir la mayor de una `peerDependency`. Antes de la 1.0, lo que rompe sube la menor;
- que antes de quitar algo se marca `@deprecated` en una versión menor, y se quita en la siguiente mayor.

#### Scenario: Prop renombrada
- **WHEN** se mira el ejemplo que no cumple la norma de SemVer
- **THEN** enseña un changeset `patch` que renombra una prop, y la norma explica que eso rompe

### Requirement: Área de versiones: changesets
El área de versiones SHALL fijar, para los paquetes publicados:
- con nivel DEBE, que toda PR que cambia lo que el paquete publica trae un changeset que lo nombra, o un changeset vacío si no hay nada que publicar;
- con nivel DEBE, que el changeset se escribe para quien usa el paquete, y que si rompe dice cómo migrar;
- con nivel DEBE, que las prerreleases salen con el modo pre de changesets y una etiqueta de npm distinta de `latest`.

#### Scenario: Beta
- **WHEN** se mira el ejemplo que cumple la norma de las prerreleases
- **THEN** enseña `changeset pre enter beta` y una versión `1.0.0-beta.0` publicada con la etiqueta `beta`

### Requirement: Área de versiones: lockfile y frameworks
El área de versiones SHALL fijar, con nivel DEBE:
- para todos los proyectos, que el lockfile está en el repo y el CI instala con `--frozen-lockfile`;
- para los paquetes publicados, que los frameworks que comparte la app (`react`, `react-dom`, `next`, `astro`, `tailwindcss`) van en `peerDependencies` y nunca en `dependencies`.

#### Scenario: React en dependencies
- **WHEN** se mira el ejemplo que no cumple la norma de los frameworks compartidos
- **THEN** enseña un paquete con `react` en `dependencies`, y el porqué explica que la app acabaría con dos copias de React

### Requirement: Área de versiones: rangos y coherencia
El área de versiones SHALL fijar:
- con nivel DEBERÍA y para los paquetes publicados, que una dependencia 0.x en `dependencies` o `peerDependencies` se fija a una versión exacta;
- con nivel DEBE y para los paquetes publicados, que las internas se declaran con `workspace:`, que lo publicado no lleva ningún `workspace:` y que `sideEffects` está declarado;
- con nivel DEBE y para todos los proyectos, que una dependencia lleva el mismo rango en todos los workspaces.

#### Scenario: Rangos distintos
- **WHEN** se mira el ejemplo que no cumple la norma de la coherencia
- **THEN** enseña `react` con `^19.3.1` en la web y `^19.2.0` en un ejemplo

### Requirement: Excepción de TypeScript en la coherencia de rangos
La norma de la coherencia de rangos SHALL listar como excepción `typescript` en los workspaces con `@astrojs/check`, `next` o `dts-bundle-generator`, porque estas herramientas leen la API de JavaScript de TypeScript 6.

#### Scenario: TypeScript en una app de Astro
- **WHEN** se abre la norma de la coherencia
- **THEN** lista como excepción `typescript` en los workspaces con `@astrojs/check`, `next` o `dts-bundle-generator`, y dice que esas herramientas usan TypeScript 6

### Requirement: Área de estructura: el monorepo
El área de estructura SHALL tener el prefijo `STR` y fijar, con nivel DEBE, que un monorepo reparte sus workspaces en `apps/` (lo que se despliega), `packages/` (lo que se publica o se comparte), `examples/` y `scripts/`, con la configuración de las herramientas en la raíz.

#### Scenario: Workspace suelto
- **WHEN** se mira el ejemplo que no cumple la norma del monorepo
- **THEN** enseña un workspace `web/` en la raíz, y el que la cumple, `apps/web/`

### Requirement: Área de estructura: un workspace
El área de estructura SHALL fijar, con nivel DEBE y para todos los proyectos, que cada workspace (o la raíz de un repo de una sola app) tiene `src/` para lo que se publica o se despliega, `test/` para los tests unitarios, `e2e/` para los de navegador y `scripts/` para lo que no se publica, con su configuración en su raíz. Dentro de `src/` SHALL NOT haber tests.

#### Scenario: Test dentro de src
- **WHEN** se mira el ejemplo que no cumple la norma de los workspaces
- **THEN** enseña `src/components/Button.test.tsx`, y el que la cumple, `test/button.test.tsx`

### Requirement: Área de estructura: carpetas de una app
El área de estructura SHALL fijar, con nivel DEBE y para las apps:
- que el código va en `src/`: en Next, `src/app/`; en Astro, sus carpetas de siempre (`src/pages/`, `src/layouts/`, `src/content/`, `src/assets/`);
- que en el `src/` de una app solo hay carpetas del framework, carpetas compartidas por tipo (`components/`, `hooks/`, `lib/`, `styles/`, `data/`) y `features/`.

#### Scenario: Next en la raíz
- **WHEN** se mira el ejemplo que no cumple la norma de las apps
- **THEN** enseña una app de Next con `app/` en la raíz, y el que la cumple, la misma con `src/app/`

### Requirement: Área de estructura: funcionalidades
El área de estructura SHALL fijar, con nivel DEBE y para las apps, que cada funcionalidad con código propio tiene su carpeta `src/features/<nombre>/`, organizada por dentro con las mismas carpetas por tipo. Lo que usa una sola funcionalidad SHALL vivir en su carpeta; lo que usan dos o más SHALL subir a la carpeta compartida, y una funcionalidad SHALL NOT importar de otra.

#### Scenario: Helper compartido
- **WHEN** un helper de `src/features/search/lib/` pasa a usarse también desde `src/features/mcp/`
- **THEN** la norma pide moverlo a `src/lib/`, y no importarlo de `features/search/`

### Requirement: Área de estructura: paquetes
El área de estructura SHALL fijar, con nivel DEBE y para los paquetes, que cada entrada de `exports` tiene su archivo o carpeta en la raíz de `src/`, junto a los módulos que esas entradas reexportan, y que lo que ningún export alcanza va en `src/internal/`.

#### Scenario: Helper interno en la raíz
- **WHEN** se mira el ejemplo que no cumple la norma de los paquetes
- **THEN** enseña `src/format-price.ts`, un helper que ninguna entrada exporta, y el que la cumple, `src/internal/format-price.ts`

### Requirement: Área de estructura: componentes
El área de estructura SHALL fijar, con nivel DEBERÍA y para todos los proyectos, que cada componente tiene su archivo, con el nombre de su export (`Button.tsx` exporta `Button`).

#### Scenario: Dos componentes en un archivo
- **WHEN** se mira el ejemplo que no cumple la norma de los componentes
- **THEN** enseña `Buttons.tsx` con `Button` y `IconButton`, y el que la cumple, un archivo para cada uno

### Requirement: Área de estructura: builds y cachés
El área de estructura SHALL fijar, con nivel DEBE y para todos los proyectos, que ni la salida del build ni las cachés (`dist/`, `.astro/`, `.next/`, `.turbo/`, `*.tsbuildinfo`) están en Git.

#### Scenario: Caché en Git
- **WHEN** se mira el ejemplo que no cumple la norma de las cachés
- **THEN** enseña `tsconfig.tsbuildinfo` en Git, y el que la cumple, la línea `*.tsbuildinfo` del `.gitignore`

### Requirement: Área de proceso: lo que no tiene norma
El área de proceso SHALL fijar, con nivel DEBE y para todos los proyectos, una norma `PRO-003`: que no haya norma no permite ni prohíbe nada por sí solo. El caso SHALL decidirse en este orden: lo que busca la norma más cercana, la convención oficial del framework o de la herramienta, lo que ya hace el repo y lo más simple. La PR SHALL anotar el caso, la decisión y su porqué.

#### Scenario: Caso sin norma
- **WHEN** una PR pone los workers de una app en una carpeta que ninguna norma nombra
- **THEN** la PR dice que no había norma, dónde los pone y por qué, siguiendo el orden

### Requirement: Un caso sin norma que se repite
Cuando el mismo caso sin norma aparece por segunda vez, o la primera si afecta a más de un proyecto, SHALL proponerse la norma con OpenSpec.

#### Scenario: Segunda vez
- **WHEN** una PR vuelve a decidir dónde van los workers, que ya se anotó en otra PR
- **THEN** la PR trae, o enlaza, la propuesta de la norma

### Requirement: Área de tests: un test por cambio
El área de tests, con el prefijo `TST`, SHALL fijar con nivel DEBE, para todos los proyectos, que todo cambio de comportamiento y todo arreglo de un fallo llevan un test que fallaría sin ese cambio. El área SHALL NOT fijar un umbral de cobertura, y el porqué de la norma SHALL decir que un porcentaje premia los tests que ejecutan código sin comprobar nada.

#### Scenario: Arreglo sin test
- **WHEN** una PR arregla un fallo de `Dropdown` y no añade ni cambia ningún test
- **THEN** quien revisa la PR pide el test que reproduce el fallo

### Requirement: Área de tests: lo que se ve
El área de tests SHALL fijar con nivel DEBERÍA, para todos los proyectos, que los tests prueban lo que ve quien usa el código (el rol, el nombre accesible, el texto) y no los detalles internos.

#### Scenario: Consulta por clase
- **WHEN** un test busca un botón por su clase CSS teniendo un nombre accesible
- **THEN** la norma de lo que se ve recomienda buscarlo por su rol y su nombre

### Requirement: Área de tests: herramientas
El área de tests SHALL fijar con nivel DEBE que las unidades y los componentes se prueban con Vitest y jsdom, el comportamiento en un navegador real con Playwright y los scripts con `bun test`. SHALL NOT admitir Jest, Mocha ni Cypress.

#### Scenario: Jest añadido
- **WHEN** un proyecto añade `jest` a sus dependencias
- **THEN** incumple la norma de las herramientas

### Requirement: Área de tests: tests deterministas
El área de tests SHALL fijar con nivel DEBE, para todos los proyectos, que un test da el mismo resultado cada vez que se ejecuta:
- sin esperas fijas: se espera a una condición, no a un tiempo;
- sin red externa;
- con el reloj y el azar controlados cuando el resultado depende de ellos;
- un test que pasa solo al reintentarlo hace fallar el CI. Se arregla, no se esconde.

#### Scenario: Espera fija
- **WHEN** un e2e espera con `page.waitForTimeout(3000)` a que llegue un mensaje
- **THEN** incumple la norma, y el ejemplo que la cumple espera a que el mensaje sea visible o controla el reloj

#### Scenario: Test inestable
- **WHEN** un e2e falla en el primer intento y pasa en el reintento
- **THEN** el CI falla y lo nombra como inestable

### Requirement: Área de tests: accesibilidad y capturas
El área de tests SHALL fijar:
- con nivel DEBE, que axe pasa sin errores en cada componente público y en cada página de cada app, salvo las excepciones de contraste que documenta la guía;
- con nivel DEBERÍA, que la apariencia de los componentes se compara con capturas aprobadas.

#### Scenario: Página nueva
- **WHEN** una PR añade una página a la web con una imagen sin texto alternativo
- **THEN** el e2e de axe falla y nombra la página y la regla

### Requirement: Área de tests: tests que no se ejecutan
El área de tests SHALL fijar con nivel DEBE que en la rama principal no hay tests con `.only` ni con `.skip`. Un salto que depende de una condición SHALL llevar el motivo en el propio test y en su supresión.

#### Scenario: Test enfocado
- **WHEN** una PR deja un `it.only`
- **THEN** Biome falla y nombra el archivo

#### Scenario: Salto con motivo
- **WHEN** un e2e de capturas se salta porque el componente no tiene captura aprobada en ese tema, y lo dice en el mensaje del salto
- **THEN** cumple la norma

### Requirement: Área de seguridad: auditoría
El área de seguridad, con el prefijo `SEC`, SHALL fijar con nivel DEBE, para todos los proyectos:
- que el CI audita las dependencias con `bun audit` y falla con cualquier aviso alto o crítico;
- que una excepción a la auditoría lleva el ID del aviso, el motivo y una fecha de caducidad de como mucho tres meses, y que caducada vuelve a fallar.

#### Scenario: Aviso alto
- **WHEN** una dependencia transitiva tiene un aviso alto sin excepción
- **THEN** la auditoría del CI falla y nombra el paquete y el aviso

#### Scenario: Excepción caducada
- **WHEN** pasa la fecha de caducidad de una excepción
- **THEN** la auditoría del CI vuelve a fallar con ese aviso y dice que la excepción caducó

### Requirement: Área de seguridad: actualizaciones e instalación
El área de seguridad SHALL fijar, para todos los proyectos:
- con nivel DEBE, que las actualizaciones de seguridad de Dependabot están activadas;
- con nivel DEBERÍA, que solo los paquetes de `trustedDependencies` ejecutan scripts de instalación, y que la PR que añade uno dice por qué.

#### Scenario: Paquete de confianza nuevo
- **WHEN** una PR añade un paquete a `trustedDependencies` sin decir por qué necesita su script de instalación
- **THEN** quien revisa la PR pide el motivo

### Requirement: Área de seguridad: publicación
El área de seguridad SHALL fijar con nivel DEBE, para los paquetes publicados, que se publican en npm con trusted publishing y con provenance, sin ningún token de npm en los secretos ni en los workflows.

#### Scenario: Token en el workflow
- **WHEN** un workflow de publicación usa `NPM_TOKEN` o `NODE_AUTH_TOKEN`
- **THEN** incumple la norma

### Requirement: Área de seguridad: permisos de los workflows
El área de seguridad SHALL fijar con nivel DEBE, para todos los proyectos, que cada workflow declara `permissions` en su raíz, vacío o solo de lectura, y que cada job pide aparte los permisos de escritura que usa.

#### Scenario: Escritura en la raíz
- **WHEN** un workflow declara `permissions: { contents: write }` en su raíz
- **THEN** incumple la norma, y el ejemplo que la cumple mueve ese permiso al job que lo usa

### Requirement: Área de seguridad: acciones por SHA
El área de seguridad SHALL fijar con nivel DEBE, para todos los proyectos, que una acción de fuera de `actions/*` y `github/*` se fija por el SHA completo de su commit, con la versión en un comentario. Las de `actions/*` y `github/*` PUEDEN ir por etiqueta mayor. El porqué SHALL contar que una etiqueta se puede mover a otro código, y citar el ataque a `tj-actions/changed-files` de marzo de 2025.

#### Scenario: Acción de terceros por etiqueta
- **WHEN** un workflow usa `oven-sh/setup-bun@v2`
- **THEN** incumple la norma, y el ejemplo que la cumple es `oven-sh/setup-bun@<sha de 40 caracteres> # v2.x.y`

### Requirement: Área de seguridad: inyección en los workflows
El área de seguridad SHALL fijar con nivel DEBE, para todos los proyectos, que ningún workflow usa `pull_request_target` y que ningún `run:` interpola `${{ github.event.* }}` ni `${{ github.head_ref }}`. Esos valores llegan al paso por `env:`.

#### Scenario: Nombre de rama en un script
- **WHEN** un paso ejecuta `run: ./check.sh "${{ github.head_ref }}"`
- **THEN** incumple la norma, porque quien abre la PR elige el nombre de la rama y puede meter órdenes en él

### Requirement: Área de seguridad: secretos y avisos
El área de seguridad SHALL fijar con nivel DEBE, para todos los proyectos:
- que ningún secreto está en el repo: `.env` y `.env.*` están en `.gitignore`, salvo `.env.example`, y el repo tiene activados secret scanning y push protection;
- que la raíz tiene un `SECURITY.md` que dice cómo avisar en privado de una vulnerabilidad, con el aviso privado de GitHub activado.

#### Scenario: Repo sin SECURITY.md
- **WHEN** un proyecto de la suite no tiene `SECURITY.md`
- **THEN** incumple la norma de los avisos

### Requirement: Área de seguridad: OWASP Top 10
El área de seguridad SHALL tener una norma por cada categoría del OWASP Top 10:2025, de `SEC-011` (A01) a `SEC-020` (A10), en el orden de la lista. Cada una SHALL nombrar su categoría, decir qué hacer en Next y en Astro, y nombrar en su porqué las normas que ya cubren parte de ella.

#### Scenario: Normas del Top 10
- **WHEN** un programa pide las normas del área `security`
- **THEN** recibe de `SEC-011` a `SEC-020`, cada una con la categoría A01 a A10 en su título

### Requirement: OWASP A01: control de acceso
`SEC-011` SHALL fijar con nivel DEBE, para las apps, que el servidor comprueba los permisos en cada ruta, acción o endpoint, y deniega por defecto. Esconder un botón SHALL NOT contar como control. CORS SHALL NOT combinar `*` con credenciales, y el servidor SHALL NOT pedir una URL que llega del usuario sin una lista de destinos permitidos (SSRF).

#### Scenario: Acción de servidor sin comprobación
- **WHEN** una Server Action de Next borra un recurso sin comprobar que el recurso es de quien la llama
- **THEN** incumple la norma

### Requirement: OWASP A02: configuración insegura
`SEC-012` SHALL fijar con nivel DEBE, para las apps que se despliegan, que cada respuesta lleva:
- una CSP sin `unsafe-eval` ni `unsafe-inline` en `script-src`, con `frame-ancestors 'none'`;
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y una `Permissions-Policy` que apaga lo que la app no usa.

En producción SHALL NOT servirse mapas de código ni páginas de depuración.

#### Scenario: Página en un iframe
- **WHEN** otra web carga una página de la app dentro de un `iframe`
- **THEN** el navegador no la pinta

### Requirement: OWASP A03: cadena de suministro
`SEC-013` SHALL fijar con nivel DEBE, para todos los proyectos, que las dependencias salen del registro de npm, nunca de una URL de Git ni de un tarball, y que un script de terceros que se carga de otro origen lleva `integrity`. Su porqué SHALL nombrar `SEC-001`, `SEC-002`, `SEC-005`, `SEC-007` y `VER-006`.

#### Scenario: Dependencia de Git
- **WHEN** un `package.json` declara `"lib": "github:org/lib"`
- **THEN** incumple la norma

### Requirement: OWASP A04: criptografía
`SEC-014` SHALL fijar con nivel DEBE, para las apps, que todo va por HTTPS, que ningún secreto llega al navegador (solo las variables `PUBLIC_` de Astro y `NEXT_PUBLIC_` de Next son públicas), que los valores aleatorios de seguridad salen de la Web Crypto API y nunca de `Math.random`, y que las contraseñas las guarda el proveedor de autenticación, no la app.

#### Scenario: Token con Math.random
- **WHEN** una app genera un token de invitación con `Math.random()`
- **THEN** incumple la norma, y el ejemplo que la cumple usa `crypto.randomUUID()`

### Requirement: OWASP A05: inyección
`SEC-015` SHALL fijar con nivel DEBE, para todos los proyectos, que:
- el HTML crudo (`dangerouslySetInnerHTML`, `set:html`) solo pinta contenido del propio repo o contenido limpiado, con el motivo en su supresión;
- no hay `eval` ni `new Function`;
- la entrada del servidor se valida con un esquema;
- las consultas a una base de datos van parametrizadas.

#### Scenario: HTML del usuario
- **WHEN** un componente pinta con `dangerouslySetInnerHTML` un comentario que escribió un usuario, sin limpiarlo
- **THEN** incumple la norma

### Requirement: OWASP A06: diseño inseguro
`SEC-016` SHALL fijar con nivel DEBE, para todos los proyectos, que el `design.md` de un cambio de OpenSpec que toca autenticación, datos de usuarios o un endpoint del servidor tiene una sección «Seguridad»: qué puede salir mal, quién podría abusar y cómo se evita. Los endpoints públicos SHALL tener un límite de peticiones.

#### Scenario: Endpoint nuevo
- **WHEN** un cambio añade un endpoint público y su `design.md` no tiene sección «Seguridad»
- **THEN** quien revisa la propuesta la pide

### Requirement: OWASP A07: autenticación
`SEC-017` SHALL fijar con nivel DEBE, para las apps con usuarios, que la autenticación la da una biblioteca o un proveedor probado y no código propio; que las cookies de sesión son `HttpOnly`, `Secure` y `SameSite`; que el inicio de sesión tiene límite de intentos; y que se ofrece un segundo factor.

#### Scenario: Sesión en localStorage
- **WHEN** una app guarda el token de sesión en `localStorage`
- **THEN** incumple la norma, y el ejemplo que la cumple usa una cookie `HttpOnly`

### Requirement: OWASP A08: integridad
`SEC-018` SHALL fijar con nivel DEBE, para todos los proyectos, que lo que llega de fuera no se cree sin comprobarlo: un webhook verifica su firma, un dato que se deserializa pasa por un esquema y un paquete se publica con provenance (`SEC-005`).

#### Scenario: Webhook sin firma
- **WHEN** una app acepta un webhook de pagos sin verificar su firma
- **THEN** incumple la norma

### Requirement: OWASP A09: registro y alertas
`SEC-019` SHALL fijar con nivel DEBE, para las apps con servidor, que los errores del servidor y los fallos de autenticación quedan registrados con contexto, sin secretos ni datos personales, y que un pico de errores avisa a alguien.

#### Scenario: Token en el registro
- **WHEN** una ruta registra la cabecera `Authorization` de la petición
- **THEN** incumple la norma

### Requirement: OWASP A10: condiciones excepcionales
`SEC-020` SHALL fijar con nivel DEBE, para las apps con servidor, que ante un error o una entrada inesperada el servidor falla cerrado: deniega en lugar de dejar pasar, responde con un error genérico sin trazas ni rutas internas, limita el tamaño de la entrada y pone un tiempo máximo a las llamadas externas.

#### Scenario: Petición mal formada
- **WHEN** alguien envía a un endpoint un cuerpo que no es JSON
- **THEN** recibe un error genérico, sin la traza del servidor
