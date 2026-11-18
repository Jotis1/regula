# Spec Delta

## MODIFIED Requirements

### Requirement: Orden de las áreas
Las áreas de normas SHALL leerse en este orden en la navegación, en la página índice y en `/standards.json`: Nombres, Idioma, Stack, Estructura, Código, Tests, Documentación, Versiones, Seguridad, Accesibilidad, Rendimiento, SEO, Internacionalización, Git, CI y Proceso. Cambiar el orden SHALL NOT cambiar la URL de un área.

#### Scenario: Áreas en el JSON
- **WHEN** un programa descarga `/standards.json`
- **THEN** las áreas llegan con los ids `naming`, `language`, `stack`, `structure`, `code`, `testing`, `documentation`, `versioning`, `security`, `accessibility`, `performance`, `seo`, `localization`, `git`, `ci` y `process`, en ese orden

## ADDED Requirements

### Requirement: Área de accesibilidad: nivel
El área de accesibilidad (`ACC`) SHALL fijar con nivel DEBE que todo proyecto con interfaz cumple WCAG 2.2 en el nivel AA. La norma SHALL nombrar a `TST-005` como su parte automática y SHALL NOT repetirla.

#### Scenario: Qué nivel se pide
- **WHEN** alguien abre la primera norma del área de accesibilidad
- **THEN** lee que el objetivo es WCAG 2.2 AA y que axe, que pide `TST-005`, solo cubre una parte

### Requirement: Área de accesibilidad: teclado y regiones
El área de accesibilidad SHALL fijar con nivel DEBE:
- que todo lo que se hace con el ratón se hace con el teclado, en un orden lógico, sin trampas de foco y con el foco siempre visible;
- que cada página de una app tiene un enlace de salto al contenido como primer elemento enfocable y una región `main`.

#### Scenario: Página sin enlace de salto
- **WHEN** una página de una app no tiene enlace de salto al contenido
- **THEN** incumple la norma, y su comprobación nombra la página

### Requirement: Área de accesibilidad: nombres, contraste y color
El área de accesibilidad SHALL fijar:
- con nivel DEBE, que cada control tiene un nombre accesible y cada imagen con contenido un texto alternativo;
- con nivel DEBE, que el texto y los controles cumplen el contraste AA en el tema claro y en el oscuro, salvo las excepciones que documenta la guía;
- con nivel DEBERÍA, que ninguna información depende solo del color.

#### Scenario: Botón de icono
- **WHEN** un componente pinta un botón que solo tiene un icono y ningún nombre accesible
- **THEN** incumple la norma

### Requirement: Área de accesibilidad: movimiento y tamaño
El área de accesibilidad SHALL fijar con nivel DEBE:
- que las animaciones y transiciones se quitan o se reducen con `prefers-reduced-motion: reduce`;
- que lo que se pulsa mide al menos 24 por 24 px, o deja ese espacio libre a su alrededor.

#### Scenario: Animación de entrada
- **WHEN** un usuario con el movimiento reducido activado abre un modal
- **THEN** el modal aparece sin animación de desplazamiento

### Requirement: Área de rendimiento: Core Web Vitals
El área de rendimiento (`PRF`) SHALL fijar con nivel DEBE, para las apps que se despliegan, que cada página cumple en móvil un LCP de 2,5 s o menos, un CLS de 0,1 o menos y un INP de 200 ms o menos.

#### Scenario: Página lenta
- **WHEN** la portada de una app publicada tarda 4 s en pintar su contenido principal en un móvil de gama media
- **THEN** incumple la norma

### Requirement: Área de rendimiento: presupuestos en el CI
El área de rendimiento SHALL fijar con nivel DEBE que el CI de cada app comprueba en cada PR presupuestos fijos: el peso del HTML, del CSS y del JS de cada página, y su CLS. Subir un presupuesto SHALL ser un cambio a la vista en la PR, con su motivo. La puntuación de rendimiento de Lighthouse SHALL NOT ser criterio de fallo: depende de la carga de la máquina que mide.

#### Scenario: Página que engorda
- **WHEN** una PR hace que el JS de una página pase de su presupuesto
- **THEN** el CI falla y nombra la página, lo medido y el límite

#### Scenario: Runner cargado
- **WHEN** el CI corre en una máquina lenta y la puntuación de rendimiento de Lighthouse baja de 90 sin que cambie el código
- **THEN** el CI no falla por eso

### Requirement: Área de rendimiento: imágenes y fuentes
El área de rendimiento SHALL fijar con nivel DEBE:
- que las imágenes de contenido van en un formato moderno (WebP, AVIF o SVG), con sus dimensiones declaradas y con carga diferida las que quedan bajo el pliegue;
- que las fuentes se sirven desde el propio sitio en WOFF2, con texto visible mientras cargan, y que solo se precargan las del primer pintado.

