// Puertos de las vistas previas de navegación de la guía (reference/components/*/preview.html).

import {
	AvatarLabel,
	Breadcrumbs,
	CommandMenu,
	Dropdown,
	FilterBar,
	Pagination,
	SidebarNav,
	Tabs,
	TreeView,
} from "@jotis-me/react";
import { useState } from "react";
import { stack } from "./actions";

const sections = [
	{ id: "a", label: "Resumen" },
	{ id: "b", label: "Movimientos" },
	{ id: "c", label: "Ajustes" },
];

export function TabsExample() {
	return (
		<div className={stack}>
			<Tabs
				aria-label="Secciones"
				items={[
					{ id: "a", label: "Resumen" },
					{ id: "b", label: "Movimientos", count: 12 },
					{ id: "c", label: "Ajustes" },
				]}
			/>
			<Tabs aria-label="Vista" type="button-brand" items={sections} />
			<Tabs aria-label="Periodo" type="button-gray" items={sections} />
			<Tabs aria-label="Modo" type="button-border" items={sections} />
		</div>
	);
}

export function BreadcrumbsExample() {
	return (
		<Breadcrumbs
			items={[
				{ label: "Inicio", icon: "home-line", href: "/" },
				{ label: "Pecunia", href: "/" },
				{ label: "Gastos de octubre" },
			]}
		/>
	);
}

export function PaginationExample() {
	return <Pagination total={10} defaultPage={1} />;
}

export function SidebarNavExample() {
	return (
		<div style={{ height: 540, display: "flex" }}>
			<SidebarNav
				brand="jotis.me"
				search
				items={[
					{ icon: "home-line", label: "Inicio", href: "/", active: true },
					{ icon: "bar-chart-01", label: "Panel", href: "/", badge: 3 },
					{ icon: "currency-euro", label: "Pecunia", href: "/" },
					{ icon: "users-01", label: "Vinculum", href: "/" },
					{ icon: "file-04", label: "Ornatus", href: "/" },
				]}
				footerItems={[{ icon: "settings-02", label: "Ajustes", href: "/" }]}
				user={{ initials: "AD", name: "Administrador", supporting: "admin@jotis.me" }}
			/>
		</div>
	);
}

export function DropdownExample() {
	// El de elección única (ampliación sobre la guía, el de tema de la cabecera) es de lectura: el estado es de quien lo usa
	const [theme, setTheme] = useState("claro");
	return (
		<div style={{ height: 310, display: "flex", alignItems: "flex-start", gap: 24 }}>
			<div style={{ width: 280 }}>
				<Dropdown
					label="Acciones"
					defaultOpen
					header={
						<AvatarLabel
							size="md"
							initials="AD"
							name="Administrador"
							supporting="admin@jotis.me"
						/>
					}
					items={[
						{ icon: "user-01", label: "Ver perfil", shortcut: "⌘P" },
						{ icon: "settings-02", label: "Ajustes", shortcut: "⌘S" },
						{ icon: "copy-01", label: "Duplicar" },
						{ divider: true },
						{ icon: "trash-01", label: "Eliminar", danger: true },
					]}
				/>
			</div>
			<div style={{ width: 280 }}>
				<Dropdown
					label="Tema"
					defaultOpen
					selectedValue={theme}
					onSelectionChange={setTheme}
					items={[
						{ icon: "monitor-01", label: "Sistema", value: "sistema" },
						{ icon: "sun", label: "Claro", value: "claro" },
						{ icon: "moon-01", label: "Oscuro", value: "oscuro" },
					]}
				/>
			</div>
		</div>
	);
}

export function FilterBarExample() {
	return (
		<FilterBar
			segments={[
				{ value: "t", label: "Todo" },
				{ value: "g", label: "Gastos" },
				{ value: "i", label: "Ingresos" },
			]}
			defaultSegment="t"
			search
			searchPlaceholder="Buscar movimientos"
			activeFilters={[{ label: "Categoría: Hogar" }, { label: "Importe > 50 €" }]}
			onRemoveFilter={() => {}}
			onClear={() => {}}
		/>
	);
}

export function CommandMenuExample() {
	return (
		<div style={{ position: "relative", height: 500, borderRadius: 12, overflow: "hidden" }}>
			<CommandMenu
				contained
				autoFocus={false}
				onClose={() => {}}
				groups={[
					{
						label: "Apps",
						items: [
							{
								icon: "currency-euro",
								label: "Pecunia",
								description: "Gastos e ingresos",
								shortcut: "G P",
							},
							{ icon: "users-01", label: "Vinculum", description: "Contactos" },
							{ icon: "file-04", label: "Ornatus", description: "Lector Markdown" },
						],
					},
					{
						label: "Acciones",
						items: [
							{ icon: "plus", label: "Nuevo gasto", shortcut: "⌘N" },
							{ icon: "upload-cloud-02", label: "Importar extracto" },
							{ icon: "moon-01", label: "Cambiar a modo oscuro" },
						],
					},
				]}
			/>
		</div>
	);
}

export function TreeViewExample() {
	return (
		<TreeView
			aria-label="Documentos"
			defaultOpen={["notas", "trabajo"]}
			defaultSelected="roadmap"
			items={[
				{
					id: "notas",
					label: "Notas",
					children: [
						{
							id: "trabajo",
							label: "Trabajo",
							children: [
								{ id: "roadmap", label: "roadmap.md" },
								{ id: "pentest", label: "pentest.md" },
							],
						},
						{ id: "casa", label: "Casa", children: [{ id: "mudanza", label: "mudanza.md" }] },
						{ id: "leeme", label: "LEEME.md", meta: "2 KB" },
					],
				},
				{ id: "recetas", label: "Recetas", children: [{ id: "r1", label: "paella.md" }] },
				{ id: "arch", label: "Archivo", icon: "inbox-01" },
			]}
		/>
	);
}
