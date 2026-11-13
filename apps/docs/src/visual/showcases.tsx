// Muestras de las cards de /components/ (change adopt-untitled-ui-icons): lo más característico de cada componente, con sus
// propios datos de ejemplo. No son los ejemplos del registro (que enseñan todas las variantes y compara la paridad
// visual): una sola forma, quieta y bien compuesta. Se pintan en /showcase/<componente>/, donde la página las centra y las
// ajusta a un marco de 640×400; un script (scripts/capture-showcases.ts) las captura a WebP. Las capas que se abren van
// en línea (`defaultOpen`, `contained`, `inline`): un portal no se pinta en el servidor.

import {
	SocialAppleLogoGray,
	SocialFacebookLogo,
	SocialFacebookLogoGray,
	SocialGoogleLogo,
	StoreAppStoreLogo,
	StoreGooglePlayOutlineLogo,
} from "@jotis-me/assets/logos";
import {
	Accordion,
	ActivityFeed,
	ActivityGauge,
	Alert,
	AppIcon,
	AppStoreBadge,
	Avatar,
	AvatarGroup,
	AvatarLabel,
	AvatarProfilePhoto,
	BackgroundOverlay,
	BackgroundPattern,
	Badge,
	BadgeGroup,
	Banner,
	BarChart,
	BlogPostCard,
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
	ChartMarker,
	ChatBadge,
	ChatBox,
	type ChatMessage,
	Checkbox,
	CheckIcon,
	CheckItem,
	CloseButton,
	CodeSnippet,
	ColorPicker,
	ColorPickerDropdown,
	CommandMenu,
	CompareSlider,
	ContentDivider,
	ContextMenu,
	CreditCard,
	DatePicker,
	Disclosure,
	Dropdown,
	EmptyState,
	ExampleCard,
	FeaturedIcon,
	FileUpload,
	FilterBar,
	FilterMenu,
	FilterPanel,
	Footer,
	HeaderNav,
	HelpIcon,
	IconTile,
	InlineCTA,
	Input,
	JobPostCard,
	Kbd,
	LaptopMockup,
	LineChart,
	LinkCard,
	MarketingNav,
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
	PhoneMockup,
	PieChart,
	PricingCard,
	ProgressBar,
	ProgressCircle,
	ProgressSteps,
	RadarChart,
	Radio,
	RadioGroup,
	Rating,
	RatingBadge,
	ScaledPreview,
	ScreenMockup,
	SectionFooter,
	SectionHeader,
	SectionLabel,
	Select,
	SidebarNav,
	Skeleton,
	Slideout,
	Slider,
	SocialButton,
	SocialButtonGroup,
	Spinner,
	Spotlight,
	StreamAlert,
	StreamCountdown,
	type StreamEventItem,
	StreamEvents,
	StreamGoal,
	StreamScene,
	StreamStatus,
	SubscribeCard,
	Table,
	Tabs,
	Tag,
	TagInput,
	TeamMemberCard,
	Testimonial,
	Textarea,
	TextEditor,
	Toggle,
	TokenSwatch,
	Tooltip,
	TransparencyGrid,
	TreeView,
	VerificationCodeInput,
	VideoPlayer,
} from "@jotis-me/react";
import {
	BarChart01,
	Calendar,
	CheckCircle,
	Clock,
	Copy01,
	CurrencyEuro,
	Download01,
	Edit02,
	HomeLine,
	Mail01,
	Plus,
	SearchLg,
	Stars02,
	Trash01,
	User01,
	Users01,
	Zap,
} from "@untitledui/icons";
import type { CSSProperties, ReactNode } from "react";
import { PantallaGastos } from "./examples/compare-slider";

