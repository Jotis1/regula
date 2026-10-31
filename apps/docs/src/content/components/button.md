---

name: Button
description: "La acción de la pantalla: rectángulo redondeado (`radius-lg`), Geist semibold, cinco jerarquías y cinco tamaños."
interactive: false
astroNote: "Sin directiva se pinta sin JavaScript: con `href` navega. Si necesitas `onClick`, ponlo en una isla `.tsx` con `client:load`."
---

**Cuándo.** Una sola `primary` por vista o por modal: es la acción que esperas que el usuario haga. El resto, `secondary`; acciones de bajo peso (cancelar en barras, "ver más"), `tertiary`; dentro de un texto o en alertas, `link-color` / `link-gray`.

**Destructivas.** No todo lo negativo es un botón rojo. Si borrar es una opción más, usa `secondary` normal. Solo cuando la acción destructiva _es_ la principal (el botón de confirmar en un modal de borrado), `destructive` con `primary`.

**Props.** `hierarchy` (`primary` · `secondary` · `tertiary` · `link-color` · `link-gray`), `size` (`xs` 32px · `sm` 36 · `md` 40 · `lg` 44 · `xl` 48), `destructive`, `iconLeading` / `iconTrailing` (nombre de icono), `iconOnly` (nombre de icono; pasa también `label` para lectores de pantalla), `loading`, `disabled`, `href` (se pinta como `<a>`). El texto va en `children`.

**Detalles que ya hace.** El texto lleva 2px extra de padding lateral y el botón 2px menos, para que con icono quede ópticamente centrado. Primario y secundario llevan `shadow-xs-skeuomorphic`; el primario además un borde interior en degradado blanco 12%→0. Deshabilitado = 50% de opacidad. Foco = `focus-ring-shadow` (anillo `focus-ring` con hueco de 2px en `bg-primary`).

**No.** No apiles dos primarios. No cambies la forma: un botón tiene que parecer un botón.
