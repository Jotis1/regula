## MODIFIED Requirements

### Requirement: Orden de las áreas
Las áreas de normas SHALL leerse en este orden en la navegación, en la página índice y en `/standards.json`: Nombres, Idioma, Stack, Estructura, Código, Tests, Documentación, Versiones, Seguridad, Git, CI y Proceso. Cambiar el orden SHALL NOT cambiar la URL de un área.

#### Scenario: Áreas en el JSON
- **WHEN** un programa descarga `/standards.json`
- **THEN** las áreas llegan con los ids `naming`, `language`, `stack`, `structure`, `code`, `testing`, `documentation`, `versioning`, `security`, `git`, `ci` y `process`, en ese orden

## ADDED Requirements

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
