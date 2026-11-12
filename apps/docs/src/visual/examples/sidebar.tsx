// Vista previa de SidebarNav: los cinco tipos, el diseño adaptable y las trece tarjetas destacadas del Figma. Va en su
// propio fichero para que Tabs y FilterBar (que comparten `navigation.tsx`) no carguen Dropdown ni las tarjetas.

import {
	AppIcon,
	Avatar,
	AvatarGroup,
	Badge,
	Button,
	ButtonUtility,
	FeaturedIcon,
	Input,
	ProgressBar,
	SidebarCards,
	SidebarNav,
	type SidebarNavItem,
} from "@jotis-me/react";
import {
	AlertCircle,
	ArrowRight,
	ArrowUpRight,
	BarChart01,
	Bell01,
	Calendar,
	CheckCircle,
	ChevronRight,
	Clock,
	Copy01,
	Eye,
	File04,
	Folder,
	HomeLine,
	LayoutAlt01,
	LifeBuoy01,
	Link03,
	LogOut01,
	MessageChatCircle,
	PieChart03,
	Settings01,
	Star01,
	User01,
	Users01,
	ZapFast,
} from "@untitledui/icons";
import type { ReactNode } from "react";

const panelChildren: SidebarNavItem[] = [
	{ icon: Eye, label: "Resumen", href: "#", active: true },
	{ icon: Bell01, label: "Avisos", href: "#", badge: 10 },
	{ icon: BarChart01, label: "Analítica", href: "#" },
	{ icon: Star01, label: "Guardados", href: "#" },
	{ icon: Clock, label: "Programados", href: "#" },
	{ icon: User01, label: "De usuarios", href: "#" },
];

const mainItems: SidebarNavItem[] = [
	{ icon: HomeLine, label: "Inicio", href: "#" },
	{ icon: BarChart01, label: "Panel", children: panelChildren },
	{ icon: File04, label: "Documentos", href: "#" },
	{ icon: Calendar, label: "Calendario", href: "#" },
	{ icon: Users01, label: "Equipo", href: "#", badge: 8 },
];

const footer = [
	{ icon: <LifeBuoy01 />, label: "Soporte", href: "#" },
	{ icon: <Settings01 />, label: "Ajustes", href: "#" },
];

const person = { initials: "OR", name: "Olivia Rhye", supporting: "olivia@jotis.me" } as const;

const account = {
	items: [
		{ icon: User01, label: "Ver perfil", shortcut: "⌘P" },
		{ icon: File04, label: "Documentación" },
		{ divider: true as const },
		{ icon: LogOut01, label: "Cerrar sesión", shortcut: "⌥⇧Q" },
	],
	accounts: [
		{
			value: "olivia",
			name: "Olivia Rhye",
			email: "olivia@jotis.me",
			initials: "OR",
			status: "online" as const,
		},
		{ value: "sienna", name: "Sienna Hewitt", email: "sienna@jotis.me", initials: "SH" },
	],
	onAddAccount: () => {},
};

const brand = (
	<>
		<AppIcon app="regula" size={32} />
		Regula
	</>
);
const mark = <AppIcon app="regula" size={32} />;

const dismiss = (
	<Button hierarchy="link-gray" size="sm">
		Descartar
	</Button>
);

const spaceCard = (variant: "bar" | "circle") => (
	<SidebarCards.Progress
		variant={variant}
		title="Espacio usado"
		description="Tu equipo ha usado el 80 % del espacio. ¿Necesitas más?"
		value={80}
		onClose={() => {}}
		actions={
			<>
				{dismiss}
				<Button hierarchy="link-color" size="sm">
					Mejorar plan
				</Button>
			</>
		}
	/>
);

const frame = (height: number, children: ReactNode) => (
	<div style={{ height, display: "flex" }}>{children}</div>
);

