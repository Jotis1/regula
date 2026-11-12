---

name: CreditCard
description: "Maqueta de tarjeta de pago (316×190) para pantallas de métodos de pago, onboarding o capturas de marketing."
interactive: false
---

**Props.** `theme` (los trece del Figma, `Credit card mockup` `1291:157837`: `brand-dark` · `brand-light` · `gray-dark` · `gray-light` · `transparent` · `transparent-gradient` · `transparent-strip` · `gray-strip` · `gradient-strip` · `salmon-strip` · `gray-strip-vertical` · `gradient-strip-vertical` · `salmon-strip-vertical`; los `*-strip` llevan una banda gris 800 abajo y los `*-strip-vertical`, a la izquierda, con la franja de color a la derecha), `company` (texto arriba a la izquierda, en Bricolage), `holder`, `expiry`, `last4`, `network` (texto opcional abajo a la derecha). Siempre muestra solo los cuatro últimos dígitos.

**Visual.** `brand-dark`: degradado #312C85 → #432DD7, texto blanco. `gray-light`: #F5F5F5 con texto #404040. `transparent`: cristal con desenfoque, para poner sobre un degradado o una imagen. Número medium 16, titular y caducidad semibold 12. El borde degradado blanco (1 → 0,2) da el canto.

**Reglas.** Los colores son fijos: la tarjeta es un objeto, no cambia con el tema. No dibujes logotipos de redes de pago; usa `network` con texto si hace falta. Tiene `role="img"` y una etiqueta que resume los datos.

**Detalles.** Funciona sin JavaScript. La etiqueta por defecto es "Tarjeta Pecunia terminada en 4821, titular Administrador, caduca 06/29"; si `company` no es texto, no entra en ella.

**Ampliación sobre la guía.** `aria-label` sustituye esa etiqueta, como el resto de textos por defecto.
