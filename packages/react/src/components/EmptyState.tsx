import { AlertCircle, SearchLg, UploadCloud02 } from "@untitledui/icons";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { type EmptyMediaDrawing, emptyMedia } from "../internal/empty-media.generated.js";
import { DynIcon, type IconComponent, type IconProp } from "../internal/icon.js";
import { BackgroundPattern } from "./BackgroundPattern.js";
import { FeaturedIcon } from "./FeaturedIcon.js";

export type EmptyStateMedia =
	| "icon"
	| "illustration"
	| "file"
	| "folder"
	| "folder-glass"
	| "users-radius"
	| "users-row"
	| "integrations";
export type EmptyStateIllustration = "cloud" | "box" | "documents" | "credit-card";
export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps {
	/**
	 * Icono destacado (`FeaturedIcon` modern gris de 48px) con `media="icon"`, y el del centro de las cabeceras de
	 * usuarios e integraciones.
	 * @default "search-lg"
	 */
	icon?: IconProp;
	/** Qué pasa: "Sin resultados", "Aún no hay gastos". */
	title: ReactNode;
	/** Por qué está vacío y qué hacer. Nada de "¡Ups!". */
	description?: ReactNode;
	/** La siguiente acción: normalmente un `Button` secundario y uno primario. */
	actions?: ReactNode;
	/**
	 * Cabecera: `icon` (por defecto) · `illustration` · `file` (icono de archivo sobre rejilla) · `folder` ·
	 * `folder-glass` (carpeta translúcida) · `users-radius` (avatares en círculos) · `users-row` · `integrations`.
	 * @default "icon"
	 */
	media?: EmptyStateMedia;
	/**
	 * Dibujo de `media="illustration"`.
	 * @default "cloud"
	 */
	illustration?: EmptyStateIllustration;
	/**
	 * Avatares (`users-radius`, `users-row`) o logos (`integrations`) de la cabecera. Pueden ser fotos, iniciales o
	 * logos de `@jotis-me/assets/logos`; se recortan y se desvanecen hacia los bordes.
	 */
	items?: ReactNode[];
	/**
	 * `sm` título de 16 · `md` de 18 · `lg` de 20, y la cabecera a su escala.
	 * @default "sm"
	 */
	size?: EmptyStateSize;
	className?: string;
}

/** Escala de los dibujos del Figma (hechos a `md`) en cada tamaño. */
const SCALE: Record<EmptyStateSize, number> = { sm: 0.88, md: 1, lg: 1.28 };
const ILLUSTRATION_ICON: Record<EmptyStateIllustration, IconComponent> = {
	cloud: SearchLg,
	box: UploadCloud02,
	documents: UploadCloud02,
	"credit-card": AlertCircle,
};

function Drawing({ drawing, scale }: { drawing: EmptyMediaDrawing; scale: number }) {
	return (
		<svg
			width={drawing.width * scale}
			height={drawing.height * scale}
			viewBox={drawing.viewBox}
			fill="none"
			aria-hidden="true"
			focusable="false"
			className="block overflow-visible"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: dibujo del propio paquete, importado del Figma
			dangerouslySetInnerHTML={{ __html: drawing.inner }}
		/>
	);
}

/** Desvanecido hacia los lados de las cabeceras con avatares o logos. */
const FADE_X: CSSProperties = {
	maskImage: "linear-gradient(90deg, transparent, black 25%, black 75%, transparent)",
};

/** Avatares en tres anillos alrededor del icono, como el nodo «Users radius» del Figma. */
const RADIUS_SPOTS: [number, number][] = [
	[-118, -52],
	[-62, -86],
	[44, -92],
	[110, -60],
	[-128, 30],
	[-48, 34],
	[60, 30],
	[126, 42],
	[-150, -6],
	[150, -2],
];

