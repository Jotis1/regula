// Formulario de la portada (design D4 de redesign-docs-site-v2): no es una captura, son los componentes de
// @jotis-me/react dentro de un `BrowserFrame`, y se puede escribir en él. El importe lleva la divisa en su
// desplegable (`trailingSelect`). Isla `client:visible`.
import { Badge, BrowserFrame, Button, FeaturedIcon, Input, Toggle } from "@jotis-me/react";
import { CurrencyEuro } from "@untitledui/icons";

const DIVISA = { label: "Divisa", options: ["EUR", "USD", "GBP"], defaultValue: "EUR" };

export default function HeroForm() {
	return (
		<BrowserFrame variant="minimal" url="pecunia.jotis.me/gastos/nuevo">
			<div className="flex flex-col gap-5 bg-primary_alt p-6">
				<div className="flex items-start gap-4">
					<FeaturedIcon icon={CurrencyEuro} color="brand" variant="modern" size="lg" />
					<div className="min-w-0 grow">
						<p className="text-md font-semibold text-primary">Nuevo gasto</p>
						<p className="text-sm text-tertiary">Lo apuntas ahora y no lo buscas en marzo.</p>
					</div>
					<Badge color="success" dot size="sm">
						Pagado
					</Badge>
				</div>
				<Input label="Importe" defaultValue="1.284,50" inputMode="decimal" trailingSelect={DIVISA} />
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
		</BrowserFrame>
	);
}