/** Las trece tarjetas destacadas del Figma, hechas con `SidebarCards` y componentes de la librería. */
function FeaturedCards() {
	const checks = [
		"Completa tu perfil",
		"Verifica tu teléfono",
		"Activa el doble factor",
		"Añade tu cuenta bancaria",
	];
	return (
		<div className="flex flex-wrap items-start gap-3 [&>*]:w-[248px]">
			{spaceCard("bar")}
			{spaceCard("circle")}
			<SidebarCards.Notice
				onClose={() => {}}
				media={<div className="aspect-video bg-brand-solid" />}
				title="¡Hay novedades!"
				description="Mira la nueva vista del panel. Las páginas cargan más rápido."
				actions={
					<>
						{dismiss}
						<Button hierarchy="link-color" size="sm">
							¿Qué hay de nuevo?
						</Button>
					</>
				}
			/>
			<SidebarCards.Notice
				onClose={() => {}}
				icon={<FeaturedIcon variant="outline" size="sm" icon={AlertCircle} />}
				title="Preferencias de cookies"
				description="Usamos cookies para analizar el tráfico, recordar tus preferencias y mejorar tu experiencia."
				actions={
					<>
						<Button hierarchy="link-gray" size="sm">
							Rechazar todo
						</Button>
						<Button hierarchy="link-color" size="sm">
							Aceptar todo
						</Button>
					</>
				}
			/>
			<SidebarCards.Notice
				outline
				onClose={() => {}}
				icon={<FeaturedIcon variant="modern" color="gray" icon={<Link03 />} />}
				title="Invita a un amigo"
				description="Gana el 50 % durante 12 meses cuando alguien use tu enlace."
			>
				<div className="flex items-center gap-1">
					<Input size="sm" readOnly value="jotis.me/4060020" aria-label="Tu enlace" />
					<ButtonUtility icon={Copy01} label="Copiar enlace" />
				</div>
			</SidebarCards.Notice>
			<SidebarCards.Notice outline>
				<div className="flex items-baseline justify-between gap-1 text-sm">
					<span className="font-semibold text-primary">Completa tu cuenta</span>
					<span className="text-quaternary">Paso 3 de 4</span>
				</div>
				<ProgressBar value={75} label={false} aria-label="Cuenta completada" />
				<ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm font-medium text-tertiary">
					{checks.map((text, i) => (
						<li key={text} className="flex items-center gap-1.5">
							<CheckCircle
								size={20}
								className={i < 3 ? "text-fg-brand-primary" : "text-fg-quaternary"}
							/>
							{text}
						</li>
					))}
				</ul>
				<Button hierarchy="secondary" size="md" className="w-full">
					Continuar
				</Button>
			</SidebarCards.Notice>
			<SidebarCards.Upgrade
				onClose={() => {}}
				icon={<ZapFast />}
				title="Pasa a PRO"
				badge="20% DTO."
				description="Desbloquea más de 20 integraciones, 40 GB y informes avanzados."
				cta="Mejorar ahora"
			/>
			<SidebarCards.Notice
				outline
				onClose={() => {}}
				icon={
					<Badge color="success" dot size="sm" className="self-start">
						En línea
					</Badge>
				}
				title="¿Necesitas ayuda?"
				description="Nuestro equipo está listo para ayudarte."
			>
				<Button
					hierarchy="secondary"
					size="md"
					iconLeading={<MessageChatCircle />}
					className="w-full"
				>
					Hablar con soporte
				</Button>
			</SidebarCards.Notice>
			<SidebarCards.Notice
				outline
				onClose={() => {}}
				icon={
					<AvatarGroup
						size="sm"
						items={[
							{ initials: "SH" },
							{ initials: "AF" },
							{ initials: "PW" },
							{ initials: "OS" },
						]}
					/>
				}
				title={
					<span className="flex items-center gap-1.5">
						Únete al taller
						<Badge color="success" dot size="sm">
							En directo
						</Badge>
					</span>
				}
				description="Aprende a sacarle partido a tus datos con nuestro equipo."
				actions={
					<>
						{dismiss}
						<Button hierarchy="link-color" size="sm">
							¡Entrar!
						</Button>
					</>
				}
			/>
			<SidebarCards.Notice
				outline
				onClose={() => {}}
				icon={<Avatar size="sm" initials="ML" status="online" />}
				actions={
					<>
						{dismiss}
						<Button hierarchy="link-color" size="sm">
							Responder
						</Button>
					</>
				}
			>
				<div className="flex flex-col gap-1 text-sm">
					<div className="flex items-baseline gap-2">
						<span className="font-semibold text-primary">Mathilde Lewis</span>
						<span className="text-quaternary">hace 2 min</span>
					</div>
					<span className="text-secondary">He terminado mis notas. ¡Échales un vistazo!</span>
				</div>
			</SidebarCards.Notice>
			<SidebarCards.Notice outline onClose={() => {}} title="Proyectos actuales">
				<ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm font-medium text-tertiary">
					{[
						["bg-utility-brand-500", "Rediseño del panel"],
						["bg-utility-blue-500", "Gestor de contenidos"],
						["bg-utility-green-500", "Prototipos de la app"],
					].map(([dot, name]) => (
						<li key={name} className="flex items-center gap-2">
							<span aria-hidden className={`size-2.5 rounded-full ${dot}`} />
							<span className="flex-1">{name}</span>
							<ChevronRight size={16} className="text-fg-quaternary" />
						</li>
					))}
				</ul>
				<Button hierarchy="link-color" size="sm" iconTrailing={ArrowRight} className="self-start">
					Todos los proyectos
				</Button>
			</SidebarCards.Notice>
			<SidebarCards.Notice outline>
				<div className="flex items-baseline justify-between gap-1 text-sm">
					<span className="font-semibold text-primary">Prueba gratuita</span>
					<span className="text-quaternary">Quedan 24 días</span>
				</div>
				<ProgressBar value={32} label={false} aria-label="Prueba gratuita usada" />
				<Button hierarchy="secondary" size="md" className="w-full">
					Mejorar ahora
				</Button>
			</SidebarCards.Notice>
			<SidebarCards.Notice
				outline
				onClose={() => {}}
				title="Verifica este dispositivo"
				description="Abre la app y escanea el código QR de abajo."
			>
				<svg
					viewBox="0 0 96 96"
					role="img"
					aria-label="Código QR de ejemplo"
					className="mx-auto size-24 text-fg-primary"
				>
					<path
						fill="currentColor"
						d="M0 0h32v32H0zM8 8v16h16V8zM64 0h32v32H64zM72 8v16h16V8zM0 64h32v32H0zM8 72v16h16V72zM12 12h8v8h-8zM76 12h8v8h-8zM12 76h8v8h-8zM40 0h8v8h-8zM52 8h8v8h-8zM40 16h8v8h-8zM40 40h16v8H40zM60 40h8v16h-8zM72 44h24v8H72zM40 56h8v16h-8zM56 64h16v8H56zM80 60h8v12h-8zM44 80h12v8H44zM64 80h8v16h-8zM84 80h12v8H84zM0 40h8v16H0zM16 44h16v8H16z"
						fillRule="evenodd"
					/>
				</svg>
				<Button hierarchy="secondary" size="md" className="w-full">
					Verificar de otra forma
				</Button>
			</SidebarCards.Notice>
		</div>
	);
}

