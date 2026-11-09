# Spec Delta

## MODIFIED Requirements

### Requirement: Rendimiento y accesibilidad de la web
Las páginas de la web SHALL pasar axe sin violaciones serias o críticas y SHALL obtener al menos 90 en Lighthouse en rendimiento y accesibilidad en móvil.

#### Scenario: Auditoría en CI
- **WHEN** se ejecuta la auditoría sobre la portada, el índice de componentes, una página de fundamentos y una de componente
- **THEN** las cuatro superan los umbrales

## ADDED Requirements

### Requirement: JavaScript solo de lo que se usa
Cada página de la web SHALL descargar solo el código de los componentes que usan sus islas, y el JavaScript de cada página SHALL quedar dentro de un límite guardado en el repo y comprobado en CI. Subir un límite SHALL ser un cambio explícito de ese fichero.

#### Scenario: Componentes que la página no usa
- **WHEN** se abre `/` o `/components/`
- **THEN** ninguno de los archivos JavaScript que descarga contiene el código de componentes que ninguna de sus islas usa, como `Carousel`, `CalendarView`, `ColorPicker` o `StreamScene`

#### Scenario: Página que se pasa del límite
- **WHEN** un cambio hace que el JavaScript de `/` supere su límite
- **THEN** el paso de CI que mide el JavaScript falla y dice qué página, cuánto pesa y cuál es su límite

#### Scenario: Componente nuevo en el paquete
- **WHEN** se añade al paquete un componente que no usa ninguna isla de `/`
- **THEN** el JavaScript que descarga `/` no cambia
