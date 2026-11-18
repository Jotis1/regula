# Spec Delta

## ADDED Requirements

### Requirement: Excepciones de normas con caducidad
El repo SHALL declarar en un fichero de la raíz cada norma que todavía no cumple, con el ID de la norma, el motivo y una fecha de caducidad. La comprobación de las normas de desarrollo SHALL fallar si una excepción ha caducado, si nombra una norma que no existe o si le falta el motivo o la fecha. Una excepción SHALL NOT apagar una comprobación automática: solo vale para normas que se verifican por revisión.

#### Scenario: Excepción caducada
- **WHEN** corre `check:dev` pasada la fecha de una excepción
- **THEN** falla y nombra la norma y la fecha

#### Scenario: Norma que no existe
- **WHEN** el fichero declara una excepción para `LOC-099`
- **THEN** `check:dev` falla y nombra el ID

### Requirement: Normas de SEO comprobadas
Un test de la web SHALL recorrer las páginas construidas y fallar, nombrando la página, si una página indexable:
- no lleva `<title>` o lo repite con otra;
- no lleva descripción;
- no lleva `canonical`, o no es su URL absoluta;
- no tiene exactamente un `<h1>`;
- no lleva Open Graph con título, descripción, URL e imagen.

El mismo test SHALL fallar si falta `robots.txt`, si no enlaza al sitemap, o si el sitemap no lista exactamente las páginas indexables.

#### Scenario: Página nueva sin descripción
- **WHEN** una PR añade una página indexable sin descripción
- **THEN** el test falla y nombra la página

#### Scenario: Página de prueba en el sitemap
- **WHEN** el sitemap incluye una página de `/visual/`
- **THEN** el test falla y nombra la URL

### Requirement: Idioma y regiones comprobados
El test que recorre las páginas construidas SHALL fallar si una página no lleva `lang` en `<html>`, o si una página indexable no tiene una región `main` y, antes de ella, un enlace de salto al contenido. Los lienzos internos de prueba, que llevan `noindex`, quedan fuera de la segunda comprobación.

#### Scenario: Página sin lang
- **WHEN** una página se construye sin `lang` en `<html>`
- **THEN** el test falla y nombra la página

### Requirement: Peso por página comprobado
El CI SHALL fallar si el HTML, el CSS o el JS de una página de la web, comprimidos, pasan de su presupuesto, y SHALL nombrar la página, el tipo, lo medido y el límite. Los presupuestos SHALL vivir en un fichero del repo, con un límite por defecto y límites por página.

#### Scenario: CSS que engorda
- **WHEN** una PR hace que el CSS de la portada pase de su presupuesto
- **THEN** el paso de peso por página falla y dice cuánto mide y cuál es el límite

### Requirement: Lighthouse sin la puntuación de rendimiento como puerta
El paso de Lighthouse del CI SHALL fallar si el CLS de una página medida pasa de 0,1 o si su puntuación de accesibilidad baja de 90. La puntuación de rendimiento SHALL calcularse y enseñarse en el resumen, y SHALL NOT hacer fallar el CI.

#### Scenario: Puntuación baja con el runner cargado
- **WHEN** la puntuación de rendimiento de la portada sale en 82 y su CLS en 0,02
- **THEN** el paso pasa y el resumen enseña el 82 como aviso

#### Scenario: Salto de diseño
- **WHEN** una PR hace que la portada tenga un CLS de 0,25
- **THEN** el paso de Lighthouse falla y nombra la página y el CLS

### Requirement: Regula cumple las normas de web
Regula SHALL cumplir las normas de accesibilidad, rendimiento y SEO el día que se publican:
- cada página indexable de la web lleva título y descripción propios, `canonical`, Open Graph y un solo `<h1>`;
- la web sirve `robots.txt` y un sitemap con sus páginas indexables;
- cada página está dentro de sus presupuestos de peso y de CLS.

#### Scenario: Repo actual
- **WHEN** corren el CI y los tests de la web en la rama principal
- **THEN** pasan el test de las páginas construidas, el paso de peso por página y el de Lighthouse

### Requirement: Regula declara lo que le falta de internacionalización
Regula SHALL cumplir las normas de `lang` y de formatos con `Intl` el día que se publican, y SHALL declarar como excepciones con caducidad las normas de los catálogos de textos y de las frases sin concatenar, hasta que el cambio que mueve sus textos a catálogos las cierre.

#### Scenario: Excepciones vigentes
- **WHEN** alguien abre el fichero de excepciones el día que se publican las normas
- **THEN** encuentra `LOC-003` y `LOC-004`, cada una con su motivo y su fecha
