# Spec Delta

## MODIFIED Requirements

### Requirement: Generación completa del artefacto
Un comando del repo SHALL generar, sin red, la carpeta `project/` del artefacto con: el índice, `tokens.json`, la guía (`README.md` y secciones), las fuentes, cada componente del catálogo con su ficha y su vista previa, el bundle, la hoja y los tipos, y los grupos de assets de iconos de app, adornos, patrones y logos de terceros.

#### Scenario: Un componente por ficha
- **WHEN** se genera el artefacto
- **THEN** cada componente que exporta `@jotis-me/react` tiene `components/<Nombre>/README.md` y `components/<Nombre>/preview.html`, y no hay ninguno más

#### Scenario: Tokens iguales al paquete
- **WHEN** se compara `tokens.json` generado con el de `@jotis-me/tokens`
- **THEN** tienen los mismos tokens con los mismos valores en claro y en oscuro

#### Scenario: Límites del tipo
- **WHEN** se genera el artefacto
- **THEN** ningún fichero pasa de 15 MiB, el bundle no pasa de 6 MB ni contiene `</script` ni `<!--`, y el total queda por debajo de 1.008 ficheros

#### Scenario: Logos de terceros
- **WHEN** se genera el artefacto
- **THEN** su índice tiene un grupo de assets con cada logo de `@jotis-me/icons/logos` en SVG, separado del grupo «Logos» que se conserva del publicado
