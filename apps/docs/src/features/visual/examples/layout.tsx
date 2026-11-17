// Puertos de las vistas previas de maquetación de la guía (reference/components/*/preview.html).
// `jm-stack` = columna con gap 16 (aquí con el gap que fija cada vista previa).

import { PaymentVisaMd } from "@jotis-me/assets/payments";
import {
	AppIcon,
	Avatar,
	Badge,
	Button,
	ButtonGroup,
	CardHeader,
	ContentDivider,
	Disclosure,
	InlineCTA,
	Input,
	LinkCard,
	PageHeader,
	SectionFooter,
	SectionHeader,
	SectionLabel,
	Tabs,
} from "@jotis-me/react";
import { FileIcon } from "@untitledui/file-icons";
import {
	ArrowLeft,
	ArrowRight,
	DotsVertical,
	HomeLine,
	Plus,
	SearchLg,
	Stars02,
	UploadCloud02,
	Zap,
} from "@untitledui/icons";

const migas = [
	{ label: "Inicio", icon: HomeLine, href: "/" },
	{ label: "Ajustes", href: "/" },
	{ label: "Equipo" },
];
const accionesPerfil = (
	<>
		<Button hierarchy="secondary" size="sm">
			Compartir
		</Button>
		<Button size="sm">Editar perfil</Button>
	</>
);
const fotoGrande = <Avatar size="2xl" initials="OR" badge="verified" />;

export function PageHeaderExample() {
	return (
		<div className="flex flex-col gap-12">
			<PageHeaderClasica />
			<PageHeader
				breadcrumbs={migas}
				back={{ href: "/" }}
				avatar={<Avatar size="md" initials="OR" />}
				title="Olivia Rhye"
				description="olivia@jotis.me"
				actions={accionesPerfil}
			/>
			<PageHeader
				banner
				breadcrumbs={migas}
				title="Equipo"
				description="Gestiona tu equipo y sus permisos."
				actions={accionesPerfil}
			/>
			<PageHeader
				banner
				avatar={fotoGrande}
				breadcrumbs={migas}
				title="Olivia Rhye"
				description="olivia@jotis.me"
				actions={accionesPerfil}
			/>
			<PageHeader
				banner
				centered
				avatar={fotoGrande}
				title="Olivia Rhye"
				description="olivia@jotis.me"
				actions={accionesPerfil}
			/>
			<div style={{ width: 375 }}>
				<PageHeader
					banner
					avatar={fotoGrande}
					breadcrumbs={migas}
					back={{ href: "/" }}
					title="Olivia Rhye"
					description="olivia@jotis.me"
					actions={accionesPerfil}
				/>
			</div>
		</div>
	);
}

function PageHeaderClasica() {
	return (
		<PageHeader
			breadcrumbs={[{ label: "Inicio", icon: HomeLine }, { label: "Pecunia" }]}
			title="Gastos"
			description="Controla lo que entra y lo que sale."
			actions={
				<>
					<Button hierarchy="secondary" iconLeading={UploadCloud02}>
						Importar
					</Button>
					<Button iconLeading={Plus}>Nuevo gasto</Button>
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
						<Button size="sm" iconLeading={Plus}>
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
						<Button size="sm" iconLeading={Plus}>
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
			<SectionHeader
				title="Miembros del equipo"
				description="Gestiona tu equipo y sus permisos."
				search={<Input size="sm" icon={SearchLg} aria-label="Buscar" placeholder="Buscar" />}
			/>
			<SectionHeader
				title="Miembros del equipo"
				description="Gestiona tu equipo y sus permisos."
				buttonGroup={
					<ButtonGroup size="sm" aria-label="Periodo" defaultValue="12m" items={periodos} />
				}
				menu={menuSeccion}
			/>
			<SectionHeader
				title="Miembros del equipo"
				description="Gestiona tu equipo y sus permisos."
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Secundaria
						</Button>
						<Button size="sm">Principal</Button>
					</>
				}
				menu={menuSeccion}
				tabs={<Tabs type="button-border" aria-label="Secciones de ajustes" items={pestañas} />}
			/>
			<div style={{ width: 375 }}>
				<SectionHeader
					title="Miembros del equipo"
					description="Gestiona tu equipo y sus permisos."
					buttonGroup={
						<ButtonGroup
							size="sm"
							aria-label="Periodo en móvil"
							defaultValue="12m"
							items={periodos}
						/>
					}
					menu={menuSeccion}
				/>
			</div>
		</div>
	);
}

