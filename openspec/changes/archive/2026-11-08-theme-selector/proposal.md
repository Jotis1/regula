# Proposal

## Why

En escritorio, la cabecera de regula.jotis.me solo alterna entre claro y oscuro: una vez elegido un tema, no hay forma de volver a seguir al sistema sin abrir el menú móvil, que en escritorio no se ve. La lógica de tres estados (sistema, claro, oscuro) ya existe en la web (`src/lib/theme.ts`) y el menú móvil la usa; falta llevarla a la cabecera. Es además el paso previo acordado antes de plantear el selector de tema como componente del paquete.

## What Changes

- El botón de tema de la cabecera pasa a ser el `Dropdown` del paquete con su propio botón (secundario, con texto y flecha), que abre un menú con **Sistema**, **Claro** y **Oscuro**, con la opción actual marcada. El botón dice lo elegido con su icono y su nombre: pantalla y «Sistema», sol y «Claro» o luna y «Oscuro». (En una primera versión era un botón solo de icono; el usuario prefirió el `Dropdown` con texto.)
- Elegir **Sistema** borra la elección guardada y la web vuelve a seguir la preferencia del sistema, también cuando esta cambia con la página abierta. Es lo mismo que ya hace el menú móvil, que no cambia.
- `Dropdown` de `@jotis-me/react` gana selección única: una opción puede ir marcada (✓) y se anuncia como opción de radio de menú (`menuitemradio`). Es retrocompatible: sin la prop nueva, el menú se comporta como ahora.
- `@jotis-me/icons` gana el icono de pantalla para «Sistema», sacado del archivo de Figma (página Icons) para mantener el trazo. El set pasa de 81 a 82 iconos.
- Fuera de alcance: convertir el selector de tema en componente del paquete (se plantea después, con este como referencia) y cambiar el selector del menú móvil.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `docs-site`: el requisito «Tema claro y oscuro» pasa de un conmutador de dos estados en la cabecera a un selector de tres estados también en escritorio.
- `component-library`: `Dropdown` admite una opción elegida (selección única) además de acciones.

## Impact

- `apps/docs`: `src/components/ThemeToggle.astro` se sustituye por un selector (isla de React con `Dropdown`) en `SiteHeader.astro`. `src/lib/theme.ts` y `ThemeScript.astro` se reutilizan sin cambios de comportamiento. Tests e2e de tema (`e2e/theme.spec.ts`) y de cabecera.
- `packages/react`: `Dropdown.tsx` (props nuevas, retrocompatibles), su ficha y su ejemplo. Changeset `minor`.
- `packages/icons`: un icono nuevo en `src/data/icons.ts` y en el componente generado. Changeset `minor`. Los textos que dicen «81 iconos» (README del paquete, iconografía de la web y la guía del artefacto) pasan a 82.
- Artefacto Jotis.me: en la próxima sincronización entran el icono nuevo (un asset más que subir) y el `Dropdown` actualizado.
