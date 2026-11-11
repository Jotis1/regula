// Muestras de las cards de /components/ (design D2): lo más característico de cada componente, con sus propios datos
// de ejemplo, como las piezas del estudio de Scaena. No son los ejemplos del registro (que enseñan todas las variantes
// y compara la paridad visual): una sola forma, quieta y legible a tamaño de miniatura (288×180). Las capas que se
// abren van en línea (`defaultOpen`, `contained`, `inline`): un portal no se pinta en el servidor.

import {
	ActivityFeed,
	Alert,
	AppIcon,
	Avatar,
	AvatarGroup,
	AvatarLabel,
	AvatarProfilePhoto,
	BackgroundPattern,
	Badge,
	BadgeGroup,
	Banner,
	BarChart,
	Breadcrumbs,
	BrowserFrame,
	Button,
	ButtonGroup,
	ButtonUtility,
	CalendarView,
	CamFrame,
	CardHeader,
	Carousel,
	ChannelBanner,
	ChannelPanel,
	ChartLegend,
	ChatBadge,
	ChatBox,
	type ChatMessage,
	Checkbox,
	CheckIcon,
	CheckItem,
	CloseButton,
	CodeSnippet,
	ColorPicker,
	CommandMenu,
	ContentDivider,
	ContextMenu,
	CreditCard,
	DatePicker,
	Dropdown,
	EmptyState,
	FeaturedIcon,
	FileUpload,
	FilterBar,
	HeaderNav,
	HelpIcon,
	Icon,
	type IconName,
	InlineCTA,
	Input,
	Kbd,
	LineChart,
	LinkCard,
	Message,
	MessageInput,
	MetricCard,
	Modal,
	MultiSelect,
	Notification,
	NowPlaying,
	NumberInput,
	PageHeader,
	Pager,
	Pagination,
	PaginationDots,
	PieChart,
	ProgressBar,
	ProgressCircle,
	ProgressSteps,
	Radio,
	RadioGroup,
	Rating,
	RatingBadge,
	ScaledPreview,
	SectionFooter,
	SectionHeader,
	SectionLabel,
	Select,
	SidebarNav,
	Skeleton,
	Slideout,
	Slider,
	Spinner,
	StreamAlert,
	StreamCountdown,
	type StreamEventItem,
	StreamEvents,
	StreamGoal,
	StreamScene,
	StreamStatus,
	Table,
	Tabs,
	Tag,
	TagInput,
	Textarea,
	TextEditor,
	Toggle,
	Tooltip,
	TransparencyGrid,
	TreeView,
	VerificationCodeInput,
	VideoPlayer,
} from "@jotis-me/react";
import type { CSSProperties, ReactNode } from "react";

export interface Thumbnail {
	/** La muestra, centrada en el escenario a su tamaño natural. */
	render: () => ReactNode;
	/** Si es más grande que el escenario, lo que se encoge desde el centro (menor que 1). */
	scale?: number;
}

