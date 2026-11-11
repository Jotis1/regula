// Fragmentos de código de cada página de componente. Se escriben una vez (el JSX de uso) y se envuelven
// para Next.js (página de servidor) y para Astro (con `client:load` si el componente es interactivo).

const usage: Record<string, string> = {
	Button: `<Button iconLeading="plus">Nuevo gasto</Button>
<Button hierarchy="secondary" href="/ajustes">Ajustes</Button>`,
	ButtonGroup: `<ButtonGroup
	aria-label="Periodo"
	defaultValue="7d"
	items={[
		{ value: "30d", label: "30 días" },
		{ value: "7d", label: "7 días" },
		{ value: "24h", label: "24 horas", icon: "clock" },
	]}
/>`,
	SocialButton: `<SocialButton provider="google" theme="gray" logo={<SocialGoogleLogoGray />} />`,
	SocialButtonGroup: `<SocialButtonGroup label="Entrar con">
	<SocialButton provider="google" theme="color" logo={<SocialGoogleLogo />} />
	<SocialButton provider="apple" theme="color" logo={<SocialAppleLogoGray />} />
</SocialButtonGroup>`,
	CloseButton: `<CloseButton label="Cerrar aviso" />`,
	ButtonUtility: `<ButtonUtility icon="copy-01" label="Copiar enlace" onClick={copiar} />`,
	Icon: `<Icon name="calendar" size={20} />
<Icon name="check-circle" title="Pagado" />`,
	Badge: `<Badge color="success">Pagado</Badge>
<Badge type="modern" color="success" dot>En línea</Badge>`,
	BadgeGroup: `<BadgeGroup badge="Nuevo" href="/novedades/">
	Hemos publicado los estados vacíos
</BadgeGroup>`,
	Tag: `<Tag size="md" count={5}>Facturas</Tag>`,
	Kbd: `<Kbd variant="field">Ctrl K</Kbd>`,
	Avatar: `<Avatar initials="AD" alt="Administrador" status="online" />`,
	AvatarGroup: `<AvatarGroup items={[{ initials: "AB" }, { initials: "CD" }, { initials: "+3" }]} />`,
	Rating: `<Rating value={4.5} />`,
	RatingBadge: `<RatingBadge title="Mejor herramienta de diseño" supportingText="2.000+ reseñas" />`,
	CheckIcon: `<CheckIcon type="filled" color="success" size="md" />`,
	CheckItem: `<ul>
	<CheckItem>Hasta 10 usuarios</CheckItem>
	<CheckItem>20 GB por persona</CheckItem>
</ul>`,
	AvatarProfilePhoto: `<AvatarProfilePhoto size="lg" src="/fotos/olivia.jpg" alt="Olivia Rhye" verified />`,
	AvatarLabel: `<AvatarLabel initials="AD" name="Responsable de seguridad" supporting="admin@jotis.me" />`,
	FeaturedIcon: `<FeaturedIcon icon="alert-circle" color="error" />`,
	Spinner: `<Spinner label="Importando extracto…" />`,
	Skeleton: `<Skeleton circle width={40} height={40} />
<Skeleton lines={3} />`,
	ProgressBar: `<ProgressBar value={62} aria-label="Presupuesto usado" />`,
	ProgressSteps: `<ProgressSteps
	aria-label="Alta"
	current={1}
	steps={[
		{ title: "Tus datos", description: "Nombre y correo" },
		{ title: "Tu empresa", description: "Web y ubicación" },
		{ title: "Tu equipo", description: "Empieza a colaborar" },
	]}
/>`,
	ProgressCircle: `<ProgressCircle value={40} label="Usuarios activos" />
<ProgressCircle value={40} shape="half" size="sm" label="Usuarios activos" />`,
	AppIcon: `<AppIcon app="pecunia" size={48} />`,
	Input: `<Input label="Correo" type="email" icon="mail-01" placeholder="tu@jotis.me" required />`,
	NumberInput: `<NumberInput label="Invitados" defaultValue={2} min={1} max={12} />`,
	TagInput: `<TagInput label="Etiquetas" defaultValue={["diseño", "código"]} onChange={guardar} />`,
	VerificationCodeInput: `<VerificationCodeInput label="Código de verificación" onComplete={(code) => verificar(code)} />`,
	Textarea: `<Textarea label="Descripción" hint="Máximo 300 caracteres." />`,
	Select: `<Select label="Categoría" placeholder="Elige una" options={["Casa", "Coche", "Ocio"]} />`,
	MultiSelect: `<MultiSelect
	label="Equipos"
	placeholder="Elige equipos"
	options={[
		{ value: "ing", label: "Ingeniería", supporting: "12 usuarios" },
		{ value: "dis", label: "Diseño", supporting: "10 usuarios" },
	]}
	onChange={guardar}
/>`,
	Checkbox: `<Checkbox label="Recordarme" hint="Mantén la sesión 30 días." />`,
	Radio: `<Radio name="plan" value="mensual" label="Mensual" defaultChecked />
<Radio name="plan" value="anual" label="Anual" />`,
	RadioGroup: `<RadioGroup
	aria-label="Plan"
	defaultValue="mensual"
	options={[
		{ value: "mensual", label: "Mensual" },
		{ value: "anual", label: "Anual", hint: "Dos meses gratis" },
	]}
/>`,
	Toggle: `<Toggle label="Avisos por correo" defaultChecked />`,
	Slider: `<Slider aria-label="Presupuesto" defaultValue={40} />`,
	FileUpload: `<FileUpload accept=".csv" hint="CSV (máx. 10 MB)" onFiles={(files) => subir(files)} />`,
	DatePicker: `<DatePicker
	range
	presets={[{ label: "Este mes", start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) }]}
	onApply={({ start, end }) => filtrar(start, end)}
/>

// Horas disponibles y modal: onApply recibe start con la hora puesta y time ("10:30")
<DatePicker
	presentation="modal"
	times={["09:00", "09:30", "10:00", "10:30"]}
	onApply={({ start, time }) => reservar(start, time)}
/>`,
	ColorPicker: `<ColorPicker defaultValue="#4f39f6" swatches={["#4f39f6", "#00a63e"]} onChange={guardar} />

// Tipos del Figma: el panel de pestañas, con modelo de color, opacidad y degradado
<ColorPicker
	type="solid"
	defaultModel="hsl"
	onChange={(hex, opacidad) => guardar(hex, opacidad)}
	onGradientChange={(paradas) => guardarDegradado(paradas)}
	onImageChange={(archivo) => subir(archivo)}
/>`,
	TextEditor: `<TextEditor label="Notas" maxLength={500} onChange={guardar} />`,
	MessageInput: `<MessageInput placeholder="Pregunta a Emptor…" onSend={enviar} />`,
	Tabs: `<Tabs
	aria-label="Secciones"
	items={[
		{ id: "resumen", label: "Resumen" },
		{ id: "movimientos", label: "Movimientos", count: 12 },
	]}
	onChange={cambiarVista}
/>`,
	Breadcrumbs: `<Breadcrumbs
	items={[
		{ label: "Inicio", icon: "home-line", href: "/" },
		{ label: "Pecunia", href: "/pecunia/" },
		{ label: "Gastos de octubre" },
	]}
/>

// Variantes del Figma: divider "slash", type "text-line" | "button" | "account"
<Breadcrumbs
	type="account"
	divider="slash"
	items={[
		{ label: "Regula", avatar: <AppIcon app="regula" size={24} /> },
		{ label: "Cuenta", accounts: cuentas, onAccountChange: cambiarCuenta },
		{ label: "Ajustes", href: "/ajustes/" },
	]}
/>`,
	PaginationDots: `<PaginationDots total={5} current={pagina} onChange={setPagina} variant="line" aria-label="Diapositivas" />`,
	Pagination: `<Pagination total={10} page={pagina} onChange={setPagina} />

// Variantes del Figma: type, shape, align y tamaño de página
<Pagination type="card-minimal" align="right" total={10} pageSizes={[10, 20, 50]} onPageSizeChange={cambiarTamano} />
<Pagination type="card-advanced" total={24} />
<Pagination type="card-button-group" shape="circle" total={10} />`,
	Pager: `<Pager
	prev={{ href: "/components/badge/", label: "Badge" }}
	next={{ href: "/components/button/", label: "Button" }}
/>`,
	SidebarNav: `<SidebarNav
	type="dual-tier"
	brand={
		<>
			<AppIcon app="regula" size={32} />
			Regula
		</>
	}
	search
	items={[
		{ icon: "home-line", label: "Inicio", href: "/", active: true },
		{
			icon: "bar-chart-01",
			label: "Panel",
			children: [
				{ icon: "eye", label: "Resumen", href: "/panel/" },
				{ icon: "bell-01", label: "Avisos", href: "/panel/avisos/", badge: 10 },
			],
		},
		{ icon: "currency-euro", label: "Pecunia", href: "/pecunia/", badge: 3 },
	]}
	featured={<SidebarCards.Progress title="Espacio usado" value={80} onClose={() => {}} />}
	account={{
		items: [{ label: "Ver perfil", shortcut: "⌘P" }],
		accounts: [{ value: "ana", name: "Ana", email: "ana@jotis.me", initials: "AN" }],
	}}
/>`,
	HeaderNav: `<HeaderNav
	type="dual-tier"
	brand={<AppIcon app="regula" size={32} />}
	items={[
		{ label: "Inicio", href: "/" },
		{
			label: "Panel",
			href: "/panel/",
			current: true,
			children: [
				{ label: "Resumen", href: "/panel/", current: true },
				{ label: "Informes", href: "/panel/informes/" },
			],
		},
	]}
	search={<Input aria-label="Buscar" placeholder="Buscar" icon="search-lg" />}
	account={<Dropdown label="Cuenta" items={[{ label: "Perfil" }]} />}
/>`,
	ContextMenu: `<ContextMenu
	aria-label="Acciones de la fila"
	items={[
		{ icon: "copy-01", label: "Copiar", shortcut: "⌘C", onSelect: copiar },
		{ icon: "edit-02", label: "Editar", onSelect: editar },
		{ divider: true },
		{ label: "Más herramientas", items: [{ label: "Exportar a CSV" }, { label: "Imprimir" }] },
		{ divider: true },
		{ icon: "trash-01", label: "Eliminar", danger: true, onSelect: eliminar },
	]}
>
	<Fila />
</ContextMenu>`,
	Dropdown: `<Dropdown
	label="Acciones"
	items={[
		{ icon: "copy-01", label: "Duplicar", onSelect: duplicar },
		{ divider: true },
		{ icon: "trash-01", label: "Eliminar", danger: true, onSelect: eliminar },
	]}
/>`,
	FilterBar: `<FilterBar
	segments={[
		{ value: "todo", label: "Todo" },
		{ value: "gastos", label: "Gastos" },
	]}
	defaultSegment="todo"
	onSearch={buscar}
	activeFilters={filtros}
	onRemoveFilter={quitarFiltro}
	onClear={limpiarFiltros}
	onOpenFilters={abrirFiltros}
/>`,
	CommandMenu: `<CommandMenu
	open={abierto}
	onClose={() => setAbierto(false)}
	groups={[
		{ label: "Apps", items: [{ icon: "currency-euro", label: "Pecunia", onSelect: irAPecunia }] },
		{ label: "Acciones", items: [{ icon: "plus", label: "Nuevo gasto", shortcut: "⌘N", onSelect: nuevoGasto }] },
	]}
/>`,
	Modal: `<Modal
	open={abierto}
	icon="trash-01"
	destructive
	title="¿Eliminar este gasto?"
	description="Se borrará también de los informes. No se puede deshacer."
	onClose={cerrar}
	actions={
		<>
			<Button hierarchy="secondary" onClick={cerrar}>Cancelar</Button>
			<Button destructive onClick={eliminar}>Eliminar</Button>
		</>
	}
/>`,
	Slideout: `<Slideout
	open={abierto}
	title="Alquiler"
	description="Movimiento del 1 de octubre"
	onClose={cerrar}
	actions={<Button onClick={guardar}>Guardar</Button>}
>
	<Input label="Concepto" defaultValue="Alquiler" />
</Slideout>`,
	CopyTooltip: `<Button onClick={(e) => copiar("bg-brand-solid", e.currentTarget)}>Copiar utilidad</Button>
<CopyTooltip />`,
	Tooltip: `<Tooltip title="Exportar a CSV" text="Incluye los movimientos filtrados.">
	<Button hierarchy="secondary" iconOnly="download-01" label="Exportar" />
</Tooltip>`,
	HelpIcon: `<label>Cuota mensual <HelpIcon title="Qué incluye" text="Impuestos incluidos, sin descuentos." placement="right" /></label>`,
	Alert: `<Alert color="error" title="No se pudo sincronizar" description="Revisa la conexión con el banco." />`,
	Notification: `<Notification
	color="success"
	title="Pago registrado"
	description="Has añadido 42,50 € a Suscripciones."
	onClose={quitarAviso}
/>`,
	Banner: `<Banner
	icon="zap"
	title="Nueva versión de Pecunia."
	description="Ahora con presupuestos compartidos."
	actions={<Button size="sm">Ver novedades</Button>}
	onClose={ocultar}
/>`,
	EmptyState: `<EmptyState
	title="Sin resultados"
	description="Ningún movimiento coincide con «León». Prueba con otro término o quita filtros."
	actions={<Button hierarchy="secondary">Limpiar búsqueda</Button>}
/>`,
	TreeView: `<TreeView
	aria-label="Documentos"
	items={[{ id: "notas", label: "Notas", children: [{ id: "leeme", label: "LEEME.md" }] }]}
	defaultOpen={["notas"]}
	onSelect={(item) => abrir(item.id)}
/>`,
	Table: `<Table
	title="Movimientos"
	count="240"
	columns={[
		{ key: "concepto", label: "Concepto", primary: true },
		{ key: "fecha", label: "Fecha" },
		{ key: "importe", label: "Importe", align: "right" },
	]}
	rows={[{ id: "1", concepto: "Alquiler", fecha: "01 oct", importe: "650,00 €" }]}
	footer={<Pagination total={24} />}
/>`,
	MetricCard: `<MetricCard
	label="Gasto del mes"
	value="1.284 €"
	change="12%"
	trend="down"
	period="vs. septiembre"
/>`,
	ActivityFeed: `<ActivityFeed
	connector
	items={[
		{
			author: "Ana Martín",
			avatar: { initials: "AM" },
			time: "Hace 2 h",
			text: <>Ha pagado <strong>Alquiler</strong></>,
		},
	]}
/>`,
	Message: `<Message author="Emptor" avatar={{ initials: "Em" }} time="10:24">
	He encontrado tres opciones por debajo de 200 €.
</Message>`,
	CalendarView: `<CalendarView
	events={[{ date: new Date(2026, 9, 29), title: "Pago del alquiler", color: "brand" }]}
	onSelectDate={(fecha) => abrirDia(fecha)}
/>

// Semana y día: la hora sale de date y la duración, de duration (minutos)
<CalendarView
	defaultView="week"
	events={[{ date: new Date(2027, 0, 8, 10, 0), title: "Olivia x Riley", color: "indigo", duration: 90 }]}
	onSelectEvent={(evento) => abrirEvento(evento)}
/>`,
	CodeSnippet: `<CodeSnippet language="bash" code="bun add @jotis-me/react" />`,
	PageHeader: `<PageHeader
	breadcrumbs={[{ label: "Inicio", href: "/", icon: "home-line" }, { label: "Pecunia" }]}
	title="Gastos"
	description="Controla lo que entra y lo que sale."
	actions={<Button iconLeading="plus">Nuevo gasto</Button>}
/>`,
	CardHeader: `<CardHeader
	title="Suscripciones"
	badge="12 activas"
	description="Pagos recurrentes de este mes."
	actions={<Button size="sm">Añadir</Button>}
/>`,
	SectionHeader: `<SectionHeader
	title="Contactos"
	description="Personas y empresas con las que tratas."
	actions={<Button size="sm" iconLeading="plus">Nuevo contacto</Button>}
/>`,
	SectionLabel: `<SectionLabel
	title="Equipo"
	required
	help="Quién puede ver y editar el proyecto."
	description="Gestiona quién entra y con qué permisos."
	actions={<Button hierarchy="link-color" size="sm">Invitar</Button>}
/>`,
	SectionFooter: `<SectionFooter
	start={<Button hierarchy="link-gray" href="/ayuda">Ver ayuda</Button>}
	actions={<Button size="sm" type="submit">Guardar cambios</Button>}
/>`,
	ContentDivider: `<ContentDivider label="o continúa con" />`,
	LinkCard: `<LinkCard
	href="/components/button/"
	title="Button"
	description="La acción de la pantalla."
	preview={<Button size="sm">Nuevo gasto</Button>}
/>`,
	InlineCTA: `<InlineCTA
	icon="stars-02"
	title="Conecta tu banco"
	description="Importa los movimientos cada día sin subir extractos a mano."
	actions={
		<>
			<Button hierarchy="secondary" size="sm" onClick={descartar}>
				Ahora no
			</Button>
			<Button size="sm" href="/ajustes/bancos">Conectar</Button>
		</>
	}
/>`,
	ScaledPreview: `<ScaledPreview width={1920} box={[360, 203]}>
	<StreamScene scale={1} variant="starting" seconds={300} countdownLabel="Para empezar" />
</ScaledPreview>`,
	TransparencyGrid: `<TransparencyGrid size="md" className="rounded-2xl p-6">
	<CamFrame ratio="16:9" width={400} name="Tu canal" />
</TransparencyGrid>`,
	BackgroundPattern: `<div className="relative">
	<BackgroundPattern pattern="grid" size="sm" mask="radial" />
	<div className="relative">Contenido</div>
</div>`,
	BrowserFrame: `<BrowserFrame url="pecunia.jotis.me/resumen" height={260}>
	<MetricCard label="Gasto de octubre" value="1.284,50 €" />
</BrowserFrame>`,
	CreditCard: `<CreditCard theme="brand-dark" company="Pecunia" holder="Administrador" expiry="06/29" last4="4821" />`,
	Carousel: `<Carousel
	aria-label="Novedades"
	slides={[<Tarjeta titulo="Importa tus extractos" />, <Tarjeta titulo="Categoriza solo" />, <Tarjeta titulo="Comparte informes" />]}
/>`,
	VideoPlayer: `<VideoPlayer src="/videos/presentacion.mp4" poster="/videos/presentacion.jpg" />`,
	LineChart: `<LineChart
	aria-label="Gastos de agosto a octubre"
	labels={["Ago", "Sep", "Oct"]}
	series={[
		{ name: "Gastos", data: [1240, 1060, 1284] },
		{ name: "Presupuesto", data: [1100, 1200, 1200] },
	]}
	format={(v) => formatCurrency(v)}
	legend="right"
	axisLabels={{ x: "Mes", y: "Gasto" }}
/>`,
	BarChart: `<BarChart
	aria-label="Gasto por categoría y mes"
	labels={["Ago", "Sep", "Oct"]}
	series={[
		{ name: "Hogar", data: [700, 700, 700] },
		{ name: "Ocio", data: [190, 170, 210] },
	]}
	format={(v) => formatCurrency(v)}
	legend="right"
	axisLabels={{ x: "Mes", y: "Gasto" }}
/>`,
	PieChart: `<PieChart
	aria-label="Gasto de octubre por categoría"
	center="1.284 €"
	data={[
		{ name: "Hogar", value: 700 },
		{ name: "Ocio", value: 210 },
		{ name: "Otros", value: 374 },
	]}
/>`,
	ChartLegend: `<ChartLegend series={[{ name: "Gastos" }, { name: "Presupuesto" }]} />`,
	StreamAlert: `<StreamAlert key={alerta.id} type="raid" user="TioBigotes" amount={1284} state="enter" />`,
	StreamEvents: `<StreamEvents
	animate
	items={[
		{ id: 3, type: "follow", user: "lucia_pixel", time: "ahora" },
		{ id: 2, type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
		{ id: 1, type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
	]}
/>`,
	StreamStatus: `<StreamStatus status="live" viewers={1284} uptime="2:14:05" category="Just Chatting" />`,
	ChatBadge: `<ChatBadge kind="mod" />
<ChatBadge kind="sub" size={28} />`,
	ChatBox: `<ChatBox
	translucent
	animate
	messages={[
		{ id: 1, user: "TioBigotes", tone: "sky", badges: ["mod"], text: "Bienvenidos todos." },
		{ id: 2, user: "lucia_pixel", tone: "pink", badges: ["sub"], text: "Esa jugada la he visto yo." },
	]}
/>`,
	CamFrame: `<CamFrame ratio="16:9" width={480} live name="Tu canal" role="ella/él" />`,
	StreamGoal: `<StreamGoal label="Meta de seguidores" current={1284} goal={2000} />`,
	NowPlaying: `<NowPlaying title="Cuatro paredes y un techo" artist="Los Vecinos del Quinto" progress={0.42} />`,
	StreamCountdown: `<StreamCountdown seconds={600} label="Empezamos en" />`,
	StreamScene: `<StreamScene variant="brb" seconds={480} countdownLabel="Vuelvo en" />`,
	ChannelPanel: `<ChannelPanel
	title="Horario"
	icon="calendar"
	rows={[
		{ label: "Lunes", value: "20:00" },
		{ label: "Viernes", value: "22:00" },
	]}
	action={{ label: "Ver todos los enlaces", href: "/enlaces", icon: "arrow-right" }}
/>`,
	ChannelBanner: `<ChannelBanner
	scale={1}
	name="Tu canal"
	tagline="Directos tranquilos y conversación sin guion."
	schedule={[
		{ day: "Lunes", time: "20:00" },
		{ day: "Viernes", time: "22:00" },
	]}
/>`,
};

const indent = (code: string, tabs: number) =>
	code
		.split("\n")
		.map((l) => "\t".repeat(tabs) + l)
		.join("\n");

/** Fragmentos de Next.js y Astro del componente `name`. */
export function snippetsOf(name: string, interactive: boolean): { next: string; astro: string } {
	const code = usage[name];
	if (!code) throw new Error(`Falta el fragmento de uso de ${name} en src/lib/snippets.ts`);
	const imp = `import { ${name} } from "@jotis-me/react";`;
	return {
		next: `${imp}\n\nexport default function Page() {\n\treturn (\n\t\t<>\n$indent(code, 3)\n\t\t</>\n\t);\n}`,
		astro: `---\n${imp}\n---\n\n${interactive ? code.replace(`<${name}`, `<${name} client:load`) : code}`,
	};
}
