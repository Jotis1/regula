import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export type FooterType =
	| "large-01"
	| "large-02"
	| "large-03"
	| "large-04"
	| "large-05"
	| "large-06"
	| "large-07"
	| "large-08"
	| "large-09"
	| "large-10"
	| "large-11"
	| "large-12"
	| "large-13"
	| "large-14"
	| "large-15"
	| "large-16"
	| "small-01"
	| "small-02"
	| "small-03"
	| "small-04";

export interface FooterLink {
	label: ReactNode;
	href: string;
	/** Tras el enlace, como «Nuevo». */
	badge?: ReactNode;
}

export interface FooterColumn {
	title: ReactNode;
	links: FooterLink[];
}

export interface FooterProps {
	/** Los tipos del Figma: dieciséis grandes y cuatro pequeños. @default "large-01" */
	type?: FooterType;
	/** `default` sobre `bg-primary` · `brand` sobre `bg-brand-section`. @default "default" */
	theme?: "default" | "brand";
	/** La marca (normalmente un enlace a la portada). */
	brand?: ReactNode;
	/** Una o dos líneas bajo la marca. */
	description?: ReactNode;
	/** Bajo la descripción: una valoración, los avatares de clientes… */
	extra?: ReactNode;
	/** Columnas de enlaces con su título. */
	columns?: FooterColumn[];
	/** Enlaces en una fila (los tipos sin columnas). */
	links?: FooterLink[];
	/** Llamada de arriba (o del pie en `large-14`): título, texto y acciones. */
	cta?: { title: ReactNode; description?: ReactNode; actions?: ReactNode };
	/** A la derecha: «Descarga la app» con sus insignias, un formulario de suscripción… */
	aside?: ReactNode;
	/** «© 2027 Regula. Todos los derechos reservados.» */
	copyright?: ReactNode;
	/** Enlaces legales del pie (Términos, Privacidad, Cookies). */
	legal?: FooterLink[];
	/** Iconos de redes, como enlaces con nombre. */
	social?: ReactNode;
	className?: string;
}

const WRAP = "mx-auto w-full max-w-[1280px] px-8 @max-3xl:px-4";

/** Colores por tema: título de columna, enlace, texto, texto suave, divisor y la banda. */
const TONE = {
	default: {
		root: "bg-primary",
		title: "text-quaternary",
		titleStrong: "text-primary",
		link: "text-tertiary hover:text-tertiary_hover",
		linkBrand: "text-brand-secondary hover:text-brand-secondary_hover",
		text: "text-tertiary",
		soft: "text-quaternary",
		heading: "text-primary",
		divider: "border-secondary",
		band: "bg-secondary",
	},
	brand: {
		root: "bg-brand-section",
		title: "text-tertiary_on-brand",
		titleStrong: "text-primary_on-brand",
		link: "text-secondary_on-brand hover:text-primary_on-brand",
		linkBrand: "text-secondary_on-brand hover:text-primary_on-brand",
		text: "text-tertiary_on-brand",
		soft: "text-quaternary_on-brand",
		heading: "text-primary_on-brand",
		divider: "border-brand_alt",
		band: "bg-brand-section_subtle",
	},
} as const;
type Tone = (typeof TONE)[keyof typeof TONE];

// Qué lleva cada tipo, del Figma
interface Layout {
	/** Arriba: la llamada centrada, a los lados, o en una banda con fondo. */
	cta?: "center" | "split" | "band" | "newsletter";
	/** El bloque de la marca a la izquierda de las columnas, o centrado. */
	brandBlock?: "side" | "center" | "bottom";
	columns?: boolean;
	/** Enlaces en fila bajo la marca. */
	rowLinks?: boolean;
	aside?: boolean;
	/** Columnas con título oscuro y enlaces de marca. */
	strong?: boolean;
	/** El pie: marca y copyright, copyright y redes, copyright y legales, formulario y copyright, o lema y copyright. */
	bottom: "brand" | "social" | "legal" | "form" | "tagline";
	/** El pie va en una banda con fondo. */
	bottomBand?: boolean;
}
const LAYOUT: Record<Exclude<FooterType, `small-${string}`>, Layout> = {
	"large-01": { columns: true, bottom: "brand" },
	"large-02": { brandBlock: "side", columns: true, bottom: "social", bottomBand: true },
	"large-03": { columns: true, aside: true, strong: true, bottom: "brand" },
	"large-04": { brandBlock: "side", columns: true, aside: true, strong: true, bottom: "legal" },
	"large-05": { cta: "newsletter", columns: true, bottom: "brand" },
	"large-06": { cta: "band", brandBlock: "side", columns: true, bottom: "social" },
	"large-07": { brandBlock: "side", rowLinks: true, aside: true, bottom: "social" },
	"large-08": { brandBlock: "side", rowLinks: true, aside: true, bottom: "legal" },
	"large-09": { cta: "center", columns: true, bottom: "brand" },
	"large-10": { cta: "split", brandBlock: "side", columns: true, bottom: "social" },
	"large-11": { cta: "center", brandBlock: "side", rowLinks: true, aside: true, bottom: "social" },
	"large-12": { cta: "band", brandBlock: "side", columns: true, bottom: "social" },
	"large-13": { cta: "center", brandBlock: "center", bottom: "legal" },
	"large-14": { brandBlock: "side", columns: true, bottom: "tagline" },
	"large-15": { brandBlock: "center", rowLinks: true, bottom: "legal" },
	"large-16": { brandBlock: "center", rowLinks: true, bottom: "form" },
};

