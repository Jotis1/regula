// Catálogo único de la estructura de la web (design §2): qué secciones hay en la cabecera, en qué grupo va cada
// componente y en qué orden van los fundamentos. De aquí salen la navegación, el índice de componentes, las
// descripciones de la búsqueda, las migas, los relacionados y anterior/siguiente. El orden y los nombres de los
// grupos son los de la navegación del diseño (`reference/docs-design/DocNav.dc.html`).
// Los componentes se nombran como en su ficha (`name` del frontmatter); un test comprueba que cada uno de la
// colección está en un solo grupo y que ningún grupo nombra uno que no existe.

export type SectionId = "start" | "foundations" | "components" | "stream" | "icons";

export interface Section {
	id: SectionId;
	label: string;
	/** Destino de la cabecera: la primera página de la sección. */
	href: string;
}

/** Las cinco secciones de la cabecera, en orden. */
export const SECTIONS: readonly Section[] = [
	{ id: "start", label: "Empezar", href: "/start/install/" },
	{ id: "foundations", label: "Fundamentos", href: "/foundations/principles/" },
	{ id: "components", label: "Componentes", href: "/components/" },
	{ id: "stream", label: "Stream", href: "/foundations/stream/" },
	{ id: "icons", label: "Iconos", href: "/icons/" },
];

export interface Foundation {
	/** Último tramo de `/foundations/<slug>/`. */
	slug: string;
	label: string;
}

/**
 * Los fundamentos, en el orden de la guía. Stream (Twitch) no está aquí: es la guía de la sección Stream.
 * Los slugs son los de las URLs nuevas (`layout` y `states`, antes `spacing` y `shadows`).
 */
export const FOUNDATIONS: readonly Foundation[] = [
	{ slug: "principles", label: "Principios" },
	{ slug: "content", label: "Contenido y tono" },
	{ slug: "color", label: "Color" },
	{ slug: "typography", label: "Tipografía" },
	{ slug: "layout", label: "Espaciado, radios y layout" },
	{ slug: "states", label: "Sombras y estados" },
	{ slug: "iconography", label: "Iconografía" },
	{ slug: "backgrounds", label: "Fondos y adornos" },
	{ slug: "brand", label: "Marca e iconos de app" },
];

export interface ComponentGroup {
	/** Ancla en `/components/` (`/components/#acciones`). */
	id: string;
	label: string;
	/** Los cuatro grupos de Stream cuelgan de su sección, no de Componentes. */
	section: "components" | "stream";
	/** Nombres de componente, en el orden en que se muestran. */
	components: readonly string[];
}

const names = (list: string): string[] => list.split(" ");

/** Los grupos de componentes, en orden: los de aplicación primero y los cuatro de Stream al final. */
export const COMPONENT_GROUPS: readonly ComponentGroup[] = [
	{
		id: "acciones",
		label: "Acciones",
		section: "components",
		components: names("Button ButtonGroup CloseButton"),
	},
	{
		id: "formularios",
		label: "Formularios",
		section: "components",
		components: names(
			"Input Textarea Select Checkbox Radio RadioGroup Toggle Slider DatePicker FileUpload ColorPicker TextEditor",
		),
	},
	{
		id: "navegacion",
		label: "Navegación",
		section: "components",
		components: names("Tabs Breadcrumbs Pagination SidebarNav Dropdown CommandMenu TreeView FilterBar"),
	},
	{ id: "capas", label: "Capas", section: "components", components: names("Modal Slideout Tooltip") },
	{
		id: "avisos-y-carga",
		label: "Avisos y carga",
		section: "components",
		components: names("Alert Notification Banner EmptyState ProgressBar Spinner Skeleton"),
	},
	{
		id: "etiquetas-e-identidad",
		label: "Etiquetas e identidad",
		section: "components",
		components: names("Badge Tag Avatar AvatarGroup AvatarLabel FeaturedIcon Icon"),
	},
	{
		id: "datos",
		label: "Datos",
		section: "components",
		components: names("Table MetricCard ActivityFeed CalendarView"),
	},
	{
		id: "graficas",
		label: "Gráficas",
		section: "components",
		components: names("LineChart BarChart PieChart ChartLegend"),
	},
	{
		id: "estructura-de-pagina",
		label: "Estructura de página",
		section: "components",
		components: names("PageHeader CardHeader SectionHeader SectionFooter ContentDivider InlineCTA"),
	},
	{
		id: "contenido-y-medios",
		label: "Contenido y medios",
		section: "components",
		components: names("Message MessageInput CodeSnippet VideoPlayer"),
	},
	{
		id: "fondos-y-maquetas",
		label: "Fondos y maquetas",
		section: "components",
		components: names("BackgroundPattern CreditCard BrowserFrame AppIcon"),
	},
	{ id: "stream-alertas", label: "Alertas", section: "stream", components: names("StreamAlert") },
	{
		id: "stream-escenas",
		label: "Escenas",
		section: "stream",
		components: names("StreamScene StreamCountdown"),
	},
	{
		id: "stream-overlay",
		label: "Overlay",
		section: "stream",
		components: names("CamFrame ChatBox ChatBadge StreamGoal StreamEvents NowPlaying StreamStatus"),
	},
	{
		id: "stream-canal",
		label: "Canal",
		section: "stream",
		components: names("ChannelPanel ChannelBanner"),
	},
];

/** `ButtonGroup` → `button-group`: el nombre de la ficha y de su URL (`/components/<slug>/`). */
export function slugOf(name: string): string {
	return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Todos los componentes del catálogo, en el orden de la navegación. */
export function catalogComponents(): string[] {
	return COMPONENT_GROUPS.flatMap((g) => [...g.components]);
}

/**
 * La sección de la cabecera a la que pertenece una ruta, o `undefined` en la portada. La guía de Stream y los
 * componentes de los grupos de Stream son de Stream; el resto de `/components/`, de Componentes.
 */
export function sectionOf(pathname: string): SectionId | undefined {
	const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
	if (path.startsWith("/start/")) return "start";
	if (path === "/foundations/stream/") return "stream";
	if (path.startsWith("/foundations/")) return "foundations";
	if (path.startsWith("/icons/")) return "icons";
	const component = path.match(/^\/components\/([^/]+)\//)?.[1];
	if (component) return groupOf(component)?.section === "stream" ? "stream" : "components";
	if (path === "/components/") return "components";
	return undefined;
}

/** El grupo de un componente por su nombre (`Button`) o su slug (`button`). */
export function groupOf(nameOrSlug: string): ComponentGroup | undefined {
	const slug = slugOf(nameOrSlug);
	return COMPONENT_GROUPS.find((g) => g.components.some((c) => slugOf(c) === slug));
}
