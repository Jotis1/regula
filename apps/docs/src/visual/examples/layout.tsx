// Puertos de las vistas previas de maquetación de la guía (reference/components/*/preview.html).
// `jm-stack` = columna con gap 16 (aquí con el gap que fija cada vista previa).

import {
	Button,
	CardHeader,
	ContentDivider,
	InlineCTA,
	PageHeader,
	SectionFooter,
	SectionHeader,
} from "@jotis-me/react";

export function PageHeaderExample() {
	return (
		<PageHeader
			breadcrumbs={[{ label: "Inicio", icon: "home-line" }, { label: "Pecunia" }]}
			title="Gastos"
			description="Controla lo que entra y lo que sale."
			actions={
				<>
					<Button hierarchy="secondary" iconLeading="upload-cloud-02">
						Importar
					</Button>
					<Button iconLeading="plus">Nuevo gasto</Button>
				</>
			}
		/>
	);
}

export function CardHeaderExample() {
	return (
		<div
			style={{
				borderRadius: 12,
				overflow: "hidden",
				boxShadow: "inset 0 0 0 1px var(--border-secondary)",
			}}
		>
			<CardHeader
				title="Suscripciones"
				badge="12 activas"
				description="Pagos recurrentes de este mes."
				menu
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Exportar
						</Button>
						<Button size="sm" iconLeading="plus">
							Añadir
						</Button>
					</>
				}
			/>
		</div>
	);
}

export function SectionHeaderExample() {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
			<SectionHeader
				title="Contactos"
				description="Personas y empresas con las que tratas."
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Importar
						</Button>
						<Button size="sm" iconLeading="plus">
							Nuevo contacto
						</Button>
					</>
				}
			/>
			<SectionHeader
				size="sm"
				title="Preferencias"
				description="Se aplican a todas las apps de la suite."
				divider={false}
			/>
		</div>
	);
}

export function SectionFooterExample() {
	return (
		<SectionFooter
			start={<Button hierarchy="link-gray">Ver ayuda</Button>}
			actions={
				<>
					<Button hierarchy="secondary" size="sm">
						Cancelar
					</Button>
					<Button size="sm">Guardar cambios</Button>
				</>
			}
		/>
	);
}

export function ContentDividerExample() {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
			<ContentDivider />
			<ContentDivider label="o continúa con" />
			<ContentDivider label="Octubre 2026" heading />
			<ContentDivider>
				<Button hierarchy="secondary" size="sm" iconLeading="plus">
					Cargar más
				</Button>
			</ContentDivider>
			<ContentDivider variant="fill" label="Pendientes" />
		</div>
	);
}

export function InlineCTAExample() {
	return (
		<InlineCTA
			icon="stars-02"
			title="Conecta tu banco"
			description="Importa los movimientos cada día sin subir extractos a mano."
			actions={
				<>
					<Button hierarchy="secondary" size="sm">
						Ahora no
					</Button>
					<Button size="sm">Conectar</Button>
				</>
			}
		/>
	);
}
