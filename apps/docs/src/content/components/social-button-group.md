---

name: SocialButtonGroup
description: "Grupo de botones de redes: en columna a todo el ancho o en fila solo con los logos."
interactive: false
---

**Props.** `children` (los `SocialButton`), `layout` (`column`, por defecto, o `row`), `size` (`md` o `lg`, el de los botones: separa 10 o 12 px en columna) y `label` (nombre del grupo).

**Visual.** La del Figma (`Social button group`, `1256:132638`): en columna, botones a todo el ancho; en fila, botones de solo logo repartidos a partes iguales con 12 px entre ellos.

**Uso.** En la entrada y el registro, encima o debajo del formulario, con un `ContentDivider` («o») de separación. En fila, los botones con `iconOnly`.

**Accesibilidad.** Es un `role="group"`; con `label`, los lectores lo anuncian («Entrar con»). Cada botón tiene su nombre aunque solo enseñe el logo.
