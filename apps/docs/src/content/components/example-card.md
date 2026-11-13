---

name: ExampleCard
description: "Tarjeta que enseña un uso bueno o malo: el espécimen sobre el damero y un veredicto con su texto."
interactive: false
---

**Props.** `verdict` (`do` · `dont` · `instead` · `better`), `caption`, `minHeight` (168 por defecto), `grid` (`sm` · `md` · `false`), `className`, el espécimen en `children`.

**Cuándo.** Para documentar un criterio con un ejemplo a la vista: «Esto sí» y «Esto no» en pareja, o «En lugar de» y «Mejor» para proponer un cambio. El texto de `caption` dice el porqué en una frase.

**Evita.** Poner varios especímenes en la misma tarjeta: cada una enseña una sola cosa. Y no dejes el veredicto sin texto: la palabra dice qué es, el texto dice por qué.

**Visual.** Tarjeta `radius-xl` con filo `border-secondary`. Arriba, el damero de `TransparencyGrid` con el espécimen centrado y 24px de relleno; con `grid={false}` el fondo es liso. Abajo, separado por una raya, un `Badge`: `success` con check en `do` y `better`, `error` con X en `dont` e `instead`, y el texto en `text-sm` `text-tertiary`.

**Accesibilidad.** Es una `<figure>` con su `<figcaption>`. El veredicto es una palabra con su icono, nunca solo el color. El espécimen es interactivo: si es solo una muestra, ponle `inert` (y `aria-hidden`) para que no entre en el orden de tabulación.

**Detalles.** Se pinta en el servidor, sin JavaScript. Los textos de los veredictos son los de `defaultStrings` y no se cambian por props: el veredicto es parte del idioma del sistema.
