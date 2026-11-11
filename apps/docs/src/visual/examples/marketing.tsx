// Vista previa de las piezas de la web de marketing. Las cabeceras se pintan a 1280 de ancho (escritorio) y se encogen
// con ScaledPreview; cada una con un menú abierto en línea (`previewItem`). Las imágenes son dibujos de color, sin fotos.

import {
	IconBookOpen01,
	IconBriefcase01,
	IconFileCode01,
	IconMessageChatCircle,
	IconPieChart01,
	IconPlayCircle,
	IconWallet02,
} from "@jotis-me/icons";
import {
	SocialFacebookLogoGray,
	SocialGithubLogoGray,
	SocialLinkedinLogoGray,
	SocialXLogoGray,
	StoreAppStoreLogo,
	StoreGooglePlayLogo,
} from "@jotis-me/icons/logos";
import {
	AppStoreBadge,
	AvatarGroup,
	Badge,
	BlogPostCard,
	type BlogPostCardType,
	Button,
	Footer,
	type FooterColumn,
	type FooterType,
	Input,
	MarketingNav,
	type MarketingNavItem,
	type MarketingNavMenu,
	type MarketingNavType,
	NavMenu,
	RatingBadge,
	ScaledPreview,
	SubscribeCard,
} from "@jotis-me/react";
import type { ReactNode } from "react";

const marca = (
	<a href="/" className="font-display text-xl font-semibold text-primary no-underline">
		Regula
	</a>
);
const acciones = (
	<>
		<Button hierarchy="secondary" size="sm">
			Entrar
		</Button>
		<Button size="sm">Empezar gratis</Button>
	</>
);
const enlacesMovil = [
	{ label: "Quiénes somos", href: "#" },
	{ label: "Ayuda", href: "#" },
	{ label: "Prensa", href: "#" },
	{ label: "Contacto", href: "#" },
];

/** Un dibujo de color en lugar de una foto. */
const Media = ({ tone }: { tone: string }) => <div className={`size-full ${tone}`} />;

const recursos = (
	<NavMenu.Section title="Recursos">
		<NavMenu.Item
			href="#"
			icon={<IconBookOpen01 />}
			title="Blog"
			description="Ideas y guías para ordenar tu dinero."
		/>
		<NavMenu.Item href="#" icon="stars-02" title="Historias" description="Cómo lo usan otras personas." />
		<NavMenu.Item
			href="#"
			icon={<IconPlayCircle />}
			title="Vídeos"
			description="Empieza en cinco minutos."
		/>
		<NavMenu.Item
			href="#"
			icon={<IconFileCode01 />}
			title="Documentación"
			description="Todo, paso a paso."
		/>
	</NavMenu.Section>
);
const producto = (
	<NavMenu.Section title="Producto">
		<NavMenu.Item
			href="#"
			icon="bar-chart-01"
			iconStyle="boxed"
			title="Informes"
			description="Lo que pasa con tu dinero."
		/>
		<NavMenu.Item
			href="#"
			icon={<IconWallet02 />}
			iconStyle="boxed"
			title="Presupuestos"
			description="Gasta con un plan."
		/>
		<NavMenu.Item
			href="#"
			icon={<IconPieChart01 />}
			iconStyle="boxed"
			title="Categorías"
			description="Cada gasto en su sitio."
		/>
	</NavMenu.Section>
);
const usos = (
	<NavMenu.Section title="Para qué">
		<NavMenu.Item
			href="#"
			icon="check-circle"
			iconStyle="boxed"
			title="Ahorrar"
			description="Metas con fecha."
		/>
		<NavMenu.Item
			href="#"
			icon="users-01"
			iconStyle="boxed"
			title="En pareja"
			description="Cuentas compartidas."
			badge={
				<Badge size="sm" color="gray" type="modern">
					Nuevo
				</Badge>
			}
		/>
		<NavMenu.Item
			href="#"
			icon={<IconBriefcase01 />}
			iconStyle="boxed"
			title="Autónomos"
			description="Gastos e impuestos."
		/>
	</NavMenu.Section>
);
const empezar = (
	<NavMenu.Section title="Empezar">
		<NavMenu.Item href="#" title="Primeros pasos" />
		<NavMenu.Item href="#" title="Importar el banco" />
		<NavMenu.Item href="#" title="Crear categorías" />
		<NavMenu.Item href="#" title="Exportar" />
	</NavMenu.Section>
);
const novedad = (
	<NavMenu.Card
		media={<Media tone="bg-brand-solid" />}
		title="Ya está aquí el nuevo panel"
		description="Más claro y tres veces más rápido."
		actions={
			<>
				<Button hierarchy="link-gray" size="sm">
					Descartar
				</Button>
				<Button hierarchy="link-color" size="sm">
					Novedades
				</Button>
			</>
		}
	/>
);
const entradas = (
	<NavMenu.Section title="Últimas entradas">
		{[
			[
				"bg-utility-brand-200",
				"La regla del 50/30/20",
				"Reparte tu sueldo en tres partes sin hojas de cálculo.",
			],
			["bg-utility-sky-200", "Gastos hormiga", "Lo que se va sin que lo veas, y cómo pararlo."],
			["bg-utility-pink-200", "Tu primer fondo de emergencia", "Cuánto guardar y dónde tenerlo."],
		].map(([tone, title, text]) => (
			<NavMenu.Card
				key={title}
				href="#"
				layout="horizontal"
				media={<Media tone={tone as string} />}
				title={title}
				description={text}
			/>
		))}
	</NavMenu.Section>
);
const pie = (
	<>
		<span className="text-sm text-tertiary">
			¿Empezamos?{" "}
			<a href="/start/install/" className="font-semibold text-brand-secondary no-underline">
				Crea tu cuenta gratis
			</a>
		</span>
		<span className="flex gap-4">
			<Button hierarchy="link-color" size="sm" iconLeading={<IconPlayCircle />}>
				Ver la demo
			</Button>
			<Button hierarchy="link-color" size="sm" iconLeading={<IconMessageChatCircle />}>
				Hablar con ventas
			</Button>
		</span>
	</>
);

