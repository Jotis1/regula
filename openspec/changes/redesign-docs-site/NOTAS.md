# Notas de traspaso

Lo que no cabe en las casillas de `tasks.md` ni en `design.md`. Léelo antes de seguir con `/opsx:apply`.

## Estado

- Grupo 1 hecho. Grupo 2 hecho dos veces: primero con `chartreuse` y después, por decisión del usuario (3 nov), con `fuchsia` y la guía reimportada a `1793653059-466a` (design §9).
- Trabajo autónomo pedido por el usuario: un commit por tarea; preguntar solo si hace falta una decisión.
- La rama `rediseno-web` sale de `grupo-13-stream`, de antes de la primera publicación: todavía tiene `.changeset/primera-version.md`, que en `main` ya se consumió. Al rebasar sobre `main`, ese fichero desaparece y se queda solo `regula-app-icon.md`.

## Diferencias con el diseño (para revisar en la 9.2)

- **Cabecera, icono de Regula:** variante Claro en el tema claro y principal en el oscuro, como pide la guía dentro de una interfaz clara; el diseño usa siempre la principal (design §9).
- **Disparador de búsqueda:** el diseño pinta «Buscar en Regula» en `text-placeholder`, que en oscuro da 4,2:1 y axe lo marca. Es la etiqueta de un botón, no un placeholder: va en `text-quaternary` (el mismo `#737373` en claro, 7,7:1 en oscuro).
- **Navegación lateral, recuento de Stream:** 12 (sus componentes), no 13. El diseño suma también el enlace «Guía de Stream»; la portada del propio diseño dice «12 componentes».
- **Navegación lateral, grupos:** `<details>` en lugar de botones con `aria-expanded`, para que sin JavaScript se pueda abrir un grupo (design §7). El filtro solo aparece con JavaScript.
- **Menú móvil:** es el `Slideout` de `@jotis-me/react` a todo el ancho (design §7). Su X dice «Cerrar», la etiqueta por defecto de `CloseButton`, en lugar de «Cerrar menú»: `Slideout` no deja cambiarla. La búsqueda del menú cierra el menú y abre la global (evento `regula:search`), en lugar de apilar dos capas modales.
- **Tema:** el conmutador de la cabecera alterna Claro y Oscuro; «Sistema» solo está en el menú móvil, como en el diseño. Mientras no hay elección guardada, la página sigue los cambios del sistema sin recargar (`src/lib/theme.ts`).
- **Portada, instalación:** el diseño dice «importa el tema de Tailwind v4 y carga las fuentes sin que el texto dé saltos». El README de `@jotis-me/react`, de donde salen los fragmentos (design §11), no tiene paso de fuentes: la hoja `styles.css` ya las trae. El texto dice «importa la hoja en tu CSS de Tailwind v4».
- **Portada, cinco reglas:** títulos del diseño con el texto de la guía (Principios, Color y Contenido y tono), no las frases cortas del diseño. «Todo campo con etiqueta» pasa a «Todo input lleva etiqueta visible» y «El color nunca va solo» a «Un estado nunca va solo con color», que es lo que dice la guía.
- **Portada, formulario:** lleva su propio `Button` primary («Guardar gasto») junto al «Instalar en tu proyecto» de la página, como en el diseño. Es la maqueta de una pantalla de app dentro de un `<figure>`, no una segunda acción de la portada; en móvil no se muestra (HomeM).
- **Color, tabla de tokens:** hay una familia «Todas», marcada al empezar, que el diseño no tiene (empieza en Texto): así la tabla se ve entera con y sin JavaScript y no esconde 218 tokens al cargar. Los focos, avatares y controles van en «Componentes». Los tokens `_on-brand` se miden contra `bg-brand-section`, que es donde van según su nota de uso; contra blanco darían un «1:1 · bajo» engañoso.
- **Color, excepciones de contraste:** además de las cinco del diseño, `bg-success-solid` y `bg-warning-solid` con texto blanco, que la guía también cita. Las cifras se calculan en el build, no se copian.
- **Color en móvil:** la tabla de tokens se desplaza en horizontal en lugar de pasar a lista como en ColorM, y la familia se elige con el mismo grupo de botones (salta de línea) en lugar de un `Select`.
- **Color, «Lo esencial»:** las siete viñetas de la guía (Fondos, Texto, Bordes, Iconos, Estados, Escalas utility, Foco), con su texto entero; el diseño resume seis con frases propias.
- **Color, muestras «Aa»:** van en un pseudoelemento (`before:content-['Aa']`). Son decoración y axe medía su contraste: un texto `_on-brand` sobre blanco no llega, que es justo lo que enseña la muestra.
- **Resto de fundamentos (5.3):** cada viñeta de la guía pasa a una tarjeta de «Lo esencial» con su texto entero y un título corto (Texto, Titulares, Código…); el texto no cambia. Tipografía, Espaciado y Sombras siguen con sus tablas generadas de los tokens debajo; esas tablas no salen en el índice «En esta página», que solo recoge los títulos del MDX. Marca y la Instalación conservan su texto y sus tablas en Markdown, con la misma página (migas, índice y anterior/siguiente).
- **Recorrido de anterior/siguiente:** portada → Instalación → los nueve fundamentos en el orden de la guía. Stream va aparte, sin anterior ni siguiente.
- **Salto al contenido:** fuera de la vista a −96px en lugar de −48px; a −48px su `shadow-lg` asomaba en el borde superior.

## Verificación

- `e2e/header.spec.ts` comprueba la cabecera contra `Header.dc.html` a 1440px por medidas (alto 64, padding 32, icono 28, huecos de 32 y 24, subrayado de 2px), no por píxeles: el diseño es una maqueta y no se puede pintar fuera de Claude Design.
