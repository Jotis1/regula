# Tasks

## 1. Referencia y estructura

- [x] 1.1 Copiar a `reference/docs-design/` los `.dc.html`, `lib/regula.css` y `canvas.json` del artefacto "Regula · web de documentación" (versión `1793652886-4c32`), con un `VERSION`; verificar que cada fichero coincide con el sha256 de `list_files` y que están las 33 pantallas del lienzo
- [x] 1.2 Crear `src/lib/catalog.ts` con las secciones de la cabecera, los grupos de componentes (incluidos los cuatro de Stream) y el orden de fundamentos (design §2); verificar con un test que los 74 componentes de la colección están cada uno en un solo grupo y que ningún grupo nombra un componente inexistente
- [x] 1.3 Mover las rutas a `/start/install/`, `/foundations/layout/` y `/foundations/states/` y actualizar enlaces, índice de búsqueda y `e2e/foundations.spec.ts`; verificar con el build que las tres responden y que las URLs antiguas ya no existen

## 2. Regula en la familia de iconos de app

- [x] 2.1 Regenerar `packages/tokens/src/tokens.json` desde `reference/tokens.json` con la escala `utility-chartreuse-50…700`, traducir sus notas con `translate-usage.ts` y quitar la exclusión `UNPORTED` de `test/usage.test.ts`; verificar con los tests de tokens (paridad uno a uno con la guía) y que `bg-utility-chartreuse-600` vale `#829500` en claro y `#cada00` en oscuro
- [ ] 2.2 Añadir Regula (`Re`, `chartreuse`) al registro de `@jotis-me/icons`, la escala `chartreuse-50…950` de la guía y su sitio en el círculo de tonos, y generar sus SVG, favicon y PNG; verificar con tests que la validación acepta el registro, que sigue rechazando `red` y que los SVG coinciden con `reference/assets/App icons/regula-*.svg`
- [ ] 2.3 Quitar la vista previa fijada de AppIcon (`e2e/visual/pinned/`, `PINNED_PREVIEWS`), recapturar su referencia con la vista previa de la guía (con la fila de Regula) y añadir el changeset `minor`; verificar con la paridad visual de AppIcon en claro y oscuro y con `check:colors`
- [ ] 2.4 Añadir Regula a la página de marca, con la paleta `chartreuse` y la nota de la variante `light` en interfaces claras (design §9); verificar con el build y `e2e/foundations.spec.ts`

## 3. Estructura común: cabecera, navegación, pie y tema

- [ ] 3.1 Rehacer `Base.astro` con la cabecera del diseño: icono de Regula (`light` en claro, principal en oscuro) y "Regula", las cinco secciones con la actual marcada, búsqueda con aspecto de campo y conmutador de tema; verificar con un e2e de la cabecera y de la sección actual, axe en claro y oscuro, y una captura a 1440px comparada con `Header.dc.html`
- [ ] 3.2 Crear la navegación lateral desde el catálogo: grupos en `<details>` con el grupo actual abierto, recuentos y filtro con atajo `/` (design §7); verificar con e2e que "tabla" deja `Table` con su grupo abierto, que sin JavaScript se puede navegar y que la página actual lleva `aria-current`
- [ ] 3.3 Crear el pie con los enlaces de documentación y de la suite, la versión de cada paquete leída de su `package.json` y el enlace a `/changelog/`; verificar con un e2e que la versión coincide con la de `@jotis-me/react`
- [ ] 3.4 Crear la cabecera móvil y el menú a pantalla completa sobre `Slideout` (búsqueda, navegación con filtro y tema Sistema/Claro/Oscuro), y el tema en tres estados (design §8); verificar con e2e a 390px que el menú atrapa el foco, se cierra con Escape y devuelve el foco, que "Sistema" sigue al sistema y borra la elección guardada, y que `e2e/theme.spec.ts` sigue pasando sin parpadeo

## 4. Portada

- [ ] 4.1 Rehacer la portada: mensaje principal con el formulario de componentes reales, instalación en tres pasos desde el README de `@jotis-me/react`, mapa de secciones con cifras contadas en el build, "Cinco reglas que se olvidan" con el texto de la guía y las cinco apps con su `AppIcon`; verificar con un e2e de las cifras (componentes, iconos y tokens iguales a los de los paquetes), axe y capturas a 1440 y 390px comparadas con `Main.dc.html` y `HomeM.dc.html`

## 5. Fundamentos

