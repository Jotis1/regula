El sistema de diseño de la suite jotis.me (Vinculum, Pecunia, Emptor, Ornatus y lo que venga). Interfaz de aplicación sobria: grises neutros, un solo color de marca (índigo), Geist y Geist Mono para leer, Bricolage Grotesque para los titulares. Claro y oscuro desde el primer día.

## Principios

- **Neutro primero, marca con intención.** Casi todo es gris: texto, bordes, fondos. El índigo (`bg-brand-solid`, `fg-brand-primary`, `text-brand-secondary`) marca lo interactivo y lo actual. Si una pantalla tiene más de dos o tres manchas de marca, sobra alguna.
- **Una acción principal.** Cada vista y cada modal tiene como mucho un `Button` `primary`. El resto, `secondary` o `tertiary`. Ver el componente Button.
- **Profundidad sutil.** Los controles llevan `shadow-xs-skeuomorphic` (sombra mínima + borde interior) para parecer pulsables sin volver al 2010. Las superficies flotantes suben por escala: menús `shadow-lg`, modales `shadow-xl`.
- **Lo justo en tablas y datos.** Sin adornos, una columna principal, separadores finos (`border-secondary`).

## Contenido y tono

- **Voz: cercana, desenfadada y con humor seco.** Quien use la app no debe sentir que habla con una empresa sin sentimientos, pero tampoco con alguien que vive en una terminal. Una pizca de ironía donde no estorba (estados vacíos, confirmaciones, cargas, errores sin consecuencias); en pagos, borrados y fallos graves, claro y serio. Sin jerga técnica ni referencias de nicho. Una broma por pantalla como mucho, y si no mejora el texto, se quita.
  - Estado vacío: "Aún no hay gastos. Qué calma." En lugar de "No se encontraron resultados."
  - Error leve: "Ese correo no parece un correo. Revísalo." En lugar de "Se ha producido un error de validación."
  - Confirmación: "Guardado. Ya no se te va a olvidar." En lugar de "Los cambios se han guardado correctamente."
- Castellano de España, tuteo, frases cortas. Verbos en los botones: "Guardar", "Eliminar gasto", "Exportar". Nada de "Aceptar" cuando hay un verbo mejor.
- Mayúscula solo al principio: "Nuevo movimiento", no "Nuevo Movimiento".
- Errores que dicen qué pasa y cómo arreglarlo: "Introduce un correo válido." No "Error 422".
- Sin emojis en la interfaz. Sin signos de exclamación salvo que algo sea realmente bueno.
- Cifras con formato español: `1.284,50 €`, fechas `29 oct 2026`.

## Color

Los tokens son **semánticos**: elige por función, no por tono. Cada uno trae su valor claro y oscuro.

