# Notas de la implementación

- **`data-theme="light"` del artefacto (1.2).** En la variante `dark` del artefacto, el `data-theme="light"` de `<html>` no cuenta (`:not(:root)`): el visor lo pone en la raíz para su tema claro, y un contenedor `data-theme="dark"` dentro debe seguir aplicando `dark:`. Los valores de los tokens sí se publican en `.light-mode, [data-theme="light"]`.
- **`ProgressSteps` sin ejemplo visual nuevo (3.2).** El asistente de tres pasos vive en el ejemplo interactivo y en el fragmento de uso, no en el registro de ejemplos visuales, así que no hay capturas aprobadas nuevas. Se miró en el ejemplo interactivo en claro y oscuro, en horizontal y vertical, con foco.
- **`ProgressSteps` con `children` en horizontal.** `className` pasa al envoltorio de la lista y el bloque de contenido. Lo dicen el JSDoc y la ficha.
- **`SidebarNav` nativo (2.1).** El e2e sin JavaScript usa una página propia, `/visual/sidebar-nav-native/`, fuera de la navegación y del registro, para no rehacer las capturas aprobadas de `SidebarNav`.
- **E2E.** Batería completa de `apps/docs` en Chromium: 1.313 pasan. Firefox y WebKit quedan para el cierre de `add-docs-variants`, que los pide.
