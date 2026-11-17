// Ejemplo de Spotlight: una zona señalada con su nota en los cuatro lados, y la misma zona sin señalar.

import { Badge, Button, Spotlight } from "@jotis-me/react";

export function SpotlightExample() {
	return (
		<div className="flex flex-col gap-24 px-24 py-20">
			<div className="flex flex-wrap items-center justify-center gap-24">
				<Spotlight active note="Ahora en gris" notePlacement="top">
					<Button hierarchy="secondary">Arriba</Button>
				</Spotlight>
				<Spotlight active note="Ahora en gris">
					<Button hierarchy="secondary">Abajo</Button>
				</Spotlight>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-64">
				<Spotlight active note="Nuevo este mes" notePlacement="left">
					<Badge color="brand">Nuevo</Badge>
				</Spotlight>
				<Spotlight active note="Nuevo este mes" notePlacement="right">
					<Badge color="brand">Nuevo</Badge>
				</Spotlight>
			</div>
			<div className="flex justify-center">
				<Spotlight note="No se ve: sin active solo hay contenido">
					<Button hierarchy="secondary">Sin señalar</Button>
				</Spotlight>
			</div>
		</div>
	);
}
