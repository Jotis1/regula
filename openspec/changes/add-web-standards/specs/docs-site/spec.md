# Spec Delta

## MODIFIED Requirements

### Requirement: Rendimiento y accesibilidad de la web
Las páginas de la web SHALL pasar axe sin violaciones serias o críticas, SHALL obtener al menos 90 en accesibilidad en Lighthouse en móvil, SHALL tener un CLS de 0,1 o menos y SHALL mantenerse dentro de sus presupuestos de peso de HTML, CSS y JS. La puntuación de rendimiento de Lighthouse SHALL medirse y enseñarse, sin ser criterio de fallo en el CI.

#### Scenario: Auditoría en CI
- **WHEN** se ejecuta la auditoría sobre la portada, el índice de componentes, una página de fundamentos y una de componente
- **THEN** las cuatro superan 90 en accesibilidad y tienen un CLS de 0,1 o menos, y el resumen enseña su puntuación de rendimiento

#### Scenario: Página fuera de presupuesto
- **WHEN** el HTML de una página pasa de su presupuesto
- **THEN** el CI falla y nombra la página

## ADDED Requirements

### Requirement: Metadatos de las páginas
Cada página indexable de la web SHALL llevar un `canonical` con su URL absoluta en `regula.jotis.me` y Open Graph con su título, su descripción, su URL y una imagen de la web. Las páginas con `noindex` SHALL NOT aparecer en el sitemap.

#### Scenario: Página de componente compartida
- **WHEN** alguien pega en un chat el enlace de `/components/button/`
- **THEN** la vista previa enseña el título y la descripción de Button y la imagen de Regula

### Requirement: Robots y sitemap
La web SHALL servir `/robots.txt`, que permite rastrear el sitio y enlaza al sitemap, y un sitemap con todas sus páginas indexables.

#### Scenario: Sitemap
- **WHEN** un buscador descarga el sitemap que nombra `/robots.txt`
- **THEN** encuentra la portada, las páginas de fundamentos, de componentes y de normas, y ninguna de `/visual/` ni de `/showcase/`
