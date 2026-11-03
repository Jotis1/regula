// Traduce al castellano las notas de uso de tokens.json (la guía las trae en inglés).
// Parte siempre del original congelado (reference/tokens.json) y escribe src/tokens.json.
// Uso: bun run scripts/translate-usage.ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const source = JSON.parse(readFileSync(join(root, "../../reference/tokens.json"), "utf8"));

const STEP_PREFIX: Record<string, string> = {
	"Gray badges, tags and avatar fallbacks": "Badges, tags y avatares sin foto en gris",
	"Brand badges, dots and charts (same hues as indigo)":
		"Badges, puntos y gráficas de marca (mismos tonos que indigo)",
	"Secondary badge colour for neutral categories": "Color secundario de badge para categorías neutras",
	"Error badges and negative chart series": "Badges de error y series negativas en gráficas",
	"Badges and chart series": "Badges y series de gráficas",
	"Warning badges": "Badges de aviso",
	"Success badges and positive chart series": "Badges de éxito y series positivas en gráficas",
	"Informational badges and chart series": "Badges informativos y series de gráficas",
};
const STEP_ROLE: Record<string, string> = {
	"badge fill": "relleno del badge",
	"hover fill": "relleno en hover",
	"badge border": "borde del badge",
	border: "borde",
	"chart/dot": "gráfica o punto",
	dot: "punto",
	icon: "icono",
	"badge text": "texto del badge",
	"strong text": "texto fuerte",
	"strongest text": "texto más fuerte",
};