function Media({
	media,
	illustration,
	icon,
	items,
	scale,
}: {
	media: Exclude<EmptyStateMedia, "icon">;
	illustration: EmptyStateIllustration;
	icon: IconProp;
	items: ReactNode[];
	scale: number;
}) {
	if (media === "illustration") {
		const drawing = emptyMedia[illustration];
		const glass = 56 * scale;
		return (
			<div aria-hidden="true" className="relative" style={{ width: drawing.width * scale }}>
				<Drawing drawing={drawing} scale={scale} />
				{/* El círculo de cristal del Figma: negro al 20 % con desenfoque del fondo */}
				<span
					className="absolute inline-flex items-center justify-center rounded-full bg-alpha-black-20 text-fg-white backdrop-blur-sm"
					style={{
						width: glass,
						height: glass,
						left: (drawing.width / 2 - 28) * scale,
						bottom: (drawing.height - 116) * scale,
					}}
				>
					<DynIcon icon={ILLUSTRATION_ICON[illustration]} size={Math.round(28 * scale)} />
				</span>
			</div>
		);
	}
	if (media === "file" || media === "folder") {
		const drawing = emptyMedia[media];
		return (
			<div aria-hidden="true" className="relative flex items-center justify-center">
				<div
					className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
					style={{ width: 480 * scale, height: 480 * scale }}
				>
					<BackgroundPattern
						pattern={media === "file" ? "grid" : "grid-check"}
						size="sm"
						width={480 * scale}
						height={480 * scale}
					/>
				</div>
				{media === "file" ? (
					<div
						className="relative rounded-full bg-linear-to-b from-(--bg-secondary) to-(--bg-quaternary)"
						style={{ padding: 32 * scale }}
					>
						<Drawing drawing={drawing} scale={scale} />
					</div>
				) : (
					<div className="relative">
						<Drawing drawing={drawing} scale={scale} />
					</div>
				)}
			</div>
		);
	}
	if (media === "folder-glass")
		return (
			<div aria-hidden="true">
				<Drawing drawing={emptyMedia["folder-glass"]} scale={scale} />
			</div>
		);

	const center = (
		<FeaturedIcon
			icon={icon}
			color="gray"
			size={scale > 1 ? "xl" : "lg"}
			variant="modern"
			className="relative z-10"
		/>
	);
	if (media === "users-radius") {
		const side = 336 * scale;
		return (
			<div
				aria-hidden="true"
				className="relative flex items-center justify-center overflow-hidden"
				style={{ width: side, height: 240 * scale }}
			>
				<div className="pointer-events-none absolute inset-0 -z-10">
					<BackgroundPattern pattern="circles" size="sm" />
				</div>
				{items.slice(0, RADIUS_SPOTS.length).map((item, i) => {
					const [x, y] = RADIUS_SPOTS[i] as [number, number];
					return (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
							key={i}
							className="absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2"
							style={{ marginLeft: x * scale, marginTop: y * scale }}
						>
							{item}
						</span>
					);
				})}
				{center}
			</div>
		);
	}
	if (media === "users-row") {
		const half = Math.ceil(items.length / 2);
		return (
			<div
				aria-hidden="true"
				className="flex items-center justify-center gap-3 overflow-hidden"
				style={{ ...FADE_X, width: 512 * scale }}
			>
				{items.slice(0, half).map((item, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
					<span key={i} className="inline-flex shrink-0">
						{item}
					</span>
				))}
				{center}
				{items.slice(half).map((item, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
					<span key={i + half} className="inline-flex shrink-0">
						{item}
					</span>
				))}
			</div>
		);
	}
	// integrations: dos filas desplazadas medio hueco, desvanecidas hacia los lados
	const half = Math.ceil(items.length / 2);
	const rows = [items.slice(0, half), items.slice(half)];
	return (
		<div
			aria-hidden="true"
			className="flex flex-col items-center gap-3 overflow-hidden"
			style={{ ...FADE_X, width: 512 * scale }}
		>
			{rows.map((row, r) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: dos filas fijas
					key={r}
					className="flex items-center gap-3"
					style={{ marginLeft: r === 0 ? 0 : 60 * scale }}
				>
					{row.map((item, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
							key={i}
							className="inline-flex shrink-0 items-center justify-center rounded-xl bg-fg-white p-2.5 shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]"
						>
							{item}
						</span>
					))}
				</div>
			))}
		</div>
	);
}

// Huecos del Figma: sm 16 entre cabecera y texto, 4 en el texto y 24 hasta las acciones; md 20, 8 y 32; lg 24, 8 y 32
const TEXT: Record<EmptyStateSize, { root: string; title: string; description: string; actions: string }> = {
	sm: {
		root: "flex flex-col items-center gap-4 px-4 py-8 text-center font-body",
		title: "m-0 text-md font-semibold text-primary",
		description: "mt-1 mb-0 max-w-[352px] text-sm text-tertiary",
		actions: "mt-2 flex flex-wrap items-center justify-center gap-3",
	},
	md: {
		root: "flex flex-col items-center gap-5 px-4 py-8 text-center font-body",
		title: "m-0 text-lg font-semibold text-primary",
		description: "mt-2 mb-0 max-w-[352px] text-sm text-tertiary",
		actions: "mt-3 flex flex-wrap items-center justify-center gap-3",
	},
	lg: {
		root: "flex flex-col items-center gap-6 px-4 py-8 text-center font-body",
		title: "m-0 text-xl font-semibold text-primary",
		description: "mt-2 mb-0 max-w-[352px] text-md text-tertiary",
		actions: "mt-2 flex flex-wrap items-center justify-center gap-3",
	},
};

/** Lo que se ve cuando una lista, tabla o búsqueda no tiene contenido: qué pasa y qué hacer. */
export function EmptyState({
	icon = SearchLg,
	title,
	description,
	actions,
	media = "icon",
	illustration = "cloud",
	items = [],
	size = "sm",
	className,
}: EmptyStateProps) {
	// Clases enteras por tamaño: `sm` es el EmptyState de siempre y su HTML no cambia
	const t = TEXT[size];
	return (
		<div
			className={cx(
				t.root,
				// Los fondos de rejilla y círculos van por detrás del texto y los botones
				media !== "icon" && "isolate",
				className,
			)}
		>
			{media === "icon" ? (
				<FeaturedIcon icon={icon} color="gray" size="lg" variant="modern" />
			) : (
				<Media
					media={media}
					illustration={illustration}
					icon={icon}
					items={items}
					scale={SCALE[size]}
				/>
			)}
			<div>
				<h3 className={t.title}>{title}</h3>
				{description ? <p className={t.description}>{description}</p> : null}
			</div>
			{actions ? <div className={t.actions}>{actions}</div> : null}
		</div>
	);
}
