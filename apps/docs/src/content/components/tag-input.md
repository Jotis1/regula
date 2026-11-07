---

name: TagInput
description: "Campo que convierte lo escrito en etiquetas al pulsar Enter o coma, sin repetidas ni vacías."
interactive: true
astroNote: "Añadir y quitar etiquetas necesita JavaScript: úsalo en una isla con `client:load`. `onChange` es una función, así que envuélvelo en un `.tsx`."
---

**Cuándo usarlo.** Listas libres que escribe el usuario: palabras clave, temas, correos de invitados. Si las opciones son fijas y conocidas, `MultiSelect`, que las enseña y deja buscar.

**Props.** `label`, `required`, `hint`, `error` (como `Input`), `value` / `defaultValue` (`string[]`), `onChange(tags)`, `placement` (`inside`: dentro del campo, delante del texto; `outside`: debajo), `size` (`sm` 36px · `md` 40 · `lg` 44 mientras quepan en una línea), `placeholder` («Añadir etiqueta»), `disabled`, `name` (las etiquetas van separadas por comas), `removeLabel(tag)`.

**Comportamiento.** Enter o coma convierten lo escrito en una etiqueta; no entran vacías ni repetidas. Retroceso con el campo vacío quita la última. Cada etiqueta es un `Tag` de tamaño `md` con su X, que se alcanza con Tab y devuelve el foco al campo al quitarla. Con `inside` el campo crece en alto cuando las etiquetas no caben en una línea.

**Estados.** Los del marco de `Input`. Deshabilitado: 50% de opacidad y sin X en las etiquetas.

**Reglas.** Etiqueta siempre visible; la pista dice cómo se añade («Enter o coma para añadir»). Las etiquetas son texto del usuario: no las uses para estados ni categorías del sistema, que van en `Badge`.
