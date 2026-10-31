// Página de servidor con componentes sin estado: no envía JavaScript de ellos.
import { Button, CloseButton, Icon } from "@jotis-me/react";

export default function Page() {
	return (
		<main className="flex flex-col gap-6">
			<h1 className="font-display text-display-sm font-semibold">Componentes estáticos</h1>
			<div className="flex flex-wrap items-center gap-3">
				<Button iconLeading="plus">Nuevo gasto</Button>
				<Button hierarchy="secondary">Cancelar</Button>
				<Button hierarchy="link-color" href="/interactivo">
					Ver los interactivos
				</Button>
				<CloseButton />
				<span className="text-fg-brand-primary">
					<Icon name="check-circle" title="Correcto" />
				</span>
			</div>
		</main>
	);
}
