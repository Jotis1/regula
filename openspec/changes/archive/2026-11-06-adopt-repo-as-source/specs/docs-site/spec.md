# Spec Delta

## MODIFIED Requirements

### Requirement: Página por componente
La web SHALL tener una página por cada componente con: descripción, su ficha repartida en "Úsalo así", "Evita", "Detalles" y "Accesibilidad" (sin reescribir su texto), ejemplos vivos de sus variantes y estados, tabla de props generada de sus tipos, fragmento de código para Next.js y para Astro, y lo que amplía o difiere de la guía. La ficha de cada componente vive en el repo junto a su página y es la misma que se publica en el artefacto generado.

#### Scenario: Página de Button
- **WHEN** se abre la página de `Button`
- **THEN** se ven las cinco jerarquías y los cinco tamaños funcionando, la regla de una sola acción primaria y la tabla de props con `hierarchy`, `size`, `destructive`, `iconOnly`, `loading` y `href`

#### Scenario: Fragmento de Astro
- **WHEN** se abre la pestaña Astro del ejemplo de un componente interactivo
- **THEN** el código incluye la importación del paquete y la directiva `client:*` necesaria

#### Scenario: Ficha repartida sin reescribir
- **WHEN** se abre la página de un componente cuya ficha tiene un párrafo "Evita"
- **THEN** ese párrafo aparece en la sección "Evita" con el texto de la ficha sin cambios

#### Scenario: Misma ficha en el artefacto
- **WHEN** se compara la ficha de un componente en su página con su `README.md` en el artefacto generado
- **THEN** tienen el mismo texto

### Requirement: Índice de componentes
La web SHALL tener en `/components/` un índice de todos los componentes del catálogo agrupados por tipo, con su descripción, incluidos los de Stream.

#### Scenario: Todos en el índice
- **WHEN** se abre `/components/`
- **THEN** aparecen todos los componentes que exporta `@jotis-me/react`, cada uno enlazado a su página, y ninguno más
