# Notas de la implementación

- **`CodeSnippet` (D6).** El fondo de la línea destacada es `bg-brand-primary_alt`, no `bg-brand-primary`: este vale `#615fff` en oscuro y dejaba una banda maciza sobre la que el resaltado de sintaxis perdía contraste. En claro son el mismo color. La raya sigue en `fg-brand-primary`.
- **`HeaderNav` (D1).** La fila móvil nunca usó el contenedor de 1.280 px, así que `fullWidth` solo cambia las dos filas de escritorio. La alineación real con el lateral a 1.920 px se comprueba en `redesign-docs-site-v2` (tarea 1.1), que es quien lo monta.
- **`Slideout` (D8).** Los otros lados no tenían transición de entrada; la de `bottom` es nueva (250 ms, vertical, con fundido solo en movimiento reducido). `width` no se aplica en `bottom`.
- **`labelAside` (D5).** También llega a `VerificationCodeInput`, que comparte el campo común. En `Toggle`, con `labelAside`, `className` va al contenedor exterior.
- **`Tabs` (D2).** El aviso de mezcla usa `process.env.NODE_ENV`, declarado en el propio fichero para no depender de los tipos de Node. El ejemplo interactivo gana el valor preparado «Enlaces a anclas» en `items`; la aserción del test de código de Astro pasa a no depender del sangrado.
- **`CommandMenu` (D7).** Con `defaultQuery` vacío no se llama a `onQueryChange` al abrir. Al cerrar, el buscador vuelve a `defaultQuery`.
- **`Carousel` (D3).** En `strip` se ignoran `index`, `defaultIndex`, `onChange` y `arrowStyle`. Que el `IntersectionObserver` mueva los puntos no tiene prueba automática (jsdom no lo implementa).
- **Páginas de prueba.** `/visual/carousel-strip/` y `/visual/slideout-bottom/`, fuera de la navegación y del registro, para los e2e.
- **E2E.** Batería completa en Chromium más la selección de Firefox y WebKit: 1.324 pasan y falla 1, el «humo» del ejemplo interactivo (esta vez en `AppStoreBadge`, que este cambio no toca), que pasa solo. Es el fallo intermitente ya anotado en `adopt-untitled-ui-icons`.
