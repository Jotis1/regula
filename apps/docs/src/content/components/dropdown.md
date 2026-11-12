---

name: Dropdown
description: "Menú de acciones que se abre desde un botón."
interactive: true
astroNote: "Los `onSelect` de los ítems son funciones y no cruzan de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `label` o `trigger`, `items` [{`icon`, `label`, `shortcut`, `danger`, `onSelect`, `value`} o {`divider`: true}], `header` (p. ej. un `AvatarLabel`), `footer`, `searchable`, `variant`, `accounts`, `triggerVariant`, `open` / `defaultOpen`, `selectedValue`, `onSelectionChange`. Panel `bg-primary_alt`, `radius-lg`, `shadow-lg`, mínimo 240px; ítems de 16px de icono con `radius-md`.

**Regla.** La acción destructiva va al final, tras un separador, con `danger`.

**Teclado.** Enter, espacio o ↓ abren el menú en el primer ítem y ↑ en el último; las flechas recorren, escribir salta al ítem que empieza así, Enter elige y Escape cierra. Al cerrar, el foco vuelve al botón. Con ratón, el foco entra en el menú y cada ítem se marca al pasar por encima.

**Abierto de inicio.** Con `defaultOpen` el panel se pinta en línea bajo el botón (como en esta página), sin llevarse el foco ni bloquear la página; elegir un ítem o pulsar el botón lo cierra. Abierto por el usuario, el panel flota sobre la página: se da la vuelta si no cabe debajo y se cierra al pulsar fuera.

**Ampliaciones sobre la guía.** `onOpenChange(open)` avisa al abrir y cerrar (sin él, `open` controlado no se podría cambiar) y `textValue` en un ítem da el texto para buscar con el teclado cuando `label` no es texto. Un `trigger` propio tiene que pasar `ref` y props al DOM, como hace `Button`.

**Elección única (ampliación sobre la guía).** Con `selectedValue` el menú deja de ser de acciones y pasa a elegir una opción entre varias, como el selector de tema de esta web: `<Dropdown label="Tema" selectedValue={tema} onSelectionChange={setTema} items={[{ label: "Claro", value: "claro" }, …]} />`. La opción elegida lleva un check a la derecha en `fg-brand-primary` y se anuncia como opción de radio de menú marcada (`menuitemradio` con `aria-checked`). Elegir otra avisa con su `value` y cierra el menú. Es de lectura: si quien lo usa no cambia `selectedValue`, la marca no se mueve. Cada opción necesita su `value`.

**Búsqueda.** Con `searchable`, arriba del menú sale un cuadro de búsqueda (`searchPlaceholder`) que recibe el foco al abrir y filtra las opciones por su texto (`textValue` si `label` no es texto), sin perder el foco: ↓ pasa a las opciones, Enter elige y Escape vacía la búsqueda y, con ella vacía, cierra el menú. Sin coincidencias sale `emptyLabel` («Sin resultados»).

**Título de grupo y pie.** `{ heading: "Equipos" }` abre un grupo con su título (`text-xs` semibold en `brand-secondary`) hasta el siguiente separador o título; no se puede elegir y los lectores lo anuncian como grupo con su nombre. `footer` pone un texto o un botón al final, separado por una raya (`border-secondary`).

**Integraciones.** `variant="integrations"` pinta los `icon` que sean nodos (logos de `@jotis-me/assets/logos`, por ejemplo `IntegrationClaudeLogoGray`) a 20px dentro del hueco de 16, y el panel mide al menos 216px. El paquete no importa los logos: se pasan.

**Cuentas.** Las variantes `account-*` llevan la lista `accounts` [{`value`, `name`, `email`?, `avatar`?, `initials`?, `status`?}] con la cuenta elegida marcada con un radio (`account` / `defaultAccount`, `onAccountChange(value)`, `accountsLabel`). La lista sale al final tras un separador, o donde pongas `{ accounts: true }` en `items`; `onAddAccount` añade la fila «Añadir cuenta». `account-button` es el botón de siempre; `account-avatar` es solo el avatar (el menú da su nombre accesible); `account-card-xs`, `-sm` y `-md` y `account-breadcrumb` (migas, con el correo en las filas) enseñan la cuenta elegida. El nombre de plan o los datos de la cuenta van en `header`.

**Disparador de enlace.** `triggerVariant="link"` pinta el texto con el chevron, sin caja, para campos como «Puede editar»; con `selectedValue` marca la opción elegida.

**Detalles.** Los atajos solo se muestran: el componente no los registra.
