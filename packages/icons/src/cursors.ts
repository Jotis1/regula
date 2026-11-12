// Entrada `@jotis-me/icons/cursors`: los cursores del Figma (los clásicos y los de macOS 26), como componentes sueltos
// (`CursorHandGrab`) y como SVG que se puede usar de cursor en CSS: `cursor: url(".../hand-grab.svg") 6 4, grab`. El SVG no
// lleva el punto activo del cursor: se pone en la regla de CSS. Aparte de los iconos de línea para que la entrada
// principal no los cargue.

export * from "./cursors.generated.js";
export type { LogoProps as CursorProps } from "./logo.js";
