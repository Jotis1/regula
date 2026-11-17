// Índice de la búsqueda (Ctrl+K): páginas, componentes, tokens e iconos, generado en el build desde las
// mismas fuentes que la web. La isla de búsqueda lo descarga al abrirse; el texto completo lo pone Pagefind.

import { getCollection } from "astro:content";
import { colors, radius, shadows, spacing, type } from "@jotis-me/tokens";
import type { APIRoute } from "astro";
import type { SearchEntry } from "../features/search/entries";
import { COMPONENT_KEYWORDS, groupOf, labelOf, slugOf } from "../lib/catalog";
import { kebab } from "../lib/gallery";
import { hrefOf } from "../lib/standards";
import { colorGroups, radiusRows, shadowRows, spacingRows } from "../lib/tokens";
import { ICON_NAMES } from "../lib/untitled";
import { nav } from "../nav";

export const GET: APIRoute = async () => {
	const components = await getCollection("components");
	const foundations = await getCollection("foundations");
	const standards = await getCollection("standards");
	// Como en el diseño (Search.dc.html), la descripción de un componente es su grupo del catálogo
	const groupLabel = (name: string) => {
		const group = groupOf(name);
		return group && (group.section === "stream" ? `Stream - ${group.label}` : group.label);
	};
	const description = (href: string) =>
		foundations.find((f) => `/foundations/${f.id}/` === href)?.data.description;

	const entries: SearchEntry[] = [
		...nav.flatMap((section) =>
			section.items.map((item) => ({
				group: "pages" as const,
				label: item.label,
				description: description(item.href) ?? section.title,
				href: item.href,
			})),
		),
		...components
			.map((c) => ({
				group: "components" as const,
				label: labelOf(c.data.name),
				description: groupLabel(c.data.name) ?? c.data.description,
				href: `/components/${c.id}/`,
				// La descripción de la ficha sigue siendo buscable aunque ya no se muestre
				keywords: [c.data.name, COMPONENT_KEYWORDS[slugOf(c.data.name)], c.data.description]
					.filter(Boolean)
					.join(" "),
			}))
			.sort((a, b) => a.label.localeCompare(b.label)),
		...colorGroups(colors).flatMap((g) =>
			g.rows.map((row) => ({
				group: "tokens" as const,
				label: row.utility,
				description: `Color - ${row.usage}`,
				href: "/foundations/color/",
				keywords: row.name,
			})),
		),
		...type.groups.flatMap((g) =>
			g.styles.map((s) => ({
				group: "tokens" as const,
				label: s.name,
				description: `Tipografía - ${s.fontSize}/${s.lineHeight}${s.usage ? ` - ${s.usage}` : ""}`,
				href: "/foundations/typography/",
			})),
		),
		...[...spacingRows(spacing), ...radiusRows(radius)].map((row) => ({
			group: "tokens" as const,
			label: row.utility ?? row.name,
			description: `Espaciado y radios - ${row.usage}`,
			href: "/foundations/layout/",
			keywords: row.name,
		})),
		...shadowRows(shadows).map((row) => ({
			group: "tokens" as const,
			label: row.utility,
			description: `Sombras - ${row.usage}`,
			href: "/foundations/states/",
			keywords: row.name,
		})),
		// Each rule is findable by its ID or by what it says
		...standards.flatMap((area) =>
			area.data.rules.map((rule) => ({
				group: "standards" as const,
				label: `${rule.id} - ${rule.title}`,
				description: `Normas - ${area.data.title}`,
				href: hrefOf(area.id, rule.id),
				keywords: `${rule.statement} ${rule.rationale}`,
			})),
		),
		...ICON_NAMES.map((name) => ({
			group: "icons" as const,
			label: name,
			description: "Icono de Untitled UI",
			href: `/icons/?icon=${name}`,
			keywords: kebab(name),
		})),
	];
	return new Response(JSON.stringify(entries), { headers: { "Content-Type": "application/json" } });
};
