// Puertos de las vistas previas de la guía (reference/components/*/preview.html) para la paridad visual.
// `jm-stack` = columna con gap 16; `jm-row` = fila que envuelve con gap 12.

import { iconNames } from "@jotis-me/icons";
import { Button, ButtonGroup, ButtonUtility, CloseButton, Icon } from "@jotis-me/react";

export const stack = "flex flex-col gap-4";
export const row = "flex flex-wrap items-center gap-3";

export function ButtonExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<Button>Guardar</Button>
				<Button hierarchy="secondary">Cancelar</Button>
				<Button hierarchy="tertiary">Más tarde</Button>
				<Button hierarchy="link-color">Ver detalles</Button>
				<Button hierarchy="link-gray">Ayuda</Button>
			</div>
			<div className={row}>
				<Button size="xs">xs</Button>
				<Button size="sm">sm</Button>
				<Button size="md" iconLeading="plus">
					Nuevo gasto
				</Button>
				<Button size="lg" iconTrailing="arrow-right">
					Continuar
				</Button>
				<Button size="xl">xl</Button>
			</div>
			<div className={row}>
				<Button destructive>Eliminar</Button>
				<Button destructive hierarchy="secondary" iconLeading="trash-01">
					Borrar
				</Button>
				<Button loading>Guardando</Button>
				<Button disabled>Deshabilitado</Button>
				<Button hierarchy="secondary" iconOnly="edit-02" label="Editar" />
				<Button hierarchy="tertiary" iconOnly="dots-vertical" label="Más" />
			</div>
		</div>
	);
}

/** Los tres tamaños sobre fondo claro y la versión para fondo oscuro. */
export function CloseButtonExample() {
	return (
		<div className={stack}>
			<div className={row}>
				<CloseButton size="sm" />
				<CloseButton size="md" />
				<CloseButton size="lg" />
			</div>
			<div className={`${row} rounded-xl bg-brand-solid p-4`}>
				<CloseButton size="sm" onDark />
				<CloseButton size="md" onDark />
				<CloseButton size="lg" onDark />
			</div>
		</div>
	);
}

/** Barra de herramientas de una fila: las dos jerarquías en sus dos tamaños, una con el tooltip abierto y una deshabilitada. */
export function ButtonUtilityExample() {
	const tools = (hierarchy: "secondary" | "tertiary", size: "xs" | "sm", first?: boolean) => (
		<div className="flex items-center gap-1">
			<ButtonUtility
				icon="copy-01"
				label="Copiar"
				hierarchy={hierarchy}
				size={size}
				tooltipOpen={first}
			/>
			<ButtonUtility icon="edit-02" label="Editar" hierarchy={hierarchy} size={size} />
			<ButtonUtility icon="download-01" label="Descargar" hierarchy={hierarchy} size={size} />
			<ButtonUtility icon="trash-01" label="Borrar" hierarchy={hierarchy} size={size} disabled />
		</div>
	);
	return (
		<div className={`${stack} pt-12`}>
			<div className={`${row} gap-8`}>
				{tools("secondary", "sm", true)}
				{tools("secondary", "xs")}
			</div>
			<div className={`${row} gap-8`}>
				{tools("tertiary", "sm")}
				{tools("tertiary", "xs")}
			</div>
		</div>
	);
}

/** Texto, con icono y con punto en `md`; los mismos en `sm`, y los de solo icono. */
export function ButtonGroupExample() {
	const periods = [
		{ value: "a", label: "12 meses" },
		{ value: "b", label: "30 días" },
		{ value: "m", label: "7 días" },
		{ value: "d", label: "24 horas", icon: "clock" as const },
	];
	const dots = [
		{ value: "on", label: "Activos", dot: true },
		{ value: "off", label: "Pausados", dot: true },
		{ value: "all", label: "Todos" },
	];
	const views = [
		{ value: "grid", iconOnly: "grid-01" as const, label: "Cuadrícula" },
		{ value: "list", iconOnly: "align-left" as const, label: "Lista" },
		{ value: "add", iconOnly: "plus" as const, label: "Añadir vista" },
	];
	return (
		<div className={stack}>
			<div className={row}>
				<ButtonGroup defaultValue="m" aria-label="Periodo" items={periods} />
				<ButtonGroup defaultValue="on" aria-label="Estado" items={dots} />
				<ButtonGroup defaultValue="grid" aria-label="Vista" items={views} />
			</div>
			<div className={row}>
				<ButtonGroup size="sm" defaultValue="m" aria-label="Periodo (pequeño)" items={periods} />
				<ButtonGroup size="sm" defaultValue="on" aria-label="Estado (pequeño)" items={dots} />
				<ButtonGroup size="sm" defaultValue="grid" aria-label="Vista (pequeño)" items={views} />
			</div>
		</div>
	);
}

export function IconExample() {
	return (
		<div className="flex flex-wrap gap-4 text-fg-secondary">
			{iconNames.map((n) => (
				<span key={n} title={n}>
					<Icon name={n} size={24} />
				</span>
			))}
		</div>
	);
}
