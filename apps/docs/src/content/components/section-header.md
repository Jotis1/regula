---

name: SectionHeader
description: "Cabecera de una sección dentro de una página: título, descripción, acciones y línea."
interactive: false
---

**Props.** `title`, `description`, `actions`, `size` (`md` · `sm`), `divider`, `children` (p. ej. `Tabs` o una búsqueda), `tabs`, `search`, `buttonGroup`, `menu`.

**Pestañas, búsqueda y grupo.** Los tipos del Figma (`Section header`, `1214:38`), como huecos para componentes del paquete: `tabs` (unas `Tabs` `button-border` bajo el título), `search` (un `Input` con la lupa, a la derecha), `buttonGroup` (un `ButtonGroup`, a la derecha) y `menu` (los tres puntos, el último). En estrecho, el menú sube junto al título y la búsqueda y los botones pasan debajo, a todo el ancho. Título `text-lg-semibold` (`text-md` en `sm`), descripción `text-sm` en `text-tertiary`.

**Uso.** Páginas de ajustes y formularios largos: una cabecera por grupo de campos.

**Detalles.** Funciona sin JavaScript. El título es un `<h2>`, por debajo del `<h1>` de `PageHeader`.