const EXACT: Record<string, string> = {
	"Body copy and headings on bg-primary, bg-secondary and bg-tertiary.":
		"Texto y titulares sobre bg-primary, bg-secondary y bg-tertiary.",
	"Headings on bg-brand-solid and bg-brand-section.": "Titulares sobre bg-brand-solid y bg-brand-section.",
	"Labels, button text on secondary buttons, table headers. On bg-primary and bg-secondary.":
		"Etiquetas, texto de botones secundarios, cabeceras de tabla. Sobre bg-primary y bg-secondary.",
	"Secondary copy on bg-brand-section.": "Texto secundario sobre bg-brand-section.",
	"Supporting text, hints, tertiary buttons. On bg-primary and bg-secondary.":
		"Texto de apoyo, pistas, botones terciarios. Sobre bg-primary y bg-secondary.",
	"Supporting text on bg-brand-section.": "Texto de apoyo sobre bg-brand-section.",
	"Low-emphasis meta text (timestamps, captions). 4.7:1 on bg-primary in light; keep it off bg-tertiary.":
		"Metadatos de poco peso (horas, pies de foto). 4,7:1 sobre bg-primary en claro; no lo uses sobre bg-tertiary.",
	"Meta text on bg-brand-section.": "Metadatos sobre bg-brand-section.",
	"Text on bg-brand-solid, bg-error-solid and bg-primary-solid (tooltips).":
		"Texto sobre bg-brand-solid, bg-error-solid y bg-primary-solid (tooltips).",
	"Input placeholders on bg-primary (4.7:1 light, 4.2:1 dark: below 4.5 in dark, kept as the source has it). Never for real content.":
		"Placeholders de inputs sobre bg-primary (4,7:1 en claro, 4,2:1 en oscuro: por debajo de 4,5 en oscuro, se mantiene como en el archivo). Nunca para contenido real.",
	"Brand-tinted headings on bg-brand-primary (10.3:1 light, 4.4:1 dark: use 18px+ in dark).":
		"Titulares en tono de marca sobre bg-brand-primary (10,3:1 en claro, 4,4:1 en oscuro: en oscuro, a 18px o más).",
	"Link-colour buttons and inline links on bg-primary.":
		"Botones link-color y enlaces en el texto sobre bg-primary.",
	"Brand accents in small text: required asterisks, active nav labels.":
		"Acentos de marca en texto pequeño: asteriscos de campo obligatorio, etiquetas de navegación activas.",
	"Brand accent that must stay readable on dark surfaces.":
		"Acento de marca que tiene que leerse sobre superficies oscuras.",
	"Error messages under inputs, destructive link buttons.":
		"Mensajes de error bajo los inputs, botones link destructivos.",
	"Warning copy. 2.9:1 on bg-primary in light: use for 24px+ or pair it with an icon and a word.":
		"Texto de aviso. 2,9:1 sobre bg-primary en claro: úsalo a 24px o más, o junto a un icono y una palabra.",
	"Success copy and positive trends. 3.2:1 on bg-primary in light: use for bold or large text, or next to an icon.":
		"Texto de éxito y tendencias positivas. 3,2:1 sobre bg-primary en claro: para texto en negrita o grande, o junto a un icono.",
	"Borders of inputs, secondary buttons, checkboxes. 1.5:1 on bg-primary (1.9:1 dark), under the 3:1 control-border floor: the source relies on the shadow and label to mark fields; keep labels on every input.":
		"Bordes de inputs, botones secundarios y checkboxes. 1,5:1 sobre bg-primary (1,9:1 en oscuro), por debajo del 3:1 para bordes de control: el archivo confía en la sombra y la etiqueta para marcar los campos; pon etiqueta en todos los inputs.",
	"Dividers, card and table borders.": "Separadores y bordes de tarjetas y tablas.",
	"Borders of floating surfaces (notifications, menus).":
		"Bordes de superficies flotantes (notificaciones, menús).",
	"Faint dividers inside dense lists.": "Separadores tenues dentro de listas densas.",
	"Focused input border (2px), selected radio cards.":
		"Borde del input con foco (2px), tarjetas de radio seleccionadas.",
	"Brand outline that turns neutral in dark mode.": "Contorno de marca que pasa a neutro en modo oscuro.",
	"Focused input in error.": "Input con error y con foco.",
	"Input in error at rest, destructive secondary buttons.":
		"Input con error en reposo, botones secundarios destructivos.",
	"Strongest icon colour.": "El color de icono más fuerte.",
	"Icons beside text-secondary.": "Iconos junto a text-secondary.",
	"Icons in nav items and toolbars.": "Iconos de ítems de navegación y barras de herramientas.",
	"Decorative icons inside inputs, help icons, chevrons. 2.6:1 on bg-primary in light and 2.5:1 in dark: decoration only, never the sole carrier of meaning.":
		"Iconos decorativos dentro de inputs, iconos de ayuda, chevrons. 2,6:1 sobre bg-primary en claro y 2,5:1 en oscuro: solo decoración, nunca lo único que transmite el significado.",
	"Icons on solid brand/error fills; toggle knob.":
		"Iconos sobre rellenos sólidos de marca o de error; mando del toggle.",
	"Progress fills, active indicators, brand icons.":
		"Relleno de progreso, indicadores activos, iconos de marca.",
	"Underline of the current tab.": "Subrayado de la pestaña actual.",
	"Secondary brand marks (badge dots).": "Marcas de marca secundarias (puntos de badge).",
	"Brand mark that goes neutral in dark mode.": "Marca de marca que pasa a neutro en modo oscuro.",
	"Error icons.": "Iconos de error.",
	"Softer error marks.": "Marcas de error más suaves.",
	"Warning icons.": "Iconos de aviso.",
	"Softer warning marks.": "Marcas de aviso más suaves.",
	"Success icons, positive trend arrows.": "Iconos de éxito, flechas de tendencia positiva.",
	"Online status dots.": "Puntos de estado en línea.",
	"Page and card background. The default ground.": "Fondo de página y de tarjetas. El fondo por defecto.",
	"Raised surfaces that must separate from the page in dark mode (modals, alerts, menus).":
		"Superficies elevadas que tienen que separarse de la página en modo oscuro (modales, alertas, menús).",
	"Hover row/item on bg-primary.": "Hover de filas e ítems sobre bg-primary.",
	"Tooltips and inverse chips. Pair with text-white.": "Tooltips y chips invertidos. Con text-white.",
	"Section backgrounds, table header rows, app shell.":
		"Fondos de sección, cabecera de tablas, shell de la app.",
	"Secondary ground that matches the page in dark mode.":
		"Fondo secundario que coincide con la página en modo oscuro.",
	"Hover on bg-secondary.": "Hover sobre bg-secondary.",
	"Neutral solid fills (avatar placeholders, gray featured icons).":
		"Rellenos sólidos neutros (avatares sin foto, iconos destacados grises).",
	"Toggle track (off), skeletons, quiet chips.": "Pista del toggle (apagado), skeletons, chips discretos.",
	"Progress and slider track.": "Pista de la barra de progreso y del slider.",
	"Modal backdrop, at 70% opacity with backdrop-blur-lg.":
		"Fondo de los modales, al 70 % de opacidad con backdrop-blur-lg.",
	"Light brand wash behind brand text.": "Tinte claro de marca detrás de texto de marca.",
	"Current tab (button brand), selected nav item.":
		"Pestaña actual (button-brand), ítem de navegación seleccionado.",
	"Featured icon (light) behind brand icons.": "Icono destacado (light) detrás de iconos de marca.",
	"Primary buttons, checked checkbox/radio/toggle. Pair with text-white (6.5:1).":
		"Botones primarios, checkbox, radio y toggle marcados. Con text-white (6,5:1).",
	"Full-width brand bands (CTA sections).":
		"Bandas de marca a todo el ancho (secciones de llamada a la acción).",
	"Inner panels inside a brand section.": "Paneles interiores dentro de una sección de marca.",
	"Error banners and tinted error rows.": "Banners de error y filas con tinte de error.",
	"Featured icon (light) behind error icons.": "Icono destacado (light) detrás de iconos de error.",
	"Destructive primary buttons. Pair with text-white (4.8:1).":
		"Botones primarios destructivos. Con text-white (4,8:1).",
	"Warning banners.": "Banners de aviso.",
	"Featured icon (light) behind warning icons.": "Icono destacado (light) detrás de iconos de aviso.",
	"Solid warning fill. Text on it: text-primary, not white (2.9:1 with white).":
		"Relleno sólido de aviso. Texto encima: text-primary, no blanco (2,9:1 con blanco).",
	"Success banners.": "Banners de éxito.",
	"Featured icon (light) behind success icons.": "Icono destacado (light) detrás de iconos de éxito.",
	"Solid success fill. White on it is 3.2:1: only for bold 14px+ or icons.":
		"Relleno sólido de éxito. El blanco encima da 3,2:1: solo para negrita de 14px o más, o iconos.",
	"Focus ring colour (4px outer ring, 2px gap in bg-primary).":
		"Color del anillo de foco (anillo exterior de 4px, hueco de 2px en bg-primary).",
	"Focus ring on a field in error.": "Anillo de foco en un campo con error.",
	"Avatar placeholder fill behind initials.": "Relleno del avatar sin foto, detrás de las iniciales.",
	"Icon inside a light brand featured icon.": "Icono dentro de un icono destacado light de marca.",
	"Icon inside a light gray featured icon.": "Icono dentro de un icono destacado light gris.",
	"Icon inside a light error featured icon.": "Icono dentro de un icono destacado light de error.",
	"Icon inside a light warning featured icon (2.7:1 light, 2.5:1 dark on bg-warning-secondary: pair with a title).":
		"Icono dentro de un icono destacado light de aviso (2,7:1 en claro, 2,5:1 en oscuro sobre bg-warning-secondary: acompáñalo de un título).",
	"Icon inside a light success featured icon (2.9:1 light, 2.7:1 dark on bg-success-secondary: pair with a title).":
		"Icono dentro de un icono destacado light de éxito (2,9:1 en claro, 2,7:1 en oscuro sobre bg-success-secondary: acompáñalo de un título).",
	"Standalone brand-coloured icons.": "Iconos sueltos en color de marca.",
	"Icons on bg-brand-section.": "Iconos sobre bg-brand-section.",
	"Slider knob fill.": "Relleno del mando del slider.",
	"Slider knob border (2px).": "Borde del mando del slider (2px).",
	"Slim toggle knob border when off.": "Borde del mando del toggle fino cuando está apagado.",
	"Slim toggle knob border when on.": "Borde del mando del toggle fino cuando está encendido.",
	"Slim toggle knob border when on and hovered.": "Borde del mando del toggle fino encendido y con hover.",
	"Second line of a tooltip, on bg-primary-solid.": "Segunda línea de un tooltip, sobre bg-primary-solid.",
	"Inactive toolbar icons in a text editor.": "Iconos inactivos de la barra de un editor de texto.",
	"Active toolbar icon in a text editor.": "Icono activo de la barra de un editor de texto.",
	"Footer links on bg-brand-section.": "Enlaces del pie sobre bg-brand-section.",
	"Footer links on hover.": "Enlaces del pie con hover.",
	"Pressed or active state of rows and items on bg-primary.":
		"Estado pulsado o activo de filas e ítems sobre bg-primary.",
	"Inputs, badge modern, secondary buttons (flat).": "Inputs, badge modern, botones secundarios (planos).",
	"Buttons and featured icons (modern). The inner edge gives the subtle 3D look; dark mode keeps only the inner edge.":
		"Botones e iconos destacados (modern). El borde interior da el leve relieve; en oscuro solo queda el borde interior.",
	"Toggle knob, selected segmented tab.":
		"Mando del toggle, pestaña seleccionada de un control segmentado.",
	"Cards that lift on hover.": "Tarjetas que se elevan con hover.",
	"Dropdown menus, tooltips, notifications.": "Menús desplegables, tooltips, notificaciones.",
	"Modals.": "Modales.",
	"Slideouts, command menus.": "Slideouts, menús de comandos.",
	"Hero mockups.": "Maquetas de cabecera.",
	"Keyboard focus on any control: 2px gap in bg-primary, then 4px of focus-ring.":
		"Foco de teclado en cualquier control: hueco de 2px en bg-primary y después 4px de focus-ring.",
	"Keyboard focus on a destructive control or a field in error.":
		"Foco de teclado en un control destructivo o un campo con error.",
	"No gap.": "Sin separación.",
	"Label to asterisk, title to subtitle in tight stacks.":
		"De etiqueta a asterisco, de título a subtítulo en bloques apretados.",
	"Icon to text inside buttons (xs–md), stacked text and supporting text.":
		"De icono a texto en botones (xs–md), texto apilado y texto de apoyo.",
	"Label to input, icon to text in lg/xl buttons, dot to badge text.":
		"De etiqueta a input, de icono a texto en botones lg/xl, de punto a texto del badge.",
	"Input inner gap, avatar to label, tag groups.":
		"Hueco interior de inputs, de avatar a etiqueta, grupos de tags.",
	"Button rows, checkbox to label (md), modal action gap.":
		"Filas de botones, de checkbox a etiqueta (md), hueco entre acciones de un modal.",
	"Card padding (compact), alert padding, form field gap.":
		"Padding de tarjeta (compacta), padding de alertas, hueco entre campos.",
	"Form sections, card padding.": "Secciones de formulario, padding de tarjetas.",
	"Modal padding, card padding (comfortable).": "Padding de modales, padding de tarjeta (holgada).",
	"Page gutters on desktop, section stacks inside a page.":
		"Márgenes de página en escritorio, bloques de sección dentro de una página.",
	"Between page sections.": "Entre secciones de una página.",
	"Large section gaps.": "Separaciones grandes entre secciones.",
	"Marketing section padding (mobile).": "Padding de secciones de marketing (móvil).",
	"Marketing section padding.": "Padding de secciones de marketing.",
	"Marketing section padding (desktop).": "Padding de secciones de marketing (escritorio).",
	"Hero padding.": "Padding de cabeceras grandes.",
	"Hero padding (large).": "Padding de cabeceras grandes (amplio).",
	"Horizontal page padding under 768px.": "Padding horizontal de página por debajo de 768px.",
	"Horizontal page padding from 768px.": "Padding horizontal de página desde 768px.",
	"Tables and full-bleed media.": "Tablas e imágenes a sangre.",
	"Tiny marks (tooltip arrow).": "Marcas diminutas (flecha del tooltip).",
	"Checkbox sm, progress bars.": "Checkbox sm, barras de progreso.",
	"Badges (badge type), tags, checkbox md, tab buttons, nav items.":
		"Badges (tipo badge), tags, checkbox md, pestañas de botón, ítems de navegación.",
	"Buttons, inputs, tooltips, dropdown items, featured icons, button groups.":
		"Botones, inputs, tooltips, ítems de menú, iconos destacados, grupos de botones.",
	"Cards, alerts, notifications, radio cards, menus.":
		"Tarjetas, alertas, notificaciones, tarjetas de radio, menús.",
	"Modals, large cards.": "Modales, tarjetas grandes.",
	"Marketing media frames.": "Marcos de imágenes de marketing.",
	"Pills, avatars, toggles, dots.": "Pills, avatares, toggles, puntos.",
	"Narrow panels, tooltips with supporting text, notifications column.":
		"Paneles estrechos, tooltips con texto de apoyo, columna de notificaciones.",
	"Small modals and popovers.": "Modales pequeños y popovers.",
	"Modals (default), slideouts.": "Modales (por defecto), slideouts.",
	"Medium modals, auth forms.": "Modales medianos, formularios de acceso.",
	"Large modals, settings forms.": "Modales grandes, formularios de ajustes.",
	"Single-column content.": "Contenido a una columna.",
	"Two-column app content.": "Contenido de app a dos columnas.",
	"App max width.": "Ancho máximo de la app.",
	"Wide dashboards.": "Paneles anchos.",
	"Extra-wide layouts.": "Maquetaciones muy anchas.",
	"Full HD canvas.": "Lienzo Full HD.",
	"Max line length for reading text.": "Ancho máximo de línea para texto de lectura.",
	"Max width of the page container.": "Ancho máximo del contenedor de página.",
	"Sticky headers.": "Cabeceras fijas.",
	"Modal backdrop.": "Fondo de los modales.",
	"Glass panels.": "Paneles de cristal.",
	"Hero overlays.": "Capas sobre cabeceras grandes.",
	"Hero headline, one per page.": "Titular principal, uno por página.",
	"Landing headline.": "Titular de página de aterrizaje.",
	"Section hero.": "Cabecera de sección.",
	"Page title on marketing pages.": "Título de página en páginas de marketing.",
	"Page title inside the app (page header).": "Título de página dentro de la app (cabecera de página).",
	"Modal titles on desktop, card headlines, metric values.":
		"Títulos de modal en escritorio, titulares de tarjeta, cifras destacadas.",
	"Lead paragraphs, section subtitles.": "Párrafos de entrada, subtítulos de sección.",
	"Section headers, modal titles on mobile.": "Cabeceras de sección, títulos de modal en móvil.",
	"Default body, input values, md checkbox labels.":
		"Texto de lectura por defecto, valores de inputs, etiquetas de checkbox md.",
	"UI default: buttons, labels, table cells, hints.":
		"Por defecto en la interfaz: botones, etiquetas, celdas de tabla, pistas.",
	"Badges sm, tags, tooltips, captions.": "Badges sm, tags, tooltips, pies de foto.",
	"Code snippets and inline code. Geist Mono, same family as the body text.":
		"Bloques de código y código en línea. Geist Mono, de la misma familia que el texto.",
	"Inline code inside small text.": "Código en línea dentro de texto pequeño.",
};

