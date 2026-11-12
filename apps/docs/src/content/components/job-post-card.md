---

name: JobPostCard
description: "Oferta de empleo: puesto, departamento, resumen, lugar, jornada y sueldo, en tres tipos."
interactive: false
---

**Props.** `href`, `title`, `description`, `department` y `departmentColor`, `location` y `flag`, `employment`, `salary`, `category`, `viewLabel` y `type` (`simple` · `card-01` · `card-02`).

**Tipos.** Los del Figma (`_Job post`, `1506:244681`): `simple` con una raya encima, el puesto, la etiqueta del departamento, el resumen y el lugar y la jornada; `card-01` en tarjeta, con la categoría encima y «Ver la oferta»; `card-02` en tarjeta, con el lugar en una etiqueta con bandera y la jornada y el sueldo. En un contenedor de menos de 448 px, las etiquetas bajan bajo el título, como el Figma en móvil.

**Uso.** En la página de empleo, una debajo de otra, agrupadas por departamento.

**Accesibilidad.** Un `article` con el puesto en `h3`; el puesto es el enlace y su área cubre la tarjeta. Los iconos del lugar, la jornada y el sueldo son decorativos.