export function SidebarNavExample() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-wrap items-start gap-6">
				{frame(
					960,
					<SidebarNav
						brand={brand}
						search
						items={mainItems.map((item) =>
							item.children ? { ...item, defaultOpen: true } : item,
						)}
						footerItems={footer}
						featured={spaceCard("bar")}
						account={account}
					/>,
				)}
				{frame(
					960,
					<SidebarNav
						type="slim"
						brand={brand}
						mark={mark}
						items={mainItems.map((item) =>
							item.children ? { ...item, defaultOpen: true } : item,
						)}
						footerItems={footer}
						user={person}
					/>,
				)}
			</div>
			{frame(
				960,
				<SidebarNav
					type="dual-tier"
					brand={brand}
					search
					items={mainItems}
					footerItems={footer}
					featured={spaceCard("circle")}
					account={account}
				/>,
			)}
			<div className="flex flex-wrap items-start gap-6">
				{frame(
					820,
					<SidebarNav
						type="sections-dividers"
						brand={brand}
						search
						sections={[
							{
								items: [
									{ icon: HomeLine, label: "Inicio", href: "#" },
									{ icon: BarChart01, label: "Panel", href: "#", active: true },
								],
							},
							{
								items: [
									{
										icon: Folder,
										label: "Carpetas",
										defaultOpen: true,
										children: [
											{ label: "Ver todo", href: "#", badge: 18 },
											{ label: "Recientes", href: "#", badge: 8 },
											{ label: "Favoritas", href: "#", badge: 6 },
											{ label: "Compartidas", href: "#", badge: 4 },
										],
									},
								],
							},
							{
								items: [
									{ icon: <PieChart03 />, label: "Informes", href: "#" },
									{ icon: <Settings01 />, label: "Ajustes", href: "#" },
									{
										icon: <LifeBuoy01 />,
										label: "Soporte",
										href: "#",
										trailing: (
											<Badge color="success" dot size="sm">
												En línea
											</Badge>
										),
									},
									{
										icon: <LayoutAlt01 />,
										label: "Abrir en el navegador",
										href: "#",
										trailing: <ArrowUpRight size={20} />,
									},
								],
							},
						]}
						account={account}
					/>,
				)}
				{frame(
					820,
					<SidebarNav
						type="sections-subheadings"
						brand={brand}
						search
						sections={[
							{
								title: "General",
								items: [
									{ icon: BarChart01, label: "Panel", href: "#", active: true },
									{ icon: File04, label: "Documentos", href: "#" },
									{ icon: Calendar, label: "Calendario", href: "#" },
								],
							},
							{
								title: "Tu suite",
								items: [
									{ icon: <PieChart03 />, label: "Informes", href: "#" },
									{ icon: Users01, label: "Equipo", href: "#", badge: 8 },
								],
							},
							{
								title: "Tus equipos",
								items: ["Catálogo", "Velocidad", "Impulso"].map((label, i) => ({
									icon: <span aria-hidden className="size-5 rounded-full bg-brand-solid" />,
									label,
									href: "#",
									shortcut: `⌘${i + 1}`,
									trailing: <ChevronRight size={20} />,
								})),
							},
						]}
						account={account}
					/>,
				)}
			</div>
			<div className="flex flex-wrap items-start gap-6">
				<div style={{ width: 375, height: 56 }}>
					<SidebarNav responsive brand={brand} items={mainItems} />
				</div>
				<div style={{ width: 375, height: 820 }}>
					<SidebarNav
						responsive
						defaultMenuOpen
						brand={brand}
						search
						items={mainItems}
						footerItems={footer}
						account={account}
					/>
				</div>
			</div>
			<FeaturedCards />
		</div>
	);
}