const NOTES: Record<string, string> = {
	spacing:
		"Escala con nombre. En Tailwind usa las utilidades numéricas, px ÷ 4 (spacing-md = 8px = p-2, spacing-xl = 16px = p-4).",
	radius: "Mismos nombres y valores que Tailwind v4 en el tema de Untitled UI (rounded-md = 6px, rounded-lg = 8px).",
	width: 'De la colección "4. Widths" del archivo.',
	shadow: "Las mismas sombras en ambos temas, como en el tema de Untitled UI. Sobre fondos oscuros las exteriores casi no se ven; la separación la dan bg-primary_alt y los bordes.",
	blur: "Desenfoques de fondo (backdrop-filter). Los nombres coinciden con las utilidades backdrop-blur de Tailwind v4.",
};

/** Traduce una nota: patrones repetidos primero, después la tabla exacta. */
export function translate(en: string): string {
	const hover = en.match(/^([\w-]+) on hover\.$/);
	if (hover) return `${hover[1]} con hover.`;
	const step = en.match(/^(.+)\. Step (\d+): (.+)\.$/);
	if (step && STEP_PREFIX[step[1] as string] && STEP_ROLE[step[3] as string])
		return `${STEP_PREFIX[step[1] as string]}. Paso ${step[2]}: ${STEP_ROLE[step[3] as string]}.`;
	const white = en.match(
		/^White at (\d+)% \(flips to the dark ground in dark\)\. Overlays on images and brand sections\.$/,
	);
	if (white)
		return `Blanco al ${white[1]} % (en oscuro pasa al fondo oscuro). Capas sobre imágenes y secciones de marca.`;
	const black = en.match(/^Black at (\d+)% \(flips to white in dark\)\. Scrims and subtle borders\.$/);
	if (black) return `Negro al ${black[1]} % (en oscuro pasa a blanco). Velos y bordes sutiles.`;
	const es = EXACT[en];
	if (!es) throw new Error(`Sin traducción: «${en}»`);
	return es;
}

if (import.meta.main) {
	const out = structuredClone(source);
	let count = 0;
	for (const key of ["color", "spacing", "radius", "width", "shadow", "blur"]) {
		for (const t of out[key].tokens) {
			t.usage = translate(t.usage);
			count++;
		}
		if (out[key].note) out[key].note = NOTES[key] ?? out[key].note;
	}
	for (const group of out.type.groups)
		for (const s of group.styles)
			if (s.usage) {
				s.usage = translate(s.usage);
				count++;
			}
	writeFileSync(join(root, "src/tokens.json"), `${JSON.stringify(out, null, 1)}\n`);
	console.log(`${count} notas de uso traducidas → src/tokens.json`);
}
