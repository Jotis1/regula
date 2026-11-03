// Galería de iconos (reference/docs-design/Icons.dc.html e IconsM.dc.html): buscador por nombre, tamaño de vista
// previa, recuento y el panel del icono elegido con sus tamaños, el uso por contexto de la guía y su código con
// `@jotis-me/icons` (componente React, importación del SVG y el SVG en bruto). En escritorio el panel va a la
// derecha; en móvil se abre como hoja inferior (`<dialog>` modal: foco atrapado, Escape y foco de vuelta).
import { type IconName, iconNames, iconSvg } from "@jotis-me/icons";
import { Button, ButtonGroup, CodeSnippet, EmptyState, Icon, Input } from "@jotis-me/react";
import { useEffect, useRef, useState } from "react";

const SIZES = ["16", "20", "24"] as const;
const pascal = (name: string) =>
	name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");
const camel = (name: string) => {
	const p = pascal(name);
	return p.charAt(0).toLowerCase() + p.slice(1);
};

/** El código del icono: el componente de `@jotis-me/icons`, el SVG importado (Astro sin React) y el SVG en bruto. */
export function iconCode(name: IconName) {
	const component = `Icon${pascal(name)}`;
	return [
		{
			label: "React",
			code: `import { ${component} } from "@jotis-me/icons";\n\n<${component} size={20} />`,
		},
		{
			label: "Importar SVG",
			code: `---\nimport ${camel(name)} from "@jotis-me/icons/svg/${name}.svg?raw";\n---\n\n<Fragment set:html={${camel(name)}} />`,
		},
		{ label: "SVG", code: iconSvg(name, 24) },
	];
}

/** Uso por contexto, de la guía (Iconografía): el tamaño según dónde va. */
const CONTEXTS = [
	{ label: "Botón e input", size: "20 px" },
	{ label: "xs y menús", size: "16 px" },
	{ label: "Navegación", size: "24 px" },
];

function Panel({ name, onClose }: { name: IconName; onClose?: () => void }) {
	return (
		<div className="flex flex-col">
			<div className="flex h-42 items-center justify-center gap-8 bg-secondary text-fg-primary shadow-[inset_0_-1px_0_var(--border-secondary)]">
				{[16, 20, 24, 48].map((s) => (
					<Icon key={s} name={name} size={s} />
				))}
			</div>
			<div className="flex flex-col gap-4 p-5">
				<div className="flex items-start gap-3">
					<div className="min-w-0 grow">
						<h2
							id={onClose ? "icon-sheet-name" : "icon-detail-name"}
							className="font-mono text-md font-semibold text-primary"
						>
							{name}
						</h2>
						<p className="mt-0.5 text-[13px] leading-5 text-tertiary">
							React:{" "}
							<code className="font-mono text-xs font-medium text-secondary">
								Icon{pascal(name)}
							</code>
						</p>
					</div>
					<Button hierarchy="secondary" size="sm" iconLeading="copy-01" data-copy={name}>
						Copiar nombre
					</Button>
					{onClose && (
						<Button
							hierarchy="tertiary"
							size="sm"
							iconOnly="x-close"
							label="Cerrar"
							onClick={onClose}
						/>
					)}
				</div>
				<dl className="grid grid-cols-3 gap-2 text-xs">
					{CONTEXTS.map((c) => (
						<div key={c.label} className="rounded-md bg-secondary px-2.5 py-2">
							<dt className="text-tertiary">{c.label}</dt>
							<dd className="font-semibold text-primary">{c.size}</dd>
						</div>
					))}
				</dl>
			</div>
			<CodeSnippet className="rounded-none shadow-none" lineNumbers={false} tabs={iconCode(name)} />
			<p className="px-5 py-3.5 text-xs text-tertiary shadow-[inset_0_1px_0_var(--border-secondary)]">
				Un icono sin texto necesita <code className="font-mono">title</code>. Como{" "}
				<code className="font-mono">&lt;img&gt;</code> no hereda el color: el SVG del paquete usa{" "}
				<code className="font-mono">currentColor</code>, así que va en línea o con{" "}
				<code className="font-mono">mask-image</code>.
			</p>
		</div>
	);
}

