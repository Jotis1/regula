// Puertos de las vistas previas de navegación de la guía (reference/components/*/preview.html).

import {
	IntegrationChatgptLogoGray,
	IntegrationClaudeLogoGray,
	IntegrationCursorLogoGray,
	IntegrationFigmaLogoGray,
	IntegrationGeminiLogoGray,
	IntegrationGithubLogoGray,
} from "@jotis-me/icons/logos";
import {
	AppIcon,
	AvatarLabel,
	Button,
	CommandMenu,
	ContextMenu,
	Dropdown,
	FilterBar,
	HeaderNav,
	type HeaderNavItem,
	Input,
	Pager,
	PaginationDots,
	ScaledPreview,
	SidebarNav,
	Tabs,
	TreeView,
} from "@jotis-me/react";
import { useState } from "react";
import { stack } from "./actions";

const sections = [
	{ id: "a", label: "Resumen" },
	{ id: "b", label: "Movimientos" },
	{ id: "c", label: "Ajustes" },
];

const settings = [
	{ id: "datos", label: "Mis datos" },
	{ id: "perfil", label: "Perfil" },
	{ id: "equipo", label: "Equipo" },
	{ id: "avisos", label: "Avisos", count: 2 },
	{ id: "api", label: "API" },
];

export function TabsExample() {
	return (
		<div className={stack}>
			<Tabs
				aria-label="Secciones"
				items={[
					{ id: "a", label: "Resumen" },
					{ id: "b", label: "Movimientos", count: 12 },
					{ id: "c", label: "Ajustes" },
				]}
			/>
			<Tabs aria-label="Vista" type="button-brand" items={sections} />
			<Tabs aria-label="Periodo" type="button-gray" items={sections} />
			<Tabs aria-label="Modo" type="button-border" items={sections} />
			<Tabs aria-label="Secciones a todo el ancho" fullWidth items={sections} />
			<Tabs aria-label="Modo a todo el ancho" type="button-border" fullWidth items={sections} />
			<div className="flex flex-wrap gap-x-16 gap-y-8">
				<Tabs aria-label="Ajustes con raya" orientation="vertical" type="line" items={settings} />
				<Tabs
					aria-label="Ajustes minimal"
					orientation="vertical"
					type="button-minimal"
					items={settings}
				/>
			</div>
		</div>
	);
}

export function PagerExample() {
	return (
		<div className={stack}>
			<Pager prev={{ href: "#", label: "Breadcrumbs" }} next={{ href: "#", label: "Sidebar nav" }} />
			<Pager next={{ href: "#", label: "Sidebar nav" }} />
		</div>
	);
}

export function SidebarNavExample() {
	return (
		<div style={{ height: 540, display: "flex" }}>
			<SidebarNav
				brand="jotis.me"
				search
				items={[
					{ icon: "home-line", label: "Inicio", href: "/", active: true },
					{ icon: "bar-chart-01", label: "Panel", href: "/", badge: 3 },
					{ icon: "currency-euro", label: "Pecunia", href: "/" },
					{ icon: "users-01", label: "Vinculum", href: "/" },
					{ icon: "file-04", label: "Ornatus", href: "/" },
				]}
				footerItems={[{ icon: "settings-02", label: "Ajustes", href: "/" }]}
				user={{ initials: "AD", name: "Administrador", supporting: "admin@jotis.me" }}
			/>
		</div>
	);
}

const zone =
	"flex items-center justify-center rounded-xl border border-dashed border-primary text-sm text-tertiary";