const navItems = (panel: MarketingNavItem["panel"]): MarketingNavItem[] => [
	{ label: "Producto", panel },
	{ label: "Precios", href: "#" },
	{ label: "Recursos", panel },
	{ label: "Quiénes somos", href: "#" },
];

function Demo({
	menu,
	type,
	panel,
	height,
	floating,
	label,
}: {
	menu: MarketingNavMenu;
	type: MarketingNavType;
	panel: MarketingNavItem["panel"];
	height: number;
	floating?: boolean;
	label: ReactNode;
}) {
	return (
		<figure className="m-0 flex flex-col gap-2">
			<figcaption className="text-sm font-medium text-tertiary">{label}</figcaption>
			<ScaledPreview
				width={1280}
				box={[768, Math.round(height * 0.6)]}
				className="rounded-lg bg-secondary"
			>
				<div style={{ height }}>
					<MarketingNav
						brand={marca}
						items={navItems(panel)}
						actions={acciones}
						menu={menu}
						type={type}
						floating={floating}
						previewItem="Recursos"
					/>
				</div>
			</ScaledPreview>
		</figure>
	);
}

/** Desplegables y a todo el ancho, con un menú abierto; abajo, la versión móvil. */
export function MarketingNavExample() {
	return (
		<div className="flex flex-col gap-8">
			<Demo
				label="Desplegable, simple"
				menu="dropdown"
				type="simple"
				panel={{ columns: [recursos] }}
				height={460}
			/>
			<Demo
				label="Desplegable, con tarjeta destacada y flotante"
				menu="dropdown"
				type="featured-card"
				floating
				panel={{ columns: [recursos], aside: novedad }}
				height={500}
			/>
			<Demo
				label="Desplegable, dos columnas con enlaces y pie"
				menu="dropdown"
				type="2-col-with-links-and-footer"
				panel={{ columns: [empezar, recursos], footer: pie }}
				height={520}
			/>
			<Demo
				label="A todo el ancho, cuatro columnas con pie"
				menu="full-width"
				type="4-col-with-footer"
				panel={{ columns: [producto, usos, recursos, empezar], footer: pie }}
				height={560}
			/>
			<Demo
				label="A todo el ancho, dos columnas con entradas al lado"
				menu="full-width"
				type="2-col-with-sidebar"
				panel={{ columns: [recursos, producto], aside: entradas }}
				height={520}
			/>
			<figure className="m-0 flex flex-col gap-2">
				<figcaption className="text-sm font-medium text-tertiary">Móvil</figcaption>
				<div className="w-[375px] max-w-full rounded-lg bg-secondary">
					<MarketingNav
						brand={marca}
						items={navItems({ columns: [recursos] })}
						actions={acciones}
						mobileLinks={enlacesMovil}
					/>
				</div>
			</figure>
		</div>
	);
}

