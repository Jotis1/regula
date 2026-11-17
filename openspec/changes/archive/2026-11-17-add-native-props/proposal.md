# Proposal

## Why

`propsOf` descarta todas las props que un componente hereda de los tipos de React, así que la ficha de la web, `/components.json` y `get_component` del MCP no dicen que `Button` acepta `disabled` o `type`, ni que `Input` acepta `name` o `placeholder`. Un agente que lee la ficha por el MCP cree que esas props no existen y las reinventa o las evita. Quedó pendiente al cerrar `add-mcp-server`.

## What Changes

- Una función `nativeOf` junto a `propsOf` (`apps/docs/src/lib/props.ts`) que, de los mismos tipos que lee react-docgen, saca a qué elemento HTML reenvía el componente sus atributos y cuáles son los propios de ese elemento (los de `ButtonHTMLAttributes`, `AnchorHTMLAttributes`, `InputHTMLAttributes`, `TextareaHTMLAttributes`…). Los globales (`HTMLAttributes`, `AriaAttributes`, `DOMAttributes`) no se listan uno a uno: se nombran en bloque. Lo que el componente quita con `Omit` o declara él mismo no aparece, porque ya no viene de `node_modules`.
- Un componente que puede pintarse como `<button>` o como `<a>` (`Button`, `ButtonUtility`, `SocialButton`, `BadgeGroup`) trae los dos elementos, cada uno con sus atributos.
- `/components.json` gana el campo `native` en cada componente (una lista, vacía si no reenvía nada). `get_component` lo devuelve sin más trabajo, porque sirve la entrada del JSON; su descripción lo menciona.
- La ficha de la web enseña, bajo la tabla de props, una línea por elemento: «Reenvía al `<button>` sus atributos: `disabled`, `type`, `name`…, además de los globales de HTML, `aria-*` y los eventos». Sin línea en los componentes que no reenvían nada.
- Hoy son 11 componentes: `AppStoreBadge`, `BadgeGroup`, `Button`, `ButtonUtility`, `Checkbox`, `CloseButton`, `Input`, `Radio`, `SocialButton`, `Textarea` y `TransparencyGrid`.

Fuera de alcance: cambiar qué reenvía cada componente, documentar uno a uno los ~280 atributos globales, y las props nativas de componentes que no las declaran en sus tipos (si no están en el tipo, no se aceptan).

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `docs-site`: «Página por componente» añade la línea de atributos reenviados bajo la tabla de props.
- `mcp-server`: «Herramientas de componentes» y «Datos públicos en JSON» añaden el campo `native` a la ficha de cada componente.

## Impact

- Código: `apps/docs/src/lib/props.ts` (`nativeOf`), `apps/docs/src/lib/components-json.ts` y su endpoint, `apps/docs/src/components/PropsTable.astro` (o la página `components/[slug].astro`), la descripción de `get_component` en `apps/docs/src/mcp/tools.ts`.
- Tests: `components-json.test.ts`, el fixture del MCP (`mcp-fixture.ts`) y un test nuevo de `nativeOf`.
- Sin cambios en los paquetes publicados ni en su API: no hace falta changeset de `@jotis-me/*`. El campo nuevo de `/components.json` es aditivo.
