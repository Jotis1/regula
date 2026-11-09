// Puertos de las vistas previas de maquetación de la guía (reference/components/*/preview.html).
// `jm-stack` = columna con gap 16 (aquí con el gap que fija cada vista previa).

import {
	Button,
	CardHeader,
	ContentDivider,
	InlineCTA,
	Input,
	LinkCard,
	PageHeader,
	SectionFooter,
	SectionHeader,
	SectionLabel,
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

/** Dos filas de una página de ajustes: la etiqueta a la izquierda y los campos a la derecha, en `sm` y en `md`. */
export function SectionLabelExample() {
	const field = (label: string, value: string) => <Input label={label} defaultValue={value} />;
	return (
		<div className="flex max-w-[720px] flex-col gap-8">
			<div className="grid grid-cols-[280px_1fr] gap-8">
				<SectionLabel
					title="Equipo"
					required
					help="Quién puede ver y editar el proyecto."
					description="Gestiona quién entra y con qué permisos."
					actions={
						<>
							<Button hierarchy="link-gray" size="sm">
								Ver todos
							</Button>
							<Button hierarchy="link-color" size="sm">
								Invitar
							</Button>
						</>
					}
				/>
				<div className="flex flex-col gap-4">
					{field("Responsable", "Olivia Rhye")}
					{field("Correo del equipo", "equipo@jotis.me")}
				</div>
			</div>
			<div className="grid grid-cols-[280px_1fr] gap-8">
				<SectionLabel size="md" title="Facturación" description="Datos para tus facturas." />
				<div className="flex flex-col gap-4">{field("Razón social", "Jotis S. L.")}</div>
			</div>
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

const sample = (
	<div className="flex h-28 items-center justify-center bg-secondary">
		<Button size="sm">Nuevo gasto</Button>
	</div>
);

export function LinkCardExample() {
	return (
		<div className="grid max-w-[640px] grid-cols-2 gap-4">
			<LinkCard
				href="#"
				title="Button"
				description="La acción de la pantalla, en cinco jerarquías y cinco tamaños."
				preview={sample}
			/>
			<LinkCard href="#" title="Sin vista previa" description="Solo el título y una línea de apoyo." />
		</div>
	);
}