export interface Showcase {
	/** La muestra del componente: lo más característico, en una sola forma y quieta. Se centra y se ajusta al marco de la captura. */
	render: () => ReactNode;
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

const CODE = `<Button iconLeading={Plus}>
  Nuevo gasto
</Button>`;

interface Movimiento {
	c: string;
	ok: boolean;
	i: string;
}

export const SHOWCASES: Record<string, Showcase> = {
	// Acciones
	Button: { render: () => <Button iconLeading={Plus}>Nuevo gasto</Button> },
	ButtonGroup: {
		render: () => (
			<ButtonGroup
				defaultValue="b"
				aria-label="Periodo"
				items={[
					{ value: "a", label: "30 días" },
					{ value: "b", label: "7 días" },
					{ value: "c", label: "24 horas", icon: Clock },
				]}
			/>
		),
	},
	CloseButton: { render: () => <CloseButton /> },
	SocialButton: {
		render: () => (
			<div style={row}>
				{/* Logos distintos de los de SocialButtonGroup: los de color llevan ids y en /components/ no se repiten */}
				<SocialButton provider="apple" logo={<SocialAppleLogoGray />} />
				<SocialButton provider="facebook" iconOnly logo={<SocialFacebookLogoGray />} />
			</div>
		),
	},
	AppStoreBadge: {
		render: () => (
			<div style={row}>
				<AppStoreBadge store="app-store" href="#" logo={<StoreAppStoreLogo />} />
				<AppStoreBadge store="google-play" href="#" logo={<StoreGooglePlayOutlineLogo />} />
			</div>
		),
	},
	SocialButtonGroup: {
		render: () => (
			<div style={{ width: 240 }}>
				<SocialButtonGroup layout="row">
					<SocialButton provider="google" theme="color" iconOnly logo={<SocialGoogleLogo />} />
					<SocialButton provider="facebook" theme="color" iconOnly logo={<SocialFacebookLogo />} />
					<SocialButton provider="apple" theme="color" iconOnly logo={<SocialAppleLogoGray />} />
				</SocialButtonGroup>
			</div>
		),
	},
	ButtonUtility: {
		render: () => (
			<div className="flex items-center gap-1" style={{ paddingTop: 48 }}>
				<ButtonUtility icon={Copy01} label="Copiar" tooltipOpen />
				<ButtonUtility icon={Edit02} label="Editar" />
				<ButtonUtility icon={Trash01} label="Borrar" />
			</div>
		),
	},

	// Formularios
	Input: {
		render: () => (
			<div style={box(248)}>
				<Input
					label="Correo"
					icon={Mail01}
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
		render: () => (
			<div style={box(288, 330)}>
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
							media: <FeaturedIcon icon={Zap} variant="modern" color="gray" size="sm" />,
						},
						{
							value: "equipo",
							label: "Equipo",
							supporting: "20 €/mes",
							media: <FeaturedIcon icon={Users01} variant="modern" color="gray" size="sm" />,
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
		render: () => (
			<DatePicker
				inline
				today={new Date(2026, 9, 29)}
				defaultValue={{ start: new Date(2026, 9, 17), end: null }}
			/>
		),
	},
	FileUpload: {
		render: () => (
			<div style={box(288)}>
				<FileUpload
					accept=".csv"
					hint="CSV (máx. 10 MB)"
					files={[{ name: "extracto-octubre.csv", size: 204800, progress: 64 }]}
					onRemove={noop}
				/>
			</div>
		),
	},
	ColorPickerDropdown: {
		render: () => (
			<div style={row}>
				<ColorPickerDropdown trigger="swatch-button" />
				<ColorPickerDropdown trigger="hex-input" />
			</div>
		),
	},
	ColorPicker: {
		render: () => (
			<ColorPicker defaultValue="#4f39f6" swatches={["#4f39f6", "#00a63e", "#d08700", "#e7000b"]} />
		),
	},
	TextEditor: {
		render: () => (
			<div style={box(288)}>
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
					{ label: "Inicio", icon: HomeLine, href: "/" },
					{ label: "Pecunia", href: "/" },
					{ label: "Gastos" },
				]}
			/>
		),
	},
	Pager: {
		render: () => (
			<div style={box(640)}>
				<Pager
					prev={{ href: "#", label: "Instalación" }}
					next={{ href: "#", label: "Sidebar nav" }}
				/>
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
		render: () => (
			<div style={box(288)}>
				<Pagination total={10} defaultPage={3} />
			</div>
		),
	},
	SidebarNav: {
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
						{ icon: HomeLine, label: "Inicio", href: "/", active: true },
						{ icon: BarChart01, label: "Panel", href: "/", badge: 3 },
						{ icon: CurrencyEuro, label: "Pecunia", href: "/" },
						{ icon: Users01, label: "Vinculum", href: "/" },
					]}
					user={{ initials: "AD", name: "Administrador", supporting: "admin@jotis.me" }}
				/>
			</div>
		),
	},
	HeaderNav: {
		render: () => (
			<div
				style={{
					width: 640,
					overflow: "hidden",
					maskImage: "linear-gradient(to right, #000 85%, transparent)",
				}}
			>
				<div style={{ width: 1100 }}>
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
				</div>
			</div>
		),
	},
	ContextMenu: {
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
		render: () => (
			<div style={box(250, 280)}>
				<Dropdown
					label="Acciones"
					defaultOpen
					items={[
						{ icon: User01, label: "Ver perfil", shortcut: "⌘P" },
						{ icon: Copy01, label: "Duplicar" },
						{ divider: true },
						{ icon: Trash01, label: "Eliminar", danger: true },
					]}
				/>
			</div>
		),
	},
	CommandMenu: {
		render: () => (
			<div style={stage(440, 300)}>
				<CommandMenu
					contained
					autoFocus={false}
					onClose={noop}
					groups={[
						{
							label: "Apps",
							items: [
								{
									icon: CurrencyEuro,
									label: "Pecunia",
									description: "Gastos e ingresos",
									shortcut: "G P",
								},
								{ icon: Users01, label: "Vinculum", description: "Contactos" },
							],
						},
						{
							label: "Acciones",
							items: [{ icon: Plus, label: "Nuevo gasto", shortcut: "⌘N" }],
						},
					]}
				/>
			</div>
		),
	},
	TreeView: {
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
	BlogPostCard: {
		render: () => (
			<div style={{ width: 288 }}>
				<BlogPostCard
					href="#"
					image={
						<div
							style={{ width: "100%", height: "100%", background: "var(--utility-brand-200)" }}
						/>
					}
					category="Ahorro"
					title="La regla del 50/30/20"
					description="Reparte tu sueldo en tres partes."
					author={{ name: "Ana Martín", date: "20 ene 2027" }}
				/>
			</div>
		),
	},
	SubscribeCard: {
		render: () => (
			<div style={{ width: 288 }}>
				<SubscribeCard description="Una vez a la semana, sin spam." />
			</div>
		),
	},
	PricingCard: {
		render: () => (
			<div style={{ width: 288 }}>
				<PricingCard
					name="Básico"
					price="10 €"
					period="al mes"
					features={["Informes", "Hasta 10 cuentas", "Ayuda por chat"]}
					actions={<Button size="lg">Empezar</Button>}
				/>
			</div>
		),
	},
	JobPostCard: {
		render: () => (
			<div style={{ width: 288 }}>
				<JobPostCard
					href="#"
					type="card-01"
					category="Diseño"
					title="Diseñador de producto"
					department="Diseño"
					description="Buscamos a alguien para el equipo de diseño."
					location="En remoto"
					employment="Jornada completa"
				/>
			</div>
		),
	},
	Accordion: {
		render: () => (
			<div style={{ width: 288 }}>
				<Accordion
					defaultExpanded={["a"]}
					items={[
						{ id: "a", title: "¿Hay prueba gratis?", content: "Sí, 30 días." },
						{ id: "b", title: "¿Puedo cancelar?", content: "Cuando quieras." },
					]}
				/>
			</div>
		),
	},
	TeamMemberCard: {
		render: () => (
			<div style={{ width: 288 }}>
				<TeamMemberCard
					type="simple-left"
					name="Ana Martín"
					role="Fundadora y directora"
					bio="Diez años ordenando cuentas."
				/>
			</div>
		),
	},
	Testimonial: {
		render: () => (
			<div style={{ width: 460 }}>
				<Testimonial
					className="h-[220px] min-h-0!"
					quote="Nos ahorra horas cada mes."
					name="Lucía Ramos"
					role="Diseñadora, Capas"
					image={
						<div
							style={{ width: "100%", height: "100%", background: "var(--utility-brand-300)" }}
						/>
					}
				/>
			</div>
		),
	},
	Footer: {
		render: () => (
			<div
				style={{
					width: 440,
					borderRadius: 12,
					overflow: "hidden",
					boxShadow: "inset 0 0 0 1px var(--border-secondary)",
				}}
			>
				<Footer
					brand={<span style={{ fontWeight: 600, fontSize: 20 }}>Regula</span>}
					columns={["Producto", "Empresa", "Recursos", "Legal"].map((title) => ({
						title,
						links: ["Uno", "Dos", "Tres"].map((label) => ({ label, href: "#" })),
					}))}
					copyright="© 2027 Regula"
				/>
			</div>
		),
	},
	MarketingNav: {
		render: () => (
			<div
				style={{
					width: 640,
					overflow: "hidden",
					maskImage: "linear-gradient(to right, #000 85%, transparent)",
				}}
			>
				<div style={{ width: 1100 }}>
					<MarketingNav
						brand={<span style={{ fontWeight: 600, fontSize: 20 }}>Regula</span>}
						items={[
							{ label: "Producto", href: "#" },
							{ label: "Precios", href: "#" },
							{ label: "Recursos", href: "#" },
							{ label: "Quiénes somos", href: "#" },
						]}
					/>
				</div>
			</div>
		),
	},
	FilterMenu: {
		render: () => (
			<div style={row}>
				<FilterMenu
					fields={[{ value: "estado", label: "Estado" }]}
					operators={[{ value: "es", label: "Es" }]}
				/>
				<FilterMenu
					fields={[{ value: "estado", label: "Estado" }]}
					operators={[{ value: "es", label: "Es" }]}
					defaultValue={[
						{ field: "estado", operator: "es", value: "Activo" },
						{ field: "estado", operator: "es", value: "Pausado" },
					]}
				/>
			</div>
		),
	},
	FilterPanel: {
		render: () => (
			<div
				style={{
					width: 288,
					display: "flex",
					flexDirection: "column",
					padding: 24,
					background: "var(--bg-primary_alt)",
				}}
			>
				<FilterPanel
					fields={[
						{ value: "estado", label: "Estado" },
						{ value: "correo", label: "Correo" },
					]}
					operators={[{ value: "es", label: "Es" }]}
					defaultValue={[{ field: "estado", operator: "es", value: "Activo" }]}
				/>
			</div>
		),
	},
	FilterBar: {
		render: () => (
			<div style={box(288)}>
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
		render: () => (
			<div style={stage(400, 260)}>
				<Modal
					contained
					icon={Trash01}
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
		render: () => (
			<div style={stage(300, 260)}>
				<Slideout
					contained
					title="Alquiler"
					description="Movimiento del 1 de octubre"
					onClose={noop}
					actions={<Button>Guardar</Button>}
				>
					<Input label="Importe" defaultValue="650,00" trailing={CurrencyEuro} />
				</Slideout>
			</div>
		),
	},
	CopyTooltip: {
		render: () => (
			<div style={{ paddingTop: 56 }}>
				<Tooltip title="Copiado" open>
					<Button hierarchy="secondary" size="sm" iconLeading={Copy01}>
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
					<Button hierarchy="secondary" iconLeading={Download01}>
						Exportar
					</Button>
				</Tooltip>
			</div>
		),
	},

	Spotlight: {
		render: () => (
			<div style={{ paddingBottom: 64 }}>
				<Spotlight active note="Ahora en gris">
					<Button hierarchy="secondary" iconLeading={Download01}>
						Exportar
					</Button>
				</Spotlight>
			</div>
		),
	},

	// Avisos
	Alert: {
		render: () => (
			<div style={box(288)}>
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
		render: () => (
			<div style={box(440)}>
				<Banner
					icon={Zap}
					title="Nueva versión de Pecunia."
					description="Ahora con presupuestos compartidos."
					actions={<Button size="sm">Ver novedades</Button>}
					onClose={noop}
				/>
			</div>
		),
	},
	EmptyState: {
		render: () => (
			<div style={box(288)}>
				<EmptyState
					icon={SearchLg}
					title="Sin resultados"
					description="Ningún movimiento coincide con «León»."
					actions={<Button iconLeading={Plus}>Nuevo movimiento</Button>}
				/>
			</div>
		),
	},
	ProgressSteps: {
		render: () => (
			<div style={box(288)}>
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
	IconTile: {
		render: () => (
			<div className="grid grid-cols-3 gap-3" style={box(300)}>
				<IconTile icon={Mail01} label="Mail01" onSelect={noop} />
				<IconTile icon={HomeLine} label="HomeLine" selected onSelect={noop} />
				<IconTile icon={Calendar} label="Calendar" onSelect={noop} />
				<IconTile icon={Clock} label="Clock" onSelect={noop} />
				<IconTile icon={Download01} label="Download01" onSelect={noop} />
				<IconTile icon={SearchLg} label="SearchLg" onSelect={noop} />
			</div>
		),
	},
	TokenSwatch: {
		render: () => (
			<div className="flex flex-col gap-3" style={box(300)}>
				<TokenSwatch
					layout="card"
					name="text-primary"
					light="#171717"
					dark="#fafafa"
					utility="text-primary"
					usage="Texto y titulares sobre bg-primary."
				/>
				<TokenSwatch
					layout="card"
					name="bg-secondary"
					light="#fafafa"
					dark="#171717"
					utility="bg-secondary"
				/>
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
				<FeaturedIcon icon={Zap} color="brand" size="lg" />
				<FeaturedIcon icon={CheckCircle} color="success" size="lg" />
				<FeaturedIcon icon={SearchLg} variant="modern" size="lg" />
			</div>
		),
	},

	// Datos
	Table: {
		render: () => (
			<div style={box(520)}>
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
		render: () => (
			<div style={box(288)}>
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
		render: () => (
			<div
				style={{
					...box(640, 330),
					overflow: "hidden",
					maskImage: "linear-gradient(#000 82%, transparent)",
				}}
			>
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
		render: () => (
			<div style={box(288)}>
				<LineChart
					width={288}
					height={120}
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
		render: () => (
			<div style={box(288)}>
				<BarChart
					width={288}
					height={120}
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
	ActivityGauge: {
		render: () => (
			<ActivityGauge
				size="xs"
				data={[
					{ name: "Móvil", value: 72 },
					{ name: "Escritorio", value: 54 },
					{ name: "Tableta", value: 38 },
				]}
				label="Activos"
				value="1.000"
			/>
		),
	},
	RadarChart: {
		render: () => (
			<div style={{ width: 288 }}>
				<RadarChart
					axes={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]}
					series={[
						{ name: "A", data: [820, 560, 380, 520, 440, 900, 300] },
						{ name: "B", data: [360, 700, 520, 760, 560, 480, 680] },
					]}
					legend={false}
				/>
			</div>
		),
	},
	ChartMarker: {
		render: () => (
			<div style={{ display: "flex", gap: 56, paddingTop: 60 }}>
				<ChartMarker value="1.218" label="10 ene" height={90} />
				<ChartMarker value="1.218" type="minimal" height={90} />
			</div>
		),
	},
	PieChart: {
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
		render: () => (
			<div style={box(288)}>
				<PageHeader
					breadcrumbs={[{ label: "Inicio", icon: HomeLine }, { label: "Pecunia" }]}
					title="Gastos"
					description="Controla lo que entra y lo que sale."
					actions={<Button iconLeading={Plus}>Nuevo gasto</Button>}
				/>
			</div>
		),
	},
	CardHeader: {
		render: () => (
			<div
				style={{
					width: 440,
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
						<Button size="sm" iconLeading={Plus}>
							Añadir
						</Button>
					}
				/>
			</div>
		),
	},
	SectionHeader: {
		render: () => (
			<div style={box(288)}>
				<SectionHeader
					title="Contactos"
					description="Personas y empresas con las que tratas."
					actions={
						<Button size="sm" iconLeading={Plus}>
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
		render: () => (
			<div style={box(288)}>
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
	Disclosure: {
		render: () => (
			<div style={box(300)}>
				<Disclosure title="Iconos" aside={<Badge color="brand">3 props</Badge>} defaultOpen>
					<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
						<span>icon</span>
						<span>iconLeading</span>
						<span>iconTrailing</span>
					</div>
				</Disclosure>
				<Disclosure title="Tamaño" aside="2 props" />
				<Disclosure title="Estados" aside="4 props" divider={false} />
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
		render: () => (
			<div style={box(288)}>
				<InlineCTA
					icon={Stars02}
					title="Conecta tu banco"
					description="Importa los movimientos cada día sin subir extractos."
					actions={<Button size="sm">Conectar</Button>}
				/>
			</div>
		),
	},

	// Contenido
	Message: {
		render: () => (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: 288 }}>
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
		render: () => (
			<div style={box(288)}>
				<MessageInput placeholder="Pregunta a Emptor…" onAttach={noop} onSend={noop} />
			</div>
		),
	},
	CodeSnippet: {
		render: () => (
			<div style={box(420)}>
				<CodeSnippet code={CODE} />
			</div>
		),
	},
	Carousel: {
		render: () => (
			<div style={box(420)}>
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
	CompareSlider: {
		render: () => (
			<div style={box(440)}>
				<CompareSlider
					label="Tema de la pantalla"
					before={<PantallaGastos mode="dark" />}
					after={<PantallaGastos mode="light" />}
					beforeLabel="Oscuro"
					afterLabel="Claro"
					defaultValue={45}
					height={250}
				/>
			</div>
		),
	},
	VideoPlayer: {
		render: () => (
			<div style={box(460)}>
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
					icon={Stars02}
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
	ExampleCard: {
		render: () => (
			<div style={{ ...row, flexWrap: "nowrap", alignItems: "stretch", gap: 16 }}>
				<div style={box(240)}>
					<ExampleCard verdict="do" caption="Un primario por pantalla." minHeight={120}>
						<Button size="sm">Guardar</Button>
					</ExampleCard>
				</div>
				<div style={box(240)}>
					<ExampleCard verdict="dont" caption="No apiles dos primarios." minHeight={120}>
						<div style={{ display: "flex", gap: 8 }}>
							<Button size="sm">Guardar</Button>
							<Button size="sm">Enviar</Button>
						</div>
					</ExampleCard>
				</div>
			</div>
		),
	},
	BackgroundPattern: {
		render: () => (
			<div
				style={{
					position: "relative",
					width: 400,
					height: 240,
					borderRadius: 12,
					overflow: "hidden",
					background: "var(--bg-primary)",
					boxShadow: "inset 0 0 0 1px var(--border-secondary)",
				}}
			>
				<BackgroundPattern pattern="grid" mask="radial" size="md" width={400} height={240} />
				<div style={{ position: "relative", height: "100%", display: "grid", placeItems: "center" }}>
					<FeaturedIcon icon={Stars02} variant="modern" color="gray" size="lg" />
				</div>
			</div>
		),
	},
	CreditCard: {
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
	BackgroundOverlay: {
		render: () => (
			<div
				style={{
					position: "relative",
					width: 240,
					height: 140,
					borderRadius: 12,
					overflow: "hidden",
					background: "var(--bg-brand-solid)",
				}}
			>
				<p
					style={{
						position: "absolute",
						top: 16,
						left: 16,
						margin: 0,
						color: "white",
						fontWeight: 600,
						fontSize: 24,
					}}
				>
					Regula
				</p>
				<BackgroundOverlay type="gradient" />
			</div>
		),
	},
	ScreenMockup: {
		render: () => (
			<div style={{ width: 240 }}>
				<ScreenMockup size="xs">
					<div style={{ position: "absolute", inset: 0, background: "var(--bg-secondary)" }} />
				</ScreenMockup>
			</div>
		),
	},
	LaptopMockup: {
		render: () => (
			<div style={{ width: 260 }}>
				<LaptopMockup>
					<div style={{ position: "absolute", inset: 0, background: "var(--bg-secondary)" }} />
				</LaptopMockup>
			</div>
		),
	},
	PhoneMockup: {
		render: () => (
			<div style={{ width: 80 }}>
				<PhoneMockup>
					<div style={{ position: "absolute", inset: 0, background: "var(--bg-secondary)" }} />
				</PhoneMockup>
			</div>
		),
	},
	BrowserFrame: {
		render: () => (
			<div style={box(288)}>
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
	StreamAlert: { render: () => <StreamAlert type="sub" user="nachoXL" tier={1} /> },
	StreamScene: {
		// StreamStage no mide sin JavaScript: con `scale` fija se pinta a 288 de ancho sin medir nada (D7)
		render: () => (
			<StreamScene variant="starting" seconds={300} countdownLabel="Para empezar" scale={288 / 1920} />
		),
	},
	StreamCountdown: {
		render: () => <StreamCountdown size="lg" seconds={600} paused label="Empezamos en" />,
	},
	StreamEvents: { render: () => <StreamEvents items={EVENTS} max={4} /> },
	StreamStatus: {
		render: () => <StreamStatus status="live" viewers={1284} uptime="2:14:05" category="Just Chatting" />,
	},
	StreamGoal: {
		render: () => <StreamGoal label="Meta de seguidores" current={1284} goal={2000} />,
	},
	NowPlaying: {
		render: () => (
			<NowPlaying title="Cuatro paredes y un techo" artist="Los Vecinos del Quinto" progress={0.42} />
		),
	},
	CamFrame: { render: () => <CamFrame ratio="16:9" width={256} live name="Tu canal" /> },
	ChatBox: {
		render: () => <ChatBox messages={CHAT.slice(1)} height={250} width={300} />,
	},
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
		render: () => (
			<ChannelPanel
				title="Horario"
				icon={Calendar}
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

/** La muestra de un componente, o nada si aún no tiene. */
export function ShowcaseOf({ name }: { name: string }) {
	const showcase = SHOWCASES[name];
	return showcase ? showcase.render() : null;
}
