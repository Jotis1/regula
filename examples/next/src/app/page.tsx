// Página de servidor con componentes sin estado: no envía JavaScript de ellos.
import { Button, CloseButton } from "@jotis-me/react";
import { CheckCircle, Plus } from "@untitledui/icons";

export default function Page() {
	return (
		<main className="flex flex-col gap-6">
			<h1 className="font-display text-display-sm font-semibold">Componentes estáticos</h1>
			<div className="flex flex-wrap items-center gap-3">
				<Button iconLeading={Plus}>Nuevo gasto</Button>
				<Button hierarchy="secondary">Cancelar</Button>
				<Button hierarchy="link-color" href="/interactivo">
					Ver los interactivos
				</Button>
				<CloseButton />
				<span className="text-fg-brand-primary">
					<CheckCircle size={24} role="img" aria-label="Correcto" aria-hidden={undefined} />
				</span>
			</div>
		</main>
	);
}
