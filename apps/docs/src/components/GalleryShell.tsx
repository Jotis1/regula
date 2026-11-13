// Lo que comparten las galerías de `/icons/` (`AssetGallery` y `LogoGallery`): la fila de filtros, la rejilla junto al
// panel del elegido y el estado sin resultados. En escritorio el panel va fijo a la derecha, de 320 px; por debajo de
// `lg` es un `Slideout` `bottom` (hoja inferior: foco atrapado, Escape y foco de vuelta a la baldosa pulsada).
import {
	Badge,
	Button,
	CodeSnippet,
	type CodeSnippetTab,
	EmptyState,
	Slideout,
	TransparencyGrid,
} from "@jotis-me/react";
import { Copy01, SearchLg } from "@untitledui/icons";
import { type ReactNode, useEffect, useState } from "react";

/** La rejilla de baldosas: 76 px de mínimo en móvil y 96 px desde `sm`. */
export const TILE_GRID =
	"m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2 p-0 sm:grid-cols-[repeat(auto-fill,minmax(96px,1fr))]";

/**
 * `IconTile` reserva para el dibujo un alto de 24 px como mucho. Las vistas previas más altas (banderas no, pero sí
 * archivos, cursores, pagos `md` y logos) sobresalen por igual arriba y abajo: estas clases le devuelven ese espacio al
 * hueco con el nombre y al relleno de la baldosa.
 */
export function tileFit(height: number): string | undefined {
	if (height <= 24) return undefined;
	return height <= 32 ? "gap-3 py-4" : "gap-4 py-5";
}

/** Por debajo de `lg` el panel no está a la vista: se abre como hoja inferior. */
export const isCompact = () => matchMedia("(max-width: 1023px)").matches;

/** Lleva el foco a la baldosa de un elemento de la rejilla, para que la hoja lo devuelva ahí al cerrarse. */
export function focusTile(attribute: string, value: string) {
	document.querySelector<HTMLElement>(`[${attribute}="${CSS.escape(value)}"] button`)?.focus();
}

/** El texto de un SVG servido por URL, para la pestaña «SVG» del panel. Mientras llega, `null`. */
export function useSvg(url: string | undefined): string | null {
	const [svg, setSvg] = useState<string | null>(null);
	useEffect(() => {
		setSvg(null);
		if (!url) return;
		let alive = true;
		fetch(url)
			.then((r) => r.text())
			.then((t) => {
				if (!alive) return;
				const text = t.trim();
				// Las carpetas con textura llevan un PNG de decenas de kB en base64: no cabe en un fragmento
				setSvg(
					text.length > 4000
						? `${text.slice(0, 3000)}\n<!-- … el resto del SVG está en el fichero -->`
						: text,
				);
			})
			.catch(() => alive && setSvg("No se pudo cargar el SVG."));
		return () => {
			alive = false;
		};
	}, [url]);
	return svg;
}

/** El elegido, tal como lo enseña el panel. */
export interface Chosen {
	/** El nombre que se copia. */
	name: string;
	/** Nombre legible junto al nombre (el país de una bandera). */
	subtitle?: string;
	/** Categoría o set, en una etiqueta. */
	badge?: string;
	/** El dibujo grande, sobre el damero. */
	big: ReactNode;
	/** Cómo se llama la lista de muestras: «Tamaños» o «Variantes». */
	samplesLabel: string;
	samples: { label: string; node: ReactNode }[];
	/** El código: la primera pestaña es la de React, la que copia «Copiar el código». */
	tabs: CodeSnippetTab[];
	note?: ReactNode;
}

