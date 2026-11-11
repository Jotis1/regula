---

name: BackgroundOverlay
description: "Velo oscuro, en degradado o transparente, con desenfoque, sobre una imagen o una composición."
interactive: false
---

**Props.** `type` (`default` velo al 70 % · `gradient` del 35 % arriba al 70 % abajo · `transparent` sin velo) y `blur` (desenfoque de 8 px detrás, `true` por defecto).

**Visual.** La del Figma (`Background overlay`, `4896:411056`): `bg-overlay` al 70 % (el degradado, la misma capa con la máscara del 50 % al 100 %) y `backdrop-blur` de 8 px.

**Uso.** Ocupa su contenedor (`absolute inset-0`), que tiene que ser `relative`: pon la imagen antes y el texto después, para que el texto blanco se lea sobre cualquier foto. `Modal` y `Slideout` ya llevan la suya.

**Accesibilidad.** Es decorativa (`aria-hidden`) y no recibe el ratón. El contraste del texto encima depende del velo: con `transparent`, compruébalo.
