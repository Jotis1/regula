# @jotis-me/tokens

## 0.8.0

### Minor Changes

- a39a147: Los iconos pasan a ser los de Untitled UI. `@jotis-me/icons` desaparece (queda obsoleto en npm) y su contenido se reparte entre los paquetes oficiales de Untitled UI (MIT) y `@jotis-me/assets`, que es nuevo. Es una versión con cambios incompatibles.

  **Qué cambia**
  - `@jotis-me/react` trae `@untitledui/icons` como dependencia y ya no depende de `@jotis-me/icons`. Las props de icono (`icon`, `iconLeading`, `iconTrailing`, `iconOnly`, `trailing`…) aceptan un componente (`iconLeading={Plus}`) o un nodo ya pintado (`iconLeading={<Plus size={16} />}`), no un nombre en cadena (`iconLeading="plus"` es ahora un error de tipos). Desaparecen `Icon`, `IconName` e `iconNames`; se exportan los tipos `IconProp`, `IconComponent` e `IconComponentProps`.
  - El icono de app (`appIconSvg`, `apps`, `validateApps`, `hues`…) está en `@jotis-me/react`, también como entrada sin React: `@jotis-me/react/app-icon`.
  - `@jotis-me/assets` publica lo que Untitled UI no trae: logos de terceros (`/logos`), iconos de pago (`/payments`), cursores (`/cursors`), trazos a mano (`/hand-drawn/*`), texturas (`/patterns/*`) y los ficheros de favicon y PWA de cada app (`/app-icons/*`), con los mismos nombres de fichero.
  - La web: las cards de `/components/` vuelven a mostrar una captura, el ejemplo interactivo ya no tiene la fila «Tipos» (todo se cambia con los controles de propiedades, que ahora también ofrecen los valores del Figma que antes solo daban los atajos) y las galerías de `/icons/` leen de los paquetes nuevos.

  **Cómo migrar**

  | Antes (`0.7`)                                                 | Ahora                                                                           |
  | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
  | `icon="search-lg"`, `iconLeading="plus"`                      | `icon={SearchLg}`, `iconLeading={Plus}` (de `@untitledui/icons`)                |
  | `<Icon name="calendar" title="Fecha" />`                      | `<Calendar role="img" aria-label="Fecha" aria-hidden="false" />`                |
  | `<Icon name="loading-02" spin />`                             | `<Loading02 className="animate-spin motion-reduce:animate-none" />`             |
  | `IconRocket02` de `@jotis-me/icons`                           | `Rocket02` de `@untitledui/icons`                                               |
  | `@jotis-me/icons/svg/*.svg`                                   | Sin SVG sueltos: los iconos son componentes y en Astro se pintan en el servidor |
  | `@jotis-me/icons/logos`, `/payments`, `/cursors`              | `@jotis-me/assets/logos`, `/payments`, `/cursors`                               |
  | `@jotis-me/icons/app-icons/*`, `/hand-drawn/*`, `/patterns/*` | `@jotis-me/assets/app-icons/*`, `/hand-drawn/*`, `/patterns/*`                  |
  | `appIconSvg` de `@jotis-me/icons/app-icon`                    | `appIconSvg` de `@jotis-me/react/app-icon`                                      |
  | `FlagSpainCircle` de `@jotis-me/icons/flags`                  | `FlagEs` de `@untitledui/country-flags` (código ISO, solo en círculo)           |
  | `FileDocumentPdf` de `@jotis-me/icons/files`                  | `<FileIcon type="pdf" />` de `@untitledui/file-icons`                           |

  `bun run scripts/migrate-icons.ts <rutas>` (en el repo de Regula) hace el cambio de nombres por componentes: pasa `icon="x"` a `icon={X}` y `<Icon name="x" />` a `<X />` con su importación.

  **Dos cosas a tener en cuenta**
  - Un componente es una función y no cruza de un Server Component de Next.js, ni de un `.astro` a una isla (`client:*`): ahí pasa el nodo (`<Plus size={16} />`) o monta el componente en un `.tsx` de cliente. Un nodo se pinta con su propio tamaño: ponle `size`.
  - Se eliminan sin sustituto: las banderas en cuadrado y rectángulo (Untitled UI solo trae el círculo, 234 frente a las 261 de antes), las variantes de carpeta (marca, gris, ruido, transparente, abierta y cerrada) y los iconos de archivo que `@untitledui/file-icons` no tiene. Tres iconos de línea no existen en `@untitledui/icons`: `align-top-01` (`AlignTopArrow01`), `align-top-02` (`AlignTopArrow02`) y `help-hexagon` (`HelpOctagon`, el más parecido).
- 5105804: Nueva clase `light-mode`, la pareja de `dark-mode`: devuelve los tokens de color y de sombra a su valor claro dentro de su contenedor, para enseñar un trozo claro dentro de una página oscura. La variante `dark:` de `theme.css` deja de aplicarse dentro de un `light-mode`. Un `dark-mode` dentro de un `light-mode` no está soportado.

## 0.7.0

No changes in this release.

## 0.6.0

No changes in this release.

## 0.5.0

No changes in this release.

## 0.4.0

No changes in this release.

## 0.3.0

No changes in this release.

## 0.2.0

No changes in this release.

## 0.1.0

### Minor Changes

- 060d186: Primera versión pública del sistema de diseño de la suite jotis.me: tokens semánticos en claro y oscuro con su tema de Tailwind v4 y las fuentes de la suite; los 81 iconos de línea como componentes React y SVG sueltos, con los iconos de app y los adornos; y los 74 componentes de la guía en React, compatibles con Next.js (App Router) y Astro.