function PanelBody({ chosen, nameId }: { chosen: Chosen; nameId?: string }) {
	const name = (
		<>
			{chosen.name}
			{chosen.subtitle ? (
				<span className="ml-2 font-body font-normal text-tertiary">{chosen.subtitle}</span>
			) : null}
		</>
	);
	const nameClass = "m-0 min-w-0 break-words font-mono text-sm font-medium text-primary";
	return (
		<div className="flex flex-col gap-4">
			<TransparencyGrid size="sm" className="rounded-lg">
				<div className="flex h-36 items-center justify-center text-fg-primary">{chosen.big}</div>
			</TransparencyGrid>
			<div className="flex items-center gap-2">
				{/* En la hoja el título ya es el nombre: aquí no se repite como encabezado */}
				{nameId ? (
					<h2 id={nameId} className={nameClass}>
						{name}
					</h2>
				) : (
					<p className={nameClass}>{name}</p>
				)}
				{chosen.badge ? (
					<Badge color="gray" size="sm">
						{chosen.badge}
					</Badge>
				) : null}
				<span className="grow" />
				<Button
					hierarchy="tertiary"
					size="sm"
					iconOnly={Copy01}
					label="Copiar nombre"
					data-copy={chosen.name}
				/>
			</div>
			{chosen.samples.length > 0 ? (
				<ul
					aria-label={chosen.samplesLabel}
					className="m-0 grid list-none gap-2 p-0"
					style={{ gridTemplateColumns: `repeat(${chosen.samples.length}, minmax(0, 1fr))` }}
				>
					{chosen.samples.map((s) => (
						<li
							key={s.label}
							className="flex flex-col items-center justify-end gap-1.5 rounded-lg border border-secondary px-1 py-2.5"
						>
							{s.node}
							<span className="text-xs text-quaternary">{s.label}</span>
						</li>
					))}
				</ul>
			) : null}
			<CodeSnippet lineNumbers={false} tabs={chosen.tabs} />
			{chosen.note ? <p className="m-0 text-xs text-tertiary">{chosen.note}</p> : null}
		</div>
	);
}

export interface GalleryShellProps {
	/** Prefijo de los id de la galería (`icon`, `flag`, `logo`…). */
	idPrefix: string;
	/** La fila de filtros: buscador, categoría y tamaño o variante. */
	filters: ReactNode;
	/** El recuento, que se anuncia al cambiar. */
	count: string;
	/** Nombre del panel del elegido: «Icono elegido». */
	asideLabel: string;
	chosen: Chosen | undefined;
	/** La hoja inferior (móvil) está abierta. */
	sheetOpen: boolean;
	onSheetClose: () => void;
	/** La rejilla y lo que va bajo ella. */
	children: ReactNode;
}

export function GalleryShell({
	idPrefix,
	filters,
	count,
	asideLabel,
	chosen,
	sheetOpen,
	onSheetClose,
	children,
}: GalleryShellProps) {
	const code = chosen?.tabs[0]?.code ?? "";
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center gap-3">
				{filters}
				<span className="hidden grow sm:block" />
				<p
					id={`${idPrefix}-count`}
					role="status"
					aria-live="polite"
					className="m-0 text-sm text-tertiary tabular-nums"
				>
					{count}
				</p>
			</div>
			<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
				<div className="min-w-0">{children}</div>
				<aside
					aria-label={asideLabel}
					className="sticky top-6 hidden max-h-[calc(100dvh-3rem)] flex-col gap-4 overflow-y-auto rounded-xl border border-secondary p-4 lg:flex"
				>
					{chosen ? (
						<>
							<PanelBody chosen={chosen} nameId={`${idPrefix}-detail-name`} />
							<Button iconLeading={Copy01} data-copy={code} className="w-full">
								Copiar el código
							</Button>
						</>
					) : null}
				</aside>
			</div>
			{chosen ? (
				<Slideout
					side="bottom"
					open={sheetOpen}
					title={chosen.name}
					description={chosen.subtitle ?? chosen.badge}
					onClose={onSheetClose}
					actions={
						<Button size="lg" iconLeading={Copy01} data-copy={code} className="w-full">
							Copiar el código
						</Button>
					}
				>
					<PanelBody chosen={chosen} />
				</Slideout>
			) : null}
		</div>
	);
}

/** Sin resultados: dice qué se buscó y ofrece la salida. */
export function GalleryEmpty({
	query,
	description,
	onClear,
}: {
	query: string;
	description: string;
	onClear: () => void;
}) {
	return (
		<div className="py-12">
			<EmptyState
				icon={SearchLg}
				title={query ? `Nada con «${query}»` : "Sin resultados"}
				description={description}
				actions={
					<Button hierarchy="secondary" onClick={onClear}>
						Limpiar búsqueda
					</Button>
				}
			/>
		</div>
	);
}
