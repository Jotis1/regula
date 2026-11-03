// Búsqueda de la web: CommandMenu de @jotis-me/react con Ctrl+K / Cmd+K sobre páginas, componentes, tokens e
// iconos (índice propio, /search-index.json) y el texto completo de las páginas (Pagefind, solo tras el build).
import { CommandMenu, Icon, type IconName } from "@jotis-me/react";
import { useEffect, useRef, useState } from "react";
import { plain, type SearchEntry, searchGroups } from "./entries";

interface PagefindResult {
	url: string;
	excerpt: string;
	meta: { title?: string };
}
interface Pagefind {
	debouncedSearch: (q: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] } | null>;
}

// Fuera del grafo de Vite: el índice de Pagefind se genera después de `astro build` (en dev no existe)
const PAGEFIND = "/pagefind/pagefind.js";

export default function SiteSearch() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [entries, setEntries] = useState<SearchEntry[]>([]);
	const [text, setText] = useState<SearchEntry[]>([]);
	const [mac, setMac] = useState(false);
	const pagefind = useRef<Promise<Pagefind | null> | null>(null);
	const loaded = useRef(false);

	useEffect(() => {
		setMac(/Mac|iPhone|iPad/.test(navigator.platform));
		const onKey = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		// El menú móvil abre la búsqueda con este evento (no comparte estado con esta isla)
		const onOpen = () => setOpen(true);
		window.addEventListener("keydown", onKey);
		window.addEventListener("regula:search", onOpen);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("regula:search", onOpen);
		};
	}, []);

	useEffect(() => {
		if (!open || loaded.current) return;
		loaded.current = true;
		fetch("/search-index.json")
			.then((r) => r.json())
			.then(setEntries)
			.catch(() => {
				loaded.current = false;
			});
		pagefind.current ??= import(/* @vite-ignore */ PAGEFIND).catch(() => null);
	}, [open]);

	const onQueryChange = async (q: string) => {
		setQuery(q);
		if (q.trim().length < 2) return setText([]);
		const pf = await pagefind.current;
		const found = await pf?.debouncedSearch(q);
		if (!found) return; // sin Pagefind (dev) o superada por otra búsqueda
		const data = await Promise.all(found.results.slice(0, 6).map((r) => r.data()));
		setText(
			data.map((d) => ({
				group: "text",
				label: d.meta.title ?? d.url,
				description: plain(d.excerpt),
				href: d.url,
			})),
		);
	};

	const close = () => {
		setOpen(false);
		setQuery("");
		setText([]);
	};

	const groups = searchGroups(entries, query, text).map((g) => ({
		label: g.label,
		items: g.entries.map((e) => ({
			label: e.label,
			description: e.description,
			icon: e.group === "icons" ? (e.label as IconName) : undefined,
			onSelect: () => location.assign(e.href),
		})),
	}));

	return (
		<>
			{/* Disparador con aspecto de campo (rg-search en reference/docs-design/lib/regula.css). El diseño le pone
			    text-placeholder, pero es la etiqueta de un botón, no un placeholder, y en oscuro se queda en 4,2:1:
			    text-quaternary es el mismo #737373 en claro y en oscuro pasa a 7,7:1. */}
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-keyshortcuts="Control+K Meta+K"
				// En móvil, botón de icono de 44px (HeaderM.dc.html); desde lg, el campo de 300px
				className="flex size-11 items-center justify-center gap-2 rounded-lg text-left text-sm text-quaternary transition-colors duration-100 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none lg:h-10 lg:w-[300px] lg:justify-start lg:border lg:border-primary lg:bg-primary lg:pr-2 lg:pl-3 lg:shadow-xs"
			>
				<Icon name="search-lg" size={20} className="shrink-0 text-fg-quaternary" />
				<span className="sr-only min-w-0 grow truncate lg:not-sr-only">Buscar en Regula</span>
				<kbd className="hidden h-[22px] shrink-0 items-center rounded-sm bg-secondary px-1.5 font-mono text-xs font-medium whitespace-nowrap text-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)] lg:inline-flex">
					{mac ? "⌘ K" : "Ctrl K"}
				</kbd>
			</button>
			{open ? (
				<CommandMenu
					onClose={close}
					filter={false}
					onQueryChange={onQueryChange}
					groups={groups}
					placeholder="Busca páginas, componentes, tokens o iconos"
					emptyText={entries.length ? "Prueba con otra palabra." : "Cargando el índice…"}
					labels={{ dialog: "Buscar en Regula", search: "Buscar en Regula" }}
				/>
			) : null}
		</>
	);
}
