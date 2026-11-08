---

name: TransparencyGrid
description: "Fondo de damero que indica transparencia, para poner detrás de lo que tiene huecos."
interactive: false
---

**Props.** `size` (`sm` · `md`), `className`, `children` y los atributos de un `div` (`style`, `aria-hidden`, `data-*`…).

**Cuándo.** Detrás de algo con partes transparentes, para que se vea que lo están: el marco de una cámara, una escena con fondo transparente, la vista previa de un componente. No es un fondo decorativo para una página: para eso, `BackgroundPattern`.

**Visual.** Cuadros de `bg-secondary` sobre `bg-primary`, de 8px en `sm` y de 16px en `md`. Usa los tokens de fondo, así que cambia con el tema sin hacer nada: en oscuro, los cuadros pasan a los del tema oscuro. Para verlo siempre en oscuro, ponle la clase `dark-mode`, como hacen las muestras de Stream.

**Accesibilidad.** Es decorativo: un `div` sin papel ni nombre. Lo que lleva dentro se anuncia como siempre. Si todo lo de dentro es una muestra inerte, ponle `aria-hidden` e `inert`, como en las cards de `/components/`.

**Detalles.** Funciona sin JavaScript. Es el damero de las cards de `/components/` (`sm`) y del ejemplo de `CamFrame` (`md`).
