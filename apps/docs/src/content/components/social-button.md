---

name: SocialButton
description: "Botón de entrar con Google, Facebook, Apple, X, Figma o Dribbble, con su logo y el texto en castellano."
interactive: false
---

**Props.** `provider` (`google` · `facebook` · `apple` · `x` · `figma` · `dribbble`), `logo` (obligatorio, de `@jotis-me/icons/logos`), `theme` (`brand`, por defecto · `color` · `gray`), `size` (`md` 40 · `lg` 44), `iconOnly` y `children` (otro texto en lugar de «Entrar con Google»). Con `href` es un enlace; el resto de props pasan al `<button>` o al `<a>`.

**Visual.** El del Figma (`Social button`, `1256:130788`), sobre `Button`. `brand`: el fondo de la marca (azul de Facebook, negro de Apple, X y Figma, rosa de Dribbble) con el brillo del primario y el logo en blanco; Google, en `brand`, es blanco con su logo en color, como el Figma. `color` y `gray`: el secundario con el logo en color o en `fg-quaternary`. Logo de 16 en `md` y de 20 en `lg`.

**Uso.** En la entrada y el registro, en un `SocialButtonGroup`. El paquete no importa los logos: se pasan por `logo`. Por tema: en `brand`, los `…LogoGray` (salen en blanco) salvo `SocialGoogleLogo` y `SocialFigmaLogo`; en `color`, los de color salvo Apple y X, que van con `…LogoGray` para tomar el color del texto (en oscuro, el negro no se vería); en `gray`, los `…LogoGray`.

**Accesibilidad.** Es un botón (o un enlace) con su texto; el logo es decorativo. Con `iconOnly`, el texto queda para lectores: «Entrar con Apple». Foco con el anillo de `Button`.
