Maqueta de tarjeta de pago (316×190, `radius-2xl`) para pantallas de métodos de pago, onboarding o capturas de marketing.

**Props.** `theme` (`brand-dark` · `brand-light` · `gray-dark` · `gray-light` · `transparent`), `company` (texto arriba a la izquierda, en Bricolage), `holder`, `expiry`, `last4`, `network` (texto opcional abajo a la derecha). Siempre muestra solo los cuatro últimos dígitos.

**Visual.** `brand-dark`: degradado #312C85 → #432DD7, texto blanco. `gray-light`: #F5F5F5 con texto #404040. `transparent`: cristal con desenfoque, para poner sobre un degradado o una imagen. Número medium 16, titular y caducidad semibold 12. El borde degradado blanco (1 → 0,2) da el canto.

**Reglas.** Los colores son fijos: la tarjeta es un objeto, no cambia con el tema. No dibujes logotipos de redes de pago; usa `network` con texto si hace falta. Tiene `role="img"` y una etiqueta que resume los datos.
