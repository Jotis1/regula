---

name: TokenSwatch
description: "Un token de color con su valor claro y su valor oscuro a la vez, y su utilidad lista para copiar."
interactive: true
---

**Props.** `name`, `light`, `dark` (hexadecimales), `usage`, `utility` (lo que se copia), `layout` (`row` · `card`), `onCopy`, `labels`, `className`.

**Cuándo.** Para documentar tokens de color: enseña los dos temas a la vez, sea cual sea el tema de la página. `row` va en una celda de `Table`; `card` apila nombre, muestras, utilidad y uso en una tarjeta.

**Evita.** Pasarle algo que no sea un hexadecimal de seis cifras, o un token que no sea de color (sombras, radios, espaciado). Los valores se sacan de `@jotis-me/tokens`: no los copies a mano.

**Visual.** Dos muestras de 20px (24px en `card`) con `radius-md`, cada una con su hexadecimal en Geist Mono 12px `text-tertiary`. El color de cada muestra va en línea, y su filo de 1px es el `border-primary` de su propio tema (`#d4d4d4` en la clara, `#404040` en la oscura), no el de la página: así se distingue de su color y del fondo de la página en cualquier tema. La utilidad es un botón con fondo `bg-secondary` en Geist Mono.

**Accesibilidad.** Las muestras son decorativas: el valor va en texto, precedido para lectores de pantalla de «Tema claro» o «Tema oscuro». `border-primary` queda por debajo de 3:1 contra el fondo, pero la información está en el hexadecimal, no en el filo. La utilidad es un botón normal.

**Detalles.** Pulsar la utilidad la copia y avisa con `CopyTooltip` (móntalo una vez en la página); si el portapapeles falla, el aviso lo dice como en el resto de la web, y `onCopy` recibe la utilidad y si se pudo. Sin `utility` no hay botón.