- **Fondos.** Página y tarjetas en `bg-primary`. Zonas secundarias (cabecera de tabla, shell de la app) en `bg-secondary`. Superficies elevadas (modales, menús, alertas) en `bg-primary_alt`, que en oscuro se separa del fondo. Hover de filas e ítems: `bg-primary_hover`.
- **Texto.** `text-primary` para títulos y valores; `text-secondary` para etiquetas y texto de botones; `text-tertiary` para apoyo y pistas; `text-quaternary` para metadatos; `text-placeholder` solo en placeholders. Enlaces: `text-brand-secondary`.
- **Bordes.** `border-primary` en controles (inputs, checkboxes, botones secundarios); `border-secondary` para separadores y tarjetas; `border-brand` en foco.
- **Iconos.** Familia `fg-*`: `fg-quaternary` dentro de controles, `fg-tertiary` en navegación, `fg-brand-primary` en indicadores activos.
- **Estados.** `error`, `warning`, `success` en tres capas: `bg-*-primary` (tinte de fondo), `bg-*-solid` (relleno), `text-*-primary` / `fg-*-primary` (texto e icono). Un estado siempre lleva palabra o icono además del color.
- **Escalas utility** (`utility-<tono>-50…700`): para badges, etiquetas y gráficas. Fondo `-50`, borde `-200`, texto `-700`, punto `-500`. El modo oscuro invierte la escala.
- **Foco.** `focus-ring-shadow`: hueco de 2px en `bg-primary` y anillo de 4px en `focus-ring` (#615FFF). En errores, `focus-ring-error-shadow`.

**Contraste.** Todos los pares de texto principales superan 4,5:1 en ambos temas. Excepciones heredadas del archivo, que se mantienen tal cual: `text-warning-primary` (2,9:1) y `text-success-primary` (3,2:1) sobre blanco valen para 24px+ o junto a un icono; `fg-quaternary` (2,6:1 en claro, 2,5:1 en oscuro) es solo decoración; `bg-success-solid` y `bg-warning-solid` no admiten texto blanco normal; `border-primary` (1,5:1) queda por debajo del 3:1 para bordes de control, así que **todo input lleva etiqueta visible**; `text-placeholder` baja a 4,2:1 en oscuro.

## Tipografía

- **Geist** (`--font-body`) para todo lo funcional. Estilos `text-xs` (12/18) a `text-xl` (20/30) en regular, medium, semibold y bold. Por defecto en la interfaz: `text-sm` (14/20). Cuerpo de lectura: `text-md` (16/24).
- **Bricolage Grotesque** (`--font-display`) solo para titulares: `display-xs` (24/32) a `display-2xl` (72/90). De `display-md` hacia arriba, interletrado −2%. Título de página en app: `display-sm-semibold`. Cifras destacadas: `display-md-semibold`.
- Pesos: etiquetas y botones en medium/semibold; párrafos en regular. No uses bold en display.
- **Geist Mono** (`--font-mono`) solo para código, de la misma familia que Geist: estilos `code-sm` (14/20) y `code-xs` (12/18).
- Ancho máximo de párrafo: `paragraph-max-width` (720px).

## Espaciado, radios y layout

- Escala de espaciado `spacing-xxs` (2) … `spacing-11xl` (160). Lo habitual: `spacing-md` (8) dentro de controles, `spacing-xl` (16) entre campos, `spacing-3xl` (24) de padding en tarjetas y modales, `spacing-4xl` (32) de gutter de página en escritorio.
- Contenedor: máximo `container-max-width-desktop` (1280), padding `container-padding-mobile` (16) y `container-padding-desktop` (32).
- Radios, con los mismos nombres que Tailwind (`rounded-md` = `radius-md`): `radius-md` (6) badges, tags, pestañas e ítems de menú; `radius-lg` (8) botones, inputs, tooltips; `radius-xl` (12) tarjetas, alertas, tablas; `radius-2xl` (16) modales; `radius-full` pills, avatares, toggles.
- Anchos: modales en `width-sm` (480); paneles estrechos `width-xxs` (320).

## Sombras y estados

- Sombras: `shadow-xs` inputs; `shadow-xs-skeuomorphic` botones e iconos destacados; `shadow-sm` mando del toggle; `shadow-lg` menús, tooltips, notificaciones; `shadow-xl` modales. Son las mismas en claro y oscuro; sobre fondos oscuros las exteriores casi no se ven y la separación la dan `bg-primary_alt` y los bordes.
- Hover: cambia el fondo un escalón (`bg-primary` → `bg-primary_hover`) o el color del texto a su `_hover`. Deshabilitado: 50% de opacidad en todo el control. Sin animaciones decorativas; transiciones de 100–150 ms en color y en el mando del toggle.
- Backdrop de modal: `bg-overlay` al 70% con `backdrop-blur-lg` (16px).

## Iconografía

- Set de iconos de línea del archivo: 24×24, trazo de 2px con extremos redondeados, sin relleno. El componente `Icon` incluye 81 de uso común (`Jotis.iconNames`); los mismos están como SVG en el grupo Icons, con trazo `#525252` (`fg-tertiary`) porque `<img>` no hereda color.
- Tamaños: 20px en botones e inputs, 16px en botones xs y menús, 24px en navegación lateral.
- Un icono solo, sin texto, necesita `label`/`title`. Nunca emojis como iconos.
- Si hace falta un icono que no está en el set, sácalo del mismo archivo de Figma (página Icons, 1.173 iconos) para mantener el trazo.

## Fondos y adornos

- **Banners** (`Banner`): avisos globales, flotantes o de ancho completo, en tema neutro o de marca. Uno a la vez.
- **Fondos** (`BackgroundPattern`): rejilla, puntos, rejilla con casillas y círculos o cuadrados concéntricos en `border-secondary`, siempre con máscara de desvanecido. Solo detrás de cabeceras, estados vacíos o bienvenidas. Texturas fijas (rayas, ondas, curvas de nivel) en el grupo Patterns.
- **Trazos a mano** (grupo Hand-drawn): subrayados, círculos, flechas y acentos en tinta `#171717`. En oscuro, recolorea a `#FAFAFA`. Uno o dos por vista, nunca en pantallas de trabajo.
- **Maquetas** (`CreditCard`, `BrowserFrame`): tarjeta de pago y marco de navegador para onboarding, documentación y presentaciones. Dentro del marco van componentes reales, no capturas.

## Stream (Twitch)

Familia de componentes para directos: alertas, escenas, overlay y canal. Sigue la misma gramática del sistema (neutro primero, índigo con intención, Geist y Bricolage) y se dibuja **siempre en oscuro**: cada raíz lleva `data-theme="dark"`, así que se ve igual dentro de una página clara.

- **Piezas.** Alertas: `StreamAlert`. Escenas: `StreamScene` y `StreamCountdown`. Overlay: `CamFrame`, `ChatBox`, `ChatBadge`, `StreamGoal`, `StreamEvents`, `NowPlaying` y `StreamStatus`. Canal: `ChannelPanel` y `ChannelBanner`.
- **Tamaños de Twitch.** Escena y pantalla offline: 1920×1080. Banner de perfil: 1200×480. Paneles: 320px de ancho (exporta a 640px). Emotes: 28, 56 y 112px. Insignias de suscriptor: 18, 36 y 72px. `StreamScene` y `ChannelBanner` son lienzos de tamaño fijo que se escalan al ancho disponible, o a `scale` si se lo das.
- **Movimiento.** Es la excepción acotada a "sin animaciones decorativas": lo que aparece o se va (una alerta, el último mensaje del chat, la primera fila de eventos) entra en 250 ms con fundido y 8px de subida, y sale en 200 ms. Con `prefers-reduced-motion`, solo fundido. No hay ecualizadores, bucles ni brillos; la cuenta atrás y las barras solo cambian cuando cambia el dato.
- **Color.** Un solo acento, el índigo: `bg-brand-solid` en los iconos de alerta y el relleno de las barras, `fg-brand-primary` en los puntos. El rol de cada usuario en el chat usa las escalas `utility-*`, que en oscuro dan fondo oscuro y texto claro. "En directo" no va en rojo: en el sistema el rojo es error.
- **Texto.** La voz de la suite (cercana, humor seco, una broma por pantalla), en castellano de España y sin emojis. Cifras con formato español (`1.284`, `5,00 €`). Las cifras de reloj van en Geist tabular y no en Bricolage, que las tiene de ancho variable.
- **En OBS.** El flujo es el de la suite: implementa cada componente en Astro o Next con Tailwind sobre estos tokens y úsalo como fuente de navegador con fondo transparente. El bundle de aquí solo sirve para verlos. `ChatBox` con `translucent` usa `color-mix` y `backdrop-filter`; en un OBS con un Chromium antiguo cae al fondo sólido.

## Marca

No hay logotipo propio de jotis.me en el archivo: en la cabecera de cada app, escribe "jotis.me" en Bricolage Grotesque bold, `text-primary`. El grupo Logos guarda el logo y el logomark **Yoruverse** que trae el archivo (marca índigo con luna), con una versión de tinta blanca para fondos oscuros; úsalos solo si la app forma parte de Yoruverse.

### Iconos de app

Cada app de la suite tiene un icono de la misma familia: baldosa con las dos primeras letras del nombre, mayúscula + minúscula, en el tono de la app. La construcción no cambia nunca; el color sí. Componente `AppIcon`; SVG listos en el grupo App icons.

| App | Letras | Tono |
|---|---|---|
| Ornatus | Or | `indigo` |
| Vinculum | Vi | `sky` |
| Pecunia | Pe | `emerald` |
| Emptor | Em | `orange` |
| Regula | Re | `chartreuse` |

**Rasgos de la familia.** Tres cosas, siempre juntas, que distinguen un icono de jotis.me de cualquier baldosa oscura con letras:
- **Esquina.** Tres esquinas con radio del 22,5 % del lado y la inferior izquierda casi recta (6/128). Es la silueta de la familia y no depende del color.
- **Dos tonos.** La mayúscula en el tono claro y la minúscula en el medio.
- **Virgulilla.** Una tilde (~) centrada bajo las letras, del tono medio. Es simétrica respecto a su centro: sube a la izquierda y baja a la derecha, a partes iguales. Tiene siempre el mismo tamaño, sea cual sea el nombre: no se adapta a las letras. Es además un guiño al castellano, la ñ de la marca.

**Construcción** (sobre el lado L):
- Bricolage Grotesque SemiBold (600), tamaño óptico 14, cuerpo al 47 % de L, tracking −3 %.
- Horizontal: centrado por la caja de avance, incluido el tracking final.
- Vertical: línea base al 62,5 % de L con virgulilla y al 66,4 % sin ella. La virgulilla va 11/128 por debajo de la línea base, mide 40/128 de largo (fijo), trazo de 3,6/128 con extremos redondos y una amplitud de unos 3/128.
- En los SVG las letras van en curvas: no dependen de la fuente instalada.

**Variantes** (tono T de la paleta v4 de Tailwind, o `chartreuse`):

| Variante | Fondo | Mayúscula / minúscula / virgulilla | Uso |
|---|---|---|---|
| Principal | `T-950` | `T-300` / `T-500` / `T-500` | El icono de la app, en claro y en oscuro |
| Sólido | `T-600` | blanco / blanco / sin virgulilla | Favicon y tamaños pequeños: el 950 se empasta en pestañas oscuras |
| Claro | `T-50` + borde 1px `T-200` | `T-800` / `T-600` / `T-600` | Dentro de la interfaz clara (selector de apps, ajustes, documentación) |
| Mono | `neutral-950` | blanco / `neutral-400` / `neutral-400` | Contextos de un solo color, sobre fondo claro (en oscuro se funde) |

- **Tamaños:** 16, 20, 24, 32, 48, 64, 96 y 128 px. La virgulilla solo se dibuja desde 32px; por debajo queda la esquina y los dos tonos. Por debajo de 20px, si no pasas `variant`, sale `solid`.
- **PWA:** icono `maskable` a sangre, sin radio ni esquina, con la variante principal. Las letras y la virgulilla caen dentro de la zona segura. En el manifest, `any` es el principal y `maskable` el maskable. `apple-touch-icon` es el maskable a 180px.
- **El tono de la app solo vive en su icono** (y en el favicon). La interfaz de todas las apps sigue en `brand` índigo: el icono identifica la app, no la tiñe.
- **No:** degradados, sombras, contorno en las letras, tres letras, pictogramas dentro, otra fuente, ni una virgulilla distinta (nada de sonrisas ni subrayados rectos).
- **App nueva:**
  - Letras: las dos primeras del nombre. Si coinciden con otra app, la primera más la siguiente consonante.
  - Tono: uno de la paleta que no esté usado ni sea vecino de uno usado.
  - Nunca `red`, que es error.
  - Tampoco `yellow`, porque el blanco sobre `yellow-600` no llega a 3:1.
  - Ni grises: la variante mono ya es la gris.
  - Si ningún tono de Tailwind cumple lo anterior, la suite tiene escala propia: `chartreuse` (Regula).

**`chartreuse`, la paleta propia.** Verde amarillento en el hueco de tono entre `yellow` y `lime` (tono OKLCH ≈ 112–122), con la misma escalera de luminosidad que las demás: 50 `#fafde6`, 100 `#f4f9c3`, 200 `#eaf389`, 300 `#dce930`, 400 `#cada00`, 500 `#b1c300`, 600 `#829500`, 700 `#627200`, 800 `#4c5a00`, 900 `#404d0f`, 950 `#222b06`. Es más amarilla que `lime` (`#7ccf00` en 500) y no es neutra como `olive`. Contrastes de los iconos de Regula: mayúscula 300 sobre 950, 11,1:1; minúscula 500 sobre 950, 7,5:1; blanco sobre 600 (sólido), 3,4:1; 800 sobre 50 (claro), 7,3:1. En los tokens va como `utility-chartreuse-50…700`. Como no viene en Tailwind, el `theme.css` de las apps necesita las once variables `--color-chartreuse-50` … `--color-chartreuse-950` dentro de `@theme`; con eso Tailwind v4 genera `bg-chartreuse-600` y compañía. Blanco sobre `chartreuse-600` no pasa de 3,4:1: sirve para iconos y letras grandes, no para texto corrido.

## Con Tailwind v4 (Next o Astro)

El código de las apps parte del `theme.css` oficial de Untitled UI con la marca en índigo, y este sistema usa sus mismos nombres y valores (paleta v4; aquí los colores van en sRGB y el código usa los oklch de Tailwind, sin diferencia visible). Si algo choca con una ficha, manda el `theme.css`.

- **Colores.** Cada token es la utilidad del mismo nombre: `bg-primary`, `bg-brand-solid`, `text-secondary`, `text-brand-secondary`, `border-secondary`, `text-fg-quaternary`, `ring-brand`, `bg-utility-brand-50`. Nada de hex ni de paleta cruda (`bg-indigo-600`) en los componentes.
- **Oscuro.** Clase `.dark-mode` en un ancestro (la variante `dark:` está redefinida así).
- **Transparencias.** `alpha-white-10…100` y `alpha-black-10…100` son `bg-alpha-white/10`, `border-alpha-black/20`…
- **Radios y desenfoque.** Mismos nombres: `rounded-lg` = `radius-lg` = 8px; `backdrop-blur-lg` = 16px.
- **Espaciado.** Los nombres del sistema son la escala numérica de Tailwind, px ÷ 4: `spacing-xs` (4) = `1`, `spacing-md` (8) = `2`, `spacing-lg` (12) = `3`, `spacing-xl` (16) = `4`, `spacing-2xl` (20) = `5`, `spacing-3xl` (24) = `6`, `spacing-4xl` (32) = `8`, `spacing-5xl` (40) = `10`, `spacing-6xl` (48) = `12`. Contenedor: `max-w-container` (1280).
- **Tipografía.** `text-xs` … `text-xl` y `text-display-xs` … `text-display-2xl` ya existen en el tema; familias `font-body`, `font-display` y `font-mono` (Geist, Bricolage Grotesque, Geist Mono).
- **Componentes.** Uno por fichero en `components/`, con clases de Tailwind sobre estos tokens. La ficha del componente manda en props, estados y reglas de uso; la vista previa, en el aspecto.

## Uso en el propio sistema

El bundle de abajo solo existe para ver las vistas previas y probar componentes aquí; las apps no lo importan.

Carga `tokens.css`, `components/bundle.css`, React 18 y `components/bundle.js`; los componentes quedan en `window.Jotis` (`Jotis.Button`, `Jotis.Input`, `Jotis.Table`…). Envuelve la app en un elemento con la clase `jm-root` y pon `data-theme="dark"` en `<html>` para el tema oscuro. Cada componente tiene su ficha con props, cuándo usarlo y qué evitar.

Las notas de uso de tokens y componentes resumen, con palabras propias, la documentación del archivo de Figma.

**Gráficas.** Las series usan, en este orden, `utility-brand-600`, `utility-brand-400`, `utility-brand-200`, `utility-sky-500`, `utility-pink-500`, `utility-neutral-400`. En oscuro la escala de marca se invierte, como en el archivo: la tercera serie queda oscura sobre fondo oscuro, así que con tres o más series añade siempre leyenda.

**Pendiente de importar.** Del archivo quedan fuera, a propósito, los componentes de marketing (cabeceras, pricing, footers…) y los ejemplos de páginas. De lo que sí está, algunas variantes no: calendario en vista semana y día; color picker con degradados, imagen y modelos RGB/HSL; gráficas de radar y gauge. Tampoco los mockups de dispositivo (portátil, móvil, pantallas: llevan capturas de demostración ajenas) ni el patrón tech grid (1,8 MB de vectores), ni los degradados ni los primitivos de color (se usan a través de los tokens semánticos). El hueco blanco del anillo de foco en modo oscuro es `#0A0A0A` (`bg-primary`); el archivo solo da el valor claro.