export default function IconGallery() {
	const [query, setQuery] = useState("");
	const [size, setSize] = useState<(typeof SIZES)[number]>("24");
	const [selected, setSelected] = useState<IconName>("search-lg");
	const sheet = useRef<HTMLDialogElement>(null);
	const q = query.trim().toLowerCase();
	const shown = iconNames.filter((n) => n.includes(q));
	const total = iconNames.length;

	// `/icons/?icono=calendar`: llega desde la búsqueda (Ctrl+K) con el icono ya filtrado y elegido
	useEffect(() => {
		const wanted = new URLSearchParams(location.search).get("icono");
		if (wanted && (iconNames as readonly string[]).includes(wanted)) {
			setQuery(wanted);
			setSelected(wanted as IconName);
		}
	}, []);

	const pick = (name: IconName) => {
		setSelected(name);
		// En móvil el panel no está a la vista: se abre como hoja inferior
		if (matchMedia("(max-width: 1023px)").matches) sheet.current?.showModal();
	};

	return (
		<div className="flex flex-col gap-7">
			<div className="flex flex-wrap items-end gap-x-6 gap-y-4">
				<div className="max-w-110 flex-[1_1_320px]">
					<Input
						id="icon-search"
						label="Buscar icono"
						icon="search-md"
						type="search"
						autoComplete="off"
						placeholder="calendar, arrow, trash…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<div className="hidden flex-col gap-1.5 sm:flex">
					<span aria-hidden="true" className="text-sm font-medium text-secondary">
						Tamaño
					</span>
					<ButtonGroup
						aria-label="Tamaño de vista previa"
						value={size}
						onChange={(v) => setSize(v as (typeof SIZES)[number])}
						items={SIZES.map((s) => ({ value: s, label: s }))}
					/>
				</div>
				<div className="hidden grow sm:block" />
				<p id="icon-count" role="status" className="mb-2.5 text-sm text-tertiary tabular-nums">
					{shown.length === total ? `${total} iconos` : `${shown.length} de ${total}`}
				</p>
			</div>

			<div className="flex items-start gap-6">
				<div className="min-w-0 flex-1">
					<ul
						aria-label="Iconos"
						className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(112px,1fr))]"
					>
						{iconNames.map((name) => (
							<li key={name} data-icon={name} hidden={!shown.includes(name)}>
								<button
									type="button"
									data-select={name}
									aria-pressed={name === selected}
									onClick={() => pick(name)}
									className="flex w-full flex-col items-center gap-3 rounded-lg px-2 py-4 text-fg-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-colors duration-100 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-fg-primary aria-pressed:shadow-[inset_0_0_0_2px_var(--border-brand)]"
								>
									<Icon name={name} size={Number(size)} />
									<span className="w-full truncate text-center font-mono text-[11px] leading-4 text-tertiary">
										{name}
									</span>
								</button>
							</li>
						))}
					</ul>
					{shown.length === 0 && (
						<div className="py-12">
							<EmptyState
								icon="search-lg"
								title="Ese icono no está en el set"
								description="Ningún icono se llama así. Prueba con otra palabra, en inglés: los nombres son los del set de la guía."
							/>
						</div>
					)}
				</div>
				<aside
					aria-label="Icono elegido"
					className="sticky top-6 hidden w-95 flex-none overflow-hidden rounded-xl bg-primary_alt shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] lg:block"
				>
					<Panel name={selected} />
				</aside>
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: pulsar el fondo es un atajo de ratón; con teclado, el <dialog> se cierra con Escape y la hoja tiene su botón «Cerrar» */}
			<dialog
				ref={sheet}
				aria-labelledby="icon-sheet-name"
				className="m-0 mt-auto max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-primary_alt p-0 text-primary shadow-xl backdrop:bg-overlay/70 backdrop:[backdrop-filter:var(--backdrop-blur-lg)] lg:hidden"
				onClick={(e) => {
					// Pulsar fuera de la hoja (en el fondo) la cierra
					if (e.target === e.currentTarget) e.currentTarget.close();
				}}
			>
				<Panel name={selected} onClose={() => sheet.current?.close()} />
			</dialog>
		</div>
	);
}