export function ContextMenuExample() {
	const [bars, setBars] = useState(["marcadores"]);
	const [profile, setProfile] = useState("olivia");
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] items-start gap-6">
			<ContextMenu
				defaultOpen
				previewAt={{ x: 16, y: 16 }}
				aria-label="Acciones"
				items={[
					{ label: "Cortar", shortcut: "⌘X" },
					{ label: "Copiar", shortcut: "⌘C" },
					{ label: "Pegar", shortcut: "⌘V" },
					{ divider: true },
					{ label: "Editar" },
					{ label: "Duplicar" },
					{ label: "Eliminar" },
					{ divider: true },
					{ label: "Ver detalles", items: [{ label: "Historial" }, { label: "Propiedades" }] },
				]}
				className={zone}
			>
				<span style={{ height: 360 }} className="flex items-end pb-3">
					Botón derecho aquí
				</span>
			</ContextMenu>
			<ContextMenu
				defaultOpen
				previewAt={{ x: 16, y: 16 }}
				aria-label="Navegador"
				items={[
					{ icon: "arrow-left", label: "Atrás" },
					{ icon: "arrow-right", label: "Adelante" },
					{ icon: "refresh-cw-01", label: "Recargar", shortcut: "⌘R" },
					{ icon: "edit-02", label: "Editar página" },
					{ icon: "star-01", label: "Añadir a favoritos" },
					{ divider: true },
					{
						section: "Barras",
						selection: "multiple",
						selected: bars,
						onSelectionChange: setBars,
						items: [
							{ value: "marcadores", label: "Mostrar marcadores" },
							{ value: "urls", label: "Mostrar URL completas" },
						],
					},
					{ divider: true },
					{
						section: "Perfil",
						selection: "single",
						selected: profile,
						onSelectionChange: setProfile,
						items: [
							{ value: "olivia", label: "Olivia Rhye" },
							{ value: "sienna", label: "Sienna Hewitt" },
						],
					},
					{ divider: true },
					{
						icon: "code-01",
						label: "Más herramientas",
						items: [{ label: "Guardar como", icon: "download-01" }, { label: "Desarrollador" }],
					},
				]}
				className={zone}
			>
				<span style={{ height: 480 }} className="flex items-end pb-3">
					Botón derecho aquí
				</span>
			</ContextMenu>
		</div>
	);
}

const headerBrand = (
	<span className="inline-flex items-center gap-2 font-display text-lg font-bold text-primary">
		<AppIcon app="regula" size={32} />
		Regula
	</span>
);

const headerItems: HeaderNavItem[] = [
	{ label: "Inicio", href: "#", icon: "home-line" },
	{
		label: "Panel",
		href: "#",
		icon: "bar-chart-01",
		current: true,
		children: [
			{ label: "Resumen", href: "#", current: true },
			{ label: "Avisos", href: "#", badge: 2 },
			{ label: "Analítica", href: "#" },
			{ label: "Informes guardados", href: "#" },
			{ label: "Informes programados", href: "#" },
		],
	},
	{ label: "Proyectos", href: "#", icon: "inbox-01", children: [{ label: "Todos", href: "#" }] },
	{ label: "Tareas", href: "#", icon: "check-circle", badge: 8 },
	{ label: "Usuarios", href: "#", icon: "users-01" },
];

const headerActions = (
	<>
		<Button hierarchy="tertiary" iconOnly="search-lg" label="Buscar" />
		<Button hierarchy="tertiary" iconOnly="settings-02" label="Ajustes" />
		<Button hierarchy="tertiary" iconOnly="bell-01" label="Avisos" />
	</>
);
const headerAccount = <Dropdown label="Cuenta" items={[{ label: "Perfil" }, { label: "Salir" }]} />;
const headerSearch = <Input aria-label="Buscar" placeholder="Buscar" icon="search-lg" size="sm" />;

/** Una cabecera a 1280px de ancho (la CSS elige escritorio por el ancho de la propia cabecera), encogida a la caja. */
function HeaderPreview({ height, children }: { height: number; children: React.ReactNode }) {
	return (
		<ScaledPreview width={1280} scale={0.6} box={[768, Math.round(height * 0.6)]}>
			{children}
		</ScaledPreview>
	);
}

export function HeaderNavExample() {
	return (
		<div className="flex flex-col gap-4">
			<HeaderPreview height={65}>
				<HeaderNav
					brand={headerBrand}
					items={headerItems}
					actions={headerActions}
					account={headerAccount}
				/>
			</HeaderPreview>
			<HeaderPreview height={129}>
				<HeaderNav
					type="dual-tier"
					brand={headerBrand}
					items={headerItems}
					search={headerSearch}
					actions={headerActions}
					account={headerAccount}
				/>
			</HeaderPreview>
			<HeaderPreview height={109}>
				<HeaderNav
					type="tabs"
					brand={headerBrand}
					items={headerItems}
					actions={headerActions}
					account={headerAccount}
				/>
			</HeaderPreview>
			<HeaderPreview height={129}>
				<HeaderNav
					type="centered"
					brand={headerBrand}
					items={headerItems}
					account={
						<>
							<Button hierarchy="secondary">Entrar</Button>
							<Button>Hazte PRO</Button>
						</>
					}
				/>
			</HeaderPreview>
			<div className="w-[375px] overflow-hidden rounded-xl border border-secondary">
				<HeaderNav
					brand={headerBrand}
					items={headerItems}
					search={headerSearch}
					mobile={{
						footerItems: [
							{ label: "Ajustes", href: "#", icon: "settings-02" },
							{ label: "Soporte", href: "#", icon: "user-01" },
						],
						footer: <AvatarLabel initials="OR" name="Olivia Rhye" supporting="olivia@jotis.me" />,
					}}
				/>
			</div>
		</div>
	);
}