function Links({ links, tone, className }: { links: FooterLink[]; tone: Tone; className?: string }) {
	return (
		<ul className={cx("m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0", className)}>
			{links.map((l) => (
				<li key={l.href + String(l.label)}>
					<a href={l.href} className={cx("text-md font-semibold no-underline", tone.link)}>
						{l.label}
					</a>
				</li>
			))}
		</ul>
	);
}

function Columns({ columns, tone, strong }: { columns: FooterColumn[]; tone: Tone; strong?: boolean }) {
	return (
		<div
			className="grid min-w-0 flex-1 gap-8 @max-3xl:!grid-cols-2"
			style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
		>
			{columns.map((c, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas; los títulos pueden ser nodos
				<div key={i} className="flex flex-col gap-4">
					<h2 className={cx("m-0 text-sm font-semibold", strong ? tone.titleStrong : tone.title)}>
						{c.title}
					</h2>
					<ul className="m-0 flex list-none flex-col gap-3 p-0">
						{c.links.map((l) => (
							<li key={l.href + String(l.label)} className="flex items-center gap-2">
								<a
									href={l.href}
									className={cx(
										"text-md font-semibold no-underline",
										strong ? tone.linkBrand : tone.link,
									)}
								>
									{l.label}
								</a>
								{l.badge}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

/**
 * Pie de una web de marketing (Figma `Footer`, `1517:334473`): los veinte tipos, con la marca, columnas o una fila de
 * enlaces, una llamada, un bloque a la derecha y el pie con el copyright, en los temas por defecto y de marca. En un
 * contenedor de menos de 768 px, las columnas se apilan de dos en dos y los bloques uno debajo de otro, como el Figma
 * en móvil.
 */
export function Footer({
	type = "large-01",
	theme = "default",
	brand,
	description,
	extra,
	columns = [],
	links = [],
	cta,
	aside,
	copyright,
	legal = [],
	social,
	className,
}: FooterProps) {
	const tone = TONE[theme];
	const root = cx("@container font-body", tone.root, className);
	const copy = copyright ? <p className={cx("m-0 text-md", tone.soft)}>{copyright}</p> : null;
	const legalLinks = legal.length ? (
		<ul className="m-0 flex list-none gap-4 p-0">
			{legal.map((l) => (
				<li key={l.href + String(l.label)}>
					<a href={l.href} className={cx("text-md no-underline", tone.soft, "hover:underline")}>
						{l.label}
					</a>
				</li>
			))}
		</ul>
	) : null;

	if (type.startsWith("small-")) {
		const row =
			"flex flex-wrap items-center justify-between gap-6 @max-3xl:flex-col @max-3xl:items-start";
		return (
			<footer className={root}>
				<div className={cx(WRAP, "py-12")}>
					{type === "small-01" ? (
						<div className={row}>
							{brand}
							{links.length ? <Links links={links} tone={tone} /> : null}
							{copy}
						</div>
					) : type === "small-02" ? (
						<div className={row}>
							{brand}
							{copy}
						</div>
					) : type === "small-03" ? (
						<div className={cx(row, "@3xl:grid @3xl:grid-cols-3")}>
							<div className="flex items-center gap-4">{social}</div>
							<div className="@3xl:justify-self-center">{brand}</div>
							<div className="@3xl:justify-self-end">{copy}</div>
						</div>
					) : (
						<div className="flex flex-col gap-8">
							<div className={row}>
								{brand}
								{aside}
							</div>
							<div className="flex justify-end @max-3xl:justify-start">{copy}</div>
						</div>
					)}
				</div>
			</footer>
		);
	}

	const L = LAYOUT[type as keyof typeof LAYOUT];
	const brandSide = (
		<div className="flex max-w-80 flex-col gap-6">
			{brand}
			{description ? <p className={cx("m-0 text-md", tone.text)}>{description}</p> : null}
			{extra}
			{L.rowLinks ? <Links links={links} tone={tone} /> : null}
		</div>
	);
	const ctaTitle = (big?: boolean) =>
		cta ? (
			<h2
				className={cx(
					"m-0 font-display font-semibold",
					tone.heading,
					big ? "text-display-sm @max-3xl:text-display-xs" : "text-xl",
				)}
			>
				{cta.title}
			</h2>
		) : null;
	const ctaText = cta?.description ? (
		<p
			className={cx(
				"m-0",
				tone.text,
				L.cta === "newsletter" || L.cta === "band" ? "text-md" : "text-xl @max-3xl:text-lg",
			)}
		>
			{cta.description}
		</p>
	) : null;

	let top: ReactNode = null;
	if (cta && L.cta === "center")
		top = (
			<div className="flex flex-col items-center gap-4 text-center">
				{L.brandBlock === "center" ? brand : null}
				{ctaTitle(true)}
				{ctaText}
				{cta.actions ? (
					<div className="mt-4 flex flex-wrap justify-center gap-3">{cta.actions}</div>
				) : null}
			</div>
		);
	else if (cta && L.cta === "split")
		top = (
			<div className="flex flex-wrap items-start justify-between gap-8">
				<div className="flex flex-col gap-4">
					{ctaTitle(true)}
					{ctaText}
				</div>
				{cta.actions ? <div className="flex flex-wrap gap-3">{cta.actions}</div> : null}
			</div>
		);
	else if (cta && (L.cta === "newsletter" || L.cta === "band"))
		top = (
			<div className="flex flex-wrap items-start justify-between gap-8">
				<div className="flex flex-col gap-2">
					{ctaTitle(type === "large-12")}
					{ctaText}
					{extra && L.cta === "newsletter" ? <div className="mt-4">{extra}</div> : null}
				</div>
				{cta.actions ? (
					<div className="flex flex-wrap gap-3 @max-3xl:w-full">{cta.actions}</div>
				) : null}
			</div>
		);

	const middle =
		L.brandBlock === "center" && !L.cta ? (
			<div className="flex flex-col items-center gap-8 text-center">
				{brand}
				{links.length ? <Links links={links} tone={tone} className="justify-center" /> : null}
			</div>
		) : L.columns || L.rowLinks || L.aside ? (
			<div className="flex gap-16 @max-3xl:flex-col @max-3xl:gap-12">
				{L.brandBlock === "side" ? <div className="flex-none @3xl:w-80">{brandSide}</div> : null}
				{L.columns ? (
					<Columns columns={columns} tone={tone} strong={L.strong} />
				) : (
					<div className="flex-1" />
				)}
				{L.aside && aside ? <div className="flex-none">{aside}</div> : null}
			</div>
		) : null;

	const bottomBar = (
		<div className="flex flex-wrap items-center justify-between gap-6 @max-3xl:flex-col @max-3xl:items-start">
			{L.bottom === "brand" ? (
				<>
					{brand}
					{copy}
				</>
			) : L.bottom === "social" ? (
				<>
					{copy}
					<div className="flex items-center gap-6">{social}</div>
				</>
			) : L.bottom === "legal" ? (
				<>
					{copy}
					{legalLinks}
				</>
			) : L.bottom === "form" ? (
				<>
					{aside}
					{copy}
				</>
			) : (
				<>
					<div className="flex flex-col gap-1">
						{cta ? (
							<p className={cx("m-0 text-lg font-semibold", tone.heading)}>{cta.title}</p>
						) : null}
						{cta?.description ? (
							<p className={cx("m-0 text-md", tone.text)}>{cta.description}</p>
						) : null}
					</div>
					{copy}
				</>
			)}
		</div>
	);

	const divider = cx("border-t", tone.divider);
	return (
		<footer className={root}>
			{L.cta === "band" && top ? (
				<div className={tone.band}>
					<div className={cx(WRAP, "py-12")}>{top}</div>
				</div>
			) : null}
			<div className={cx(WRAP, "flex flex-col gap-12 pt-12 pb-12 @3xl:pt-16")}>
				{top && L.cta !== "band" ? top : null}
				{top && L.cta !== "band" && middle && L.cta !== "center" ? <div className={divider} /> : null}
				{top && L.cta === "center" && middle && type === "large-11" ? (
					<div className={divider} />
				) : null}
				{middle}
				{L.bottomBand ? null : <div className={cx(divider, "pt-8")}>{bottomBar}</div>}
			</div>
			{L.bottomBand ? (
				<div className={tone.band}>
					<div className={cx(WRAP, "py-12")}>{bottomBar}</div>
				</div>
			) : null}
		</footer>
	);
}
