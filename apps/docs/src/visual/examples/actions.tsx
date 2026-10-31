// Puertos de las vistas previas de la guía (reference/components/*/preview.html) para la paridad visual.
// `jm-stack` = columna con gap 16; `jm-row` = fila que envuelve con gap 12.

import { iconNames } from "@jotis-me/icons";
import { Button, ButtonGroup, CloseButton, Icon } from "@jotis-me/react";

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

export function CloseButtonExample() {
	return (
		<div className={row}>
			<CloseButton />
		</div>
	);
}

export function ButtonGroupExample() {
	return (
		<ButtonGroup
			defaultValue="m"
			aria-label="Periodo"
			items={[
				{ value: "a", label: "12 meses" },
				{ value: "b", label: "30 días" },
				{ value: "m", label: "7 días" },
				{ value: "d", label: "24 horas", icon: "clock" },
			]}
		/>
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
