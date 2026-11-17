## MODIFIED Requirements

### Requirement: Página por componente
La web SHALL tener una página por cada componente con: descripción, su ficha repartida en "Úsalo así", "Evita", "Detalles" y "Accesibilidad" (sin reescribir su texto), su ejemplo interactivo (requisito «Playground de componente»), tabla de props generada de sus tipos, fragmento de código para Next.js y para Astro, y lo que amplía o difiere de la guía. La página no SHALL tener una galería fija de variantes y estados: lo que antes enseñaba esa galería se alcanza desde el ejemplo interactivo. La ficha de cada componente vive en el repo junto a su página y es la misma que se publica en el artefacto generado.

Si el componente reenvía atributos nativos a un elemento HTML, la página SHALL decirlo bajo la tabla de props, con una línea por elemento: el elemento, los atributos propios de ese elemento que acepta el tipo del componente y la mención en bloque de los globales de HTML, `aria-*` y los eventos. Los atributos SHALL salir de los tipos del componente, como la tabla: no se listan los que el componente quita ni los que declara él mismo. Un componente que no reenvía atributos nativos no SHALL tener esa línea.

#### Scenario: Página de Button
- **WHEN** se abre la página de `Button`
- **THEN** desde su ejemplo interactivo se pueden ver las cinco jerarquías y los cinco tamaños funcionando, y la página muestra la regla de una sola acción primaria y la tabla de props con `hierarchy`, `size`, `destructive`, `iconOnly`, `loading` y `href`

#### Scenario: Atributos reenviados de Button
- **WHEN** se abre la página de `Button`
- **THEN** bajo la tabla de props hay una línea para `<button>` que incluye `type` y otra para `<a>` que incluye `target`, y las dos mencionan los atributos globales, `aria-*` y los eventos

#### Scenario: Atributo quitado
- **WHEN** se abre la página de `Checkbox`, cuyo tipo quita `type` y `size` de los atributos de `<input>`
- **THEN** la línea de `<input>` no incluye `type` ni `size`

#### Scenario: Sin atributos reenviados
- **WHEN** se abre la página de un componente cuyo tipo no hereda atributos de HTML, como `Avatar`
- **THEN** bajo la tabla de props no hay línea de atributos reenviados

#### Scenario: Sin galería de variantes
- **WHEN** se abre la página de cualquier componente
- **THEN** no tiene la sección «Variantes y estados» ni la entrada correspondiente en «En esta página», y el ejemplo interactivo es la primera sección tras la cabecera

#### Scenario: Fragmento de Astro
- **WHEN** se abre la pestaña Astro del ejemplo de un componente interactivo
- **THEN** el código incluye la importación del paquete y la directiva `client:*` necesaria

#### Scenario: Ficha repartida sin reescribir
- **WHEN** se abre la página de un componente cuya ficha tiene un párrafo "Evita"
- **THEN** ese párrafo aparece en la sección "Evita" con el texto de la ficha sin cambios

#### Scenario: Misma ficha en el artefacto
- **WHEN** se compara la ficha de un componente en su página con su `README.md` en el artefacto generado
- **THEN** tienen el mismo texto
