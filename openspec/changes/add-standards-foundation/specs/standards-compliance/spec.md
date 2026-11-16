## ADDED Requirements

### Requirement: Regula cumple las normas verificables
Cada norma cuya verificación sea Biome, CI o test SHALL tener su comprobación funcionando en el repo de Regula y en verde en la rama principal. Una norma SHALL NOT publicarse como automática si su comprobación no existe todavía.

#### Scenario: Norma sin comprobación
- **WHEN** una norma dice que la verifica un paso de CI que no existe en `ci.yml`
- **THEN** los tests de la fuente de normas fallan y nombran la norma

### Requirement: Nombres de paquete comprobados
El CI SHALL comprobar el `name` de cada `package.json` del workspace y SHALL fallar si:
- un paquete privado no está en dominio inverso bajo `me.jotis.regula`;
- un paquete público no usa el scope `@jotis-me`.

Todos los paquetes del repo SHALL cumplirlo: `me.jotis.regula` (raíz), `me.jotis.regula.docs`, `me.jotis.regula.example.astro`, `me.jotis.regula.example.next` y `me.jotis.regula.artifact`, además de los tres `@jotis-me/*` publicados.

#### Scenario: Paquete privado mal nombrado
- **WHEN** una PR añade un paquete privado llamado `example-vite`
- **THEN** el CI falla, nombra el `package.json` y propone `me.jotis.regula.example.vite`

#### Scenario: Repo actual
- **WHEN** corre el CI en la rama principal
- **THEN** la comprobación de nombres pasa

### Requirement: Commits comprobados en las PR
En cada PR, el CI SHALL comprobar que todos los commits que trae la PR siguen Conventional Commits. SHALL fallar nombrando el commit y la regla que incumple. Los commits de fusión que genera GitHub SHALL quedar fuera. Los commits que ya están en la rama principal no se reescriben ni se comprueban.

#### Scenario: Commit sin tipo
- **WHEN** una PR trae un commit `Arreglos en la propuesta`
- **THEN** el CI falla en el job de commits y nombra ese commit

#### Scenario: Commit con cuerpo y coautor
- **WHEN** una PR trae un commit `fix(docs): el historial pinta las tablas`, con un cuerpo y un pie `Co-Authored-By:`
- **THEN** el job de commits pasa

### Requirement: PR de versión con formato
El PR de versión que abre changesets y su commit SHALL llamarse `chore(release): versión de los paquetes`.

#### Scenario: Siguiente versión
- **WHEN** se fusiona en la rama principal una PR con un changeset
- **THEN** el PR de versión que se abre y su commit se llaman `chore(release): versión de los paquetes`