const DD_ACCOUNTS = [
	{
		value: "olivia",
		name: "Olivia Rhye",
		email: "olivia@jotis.me",
		initials: "OR",
		status: "online" as const,
	},
	{ value: "sienna", name: "Sienna Hewitt", email: "sienna@jotis.me", initials: "SH" },
];

export function DropdownExample() {
	// El de elección única (ampliación sobre la guía, el de tema de la cabecera) es de lectura: el estado es de quien lo usa
	const [theme, setTheme] = useState("claro");
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			<div style={{ width: 280, height: 310 }}>
				<Dropdown
					label="Acciones"
					defaultOpen
					header={
						<AvatarLabel
							size="md"
							initials="AD"
							name="Administrador"
							supporting="admin@jotis.me"
						/>
					}
					items={[
						{ icon: "user-01", label: "Ver perfil", shortcut: "⌘P" },
						{ icon: "settings-02", label: "Ajustes", shortcut: "⌘S" },
						{ icon: "copy-01", label: "Duplicar" },
						{ divider: true },
						{ icon: "trash-01", label: "Eliminar", danger: true },
					]}
				/>
			</div>
			<div style={{ width: 280, height: 310 }}>
				<Dropdown
					label="Tema"
					defaultOpen
					selectedValue={theme}
					onSelectionChange={setTheme}
					items={[
						{ icon: "monitor-01", label: "Sistema", value: "sistema" },
						{ icon: "sun", label: "Claro", value: "claro" },
						{ icon: "moon-01", label: "Oscuro", value: "oscuro" },
					]}
				/>
			</div>
			{/* Búsqueda dentro del menú, con título de grupo y pie de texto */}
			<div style={{ width: 280, height: 400 }}>
				<Dropdown
					label="Gestionar acceso"
					defaultOpen
					searchable
					footer={
						<>
							<span>© Jotis</span>
							<span>v1.0.0</span>
						</>
					}
					items={[
						{ heading: "Equipos" },
						{ label: "Contabilidad" },
						{ label: "Ventas" },
						{ label: "Soporte" },
						{ divider: true },
						{ icon: "plus", label: "Crear equipo" },
					]}
				/>
			</div>
			{/* Integraciones: logos de 20px, secciones separadas */}
			<div style={{ width: 280, height: 400 }}>
				<Dropdown
					label="Copiar"
					variant="integrations"
					defaultOpen
					items={[
						{ icon: "code-01", label: "Ver como markdown" },
						{ icon: "copy-01", label: "Copiar como markdown" },
						{ divider: true },
						{ icon: <IntegrationClaudeLogoGray />, label: "Abrir en Claude" },
						{ icon: <IntegrationCursorLogoGray />, label: "Abrir en Cursor" },
						{ icon: <IntegrationChatgptLogoGray />, label: "Abrir en ChatGPT" },
						{ icon: <IntegrationGeminiLogoGray />, label: "Abrir en Gemini" },
						{ divider: true },
						{ icon: <IntegrationFigmaLogoGray />, label: "Abrir en Figma" },
						{ icon: <IntegrationGithubLogoGray />, label: "Crear Gist en GitHub" },
					]}
				/>
			</div>
			{/* Cuenta: tarjeta md con cabecera, la lista de cuentas y pie con botón */}
			<div style={{ width: 280, height: 520 }}>
				<Dropdown
					variant="account-card-md"
					defaultOpen
					accounts={DD_ACCOUNTS}
					onAddAccount={() => {}}
					header={
						<div className="flex min-w-0 flex-col text-sm">
							<span className="font-semibold text-primary">Cuenta PRO</span>
							<span className="text-tertiary">Se renueva el 10 de agosto de 2028</span>
						</div>
					}
					footer={<span>© Jotis</span>}
					items={[
						{ icon: "user-01", label: "Ver perfil", shortcut: "⌘P" },
						{ icon: "settings-02", label: "Ajustes", shortcut: "⌘S" },
						{ divider: true },
						{ accounts: true },
						{ divider: true },
						{ icon: "log-out-01", label: "Cerrar sesión" },
					]}
				/>
			</div>
			{/* Disparadores: avatar, migas y enlace, con el menú cerrado */}
			<div style={{ width: 280, height: 520 }} className="flex flex-col items-start gap-6">
				<Dropdown
					variant="account-avatar"
					label="Cuenta"
					accounts={DD_ACCOUNTS}
					items={[{ label: "Ver perfil" }]}
				/>
				<Dropdown
					variant="account-card-xs"
					accounts={DD_ACCOUNTS}
					items={[{ label: "Ver perfil" }]}
				/>
				<Dropdown
					variant="account-card-sm"
					accounts={DD_ACCOUNTS}
					items={[{ label: "Ver perfil" }]}
				/>
				<Dropdown
					variant="account-breadcrumb"
					accounts={DD_ACCOUNTS}
					items={[{ label: "Ver perfil" }]}
				/>
				<Dropdown
					label="Puede editar"
					triggerVariant="link"
					selectedValue="edit"
					items={[
						{ label: "Propietario", value: "owner" },
						{ label: "Puede editar", value: "edit" },
						{ label: "Puede ver", value: "view" },
					]}
				/>
			</div>
		</div>
	);
}