- [ ] 5.1 Crear las piezas de composición en MDX (tarjetas de "lo esencial", "Cabe / No cabe", tabla "En lugar de / Escribe", pares de título y texto, ejemplos vivos), migrar Contenido y tono con el texto de la guía y añadir migas, índice "En esta página" y anterior/siguiente; verificar con `e2e/foundations.spec.ts` (texto clave de la guía), axe y capturas comparadas con `Tone.dc.html` y `ToneM.dc.html`
- [ ] 5.2 Rehacer Color: "lo esencial", tabla de excepciones de contraste de la guía y tabla de tokens con filtro, familias con recuento, valores claro/oscuro, contraste WCAG calculado en el build y copia de la utilidad (design §6); verificar con tests del cálculo de contraste (`text-primary` 17,9:1 en claro), con que `e2e/tokens.spec.ts` sigue mostrando un token nuevo sin tocar la web, axe y capturas comparadas con `Color.dc.html` y `ColorM.dc.html`
- [ ] 5.3 Migrar el resto de fundamentos (principios, tipografía, espaciado/layout, sombras/estados, iconografía, fondos, marca, Stream) e Instalación a la nueva composición con el texto de la guía; verificar con `e2e/foundations.spec.ts` para cada apartado, axe en todas y el build

## 6. Página de componente

- [ ] 6.1 Repartir las fichas por etiqueta en Úsalo así, Evita, Accesibilidad, Amplía o difiere de la guía y Detalles, con el párrafo "Props." junto a la tabla (design §3); verificar con un test que, en las 74 fichas, cada párrafo aparece en la página una sola vez y sin cambios
- [ ] 6.2 Rehacer `ComponentPage.astro`: migas, grupo, descripción, línea de importación y nota de Astro; ejemplo, secciones de la ficha, variantes (ejemplos del registro), props, código Next.js/Astro, índice "En esta página", relacionados del catálogo y anterior/siguiente; verificar con `e2e/components.spec.ts` adaptado (los 74), axe en claro y oscuro y capturas de Button comparadas con `Button.dc.html` y `ButtonM.dc.html`
- [ ] 6.3 Crear el playground genérico desde las props, con su punto de partida en `src/lib/playground.ts` y la lista de props excluidas (design §4); verificar con el e2e del spec (en Button, `secondary` cambia el botón y el código), un test de que el código copiado es JSX válido que importa de `@jotis-me/react` y un test de humo que monta cada playground con el primer y el último valor de cada control sin errores
- [ ] 6.4 Aplicar a Stream su variante de la página (ejemplos en oscuro, insignia "Siempre en oscuro", nota de OBS) y crear `/components/stream-scene/full/` y `/components/channel-banner/full/` a tamaño real; verificar con un e2e de que la escena mide 1920×1080 en su página `full`, axe y capturas comparadas con `Scene.dc.html` y `SceneM.dc.html`
- [ ] 6.5 Crear el índice `/components/` desde el catálogo; verificar con un e2e de que aparecen los 74 enlazados a su página, y axe

## 7. Iconos y búsqueda

- [ ] 7.1 Rehacer la galería de iconos con buscador, tamaño de vista previa, recuento y panel del icono elegido (tamaños, uso por contexto de la guía y código React, importación SVG y SVG en bruto de `@jotis-me/icons`); verificar con `e2e/icons.spec.ts` ("cal" filtra; al elegir `calendar` el código usa `@jotis-me/icons`), axe y capturas comparadas con `Icons.dc.html` y `IconsM.dc.html`
- [ ] 7.2 Ajustar la búsqueda al diseño: grupos Páginas, Componentes (con su grupo del catálogo como descripción), Tokens e Iconos, y el texto de sin resultados; verificar con `e2e/search.spec.ts` ("modal" y Enter llevan a Modal), axe y capturas comparadas con `Search.dc.html` y `SearchM.dc.html`

## 8. Historial de cambios

- [ ] 8.1 Crear `/changelog/` desde los `CHANGELOG.md` de los paquetes (design §10), con un estado vacío si no hay versiones; verificar con un test sobre un CHANGELOG de ejemplo (versión y entradas) y con el build sin CHANGELOG

## 9. Integración

- [ ] 9.1 Pasar la verificación completa: `biome ci`, `turbo build typecheck test` desde un clon limpio, toda la suite de la web (incluida la paridad de `/visual/`), los ejemplos Next y Astro, y Lighthouse en CI (≥ 90 en portada, Color y Button) en el PR de `rediseno-web`; verificar con CI en verde en el PR
- [ ] 9.2 Revisar con el usuario la preview de Vercel del PR frente al diseño en escritorio y móvil, en claro y oscuro, y anotar en NOTAS.md del cambio las diferencias aceptadas; verificar con su visto bueno

## Workflow follow-up

- Archivar este cambio después de `create-regula-design-system`, que crea en `openspec/specs/` los specs que este modifica.
- Rebasar `rediseno-web` sobre `main` cuando `grupo-13-stream` esté fusionada.
