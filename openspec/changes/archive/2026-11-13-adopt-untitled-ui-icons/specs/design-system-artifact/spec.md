# Spec Delta

## MODIFIED Requirements

### Requirement: Generación completa del artefacto
Un comando del repo SHALL generar, sin red, la carpeta `project/` del artefacto con estas piezas:
- el índice, `tokens.json`, la guía (`README.md` y secciones) y las fuentes;
- cada componente del catálogo con su ficha y su vista previa;
- el bundle, la hoja y los tipos;
- los grupos de assets de iconos de app, adornos, patrones, logos de terceros, pagos y cursores.

Los iconos de línea, los de archivo y las banderas no SHALL ir como assets: la guía del artefacto SHALL decir que se toman de los paquetes de Untitled UI.

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
- **THEN** su índice tiene un grupo de assets con cada logo de `@jotis-me/assets/logos` en SVG, separado del grupo «Logos» que se conserva del publicado

#### Scenario: Sets nuevos de assets
- **WHEN** se genera el artefacto
- **THEN** su índice tiene un grupo de assets para pagos y otro para cursores, con cada SVG del paquete, y no tiene grupos de iconos de línea, banderas ni archivos

#### Scenario: Iconos en las vistas previas
- **WHEN** una vista previa del artefacto monta un ejemplo que usa iconos de `@untitledui/icons`
- **THEN** los iconos se ven, sin red, porque van dentro del bundle
