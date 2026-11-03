// Formulario de la portada (reference/docs-design/Main.dc.html): no es una captura, son los componentes de
// @jotis-me/react, y se puede escribir en él. Isla `client:visible`.
import { Badge, Button, FeaturedIcon, Input, Toggle } from "@jotis-me/react";

export default function HeroForm() {
	return (
		<div className="flex flex-col gap-5 rounded-2xl bg-primary_alt p-6 shadow-[var(--shadow-xl),inset_0_0_0_1px_var(--border-secondary_alt)]">
			<div className="flex items-start gap-4">
				<FeaturedIcon icon="currency-euro" color="brand" variant="modern" size="lg" />
				<div className="min-w-0 grow">
					<p className="text-md font-semibold text-primary">Nuevo gasto</p>
					<p className="text-sm text-tertiary">Lo apuntas ahora y no lo buscas en marzo.</p>
				</div>
				<Badge color="success" dot size="sm">
					Pagado
				</Badge>
			</div>
			<Input label="Importe" defaultValue="1.284,50 €" icon="currency-euro" />
			<Input
				label="Correo del recibo"
				type="email"
				defaultValue="hola@pecunia"
				error="Ese correo no parece un correo. Revísalo."
			/>
			<Toggle label="Repetir cada mes" defaultChecked />
			<div className="flex justify-end gap-3 pt-1">
				<Button hierarchy="secondary">Cancelar</Button>
				<Button>Guardar gasto</Button>
			</div>
		</div>
	);
}
