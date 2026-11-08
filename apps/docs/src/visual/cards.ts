// Tarjeta de cada ejemplo del registro: alto y si va siempre en oscuro. Módulo sin React para que lo lean también
// el generador del artefacto (scripts/artifact) y los scripts de captura.

/** Ancho de diseño de los ejemplos: el de las capturas aprobadas y el que escala la vista previa de las cards del índice. */
export const VIEWPORT_WIDTH = 800;

/**
 * Alto en px de la tarjeta de cada ejemplo: el de la captura aprobada (800 de ancho) y el de la vista previa del
 * artefacto generado (`@dsCard height`). Los 74 originales son los de la guía `9fe2`; un componente nuevo trae el suyo.
 */
export const CARD_HEIGHTS: Record<string, number> = {
	ActivityFeed: 330,
	Alert: 300,
	AppIcon: 670,
	Avatar: 140,
	AvatarGroup: 64,
	AvatarLabel: 72,
	BackgroundPattern: 520,
	TransparencyGrid: 180,
	ScaledPreview: 250,
	Badge: 150,
	Banner: 540,
	BarChart: 330,
	Breadcrumbs: 56,
	BrowserFrame: 600,
	Button: 220,
	ButtonGroup: 72,
	CalendarView: 760,
	CamFrame: 330,
	CardHeader: 120,
	ChannelBanner: 430,
	ChannelPanel: 400,
	ChartLegend: 60,
	ChatBadge: 190,
	ChatBox: 500,
	Checkbox: 170,
	CloseButton: 64,
	CodeSnippet: 260,
	ColorPicker: 420,
	CommandMenu: 520,
	ContentDivider: 200,
	CreditCard: 460,
	DatePicker: 540,
	Dropdown: 330,
	EmptyState: 280,
	FeaturedIcon: 140,
	FileUpload: 400,
	FilterBar: 120,
	Icon: 160,
	InlineCTA: 170,
	LinkCard: 250,
	Input: 540,
	LineChart: 330,
	Message: 300,
	MessageInput: 120,
	MultiSelect: 500,
	NumberInput: 214,
	TagInput: 246,
	VerificationCodeInput: 302,
	MetricCard: 190,
	Modal: 380,
	Notification: 170,
	NowPlaying: 262,
	PageHeader: 200,
	Pagination: 80,
	Pager: 200,
	PieChart: 240,
	ProgressBar: 100,
	ProgressCircle: 930,
	ProgressSteps: 880,
	Radio: 72,
	RadioGroup: 316,
	SectionFooter: 80,
	SectionHeader: 200,
	Select: 400,
	SidebarNav: 560,
	Skeleton: 120,
	Slideout: 520,
	Slider: 64,
	Spinner: 130,
	StreamAlert: 490,
	StreamCountdown: 190,
	StreamEvents: 585,
	StreamGoal: 330,
	StreamScene: 620,
	StreamStatus: 200,
	Table: 420,
	Tabs: 220,
	Tag: 72,
	Kbd: 96,
	TextEditor: 300,
	Textarea: 200,
	Toggle: 188,
	Tooltip: 170,
	CopyTooltip: 72,
	HelpIcon: 460,
	TreeView: 330,
	VideoPlayer: 400,
};

/**
 * Vistas previas que ponen la página entera en oscuro (`data-theme="dark"` en `<html>`): las de Stream, que se
 * dibujan siempre en oscuro (design §12). Su página de comparación va en oscuro también en el tema claro, y en
 * su página de componente los ejemplos van sobre fondo oscuro (StreamCountdown no tiene fondo propio: en una
 * página clara no se leería).
 */
export const DARK_PREVIEWS = new Set([
	"StreamAlert",
	"StreamEvents",
	"StreamStatus",
	"ChatBadge",
	"ChatBox",
	"CamFrame",
	"StreamGoal",
	"NowPlaying",
	"StreamCountdown",
	"StreamScene",
	"ChannelPanel",
	"ChannelBanner",
]);

/** `DatePicker` → `date-picker`. */
export const slugOf = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