export function FilterBarExample() {
	return (
		<FilterBar
			segments={[
				{ value: "t", label: "Todo" },
				{ value: "g", label: "Gastos" },
				{ value: "i", label: "Ingresos" },
			]}
			defaultSegment="t"
			search
			searchPlaceholder="Buscar movimientos"
			activeFilters={[{ label: "Categoría: Hogar" }, { label: "Importe > 50 €" }]}
			onRemoveFilter={() => {}}
			onClear={() => {}}
		/>
	);
}

export function CommandMenuExample() {
	return (
		<div style={{ position: "relative", height: 500, borderRadius: 12, overflow: "hidden" }}>
			<CommandMenu
				contained
				autoFocus={false}
				onClose={() => {}}
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
							{ icon: "file-04", label: "Ornatus", description: "Lector Markdown" },
						],
					},
					{
						label: "Acciones",
						items: [
							{ icon: "plus", label: "Nuevo gasto", shortcut: "⌘N" },
							{ icon: "upload-cloud-02", label: "Importar extracto" },
							{ icon: "moon-01", label: "Cambiar a modo oscuro" },
						],
					},
				]}
			/>
		</div>
	);
}

export function TreeViewExample() {
	return (
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
						{ id: "casa", label: "Casa", children: [{ id: "mudanza", label: "mudanza.md" }] },
						{ id: "leeme", label: "LEEME.md", meta: "2 KB" },
					],
				},
				{ id: "recetas", label: "Recetas", children: [{ id: "r1", label: "paella.md" }] },
				{ id: "arch", label: "Archivo", icon: "inbox-01" },
			]}
		/>
	);
}

export function PaginationDotsExample() {
	const [page, setPage] = useState(2);
	return (
		<div className="grid grid-cols-2 gap-x-10 gap-y-8 rounded-xl bg-secondary p-8">
			{(["md", "lg"] as const).map((size) => (
				<div key={size} className="flex flex-col items-start gap-6">
					<PaginationDots total={3} current={2} size={size} />
					<PaginationDots total={3} current={2} size={size} framed />
					<PaginationDots total={3} current={2} size={size} variant="line" />
					<PaginationDots total={3} current={2} size={size} variant="line" framed />
				</div>
			))}
			<div className="col-span-2 flex flex-col items-start gap-3">
				<p className="m-0 text-sm text-tertiary">Con onChange, cada punto lleva a su página.</p>
				<PaginationDots
					total={5}
					current={page}
					onChange={setPage}
					variant="line"
					framed
					aria-label="Diapositivas"
				/>
			</div>
		</div>
	);
}
