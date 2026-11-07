// Puertos de las vistas previas de superposiciones y avisos de la guía (reference/components/*/preview.html).

import {
	Alert,
	Banner,
	Button,
	CopyTooltip,
	EmptyState,
	Input,
	Modal,
	Notification,
	Select,
	Slideout,
	Tooltip,
	useCopy,
} from "@jotis-me/react";
import { stack } from "./actions";

export function ModalExample() {
	return (
		<div style={{ position: "relative", height: 360, borderRadius: 12, overflow: "hidden" }}>
			<Modal
				contained
				icon="trash-01"
				destructive
				title="¿Eliminar este gasto?"
				description="Se borrará también de los informes. No se puede deshacer."
				onClose={() => {}}
				actions={
					<>
						<Button hierarchy="secondary">Cancelar</Button>
						<Button destructive>Eliminar</Button>
					</>
				}
			/>
		</div>
	);
}

export function SlideoutExample() {
	return (
		<div
			style={{
				position: "relative",
				height: 500,
				borderRadius: 12,
				overflow: "hidden",
				background: "var(--bg-secondary)",
			}}
		>
			<Slideout
				contained
				title="Alquiler"
				description="Movimiento del 1 de octubre"
				onClose={() => {}}
				actions={
					<>
						<Button hierarchy="secondary">Cancelar</Button>
						<Button>Guardar</Button>
					</>
				}
			>
				<Input label="Concepto" defaultValue="Alquiler" />
				<Input label="Importe" defaultValue="650,00" trailing="currency-euro" />
				<Select label="Categoría" options={["Hogar", "Transporte", "Ocio"]} />
			</Slideout>
		</div>
	);
}

export function TooltipExample() {
	return (
		<div style={{ display: "flex", gap: 160, padding: "96px 0 0 120px" }}>
			<Tooltip title="Esto es un tooltip" open>
				<Button hierarchy="secondary" iconOnly="help-circle" label="Ayuda" />
			</Tooltip>
			<Tooltip title="Con texto de apoyo" text="Una frase más para explicar el control." open>
				<Button hierarchy="secondary">Pasa el ratón</Button>
			</Tooltip>
		</div>
	);
}

function CopyButton({ value, children }: { value: string; children: string }) {
	const copy = useCopy();
	return (
		<Button
			hierarchy="secondary"
			size="sm"
			iconLeading="copy-01"
			onClick={(e) => void copy(value, e.currentTarget)}
		>
			{children}
		</Button>
	);
}

export function CopyTooltipExample() {
	return (
		<div style={{ display: "flex", gap: 16 }}>
			<CopyButton value="bg-brand-solid">Copiar utilidad</CopyButton>
			<CopyButton value="var(--bg-brand-solid)">Copiar variable</CopyButton>
			<CopyTooltip />
		</div>
	);
}

export function AlertExample() {
	return (
		<div className={stack}>
			<Alert
				color="brand"
				title="Hay una actualización disponible"
				description="La nueva versión mejora la importación de extractos."
				onClose={() => {}}
				actions={
					<>
						<Button hierarchy="link-gray">Descartar</Button>
						<Button hierarchy="link-color">Ver cambios</Button>
					</>
				}
			/>
			<Alert
				color="error"
				title="No se pudo sincronizar"
				description="Revisa la conexión con el banco e inténtalo de nuevo."
			/>
			<Alert color="success" title="Copia de seguridad completada" />
		</div>
	);
}

export function NotificationExample() {
	return (
		<Notification
			color="success"
			title="Pago registrado"
			description="Has añadido 42,50 € a Suscripciones."
			onClose={() => {}}
			actions={
				<>
					<Button hierarchy="link-gray">Deshacer</Button>
					<Button hierarchy="link-color">Ver gasto</Button>
				</>
			}
		/>
	);
}

export function BannerExample() {
	return (
		<div className={stack}>
			<Banner
				icon="zap"
				title="Nueva versión de Pecunia."
				description="Ahora con presupuestos compartidos."
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Más tarde
						</Button>
						<Button size="sm">Ver novedades</Button>
					</>
				}
				onClose={() => {}}
			/>
			<Banner
				theme="brand"
				icon="shield-tick"
				title="Activa la verificación en dos pasos."
				description="Tarda un minuto."
				actions={
					<Button hierarchy="secondary" size="sm">
						Activar
					</Button>
				}
				onClose={() => {}}
			/>
			<Banner
				icon="mail-01"
				title="Resumen semanal por correo."
				description="Un correo los lunes, nada más."
				email={{ buttonLabel: "Suscribirme", hint: "Puedes darte de baja cuando quieras." }}
				onClose={() => {}}
			/>
			<Banner
				theme="brand"
				icon="clock"
				title="Fin de la beta."
				description="Exporta tus datos antes del cierre."
				countdown={new Date(2026, 10, 1, 12, 0, 0)}
				now={new Date(2026, 9, 29, 9, 30, 15)}
				actions={
					<Button hierarchy="secondary" size="sm">
						Exportar
					</Button>
				}
			/>
			<Banner
				slim
				title="Mantenimiento programado el domingo a las 03:00."
				description="Duración estimada: 2 horas."
				onClose={() => {}}
			/>
			<div style={{ margin: "0 -16px" }}>
				<Banner
					layout="full"
					theme="brand"
					slim
					title="Estás viendo datos de ejemplo."
					description="Conecta tu banco para ver los tuyos."
					onClose={() => {}}
				/>
			</div>
		</div>
	);
}

export function EmptyStateExample() {
	return (
		<EmptyState
			icon="search-lg"
			title="Sin resultados"
			description="Ningún movimiento coincide con «León». Prueba con otro término o quita filtros."
			actions={
				<>
					<Button hierarchy="secondary">Limpiar búsqueda</Button>
					<Button iconLeading="plus">Nuevo movimiento</Button>
				</>
			}
		/>
	);
}
