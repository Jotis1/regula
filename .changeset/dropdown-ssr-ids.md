---
"@jotis-me/react": patch
---

`Dropdown` abierto de inicio (`defaultOpen`) ya no repite ids ni deja referencias ARIA rotas en el HTML de servidor. El panel en línea iba dentro del `MenuTrigger` de React Aria y cada opción recibía las props del botón (su `id`, `aria-controls`, `aria-haspopup`…). Ahora va fuera, y la etiqueta, la descripción y el atajo de cada opción van en sus huecos de React Aria. El aspecto y el comportamiento no cambian: el botón sigue cerrando el menú abierto de inicio y elegir una opción lo cierra.
