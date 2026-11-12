---

name: CheckItem
description: "Una línea de lista con su check: lo que incluye un plan, una ventaja o un paso hecho."
interactive: false
---

**Props.** `children` (el texto), `type` y `color` (los de `CheckIcon`), `size` (`sm` check de 20 y `text-sm` · `md` 24 y `text-md` · `lg` 28 y `text-lg`), `as` (`li`, por defecto, o `div`).

**Visual.** La del Figma (`Check item text`, `1345:1610`): check y texto en `text-tertiary`, a 12 px. En un contenedor estrecho (container queries) el texto baja un paso, como el Figma en móvil.

**Uso.** Dentro de un `<ul>`: es un `<li>`. Para listas de planes (`PricingCard`, `InlineCTA` `upgrade-plan`) y de ventajas.

**Accesibilidad.** El check es decorativo; la lista se anuncia con su número de elementos.
