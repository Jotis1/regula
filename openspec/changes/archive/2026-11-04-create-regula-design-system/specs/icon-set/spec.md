# Spec Delta

## Purpose

Ofrece el set de iconos de línea de la guía (24×24, trazo de 2px redondeado, sin relleno) a todas las apps, tanto como componentes React como en SVG para Astro y HTML.

## ADDED Requirements

### Requirement: Set completo de iconos de la guía
El paquete de iconos SHALL incluir los 81 iconos de uso común de la guía con los mismos nombres que `Jotis.iconNames`, dibujados en 24×24 con trazo de 2px, extremos redondeados y sin relleno.

#### Scenario: Paridad de nombres
- **WHEN** se compara la lista de iconos exportada con `iconNames` de la guía
- **THEN** coinciden uno a uno

### Requirement: Iconos que heredan el color
Cada icono SHALL pintar su trazo con `currentColor` y aceptar `size` (20 por defecto) y `strokeWidth`, de modo que tome el color de la utilidad `text-fg-*` que tenga su contenedor.

#### Scenario: Color por utilidad
- **WHEN** un icono se pinta dentro de un elemento con `text-fg-brand-primary`
- **THEN** su trazo tiene el color `fg-brand-primary` en claro y en oscuro

#### Scenario: Tamaño
- **WHEN** se pinta un icono con `size={16}`
- **THEN** el SVG mide 16×16 px y conserva el viewBox 24×24

### Requirement: Accesibilidad de los iconos
Un icono sin `title` SHALL quedar oculto a lectores de pantalla (`aria-hidden`); con `title` SHALL exponerse como imagen con ese nombre accesible.

#### Scenario: Icono decorativo
- **WHEN** se pinta un icono sin `title` junto a un texto
- **THEN** el SVG lleva `aria-hidden="true"` y no aparece en el árbol de accesibilidad

#### Scenario: Icono con significado
- **WHEN** se pinta un icono con `title="Buscar"`
- **THEN** el SVG tiene `role="img"` y nombre accesible "Buscar"

### Requirement: Iconos utilizables sin React
El paquete SHALL publicar cada icono también como fichero SVG con trazo `currentColor`, importable desde Astro o HTML sin runtime de React.

#### Scenario: Icono en Astro sin isla
- **WHEN** una página Astro importa el SVG de un icono y lo incluye en línea
- **THEN** la página renderiza el icono sin enviar JavaScript al cliente

### Requirement: Animación de giro
El componente de icono SHALL aceptar `spin` para girar de forma continua (para cargas) y SHALL detener el giro cuando el usuario prefiere movimiento reducido.

#### Scenario: Movimiento reducido
- **WHEN** un icono con `spin` se pinta con `prefers-reduced-motion: reduce`
- **THEN** el icono no gira
