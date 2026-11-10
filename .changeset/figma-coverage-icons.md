---
"@jotis-me/icons": minor
---

El set completo de iconos del Figma y cuatro entradas nuevas de recursos en color.

**Cambio incompatible: `Icon name`, `IconName` e `iconNames` pasan a ser el núcleo.** El paquete pasa de 82 a 1.172 iconos de línea, pero `<Icon name="…" />` sigue aceptando solo los 82 de antes, con los mismos nombres y los mismos dibujos: son los que usan los componentes de `@jotis-me/react`, y así `Icon` no arrastra el set entero. Los otros 1.090 son componentes sueltos que un bundler deja fuera si no se importan, y cada uno lleva su propio dibujo: `import { IconRocket02 } from "@jotis-me/icons"`. `allIconNames` lista los 1.172, y hay un SVG de cada uno en `@jotis-me/icons/svg/<nombre>.svg`. Si escribías `name="rocket-02"` o similar con un nombre nuevo, ahora no compila: usa su componente. Las props de icono de `@jotis-me/react` aceptan también ese componente ya pintado.

Entradas nuevas, aparte de la principal, cada una con un componente suelto por recurso y un SVG en `@jotis-me/icons/<entrada>/<nombre>.svg`:

- `@jotis-me/icons/flags`: 261 países y regiones en círculo, cuadrado y rectángulo (`FlagSpainCircle`, `FlagCanaryIslandsRectangle`). El nombre es el del país o la región, no el código ISO: Portugal y las Azores comparten PT, Italia y Cerdeña IT, y 11 regiones no tienen.
- `@jotis-me/icons/payments`: 56 métodos de pago en `sm` y `md` (`PaymentVisaMd`, `PaymentApplePaySm`).
- `@jotis-me/icons/files`: 153 tipos de archivo, por extensión y genéricos, en default, gray y solid (`FileDocumentPdf`, `FileDesignFigGray`), y 8 carpetas (`FolderBrandOpen`).
- `@jotis-me/icons/cursors`: 50 cursores, los clásicos y los de macOS 26 (`CursorHandGrab`, `CursorMacosResizeNorthSouth`), que sirven de `cursor` en CSS con el punto activo que pongas tú.

Sin `title` son decorativos; con `title`, una imagen con ese nombre. La entrada principal no exporta ninguno de estos recursos. Los emojis del Figma no se incluyen: son PNG con el arte de emoji de Apple.

El paquete pasa de 2,98 a 8,99 MB sin comprimir (597 a 2.815 ficheros) y de 1,03 a 2,73 MB comprimido. Lo que cargas en tu app es solo lo que importas.
