# Spec Delta

## Purpose

regula.jotis.me es la referencia pública del sistema de diseño de la suite jotis.me: reúne las reglas de la guía y la documentación viva de tokens, iconos y componentes, para que quien diseñe o programe una app la consulte en un solo sitio.

## ADDED Requirements

### Requirement: Secciones de fundamentos
La web SHALL tener una página para cada apartado de la guía: principios, contenido y tono, color, tipografía, espaciado, radios y layout, sombras y estados, iconografía, fondos y adornos, marca e iconos de app, Stream (Twitch), y uso con Tailwind v4 en Next.js y Astro, con el contenido de la guía.

#### Scenario: Contenido y tono
- **WHEN** se abre la página de contenido y tono
- **THEN** aparecen la voz, las reglas de formato (tuteo, mayúscula inicial, `1.284,50 €`) y los ejemplos "en lugar de" de la guía

### Requirement: Tokens mostrados desde la fuente
Las páginas de color, tipografía, espaciado, radios y sombras SHALL generarse a partir de los tokens del paquete publicado y mostrar para cada token nombre, muestra, valor claro, valor oscuro, utilidad de Tailwind y nota de uso.

#### Scenario: Token nuevo
- **WHEN** se añade un token al paquete y se reconstruye la web
- **THEN** aparece en su página sin editar la web

#### Scenario: Copiar utilidad
- **WHEN** el usuario pulsa sobre el nombre de un token
- **THEN** se copia la utilidad (`bg-brand-solid`) al portapapeles y se confirma con un aviso breve

### Requirement: Página por componente
La web SHALL tener una página por cada componente con: descripción, cuándo usarlo y qué evitar (de su ficha), ejemplos vivos de sus variantes y estados, tabla de props generada de sus tipos y fragmento de código para Next.js y para Astro.

#### Scenario: Página de Button
- **WHEN** se abre la página de `Button`
- **THEN** se ven las cinco jerarquías y los cinco tamaños funcionando, la regla de una sola acción primaria y la tabla de props con `hierarchy`, `size`, `destructive`, `iconOnly`, `loading` y `href`

#### Scenario: Fragmento de Astro
- **WHEN** se abre la pestaña Astro del ejemplo de un componente interactivo
- **THEN** el código incluye la importación del paquete y la directiva `client:*` necesaria

### Requirement: Galería de iconos
La web SHALL mostrar todos los iconos del set con buscador por nombre, y al elegir uno SHALL permitir copiar su uso en React, su importación SVG y el SVG en bruto.

#### Scenario: Buscar un icono
- **WHEN** el usuario escribe "cal" en el buscador de iconos
- **THEN** solo se muestran los iconos cuyo nombre contiene "cal"

### Requirement: Tema claro y oscuro
La web SHALL ofrecer un conmutador de tema que aplique `dark-mode` a toda la página, recuerde la elección entre visitas y use la preferencia del sistema la primera vez, sin parpadeo del tema equivocado al cargar.

#### Scenario: Recordar tema
- **WHEN** el usuario elige oscuro y recarga la página
- **THEN** la página carga directamente en oscuro

### Requirement: La web sigue el propio sistema
La web SHALL construirse con los paquetes del propio monorepo y cumplir las reglas de la guía: textos en castellano de España con tuteo, sin emojis, una acción principal por vista y "jotis.me" en Bricolage Grotesque bold en la cabecera.

#### Scenario: Cabecera
- **WHEN** se abre cualquier página
- **THEN** la cabecera muestra "jotis.me" en Bricolage Grotesque bold en `text-primary` junto al nombre "Regula"

### Requirement: Búsqueda y navegación
La web SHALL tener navegación lateral por secciones y una búsqueda global de páginas, tokens, iconos y componentes accesible con Ctrl+K / Cmd+K.

#### Scenario: Atajo de búsqueda
- **WHEN** el usuario pulsa Ctrl+K y escribe "modal"
- **THEN** aparece la página del componente `Modal` en los resultados y Enter navega a ella

### Requirement: Publicación en regula.jotis.me
La web SHALL servirse como sitio estático en `https://regula.jotis.me` con HTTPS, y SHALL indicar en el pie la versión de los paquetes que documenta.

#### Scenario: Versión documentada
- **WHEN** se publica una versión nueva de los paquetes
- **THEN** tras el despliegue el pie de la web muestra ese número de versión

### Requirement: Rendimiento y accesibilidad de la web
Las páginas de la web SHALL pasar axe sin violaciones serias o críticas y SHALL obtener al menos 90 en Lighthouse en rendimiento y accesibilidad en móvil.

#### Scenario: Auditoría en CI
- **WHEN** se ejecuta la auditoría sobre la portada, una página de fundamentos y una de componente
- **THEN** las tres superan los umbrales
