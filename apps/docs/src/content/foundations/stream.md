---

title: "Stream (Twitch)"
description: "Componentes para directos: alertas, escenas, overlay y canal, siempre en oscuro."
order: 9
---

Familia de componentes para directos: alertas, escenas, overlay y canal. Sigue la misma gramática del sistema (neutro primero, índigo con intención, Geist y Bricolage) y se dibuja **siempre en oscuro**: cada raíz lleva la clase `dark-mode`, que redefine los tokens en su interior, así que se ve igual dentro de una página clara.

- **Piezas.** Alertas: `StreamAlert`. Escenas: `StreamScene` y `StreamCountdown`. Overlay: `CamFrame`, `ChatBox`, `ChatBadge`, `StreamGoal`, `StreamEvents`, `NowPlaying` y `StreamStatus`. Canal: `ChannelPanel` y `ChannelBanner`.
- **Tamaños de Twitch.** Escena y pantalla offline: 1920×1080. Banner de perfil: 1200×480. Paneles: 320px de ancho (exporta a 640px). Emotes: 28, 56 y 112px. Insignias de suscriptor: 18, 36 y 72px. `StreamScene` y `ChannelBanner` son lienzos de tamaño fijo que se escalan al ancho disponible, o a `scale` si se lo das.
- **Movimiento.** Es la excepción acotada a "sin animaciones decorativas": lo que aparece o se va (una alerta, el último mensaje del chat, la primera fila de eventos) entra en 250 ms con fundido y 8px de subida, y sale en 200 ms. Con `prefers-reduced-motion`, solo fundido. No hay ecualizadores, bucles ni brillos; la cuenta atrás y las barras solo cambian cuando cambia el dato.
- **Color.** Un solo acento, el índigo: `bg-brand-solid` en los iconos de alerta y el relleno de las barras, `fg-brand-primary` en los puntos. El rol de cada usuario en el chat usa las escalas `utility-*`, que en oscuro dan fondo oscuro y texto claro. "En directo" no va en rojo: en el sistema el rojo es error.
- **Texto.** La voz de la suite (cercana, humor seco, una broma por pantalla), en castellano de España y sin emojis. Cifras con formato español (`1.284`, `5,00 €`). Las cifras de reloj van en Geist tabular y no en Bricolage, que las tiene de ancho variable.
- **En OBS.** Monta cada pieza con `@jotis-me/react` en una página de Astro o Next con Tailwind y úsala como fuente de navegador con fondo transparente. `ChatBox` con `translucent` usa `color-mix` y `backdrop-filter`; en un OBS con un Chromium antiguo cae al fondo sólido.

## En el paquete

- **Entrada y salida sin JavaScript.** La entrada es una transición desde `@starting-style` (la variante `starting:` de Tailwind): se ve al montar el elemento. Para repetirla, móntalo de nuevo (cambia su `key`). La salida es una transición al pasar `state` a `exit`; quita el elemento cuando acabe (200 ms). En un OBS con Chromium anterior al 117 el elemento aparece sin animación.
- **Listas que crecen.** En `StreamEvents` y `ChatBox` cada fila se reconoce por su `id` o, si no lo tiene, por su contenido. Así, con `animate`, cuando entra un evento o un mensaje solo se anima ese, aunque la lista vaya llena y salga el más antiguo.
- **Lo que escribe el público.** `message` de `StreamAlert` y `text` de `ChatBox` son texto (`string`) y se pintan tal cual, nunca como HTML. Modéralos antes.
- **Servidor y cliente.** Todos son componentes de servidor salvo `StreamCountdown`, que cuenta el tiempo. `StreamScene` y `ChannelBanner` también son de servidor: solo su lienzo, que mide el contenedor, es de cliente. Con `scale` no necesitan JavaScript; sin él, en Astro van en una isla (`client:load`), o no se ven hasta medir.
