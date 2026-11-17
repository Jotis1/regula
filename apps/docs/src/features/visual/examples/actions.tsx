// Puertos de las vistas previas de la guía (reference/components/*/preview.html) para la paridad visual.
// `jm-stack` = columna con gap 16; `jm-row` = fila que envuelve con gap 12.

import { Button, ButtonGroup, ButtonUtility, CloseButton } from "@jotis-me/react";
import {
	AlignLeft,
	ArrowRight,
	Clock,
	Copy01,
	DotsVertical,
	Download01,
	Edit02,
	Grid01,
	Plus,
	Trash01,
} from "@untitledui/icons";

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
				<Button size="md" iconLeading={Plus}>
					Nuevo gasto
				</Button>
				<Button size="lg" iconTrailing={ArrowRight}>
					Continuar
				</Button>
				<Button size="xl">xl</Button>
			</div>
			<div className={row}>
				<Button destructive>Eliminar</Button>
				<Button destructive hierarchy="secondary" iconLeading={Trash01}>
					Borrar
				</Button>
				<Button loading>Guardando</Button>
				<Button disabled>Deshabilitado</Button>
				<Button hierarchy="secondary" iconOnly={Edit02} label="Editar" />
				<Button hierarchy="tertiary" iconOnly={DotsVertical} label="Más" />
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
				icon={Copy01}
				label="Copiar"
				hierarchy={hierarchy}
				size={size}
				tooltipOpen={first}
			/>
			<ButtonUtility icon={Edit02} label="Editar" hierarchy={hierarchy} size={size} />
			<ButtonUtility icon={Download01} label="Descargar" hierarchy={hierarchy} size={size} />
			<ButtonUtility icon={Trash01} label="Borrar" hierarchy={hierarchy} size={size} disabled />
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
		{ value: "d", label: "24 horas", icon: Clock },
	];
	const dots = [
		{ value: "on", label: "Activos", dot: true },
		{ value: "off", label: "Pausados", dot: true },
		{ value: "all", label: "Todos" },
	];
	const views = [
		{ value: "grid", iconOnly: Grid01, label: "Cuadrícula" },
		{ value: "list", iconOnly: AlignLeft, label: "Lista" },
		{ value: "add", iconOnly: Plus, label: "Añadir vista" },
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