#### Scenario: Imagen sin dimensiones
- **WHEN** una página lleva una imagen sin `width` ni `height`
- **THEN** incumple la norma: la página salta al cargar la imagen

### Requirement: Área de rendimiento: lo mínimo en el navegador
El área de rendimiento SHALL fijar con nivel DEBERÍA:
- que una página es estática por defecto y solo hidrata lo interactivo, con la directiva o el modo menos urgente que sirva;
- que los assets llevan un hash en el nombre y se sirven con caché inmutable.

#### Scenario: Isla bajo el pliegue
- **WHEN** una página de Astro hidrata al cargar una isla que queda bajo el pliegue
- **THEN** la norma recomienda hidratarla cuando se ve

### Requirement: Área de SEO: alcance
Las normas del área de SEO (`SEO`) SHALL aplicarse a las páginas indexables de las apps que se despliegan. Una página es indexable si no lleva `noindex`.

#### Scenario: Ejemplo que no se despliega
- **WHEN** un proyecto de ejemplo no se despliega
- **THEN** las normas de SEO no le aplican

### Requirement: Área de SEO: título, descripción y canonical
El área de SEO SHALL fijar con nivel DEBE que cada página indexable lleva:
- un `<title>` propio, que no se repite en otra página;
- una descripción propia en `<meta name="description">`;
- un `<link rel="canonical">` con su URL absoluta.

#### Scenario: Página sin canonical
- **WHEN** una página indexable no lleva `canonical`
- **THEN** incumple la norma

### Requirement: Área de SEO: robots, sitemap y noindex
El área de SEO SHALL fijar con nivel DEBE:
- que la app sirve `robots.txt`, que enlaza al sitemap;
- que el sitemap lista todas las páginas indexables y ninguna más;
- que las páginas internas o de prueba, y los despliegues de vista previa, llevan `noindex`.

#### Scenario: Página de prueba en el sitemap
- **WHEN** el sitemap lista una página que lleva `noindex`
- **THEN** incumple la norma

### Requirement: Área de SEO: encabezados y URLs
El área de SEO SHALL fijar con nivel DEBE:
- que cada página indexable tiene un solo `<h1>`;
- que una página que cambia de URL deja una redirección permanente desde la anterior.

#### Scenario: Dos títulos
- **WHEN** una página indexable tiene dos `<h1>`
- **THEN** incumple la norma

### Requirement: Área de SEO: tarjetas y datos estructurados
El área de SEO SHALL fijar:
- con nivel DEBERÍA, que cada página indexable lleva Open Graph con título, descripción, URL e imagen, y el tipo de tarjeta para redes;
- con nivel PUEDE, que una página lleva datos estructurados JSON-LD cuando describen bien su contenido.

#### Scenario: Enlace compartido
- **WHEN** alguien pega en un chat el enlace de una página que cumple la norma
- **THEN** la vista previa enseña su título, su descripción y una imagen

### Requirement: Área de internacionalización: idioma y formatos
El área de internacionalización (`LOC`) SHALL fijar con nivel DEBE:
- que `<html>` lleva `lang` con el idioma de la página;
- que las cifras, las fechas y las monedas se formatean con `Intl` y la configuración regional explícita, nunca a mano.

#### Scenario: Importe formateado a mano
- **WHEN** un componente monta un importe concatenando la cifra y el símbolo del euro
- **THEN** incumple la norma

### Requirement: Área de internacionalización: textos
El área de internacionalización SHALL fijar con nivel DEBE:
- que los textos de la interfaz viven en catálogos por idioma, fuera del código que los pinta;
- que ninguna frase se monta concatenando trozos: cada mensaje es una frase completa con sus variables, y los plurales se resuelven con las reglas del idioma.

#### Scenario: Frase a trozos
- **WHEN** un componente pinta "Mostrando " seguido de un número y de " resultados"
- **THEN** incumple la norma: otro idioma puede necesitar otro orden

### Requirement: Área de internacionalización: varios idiomas
El área de internacionalización SHALL fijar:
- con nivel DEBE, que una app con más de un idioma da a cada uno su ruta y enlaza las versiones de cada página con `hreflang`;
- con nivel DEBERÍA, que la interfaz aguanta textos un 40 % más largos sin cortarse ni romper el diseño.

#### Scenario: App en un solo idioma
- **WHEN** una app solo tiene español
- **THEN** cumple la norma de las rutas por idioma sin hacer nada
