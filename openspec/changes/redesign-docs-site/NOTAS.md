# Notas de traspaso

Lo que no cabe en las casillas de `tasks.md` ni en `design.md`. Léelo antes de seguir con `/opsx:apply`.

## Estado

- Grupo 1 hecho. Grupo 2 hecho dos veces: primero con `chartreuse` y después, por decisión del usuario (3 nov), con `fuchsia` y la guía reimportada a `1793653059-466a` (design §9).
- Trabajo autónomo pedido por el usuario: un commit por tarea; preguntar solo si hace falta una decisión.
- La rama `rediseno-web` sale de `grupo-13-stream`, de antes de la primera publicación: todavía tiene `.changeset/primera-version.md`, que en `main` ya se consumió. Al rebasar sobre `main`, ese fichero desaparece y se queda solo `regula-app-icon.md`.

## Diferencias con el diseño (para revisar en la 9.2)

- **Cabecera, icono de Regula:** variante Claro en el tema claro y principal en el oscuro, como pide la guía dentro de una interfaz clara; el diseño usa siempre la principal (design §9).
- **Disparador de búsqueda:** el diseño pinta «Buscar en Regula» en `text-placeholder`, que en oscuro da 4,2:1 y axe lo marca. Es la etiqueta de un botón, no un placeholder: va en `text-quaternary` (el mismo `#737373` en claro, 7,7:1 en oscuro).
- **Salto al contenido:** fuera de la vista a −96px en lugar de −48px; a −48px su `shadow-lg` asomaba en el borde superior.

## Verificación

- `e2e/header.spec.ts` comprueba la cabecera contra `Header.dc.html` a 1440px por medidas (alto 64, padding 32, icono 28, huecos de 32 y 24, subrayado de 2px), no por píxeles: el diseño es una maqueta y no se puede pintar fuera de Claude Design.
