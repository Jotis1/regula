---

"@jotis-me/react": patch
---

`Checkbox`: con `indeterminate`, `aria-checked="mixed"` se pone al montar, junto con la propiedad `indeterminate` de la casilla. Antes, el HTML de servidor anunciaba "mixed" en una casilla nativa que hasta hidratar no lo estaba.
