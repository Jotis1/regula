// MarketingNav en el ejemplo interactivo (un fichero por componente: design D4): la marca, las acciones y los
// elementos con menú son nodos, que se eligen entre opciones preparadas.
import { Button, NavMenu } from "@jotis-me/react";
import { BarChart01, CurrencyEuro } from "@untitledui/icons";
import type { Tweak } from "../lib/playground";

export { MarketingNav as default } from "@jotis-me/react";

const MENU = (
	<NavMenu.Section title="Producto">
		<NavMenu.Item
			href="#"
			icon={BarChart01}
			iconStyle="boxed"
			title="Informes"
			description="Lo que pasa con tu dinero."
		/>
		<NavMenu.Item
			href="#"
			icon={CurrencyEuro}
			iconStyle="boxed"
			title="Presupuestos"
			description="Gasta con un plan."
		/>
	</NavMenu.Section>
);

const MENU_CODE = [
	'<NavMenu.Section title="Producto">',
	'\t<NavMenu.Item href="#" icon={BarChart01} iconStyle="boxed" title="Informes" description="Lo que pasa con tu dinero." />',
	'\t<NavMenu.Item href="#" icon={CurrencyEuro} iconStyle="boxed" title="Presupuestos" description="Gasta con un plan." />',
	"</NavMenu.Section>",
].join("\n");

const ENLACES = [
	{ label: "Producto", href: "#" },
	{ label: "Precios", href: "#" },
	{ label: "Recursos", href: "#" },
	{ label: "Quiénes somos", href: "#" },
];

export const tweaks: Record<string, Tweak> = {
	brand: {
		kind: "content",
		options: [
			{
				label: "Regula",
				value: (
					<a href="/" className="font-display text-xl font-semibold text-primary no-underline">
						Regula
					</a>
				),
				code: '<a href="/" className="font-display text-xl font-semibold text-primary no-underline">Regula</a>',
			},
		],
	},
	actions: {
		kind: "content",
		options: [
			{
				label: "Entrar y empezar",
				value: (
					<>
						<Button hierarchy="secondary" size="sm">
							Entrar
						</Button>
						<Button size="sm">Empezar gratis</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary" size="sm">Entrar</Button>',
					'\t<Button size="sm">Empezar gratis</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
	items: {
		kind: "content",
		options: [
			{
				label: "Con menús",
				value: [
					{ label: "Producto", panel: { columns: [MENU] } },
					{ label: "Precios", href: "#" },
					{ label: "Recursos", panel: { columns: [MENU] } },
					{ label: "Quiénes somos", href: "#" },
				],
				code: [
					"[",
					`\t{ label: "Producto", panel: { columns: [${MENU_CODE.replaceAll("\n", "\n\t")}] } },`,
					'\t{ label: "Precios", href: "#" },',
					"]",
				].join("\n"),
				imports: ["NavMenu"],
			},
			{ label: "Solo enlaces", value: ENLACES, code: JSON.stringify(ENLACES) },
		],
	},
};
