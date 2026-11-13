---

name: AppStoreBadge
description: "Insignia de Google Play, App Store, Mac App Store, Galaxy Store o AppGallery, como enlace a la app."
interactive: false
---

**Props.** `store` (`google-play` · `app-store` · `mac-app-store` · `galaxy-store` · `app-gallery`), `href`, `logo` (obligatorio: el dibujo de la insignia), `size` (`md` 40 · `lg` 44; el ancho sigue la proporción) y `label`. El resto de props pasan al `<a>`.

**Visual.** Los dibujos del Figma (`Mobile app store badge`, `1303:2162`), en `@jotis-me/assets/logos`: `StoreGooglePlayLogo`, `StoreAppStoreLogo`, `StoreMacAppStoreLogo`, `StoreGalaxyStoreLogo` y `StoreAppGalleryLogo` en relleno (negro con borde gris), y sus `…OutlineLogo` en contorno, de un solo color que toma el del texto (`text-primary`: negro en claro, blanco en oscuro). Los textos de las insignias van en inglés, como las oficiales.

**Uso.** En la portada o en la página de descarga, en fila, del mismo tamaño. El paquete no importa los dibujos: se pasan por `logo`. Relleno sobre fondos claros u oscuros; contorno cuando el negro pesa demasiado.

**Accesibilidad.** Es un enlace cuyo nombre es la tienda («App Store»), contenido en el texto de la insignia; `label` lo cambia («Descárgala en App Store»). El dibujo es decorativo. Foco con el anillo de la marca.