const COLUMNAS: FooterColumn[] = [
	{
		title: "Producto",
		links: [
			{ label: "Resumen", href: "#" },
			{ label: "Funciones", href: "#" },
			{
				label: "Informes",
				href: "#",
				badge: (
					<Badge size="sm" color="gray" type="modern">
						Nuevo
					</Badge>
				),
			},
			{ label: "Precios", href: "#" },
		],
	},
	{
		title: "Empresa",
		links: [
			{ label: "Quiénes somos", href: "#" },
			{ label: "Empleo", href: "#" },
			{ label: "Prensa", href: "#" },
		],
	},
	{
		title: "Recursos",
		links: [
			{ label: "Blog", href: "#" },
			{ label: "Ayuda", href: "#" },
			{ label: "Guías", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Términos", href: "#" },
			{ label: "Privacidad", href: "#" },
			{ label: "Cookies", href: "#" },
		],
	},
];
const FILA = ["Resumen", "Funciones", "Precios", "Empleo", "Ayuda", "Privacidad"].map((label) => ({
	label,
	href: "#",
}));
const LEGAL = ["Términos", "Privacidad", "Cookies"].map((label) => ({ label, href: "#" }));
const redes = (
	<>
		{(
			[
				["X", SocialXLogoGray],
				["LinkedIn", SocialLinkedinLogoGray],
				["Facebook", SocialFacebookLogoGray],
				["GitHub", SocialGithubLogoGray],
			] as const
		).map(([name, Logo]) => (
			<a
				key={name}
				href={`/redes/${name.toLowerCase()}`}
				aria-label={name}
				className="flex text-fg-quaternary hover:text-fg-quaternary_hover"
			>
				<Logo size={24} />
			</a>
		))}
	</>
);
const suscripcion = (
	<div className="flex w-full max-w-[360px] flex-col gap-3">
		<p className="m-0 text-sm font-semibold text-primary">Al día</p>
		<div className="flex gap-3">
			<Input aria-label="Tu correo" placeholder="Tu correo" className="flex-1" />
			<Button>Suscribirme</Button>
		</div>
	</div>
);
const app = (
	<div className="flex flex-col gap-4">
		<p className="m-0 text-sm font-semibold text-brand-secondary">Descarga la app</p>
		<AppStoreBadge store="app-store" href="#" logo={<StoreAppStoreLogo />} />
		<AppStoreBadge store="google-play" href="#" logo={<StoreGooglePlayLogo />} />
	</div>
);
const ASIDE: Partial<Record<FooterType, "app" | "form">> = {
	"large-03": "app",
	"large-04": "form",
	"large-07": "app",
	"large-08": "form",
	"large-11": "app",
	"large-16": "form",
	"small-04": "form",
};
const CTA_FORM = new Set<FooterType>(["large-05", "large-06", "large-12"]);

function Pie({ type, theme }: { type: FooterType; theme?: "default" | "brand" }) {
	const aside = ASIDE[type] === "app" ? app : ASIDE[type] === "form" ? suscripcion : undefined;
	return (
		<Footer
			type={type}
			theme={theme}
			brand={
				<a
					href="/"
					className={`font-display text-xl font-semibold no-underline ${theme === "brand" ? "text-primary_on-brand" : "text-primary"}`}
				>
					Regula
				</a>
			}
			description="Tus cuentas, claras y en un sitio."
			extra={
				type === "large-02" || type === "large-06" ? (
					<RatingBadge title="La mejor app de finanzas" supportingText="2.000+ reseñas" />
				) : type === "large-04" || type === "large-05" || type === "large-12" ? (
					<AvatarGroup
						size="sm"
						items={[{ initials: "AM" }, { initials: "LR" }, { initials: "PG" }]}
					/>
				) : undefined
			}
			columns={type === "large-14" ? COLUMNAS.slice(0, 3) : COLUMNAS}
			links={FILA}
			cta={
				CTA_FORM.has(type)
					? {
							title: type === "large-12" ? "Entérate cuando salga" : "Recibe nuestra carta",
							description: "Una vez a la semana. Sin spam.",
							actions: (
								<div className="flex gap-3">
									<Input aria-label="Tu correo" placeholder="Tu correo" />
									<Button>Suscribirme</Button>
								</div>
							),
						}
					: type === "large-14"
						? {
								title: "Ordena tu dinero con Regula",
								description: "Menos tiempo con las cuentas, más con lo que importa.",
							}
						: {
								title:
									type === "large-10" ? "Prueba 30 días gratis" : "Empieza hoy con Regula",
								description: "Más de 4.000 personas ya ordenan sus cuentas.",
								actions: (
									<>
										<Button hierarchy="secondary">Ver la demo</Button>
										<Button>Empezar</Button>
									</>
								),
							}
			}
			aside={aside}
			copyright="© 2027 Regula. Todos los derechos reservados."
			legal={LEGAL}
			social={redes}
		/>
	);
}

const TIPOS: FooterType[] = [
	...Array.from({ length: 16 }, (_, i) => `large-${String(i + 1).padStart(2, "0")}` as FooterType),
	"small-01",
	"small-02",
	"small-03",
	"small-04",
];

/** Los veinte tipos a 1280 de ancho, encogidos; el tema de marca; y la versión móvil, a 375. */
export function FooterExample() {
	return (
		<div className="flex flex-col gap-8">
			<div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
				{TIPOS.map((type) => (
					<figure key={type} className="m-0 flex flex-col gap-2">
						<figcaption className="text-sm font-medium text-tertiary">{type}</figcaption>
						<ScaledPreview
							width={1280}
							box={[368, type.startsWith("small") ? 70 : 175]}
							className="rounded-lg shadow-[inset_0_0_0_1px_var(--border-secondary)]"
						>
							<Pie type={type} />
						</ScaledPreview>
					</figure>
				))}
			</div>
			<figure className="m-0 flex flex-col gap-2">
				<figcaption className="text-sm font-medium text-tertiary">large-01 · marca</figcaption>
				<ScaledPreview width={1280} box={[768, 280]} className="rounded-lg">
					<Pie type="large-01" theme="brand" />
				</ScaledPreview>
			</figure>
			<figure className="m-0 flex flex-col gap-2" data-footer-mobile>
				<figcaption className="text-sm font-medium text-tertiary">Móvil (375)</figcaption>
				<div className="w-[375px] max-w-full rounded-lg shadow-[inset_0_0_0_1px_var(--border-secondary)]">
					<Pie type="large-01" />
				</div>
			</figure>
		</div>
	);
}

/** Una portada sin fotos: un degradado de la marca con un dibujo. */
const Portada = ({ tono }: { tono: string }) => (
	<div className={`flex size-full items-center justify-center ${tono}`}>
		<div className="size-1/3 rounded-full bg-primary/40 shadow-[var(--shadow-xl)]" />
	</div>
);
const ENTRADA = {
	href: "#",
	title: "La regla del 50/30/20",
	description:
		"Reparte tu sueldo en tres partes sin hojas de cálculo y sin perder de vista lo que importa.",
	category: "Ahorro",
	readTime: "8 min de lectura",
	author: { name: "Ana Martín", date: "20 ene 2027" },
	tags: [
		{ label: "Ahorro" },
		{ label: "Sueldo", color: "blue" as const },
		{ label: "Hábitos", color: "pink" as const },
	],
};
const TONOS = ["bg-utility-brand-200", "bg-utility-sky-200", "bg-utility-pink-200", "bg-utility-green-200"];

/** Los ocho tipos en vertical y dos en horizontal. */
export function BlogPostCardExample() {
	const tipos: BlogPostCardType[] = [
		"simple-01",
		"simple-02",
		"simple-03",
		"simple-04",
		"card-01",
		"card-02",
		"card-03",
		"card-04",
	];
	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
				{tipos.map((type, i) => (
					<BlogPostCard
						key={type}
						type={type}
						{...ENTRADA}
						image={<Portada tono={TONOS[i % 4] as string} />}
					/>
				))}
			</div>
			<div className="grid gap-8">
				<BlogPostCard
					{...ENTRADA}
					orientation="horizontal"
					image={<Portada tono="bg-utility-brand-200" />}
				/>
				<BlogPostCard
					{...ENTRADA}
					type="card-01"
					orientation="horizontal"
					image={<Portada tono="bg-utility-sky-200" />}
				/>
			</div>
		</div>
	);
}

/** Por defecto y con la raya de marca. */
export function SubscribeCardExample() {
	const privacidad = (
		<>
			Lee nuestra{" "}
			<a href="/foundations/content/" className="text-tertiary underline">
				política de privacidad
			</a>
			.
		</>
	);
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
			<SubscribeCard
				description="Sin spam. Solo novedades, consejos y entrevistas, una vez a la semana."
				privacy={privacidad}
			/>
			<SubscribeCard
				type="line"
				description="Sin spam. Solo novedades, consejos y entrevistas, una vez a la semana."
				privacy={privacidad}
			/>
		</div>
	);
}
