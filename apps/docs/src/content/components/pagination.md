---

name: Pagination
description: "Paginación de página o de tarjeta con los diez tipos del Figma: texto, botones, mínima, avanzada y grupo de botones, en forma cuadrada o circular."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvela en un `.tsx` y úsala con `client:load`."
---

**Props.** `total` (páginas), `page` / `defaultPage`, `onChange(n)`, `type`, `shape`, `align`, `pageSizes` / `pageSize` / `defaultPageSize` / `onPageSizeChange`. Con más de 7 páginas recorta con "…". Separada de la tabla por una línea `border-secondary`.

**Tipos.** Los diez del Figma (`Pagination`, `1115:68622`) son seis `type` y la alineación:
- `page-minimal` (por defecto, el de siempre): Anterior y Siguiente como botones, números en medio.
- `page-default`: Anterior y Siguiente como texto.
- `card-default`: como `page-minimal` con el relleno de una tarjeta.
- `card-minimal`: «Página N de T» y los botones; `align` `left`, `center` o `right` (por defecto). Con `pageSizes` suma la lista «10 por página».
- `card-advanced`: cuadro de página, filas por página (10, 25, 50 y 100 si no pasas `pageSizes`), primera y última; `align` `left` o `center`.
- `card-button-group`: todo en una barra con borde; `align` `left` o `right`.

**Forma y móvil.** `shape="circle"` redondea los números. En móvil (por debajo de `md`) los botones quedan solo con el icono (su nombre sigue ahí para lectores de pantalla) y los números se sustituyen por «Página N de T». Sin `type` ni `shape` el componente es el de siempre y no cambia en móvil.

**Accesibilidad.** Va en un `<nav>` llamado "Paginación"; la página actual lleva `aria-current="page"` y cada número se anuncia como "Página N". Anterior se desactiva en la primera y Siguiente en la última. Pulsar la página actual no avisa.

**Recorte.** Hasta 7 páginas se ven todas. Con más, cerca de los extremos se muestran `1 2 3 … 8 9 10`, y en medio `1 … 4 5 6 … 10`.

**Textos.** `labels` cambia "Anterior", "Siguiente", el nombre de la navegación, el de cada número, «Página N de T», «N por página», «Filas por página», «Mostrando página», «Ir a la página», «Primera página» y «Última página».

**Cuadro de página.** En `card-advanced`, Enter o salir del cuadro va a la página escrita; un número fuera de rango vuelve a la actual.
