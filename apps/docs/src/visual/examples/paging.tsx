// Vista previa de Breadcrumbs y Pagination: todos los tipos del Figma. Van en su propio fichero para que Tabs y FilterBar
// (que comparten `navigation.tsx`) no carguen el desplegable de cuentas ni el Select de las filas por página.

import { AppIcon, Breadcrumbs, Pagination } from "@jotis-me/react";
import { stack } from "./actions";

const crumbs = [
	{ label: "Inicio", icon: "home-line" as const, href: "/" },
	{ label: "Ajustes", href: "/" },
	{ label: "Equipo" },
];

const cuentas = [
	{ value: "caitlyn", name: "Caitlyn King", email: "caitlyn@jotis.me", initials: "CK" },
	{ value: "sienna", name: "Sienna Hewitt", email: "sienna@jotis.me", initials: "SH" },
];

export function BreadcrumbsExample() {
	return (
		<div className={stack}>
			<Breadcrumbs
				items={[
					{ label: "Inicio", icon: "home-line", href: "/" },
					{ label: "Pecunia", href: "/" },
					{ label: "Gastos de octubre" },
				]}
			/>
			<Breadcrumbs divider="slash" items={crumbs} aria-label="Migas con barra" />
			<Breadcrumbs type="text-line" items={crumbs} aria-label="Migas entre rayas" />
			<Breadcrumbs type="button" divider="slash" items={crumbs} aria-label="Migas como botones" />
			<div className="min-h-44">
				<Breadcrumbs
					type="account"
					aria-label="Migas con cuenta"
					items={[
						{ label: "Regula", avatar: <AppIcon app="regula" size={24} /> },
						{ label: "Cuenta", accounts: cuentas },
						{ label: "Ajustes", href: "/" },
					]}
				/>
			</div>
		</div>
	);
}

export function PaginationExample() {
	return (
		<div className={stack}>
			<Pagination total={10} defaultPage={1} />
			<Pagination type="page-default" total={10} defaultPage={1} labels={{ nav: "Página, texto" }} />
			<Pagination
				type="page-default"
				shape="circle"
				total={10}
				defaultPage={1}
				labels={{ nav: "Página, círculo" }}
			/>
			<Pagination
				type="card-default"
				shape="circle"
				total={10}
				defaultPage={1}
				labels={{ nav: "Tarjeta" }}
			/>
			<Pagination
				type="card-minimal"
				total={10}
				defaultPage={1}
				pageSizes={[10, 20, 50]}
				labels={{ nav: "Tarjeta mínima derecha" }}
			/>
			<Pagination
				type="card-minimal"
				align="left"
				total={10}
				defaultPage={1}
				pageSizes={[10, 20, 50]}
				labels={{ nav: "Tarjeta mínima izquierda" }}
			/>
			<Pagination
				type="card-minimal"
				align="center"
				total={10}
				defaultPage={1}
				pageSizes={[10, 20, 50]}
				labels={{ nav: "Tarjeta mínima centrada" }}
			/>
			<Pagination
				type="card-button-group"
				total={10}
				defaultPage={1}
				labels={{ nav: "Grupo a la derecha" }}
			/>
			<Pagination
				type="card-button-group"
				align="left"
				total={10}
				defaultPage={1}
				labels={{ nav: "Grupo a la izquierda" }}
			/>
			<Pagination type="card-advanced" total={10} defaultPage={1} labels={{ nav: "Avanzada" }} />
			<Pagination
				type="card-advanced"
				align="center"
				total={10}
				defaultPage={1}
				labels={{ nav: "Avanzada centrada" }}
			/>
		</div>
	);
}