const periodos = [
	{ value: "12m", label: "12 meses" },
	{ value: "30d", label: "30 días" },
	{ value: "7d", label: "7 días" },
];
const pestañas = [
	{ id: "datos", label: "Mis datos" },
	{ id: "perfil", label: "Perfil" },
	{ id: "contrasena", label: "Contraseña" },
	{ id: "equipo", label: "Equipo" },
	{ id: "plan", label: "Plan" },
];
const menuSeccion = <Button hierarchy="tertiary" size="sm" iconOnly={DotsVertical} label="Más opciones" />;

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
				<Button hierarchy="secondary" size="sm" iconLeading={Plus}>
					Cargar más
				</Button>
			</ContentDivider>
			<ContentDivider variant="fill" label="Pendientes" />
			<ContentDivider
				actions={
					<Button hierarchy="secondary" size="sm">
						Añadir
					</Button>
				}
			/>
			<ContentDivider
				variant="dual"
				actions={
					<ButtonGroup
						size="sm"
						aria-label="Mover"
						items={[
							{ value: "anterior", iconOnly: ArrowLeft, label: "Anterior" },
							{ value: "nuevo", iconOnly: Plus, label: "Nuevo" },
							{ value: "siguiente", iconOnly: ArrowRight, label: "Siguiente" },
						]}
					/>
				}
			/>
			<ContentDivider
				variant="fill"
				actions={
					<ButtonGroup
						size="sm"
						aria-label="Filtro"
						defaultValue="todo"
						items={[
							{ value: "todo", label: "Ver todo" },
							{ value: "activos", label: "Activos" },
							{ value: "inactivos", label: "Inactivos" },
						]}
					/>
				}
			/>
			<ContentDivider
				actions={<Button hierarchy="secondary" size="sm" iconOnly={Plus} label="Añadir elemento" />}
			/>
		</div>
	);
}

const ahoraNo = (
	<Button hierarchy="secondary" size="sm">
		Ahora no
	</Button>
);
const novedades = {
	title: "Acabamos de publicar novedades",
	description: "El panel nuevo carga más rápido y se lee mejor.",
};
const portada = (
	<div className="flex size-full min-h-40 items-center justify-center bg-brand-solid">
		<AppIcon app="regula" size={64} />
	</div>
);

function InlineCTATipos() {
	return (
		<>
			<InlineCTA
				type="image"
				{...novedades}
				image={portada}
				actions={
					<>
						{ahoraNo}
						<Button size="sm">Novedades</Button>
					</>
				}
			/>
			<InlineCTA
				type="actions"
				{...novedades}
				actions={
					<>
						{ahoraNo}
						<Button size="sm">Novedades</Button>
					</>
				}
			/>
			<InlineCTA type="email" {...novedades} />
			<InlineCTA
				type="change-plan"
				title="Cambia de plan"
				description="Precios flexibles que crecen contigo."
				plan={{
					name: "Plan básico",
					icon: Zap,
					price: "10 €",
					period: "al mes",
					description: "Hasta 10 usuarios, 20 GB por persona y todas las funciones.",
				}}
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Saber más
						</Button>
						<Button size="sm">Mejorar plan</Button>
					</>
				}
			/>
			<InlineCTA
				type="upgrade-plan"
				title="Mejora tu plan"
				description="¿Necesitas más espacio? Mejora tu plan hoy."
				features={[
					{ title: "10 usuarios", description: "Hasta 10 personas en el equipo." },
					{ title: "20 GB", description: "20 GB por persona." },
					{ title: "Todas las funciones", description: "Funciones avanzadas y analítica." },
				]}
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Todos los planes
						</Button>
						<Button size="sm">Mejorar plan</Button>
					</>
				}
			/>
			<InlineCTA
				type="payment-method"
				title="Método de pago"
				description="Cambia cómo pagas tu plan."
				payment={{
					logo: <PaymentVisaMd />,
					label: "Visa terminada en 1234",
					expiry: "Caduca el 06/2028",
					email: "pagos@jotis.me",
				}}
				actions={
					<Button hierarchy="secondary" size="sm">
						Editar
					</Button>
				}
			/>
			<InlineCTA
				type="receipt"
				title="Tu último recibo ya está disponible"
				description="Descarga el recibo de enero de 2027."
				file={{ name: "Recibo_enero_2027.pdf", size: "200 KB", icon: <FileIcon type="pdf" /> }}
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Descargar
						</Button>
						<Button size="sm">Ver</Button>
					</>
				}
			/>
		</>
	);
}

export function InlineCTAExample() {
	return (
		<div className="flex flex-col gap-6">
			<InlineCTA
				icon={Stars02}
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
			<InlineCTATipos />
			<div className="flex flex-col gap-6" style={{ width: 360 }}>
				<InlineCTA
					type="image"
					{...novedades}
					image={portada}
					actions={
						<>
							{ahoraNo}
							<Button size="sm">Novedades</Button>
						</>
					}
				/>
				<InlineCTA type="email" {...novedades} />
			</div>
		</div>
	);
}

const sample = (
	<div className="flex h-28 items-center justify-center bg-secondary">
		<Button size="sm">Nuevo gasto</Button>
	</div>
);

export function DisclosureExample() {
	return (
		<div className="flex max-w-[420px] flex-col">
			<Disclosure title="Iconos" aside={<Badge color="brand">3 props</Badge>} defaultOpen>
				<ul className="m-0 list-none space-y-1 p-0">
					<li>icon</li>
					<li>iconLeading</li>
					<li>iconTrailing</li>
				</ul>
			</Disclosure>
			<Disclosure title="Tamaño" size="sm" aside="2 props">
				Dos props.
			</Disclosure>
			<Disclosure title="Sin raya" divider={false}>
				Un bloque suelto, sin raya inferior.
			</Disclosure>
		</div>
	);
}

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
