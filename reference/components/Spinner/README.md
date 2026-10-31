Indicador de carga circular para esperas de más de un segundo sin forma conocida.

**Props.** `size` (`sm` 32 · `md` 48 · `lg` 56 · `xl` 64), `label` (texto bajo el círculo; `false` lo deja solo para lectores de pantalla). Pista `bg-tertiary`, arco `fg-brand-primary`, texto `text-sm-medium` en `text-secondary`. Lleva `role="status"`.

**Spinner o Skeleton.** Si sabes qué forma tendrá el contenido (una tabla, una tarjeta), usa `Skeleton`. El spinner es para acciones (importar, guardar) o pantallas enteras. Dentro de un botón, la prop `loading` de `Button`.
