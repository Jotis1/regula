---

name: Spinner
description: "Indicador de carga circular para esperas de más de un segundo sin forma conocida."
interactive: false
---

**Props.** `size` (`sm` 32 · `md` 48 · `lg` 56 · `xl` 64), `variant` (`line-simple`, por defecto: arco de un cuarto sobre su pista `bg-tertiary` · `line-spinner`: arco largo, sin pista · `dot-circle`: dieciséis puntos que se desvanecen), `label` (texto bajo el círculo; `false` lo deja solo para lectores de pantalla). Arco y puntos en `fg-brand-primary`, texto `text-sm-medium` en `text-secondary`. Lleva `role="status"`. Los tres giran, tres veces más despacio con movimiento reducido.

**Spinner o Skeleton.** Si sabes qué forma tendrá el contenido (una tabla, una tarjeta), usa `Skeleton`. El spinner es para acciones (importar, guardar) o pantallas enteras. Dentro de un botón, la prop `loading` de `Button`.