const noop = () => {};
const row: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 };
const box = (width: number, height?: number): CSSProperties => ({ width, height });
/** Contenedor de las capas `contained` (Modal, Slideout, CommandMenu): se pintan dentro, no sobre la página. */
const stage = (width: number, height: number): CSSProperties => ({
	position: "relative",
	width,
	height,
	borderRadius: 12,
	overflow: "hidden",
	background: "var(--bg-secondary)",
});

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
const ICONS: IconName[] = [
	"home-line",
	"search-lg",
	"settings-02",
	"user-01",
	"bell-01",
	"calendar",
	"mail-01",
	"trash-01",
	"edit-02",
	"plus",
	"check-circle",
	"currency-euro",
];
const TEAMS = [
	{ value: "ing", label: "Ingeniería", supporting: "12 usuarios" },
	{ value: "dis", label: "Diseño", supporting: "10 usuarios" },
	{ value: "pro", label: "Producto", supporting: "6 usuarios" },
	{ value: "mkt", label: "Márketing", supporting: "8 usuarios" },
];
const CHAT: ChatMessage[] = [
	{
		user: "TioBigotes",
		tone: "sky",
		badges: ["mod"],
		text: "Bienvenidos todos, el sillón de la derecha es mío.",
	},
	{
		user: "lucia_pixel",
		tone: "pink",
		badges: ["sub", "vip"],
		text: "Esa jugada la he visto en un tutorial.",
	},
	{ user: "nachoXL", tone: "emerald", badges: ["sub"], text: "Cuenta atrás para el primer susto." },
	{ user: "ElSilencioso", tone: "neutral", text: "Llego tarde pero llego." },
];
const EVENTS: StreamEventItem[] = [
	{ type: "follow", user: "lucia_pixel", time: "ahora" },
	{ type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
	{ type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
	{ type: "resub", user: "nachoXL", months: 14, time: "12 min" },
];

const CODE = `<Button iconLeading="plus">
  Nuevo gasto
</Button>`;

interface Movimiento {
	c: string;
	ok: boolean;
	i: string;
}

export const THUMBNAILS: Record<string, Thumbnail> = {
	// Acciones
	Button: { render: () => <Button iconLeading="plus">Nuevo gasto</Button> },
	ButtonGroup: {
		render: () => (
			<ButtonGroup
				defaultValue="b"
				aria-label="Periodo"
				items={[
					{ value: "a", label: "30 días" },
					{ value: "b", label: "7 días" },
					{ value: "c", label: "24 horas", icon: "clock" },
				]}
			/>
		),
	},
	CloseButton: { render: () => <CloseButton /> },
	ButtonUtility: {
		render: () => (
			<div className="flex items-center gap-1" style={{ paddingTop: 48 }}>
				<ButtonUtility icon="copy-01" label="Copiar" tooltipOpen />
				<ButtonUtility icon="edit-02" label="Editar" />
				<ButtonUtility icon="trash-01" label="Borrar" />
			</div>
		),
	},

	// Formularios
	Input: {
		render: () => (
			<div style={box(248)}>
				<Input
					label="Correo"
					icon="mail-01"
					defaultValue="tu@jotis.me"
					hint="Solo lo usamos para avisos."
				/>
			</div>
		),
	},
	NumberInput: {
		render: () => (
			<div style={box(220)}>
				<NumberInput label="Invitados" defaultValue={2} min={1} max={12} hint="Hasta 12 personas." />
			</div>
		),
	},
	TagInput: {
		render: () => (
			<div style={box(260)}>
				<TagInput
					label="Etiquetas"
					defaultValue={["diseño", "código"]}
					hint="Enter o coma para añadir."
				/>
			</div>
		),
	},
	VerificationCodeInput: {
		render: () => <VerificationCodeInput label="Código" digits={4} size="sm" defaultValue="73" />,
	},
	Textarea: {
		render: () => (
			<div style={box(260)}>
				<Textarea
					label="Descripción"
					rows={3}
					defaultValue="Revisar el seguro del coche antes del día 15."
					hint="Máximo 280 caracteres."
				/>
			</div>
		),
	},
	Select: {
		render: () => (
			<div style={box(248)}>
				<Select
					label="Categoría"
					defaultValue="Ocio"
					options={["Hogar", "Transporte", "Ocio", "Suscripciones"]}
					hint="Para agrupar el gasto."
				/>
			</div>
		),
	},
	MultiSelect: {
		scale: 0.55,
		render: () => (
			<div style={box(300, 330)}>
				<MultiSelect
					label="Equipos"
					options={TEAMS}
					defaultValue={["ing", "dis"]}
					summarySupporting={() => "22 usuarios"}
					defaultOpen
				/>
			</div>
		),
	},
	Checkbox: {
		render: () => <Checkbox label="Recordarme" hint="Mantener la sesión 30 días." defaultChecked />,
	},
	Radio: {
		render: () => (
			<div style={row}>
				<Radio name="miniatura-plan" label="Mensual" checked readOnly />
				<Radio name="miniatura-plan" label="Anual" readOnly />
			</div>
		),
	},
	RadioGroup: {
		render: () => (
			<div style={box(272)}>
				<RadioGroup
					appearance="card"
					aria-label="Plan"
					defaultValue="equipo"
					options={[
						{
							value: "basico",
							label: "Básico",
							supporting: "10 €/mes",
							media: <FeaturedIcon icon="zap" variant="modern" color="gray" size="sm" />,
						},
						{
							value: "equipo",
							label: "Equipo",
							supporting: "20 €/mes",
							media: <FeaturedIcon icon="users-01" variant="modern" color="gray" size="sm" />,
						},
					]}
				/>
			</div>
		),
	},
	Toggle: {
		render: () => <Toggle label="Notificaciones" hint="Aviso al vencer un pago." defaultChecked />,
	},
	Slider: {
		render: () => (
			<div style={{ width: 240, paddingTop: 12 }}>
				<Slider defaultValue={40} aria-label="Presupuesto" />
			</div>
		),
	},
	DatePicker: {
		scale: 0.42,
		render: () => (
			<DatePicker
				inline
				today={new Date(2026, 9, 29)}
				defaultValue={{ start: new Date(2026, 9, 17), end: null }}
			/>
		),
	},
	FileUpload: {
		scale: 0.6,
		render: () => (
			<div style={box(440)}>
				<FileUpload
					accept=".csv"
					hint="CSV (máx. 10 MB)"
					files={[{ name: "extracto-octubre.csv", size: 204800, progress: 64 }]}
					onRemove={noop}
				/>
			</div>
		),
	},
	ColorPicker: {
		scale: 0.5,
		render: () => (
			<ColorPicker defaultValue="#4f39f6" swatches={["#4f39f6", "#00a63e", "#d08700", "#e7000b"]} />
		),
	},
	TextEditor: {
		scale: 0.6,
		render: () => (
			<div style={box(440)}>
				<TextEditor
					label="Notas"
					maxLength={500}
					defaultValue="<p>Revisar el <b>seguro del coche</b> antes del 15.</p><ul><li>Comparar dos ofertas</li></ul>"
				/>
			</div>
		),
	},

	// Navegación
	Tabs: {
		render: () => (
			<Tabs
				aria-label="Secciones"
				items={[
					{ id: "a", label: "Resumen" },
					{ id: "b", label: "Movimientos", count: 12 },
					{ id: "c", label: "Ajustes" },
				]}
			/>
		),
	},
	Breadcrumbs: {
		render: () => (
			<Breadcrumbs
				items={[
					{ label: "Inicio", icon: "home-line", href: "/" },
					{ label: "Pecunia", href: "/" },
					{ label: "Gastos" },
				]}
			/>
		),
	},
	Pager: {
		render: () => (
			<div style={box(240)}>
				<Pager next={{ href: "#", label: "Sidebar nav" }} />
			</div>
		),
	},
	PaginationDots: {
		render: () => (
			<div
				style={{
					...box(240),
					display: "flex",
					flexDirection: "column",
					gap: 20,
					alignItems: "center",
				}}
			>
				<PaginationDots total={4} current={2} size="lg" />
				<PaginationDots total={4} current={2} size="lg" variant="line" />
			</div>
		),
	},
	Pagination: {
		scale: 0.52,
		render: () => (
			<div style={box(540)}>
				<Pagination total={10} defaultPage={3} />
			</div>
		),
	},
	SidebarNav: {
		scale: 0.45,
		render: () => (
			<div style={{ height: 400, display: "flex" }}>
				<SidebarNav
					brand={
						<>
							<AppIcon app="regula" size={32} />
							Regula
						</>
					}
					items={[
						{ icon: "home-line", label: "Inicio", href: "/", active: true },
						{ icon: "bar-chart-01", label: "Panel", href: "/", badge: 3 },
						{ icon: "currency-euro", label: "Pecunia", href: "/" },
						{ icon: "users-01", label: "Vinculum", href: "/" },
					]}
					user={{ initials: "AD", name: "Administrador", supporting: "admin@jotis.me" }}
				/>
			</div>
		),
	},
	HeaderNav: {
		render: () => (
			<div style={box(248)}>
				<ScaledPreview width={1280} scale={0.19} box={[248, 62]}>
					<HeaderNav
						type="dual-tier"
						brand={<AppIcon app="regula" size={32} />}
						items={[
							{ label: "Inicio", href: "#" },
							{
								label: "Panel",
								href: "#",
								current: true,
								children: [
									{ label: "Resumen", href: "#", current: true },
									{ label: "Avisos", href: "#" },
								],
							},
							{ label: "Tareas", href: "#" },
						]}
					/>
				</ScaledPreview>
			</div>
		),
	},
	ContextMenu: {
		scale: 0.7,
		render: () => (
			<div style={box(280)}>
				<ContextMenu
					defaultOpen
					previewAt={{ x: 8, y: 8 }}
					items={[
						{ label: "Cortar", shortcut: "⌘X" },
						{ label: "Copiar", shortcut: "⌘C" },
						{ divider: true },
						{ label: "Ver detalles", items: [{ label: "Historial" }] },
					]}
				>
					<div style={{ height: 160 }} />
				</ContextMenu>
			</div>
		),
	},
	Dropdown: {
		scale: 0.6,
		render: () => (
			<div style={box(250, 280)}>
				<Dropdown
					label="Acciones"
					defaultOpen
					items={[
						{ icon: "user-01", label: "Ver perfil", shortcut: "⌘P" },
						{ icon: "copy-01", label: "Duplicar" },
						{ divider: true },
						{ icon: "trash-01", label: "Eliminar", danger: true },
					]}
				/>
			</div>
		),
	},
	CommandMenu: {
		scale: 0.5,
		render: () => (
			<div style={stage(576, 360)}>
				<CommandMenu
					contained
					autoFocus={false}
					onClose={noop}
					groups={[
						{
							label: "Apps",
							items: [
								{
									icon: "currency-euro",
									label: "Pecunia",
									description: "Gastos e ingresos",
									shortcut: "G P",
								},
								{ icon: "users-01", label: "Vinculum", description: "Contactos" },
							],
						},
						{
							label: "Acciones",
							items: [{ icon: "plus", label: "Nuevo gasto", shortcut: "⌘N" }],
						},
					]}
				/>
			</div>
		),
	},
	TreeView: {
		scale: 0.75,
		render: () => (
			<div style={box(260)}>
				<TreeView
					aria-label="Documentos"
					defaultOpen={["notas", "trabajo"]}
					defaultSelected="roadmap"
					items={[
						{
							id: "notas",
							label: "Notas",
							children: [
								{
									id: "trabajo",
									label: "Trabajo",
									children: [
										{ id: "roadmap", label: "roadmap.md" },
										{ id: "pentest", label: "pentest.md" },
									],
								},
								{ id: "leeme", label: "LEEME.md", meta: "2 KB" },
							],
						},
					]}
				/>
			</div>
		),
	},
	FilterBar: {
		scale: 0.5,
		render: () => (
			<div style={box(560)}>
				<FilterBar
					segments={[
						{ value: "t", label: "Todo" },
						{ value: "g", label: "Gastos" },
						{ value: "i", label: "Ingresos" },
					]}
					defaultSegment="t"
					search
					searchPlaceholder="Buscar movimientos"
				/>
			</div>
		),
	},

	// Superposiciones
	Modal: {
		scale: 0.6,
		render: () => (
			<div style={stage(480, 300)}>
				<Modal
					contained
					icon="trash-01"
					destructive
					title="¿Eliminar este gasto?"
					description="Se borrará también de los informes."
					onClose={noop}
					actions={
						<>
							<Button hierarchy="secondary">Cancelar</Button>
							<Button destructive>Eliminar</Button>
						</>
					}
				/>
			</div>
		),
	},
	Slideout: {
		scale: 0.6,
		render: () => (
			<div style={stage(480, 300)}>
				<Slideout
					contained
					title="Alquiler"
					description="Movimiento del 1 de octubre"
					onClose={noop}
					actions={<Button>Guardar</Button>}
				>
					<Input label="Importe" defaultValue="650,00" trailing="currency-euro" />
				</Slideout>
			</div>
		),
	},
	CopyTooltip: {
		render: () => (
			<div style={{ paddingTop: 56 }}>
				<Tooltip title="Copiado" open>
					<Button hierarchy="secondary" size="sm" iconLeading="copy-01">
						Copiar utilidad
					</Button>
				</Tooltip>
			</div>
		),
	},
	HelpIcon: {
		render: () => (
			<div style={{ paddingTop: 64, paddingLeft: 24 }}>
				<span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary">
					Cuota mensual
					<HelpIcon title="Qué incluye" text="Impuestos incluidos." open />
				</span>
			</div>
		),
	},
	Tooltip: {
		render: () => (
			<div style={{ paddingTop: 56 }}>
				<Tooltip title="Exporta a CSV" open>
					<Button hierarchy="secondary" iconLeading="download-01">
						Exportar
					</Button>
				</Tooltip>
			</div>
		),
	},

	// Avisos
	Alert: {
		scale: 0.6,
		render: () => (
			<div style={box(460)}>
				<Alert
					color="brand"
					title="Hay una actualización disponible"
					description="La nueva versión mejora la importación de extractos."
					onClose={noop}
					actions={
						<>
							<Button hierarchy="link-gray">Descartar</Button>
							<Button hierarchy="link-color">Ver cambios</Button>
						</>
					}
				/>
			</div>
		),
	},
	Notification: {
		scale: 0.72,
		render: () => (
			<Notification
				color="success"
				title="Pago registrado"
				description="Has añadido 42,50 € a Suscripciones."
				onClose={noop}
				actions={
					<>
						<Button hierarchy="link-gray">Deshacer</Button>
						<Button hierarchy="link-color">Ver gasto</Button>
					</>
				}
			/>
		),
	},
	Banner: {
		scale: 0.5,
		render: () => (
			<div style={box(560)}>
				<Banner
					icon="zap"
					title="Nueva versión de Pecunia."
					description="Ahora con presupuestos compartidos."
					actions={<Button size="sm">Ver novedades</Button>}
					onClose={noop}
				/>
			</div>
		),
	},
	EmptyState: {
		scale: 0.6,
		render: () => (
			<div style={box(420)}>
				<EmptyState
					icon="search-lg"
					title="Sin resultados"
					description="Ningún movimiento coincide con «León»."
					actions={<Button iconLeading="plus">Nuevo movimiento</Button>}
				/>
			</div>
		),
	},
	ProgressSteps: {
		scale: 0.8,
		render: () => (
			<div style={box(300)}>
				<ProgressSteps
					aria-label="Alta"
					current={1}
					size="sm"
					steps={[
						{ title: "Datos", description: "Nombre" },
						{ title: "Empresa", description: "Web" },
						{ title: "Equipo", description: "Invita" },
					]}
				/>
			</div>
		),
	},
	ProgressCircle: {
		render: () => (
			<div style={{ ...box(248), display: "flex", justifyContent: "center" }}>
				<ProgressCircle value={40} size="xs" label="Usuarios activos" />
			</div>
		),
	},
	ProgressBar: {
		render: () => (
			<div style={box(240)}>
				<ProgressBar value={62} label="bottom" aria-label="Presupuesto usado" />
			</div>
		),
	},
	Spinner: { render: () => <Spinner size="lg" label="Importando extracto…" /> },
	Skeleton: {
		render: () => (
			<div style={{ display: "flex", gap: 16, width: 260 }}>
				<Skeleton circle width={40} height={40} />
				<div style={{ flex: 1 }}>
					<Skeleton width="50%" height={14} />
					<div style={{ height: 12 }} />
					<Skeleton lines={3} />
				</div>
			</div>
		),
	},

	// Identidad y etiquetas
	Badge: {
		render: () => (
			<div style={row}>
				<Badge color="success">Pagado</Badge>
				<Badge color="warning">Pendiente</Badge>
				<Badge type="modern" dot color="brand">
					Nuevo
				</Badge>
			</div>
		),
	},
	BadgeGroup: {
		render: () => (
			<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
				<BadgeGroup badge="Nuevo" size="lg" href="#">
					Hemos publicado los estados vacíos
				</BadgeGroup>
				<BadgeGroup badge="Ver" type="modern" badgePosition="trailing" size="lg" href="#">
					Novedades de noviembre
				</BadgeGroup>
			</div>
		),
	},
	Kbd: {
		render: () => (
			<div style={row}>
				<Kbd>⌘P</Kbd>
				<Kbd variant="field">Ctrl K</Kbd>
			</div>
		),
	},
	Tag: {
		render: () => (
			<div style={row}>
				<Tag size="md">Diseño</Tag>
				<Tag size="md" count={5}>
					Facturas
				</Tag>
				<Tag size="md" onRemove={noop}>
					León
				</Tag>
			</div>
		),
	},
	Avatar: {
		render: () => (
			<div style={row}>
				<Avatar size="lg" initials="AD" alt="Administrador" status="online" />
				<Avatar size="md" initials="LM" alt="Leo Martín" />
				<Avatar size="sm" initials="AN" alt="Ana" />
			</div>
		),
	},
	AvatarGroup: {
		render: () => (
			<AvatarGroup
				size="md"
				items={[{ initials: "AB" }, { initials: "CD" }, { initials: "EF" }, { initials: "+3" }]}
			/>
		),
	},
	Rating: {
		render: () => (
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				<Rating value={4.5} />
				<Rating value={3.7} color="gray" />
			</div>
		),
	},
	RatingBadge: {
		render: () => <RatingBadge title="Mejor del año" supportingText="2.000+ reseñas" />,
	},
	CheckIcon: {
		render: () => (
			<div style={row}>
				<CheckIcon />
				<CheckIcon type="line" color="success" />
				<CheckIcon type="filled" color="success" />
			</div>
		),
	},
	CheckItem: {
		render: () => (
			<ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
				<CheckItem size="sm">Hasta 10 usuarios</CheckItem>
				<CheckItem size="sm">20 GB por persona</CheckItem>
			</ul>
		),
	},
	AvatarProfilePhoto: {
		render: () => (
			<div style={row}>
				<AvatarProfilePhoto size="md" initials="OR" verified />
				<AvatarProfilePhoto size="sm" />
			</div>
		),
	},
	AvatarLabel: {
		render: () => (
			<AvatarLabel
				initials="AD"
				name="Responsable de seguridad"
				supporting="admin@jotis.me"
				status="online"
			/>
		),
	},
	FeaturedIcon: {
		render: () => (
			<div style={row}>
				<FeaturedIcon icon="zap" color="brand" size="lg" />
				<FeaturedIcon icon="check-circle" color="success" size="lg" />
				<FeaturedIcon icon="search-lg" variant="modern" size="lg" />
			</div>
		),
	},
	Icon: {
		render: () => (
			<div
				className="text-fg-secondary"
				style={{ display: "grid", gridTemplateColumns: "repeat(6, 24px)", gap: 16 }}
			>
				{ICONS.map((n) => (
					<Icon key={n} name={n} size={24} />
				))}
			</div>
		),
	},

	// Datos
	Table: {
		scale: 0.5,
		render: () => (
			<div style={box(560)}>
				<Table<Movimiento>
					title="Movimientos"
					count="240"
					columns={[
						{ key: "c", label: "Concepto", primary: true },
						{
							key: "ok",
							label: "Estado",
							render: (r) => (
								<Badge color={r.ok ? "success" : "warning"} dot size="sm">
									{r.ok ? "Pagado" : "Pendiente"}
								</Badge>
							),
						},
						{ key: "i", label: "Importe", align: "right" },
					]}
					rows={[
						{ c: "Alquiler", ok: true, i: "650,00 €" },
						{ c: "Electricidad", ok: true, i: "48,20 €" },
						{ c: "Seguro del coche", ok: false, i: "210,00 €" },
					]}
				/>
			</div>
		),
	},
	MetricCard: {
		render: () => (
			<div style={box(260)}>
				<MetricCard
					label="Gasto del mes"
					value="1.284 €"
					change="12%"
					trend="down"
					period="vs. septiembre"
				/>
			</div>
		),
	},
	ActivityFeed: {
		scale: 0.68,
		render: () => (
			<div style={box(380)}>
				<ActivityFeed
					items={[
						{
							author: "Pecunia",
							avatar: { initials: "Pe" },
							time: "Hace 2 min",
							text: "Importado extracto-octubre.csv con 84 movimientos.",
							unread: true,
						},
						{
							author: "Emptor",
							avatar: { initials: "Em" },
							time: "Hace 1 h",
							text: "Ha bajado de precio una aspiradora.",
						},
						{
							author: "Vinculum",
							avatar: { initials: "Vi" },
							time: "Ayer",
							text: "3 contactos fusionados.",
						},
					]}
				/>
			</div>
		),
	},
	CalendarView: {
		scale: 0.3,
		render: () => (
			<div style={box(760)}>
				<CalendarView
					today={new Date(2026, 9, 29)}
					events={[
						{ date: new Date(2026, 9, 1), title: "Alquiler", time: "650 €", color: "brand" },
						{ date: new Date(2026, 9, 15), title: "Seguro coche", color: "indigo" },
						{
							date: new Date(2026, 9, 29),
							title: "Revisión semanal",
							time: "18:00",
							color: "blue",
						},
					]}
				/>
			</div>
		),
	},
	LineChart: {
		scale: 0.55,
		render: () => (
			<div style={box(500)}>
				<LineChart
					labels={MESES}
					series={[
						{ name: "Gastos", data: [820, 910, 1100, 880, 1240, 1284] },
						{ name: "Presupuesto", data: [1000, 1000, 1000, 1100, 1100, 1200] },
					]}
					format={(v) => `${v.toLocaleString("es-ES")} €`}
				/>
			</div>
		),
	},
	BarChart: {
		scale: 0.55,
		render: () => (
			<div style={box(500)}>
				<BarChart
					labels={MESES}
					series={[
						{ name: "Hogar", data: [650, 650, 650, 700, 700, 700] },
						{ name: "Ocio", data: [120, 240, 180, 220, 260, 210] },
					]}
					format={(v) => `${v} €`}
				/>
			</div>
		),
	},
	PieChart: {
		scale: 0.8,
		render: () => (
			<PieChart
				size={160}
				center="1.284 €"
				data={[
					{ name: "Hogar", value: 700 },
					{ name: "Ocio", value: 210 },
					{ name: "Transporte", value: 95 },
					{ name: "Otros", value: 279 },
				]}
			/>
		),
	},
	ChartLegend: {
		render: () => (
			<ChartLegend series={[{ name: "Gastos" }, { name: "Presupuesto" }, { name: "Ahorro" }]} />
		),
	},

	// Maquetación
	PageHeader: {
		scale: 0.5,
		render: () => (
			<div style={box(560)}>
				<PageHeader
					breadcrumbs={[{ label: "Inicio", icon: "home-line" }, { label: "Pecunia" }]}
					title="Gastos"
					description="Controla lo que entra y lo que sale."
					actions={<Button iconLeading="plus">Nuevo gasto</Button>}
				/>
			</div>
		),
	},
	CardHeader: {
		scale: 0.55,
		render: () => (
			<div
				style={{
					width: 500,
					borderRadius: 12,
					overflow: "hidden",
					boxShadow: "inset 0 0 0 1px var(--border-secondary)",
				}}
			>
				<CardHeader
					title="Suscripciones"
					badge="12 activas"
					description="Pagos recurrentes de este mes."
					menu
					actions={
						<Button size="sm" iconLeading="plus">
							Añadir
						</Button>
					}
				/>
			</div>
		),
	},
	SectionHeader: {
		scale: 0.55,
		render: () => (
			<div style={box(500)}>
				<SectionHeader
					title="Contactos"
					description="Personas y empresas con las que tratas."
					actions={
						<Button size="sm" iconLeading="plus">
							Nuevo contacto
						</Button>
					}
				/>
			</div>
		),
	},
	SectionLabel: {
		render: () => (
			<div style={{ paddingTop: 48 }}>
				<SectionLabel
					title="Equipo"
					required
					help="Quién puede ver y editar el proyecto."
					description="Gestiona quién entra y con qué permisos."
					actions={
						<Button hierarchy="link-color" size="sm">
							Invitar
						</Button>
					}
				/>
			</div>
		),
	},
	SectionFooter: {
		scale: 0.6,
		render: () => (
			<div style={box(460)}>
				<SectionFooter
					start={<Button hierarchy="link-gray">Ver ayuda</Button>}
					actions={
						<>
							<Button hierarchy="secondary" size="sm">
								Cancelar
							</Button>
							<Button size="sm">Guardar cambios</Button>
						</>
					}
				/>
			</div>
		),
	},
	ContentDivider: {
		render: () => (
			<div style={box(260)}>
				<ContentDivider label="o continúa con" />
			</div>
		),
	},
	LinkCard: {
		render: () => (
			<div style={box(240)}>
				<LinkCard
					href="#"
					title="Button"
					description="La acción de la pantalla."
					preview={
						<div className="flex h-16 items-center justify-center bg-secondary">
							<Button size="sm">Nuevo gasto</Button>
						</div>
					}
				/>
			</div>
		),
	},
	InlineCTA: {
		scale: 0.5,
		render: () => (
			<div style={box(560)}>
				<InlineCTA
					icon="stars-02"
					title="Conecta tu banco"
					description="Importa los movimientos cada día sin subir extractos."
					actions={<Button size="sm">Conectar</Button>}
				/>
			</div>
		),
	},

	// Contenido
	Message: {
		scale: 0.72,
		render: () => (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: 380 }}>
				<Message author="Emptor" avatar={{ initials: "Em" }} time="Jueves 18:02">
					He encontrado tres aspiradoras por debajo de 300 €.
				</Message>
				<Message sent time="Jueves 18:03">
					Compáralas por autonomía.
				</Message>
			</div>
		),
	},
	MessageInput: {
		scale: 0.7,
		render: () => (
			<div style={box(400)}>
				<MessageInput placeholder="Pregunta a Emptor…" onAttach={noop} onSend={noop} />
			</div>
		),
	},
	CodeSnippet: {
		scale: 0.8,
		render: () => (
			<div style={box(330)}>
				<CodeSnippet code={CODE} />
			</div>
		),
	},
	Carousel: {
		scale: 0.5,
		render: () => (
			<div style={box(480)}>
				<Carousel
					aria-label="Novedades"
					slides={[
						<div
							key="a"
							className="flex h-[240px] items-center justify-center bg-brand-secondary text-display-xs font-semibold text-primary"
						>
							Importa tus extractos
						</div>,
						<div key="b" className="h-[240px] bg-success-secondary" />,
					]}
				/>
			</div>
		),
	},
	VideoPlayer: {
		scale: 0.58,
		render: () => (
			<div style={box(480)}>
				<VideoPlayer duration={252} />
			</div>
		),
	},

	// Marca y maquetas
	ScaledPreview: {
		render: () => (
			<ScaledPreview
				width={560}
				scale={0.45}
				box={[252, 75]}
				className="rounded-lg border border-secondary"
			>
				<InlineCTA
					icon="stars-02"
					title="Conecta tu banco"
					description="Importa los movimientos cada día sin subir extractos."
				/>
			</ScaledPreview>
		),
	},
	TransparencyGrid: {
		render: () => (
			<TransparencyGrid
				size="md"
				className="flex h-24 w-56 items-center justify-center rounded-xl border border-secondary"
			>
				<Badge color="brand">Transparente</Badge>
			</TransparencyGrid>
		),
	},
	BackgroundPattern: {
		render: () => (
			<div
				style={{
					position: "relative",
					width: 260,
					height: 150,
					borderRadius: 12,
					overflow: "hidden",
					background: "var(--bg-primary)",
					boxShadow: "inset 0 0 0 1px var(--border-secondary)",
				}}
			>
				<BackgroundPattern pattern="grid" mask="radial" size="md" />
				<div style={{ position: "relative", height: "100%", display: "grid", placeItems: "center" }}>
					<FeaturedIcon icon="stars-02" variant="modern" color="gray" size="lg" />
				</div>
			</div>
		),
	},
	CreditCard: {
		scale: 0.8,
		render: () => (
			<CreditCard
				theme="brand-dark"
				company="Pecunia"
				holder="Administrador"
				expiry="06/29"
				last4="4821"
			/>
		),
	},
	BrowserFrame: {
		scale: 0.6,
		render: () => (
			<div style={box(480)}>
				<BrowserFrame url="pecunia.jotis.me/resumen" height={240}>
					<div
						style={{
							display: "grid",
							placeItems: "center",
							height: "100%",
							padding: 24,
							background: "var(--bg-secondary)",
						}}
					>
						<MetricCard
							label="Gasto de octubre"
							value="1.284,50 €"
							change="8 %"
							trend="up"
							period="vs. septiembre"
						/>
					</div>
				</BrowserFrame>
			</div>
		),
	},
	AppIcon: {
		render: () => (
			<div style={row}>
				<AppIcon app="regula" size={56} />
				<AppIcon app="pecunia" size={56} />
				<AppIcon app="scaena" size={56} />
			</div>
		),
	},

	// Stream
	StreamAlert: { scale: 0.55, render: () => <StreamAlert type="sub" user="nachoXL" tier={1} /> },
	StreamScene: {
		// StreamStage no mide sin JavaScript: con `scale` fija se pinta a 288 de ancho sin medir nada (D7)
		render: () => (
			<StreamScene variant="starting" seconds={300} countdownLabel="Para empezar" scale={288 / 1920} />
		),
	},
	StreamCountdown: {
		scale: 0.7,
		render: () => <StreamCountdown size="lg" seconds={600} paused label="Empezamos en" />,
	},
	StreamEvents: { scale: 0.6, render: () => <StreamEvents items={EVENTS} max={4} /> },
	StreamStatus: {
		scale: 0.72,
		render: () => <StreamStatus status="live" viewers={1284} uptime="2:14:05" category="Just Chatting" />,
	},
	StreamGoal: {
		scale: 0.65,
		render: () => <StreamGoal label="Meta de seguidores" current={1284} goal={2000} />,
	},
	NowPlaying: {
		scale: 0.75,
		render: () => (
			<NowPlaying title="Cuatro paredes y un techo" artist="Los Vecinos del Quinto" progress={0.42} />
		),
	},
	CamFrame: { render: () => <CamFrame ratio="16:9" width={256} live name="Tu canal" /> },
	ChatBox: { scale: 0.58, render: () => <ChatBox messages={CHAT.slice(1)} height={250} width={300} /> },
	ChatBadge: {
		render: () => (
			<div style={row}>
				{(["broadcaster", "mod", "vip", "sub", "bits"] as const).map((k) => (
					<ChatBadge key={k} kind={k} size={28} />
				))}
			</div>
		),
	},
	ChannelPanel: {
		scale: 0.6,
		render: () => (
			<ChannelPanel
				title="Horario"
				icon="calendar"
				rows={[
					{ label: "Lunes", value: "20:00" },
					{ label: "Miércoles", value: "20:00" },
					{ label: "Viernes", value: "22:00" },
				]}
			/>
		),
	},
	ChannelBanner: {
		// StreamStage, como StreamScene (D7)
		render: () => (
			<ChannelBanner
				name="Tu canal"
				tagline="Directos tranquilos y conversación sin guion."
				schedule={[
					{ day: "Lunes", time: "20:00" },
					{ day: "Viernes", time: "22:00" },
				]}
				scale={288 / 1200}
			/>
		),
	},
};

/** La muestra de un componente, o nada si aún no tiene (entonces la card enseña su ejemplo entero). */
export function Thumbnail({ name }: { name: string }) {
	const thumbnail = THUMBNAILS[name];
	return thumbnail ? thumbnail.render() : null;
}
