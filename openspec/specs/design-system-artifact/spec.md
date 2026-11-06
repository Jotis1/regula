# design-system-artifact Specification

## Purpose
Mantiene el artefacto "Jotis.me" de Claude como copia generada del sistema de diseño del repo, para que Claude diseñe pantallas de la suite con los mismos tokens, componentes y reglas que usan las apps.

## Requirements

### Requirement: El repo es la fuente de verdad
Los tokens, iconos, iconos de app, adornos, componentes, fichas y la guía SHALL definirse solo en el repo. El artefacto "Jotis.me" SHALL ser una salida generada y ningún código ni test del repo SHALL leer `reference/`, que queda como registro congelado de la importación original.

#### Scenario: Sin lecturas de reference
- **WHEN** se buscan en el código fuente, los scripts y los tests de `packages/`, `apps/` y `scripts/` rutas que lleguen a la carpeta `reference/` de la raíz
- **THEN** no aparece ninguna, y los comentarios que citan un fichero de `reference/` como procedencia no cuentan como lectura

#### Scenario: Cambio en el artefacto a mano
- **WHEN** alguien abre el artefacto "Jotis.me" en Claude
- **THEN** la página está en solo lectura e indica que se cambia en el código

### Requirement: Generación completa del artefacto
Un comando del repo SHALL generar, sin red, la carpeta `project/` del artefacto con: el índice, `tokens.json`, la guía (`README.md` y secciones), las fuentes, cada componente del catálogo con su ficha y su vista previa, el bundle, la hoja y los tipos, y los grupos de assets de iconos de app, adornos y patrones.

#### Scenario: Un componente por ficha
- **WHEN** se genera el artefacto
- **THEN** cada componente que exporta `@jotis-me/react` tiene `components/<Nombre>/README.md` y `components/<Nombre>/preview.html`, y no hay ninguno más

#### Scenario: Tokens iguales al paquete
- **WHEN** se compara `tokens.json` generado con el de `@jotis-me/tokens`
- **THEN** tienen los mismos tokens con los mismos valores en claro y en oscuro

#### Scenario: Límites del tipo
- **WHEN** se genera el artefacto
- **THEN** ningún fichero pasa de 15 MiB, el bundle no pasa de 6 MB ni contiene `</script` ni `<!--`, y el total queda por debajo de 1.008 ficheros

### Requirement: Componentes reales en el artefacto
El bundle del artefacto SHALL ser `@jotis-me/react` compilado como un único script clásico que lee React de `window.React` y expone los componentes en `window.Jotis` con los mismos nombres y props que el paquete.

#### Scenario: Mismo componente que en las apps
- **WHEN** una vista previa del artefacto pinta `Jotis.Button` con `hierarchy="secondary"` y `size="lg"`
- **THEN** se ve igual que el mismo botón en la web, en claro y en oscuro

#### Scenario: Vista previa con utilidades propias
- **WHEN** una vista previa del artefacto monta un ejemplo de `Jotis.previews` que usa utilidades que no aparecen en el paquete (por ejemplo, la rejilla del ejemplo de AppIcon)
- **THEN** esas utilidades están en la hoja y la vista previa coincide con la captura aprobada del componente

#### Scenario: React del artefacto
- **WHEN** se carga el bundle en una página con React 18 UMD
- **THEN** cada componente del catálogo se monta sin errores en consola

#### Scenario: Tema oscuro del artefacto
- **WHEN** una vista previa pone `data-theme="dark"` en la raíz
- **THEN** los componentes toman los valores oscuros de los tokens, igual que con `.dark-mode` en las apps

### Requirement: Procedencia y publicación
El artefacto SHALL registrar de qué repo y commit sale y SHALL republicarse desde el repo después de cada versión publicada de los paquetes, sin borrar los assets ya subidos que sigan en uso.

#### Scenario: Commit de origen
- **WHEN** se abre el índice del artefacto publicado
- **THEN** `lastChange` indica `GitHub · Jotis1/regula@<sha>` y `tokens.json` lleva `meta.source` `github` con el mismo commit

#### Scenario: Versión nueva
- **WHEN** se publica una versión nueva de `@jotis-me/react`
- **THEN** el artefacto se regenera desde ese commit y su `lastChange` apunta a él

#### Scenario: Artefacto atrasado
- **WHEN** se empieza una sincronización y el `lastChange` publicado no apunta al commit de la última versión de los paquetes
- **THEN** el procedimiento avisa de qué versiones se quedaron sin sincronizar antes de publicar
