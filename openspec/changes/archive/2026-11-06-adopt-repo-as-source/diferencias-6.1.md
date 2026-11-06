# 6.1 Diseños que usan el artefacto frente al bundle generado

Revisión de los diseños hechos con el artefacto "Jotis.me" frente a `dist-artifact/` (commit `16fb0ab`), antes de la primera sincronización.

## Diseños revisados

| Diseño | Slug | Copia del sistema que lleva |
| --- | --- | --- |
| Scaena | `6b562adc…` | `project/ds/jotis/` con el `bundle.js` de la `466a` (`25fb7c2d…`) |
| Scaena (anterior) | `52f0dfd0…` | la misma copia `466a` |
| Ornatus — bienvenida y pestañas | `546e2a7a…` | una copia anterior a Stream (`bundle.js` de 131 KB, `55b0d5d8…`) |
| Regula · web de documentación | `242dc7f2…` | otra copia (`1f94aed1…`) y su propio `lib/regula.css` |

**Publicar no les cambia nada.** Cada diseño lleva su propia copia del sistema (`ds/jotis/tokens.css`, `components/bundle.css`, `components/bundle.js`) y carga esa, no la del artefacto. Lo de abajo aplica cuando un diseño vuelva a importar el sistema, o en los diseños nuevos.

Cómo usan los componentes: `<x-import component-from-global-scope="Jotis.<Nombre>" …>` con las props como atributos, dentro de un contenedor `class="jm-root"`, con `data-theme="dark"` en el contenedor (Scaena, overlays de Stream) o en `<html>` (Ornatus).

## Props (tipos de la guía `9fe2` frente a `index.d.ts` generado)

Se compararon las props de los 74 componentes con el compilador de TypeScript. Casi todo son cambios solo de tipos (alias con nombre, como `ButtonSize`; los iconos pasan de `string` a la unión de los 81 nombres) y props nuevas opcionales (`className`, etiquetas accesibles…). Cambios con efecto:

| Componente | Cambio | ¿Lo usan los diseños? |
| --- | --- | --- |
| `StreamAlert` | `message` pasa de `ReactNode` a `string`: el paquete lo pinta como texto, nunca como HTML (lo escribe el público) | No en lo revisado: Scaena usa `detail` con texto |
| `Notification` | sin `variant` (siempre flotante) | No en lo revisado |
| `Radio` | sin `indeterminate` (era cosa del checkbox) | No en lo revisado |
| `MetricCard`, `CardHeader` | `menu` admite también un nodo; `true` sigue funcionando | Compatible |
| `Icon` | `className` llega por las props de SVG | Compatible |

Ninguno es un fallo del paquete: son decisiones de sus specs (`component-library`).

## Lo que cambia y cómo se decidió (revisado por Jotis el 2026-11-06)

1. **`.jm-root` ya no existe en la hoja.** La de la guía le daba fuente (`--font-body`), color (`text-primary`), suavizado y `box-sizing`. Todos los diseños envuelven en `jm-root`; los de Scaena repiten fuente y color en línea, pero no todos. **Decidido:** el generador añade esas mismas reglas de `.jm-root` a la hoja (`JM_ROOT` en `scripts/artifact/src/sheet.ts`, con su test) y la guía del artefacto lo dice.
2. **La hoja nueva trae el reset de Tailwind (preflight)**, como las apps; la de la guía solo tenía clases `jm-*`. En un diseño eso cambia su propio HTML (márgenes de `h1`/`p`, listas, imágenes en bloque, botones sin estilo de navegador). Las vistas previas lo necesitan (las capturas aprobadas se hicieron con él). **Opciones:** (a) dejarlo, porque un diseño se parece más a la app real; (b) quitarlo y comprobar que las 148 vistas previas siguen pasando. **Decidido: (a).** Se queda, y la guía del artefacto avisa de que la hoja es la de las apps, con el reset incluido.
3. **Las clases `jm-*` de la guía desaparecen** (443 en su hoja). En lo revisado los diseños no las usan directamente (Ornatus usa sus `om-*`), pero un diseño que las use perdería ese estilo. **Aceptado:** la revisión de la muestra basta para dar la 6.1 por hecha.

## Muestra revisada

Scaena: `EstudioEntrada`, `PerfilPaneles`, `OvJuego`. Ornatus: `Main`. El resto se revisó por la lista de ficheros: las pantallas pequeñas (≈700 bytes) solo importan otras (`<dc-import>`), y la web de Regula pinta con su propio `lib/regula.css`. Aceptada como suficiente; la revisión fichero a fichero de los ≈500 KB de diseños queda descartada.
