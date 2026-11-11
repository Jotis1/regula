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
	Badge,
	Button,
	MarketingNav,
	type MarketingNavItem,
	type MarketingNavMenu,
	type MarketingNavType,
	NavMenu,
	ScaledPreview,
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
