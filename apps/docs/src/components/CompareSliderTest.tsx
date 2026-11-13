// Comparador de dos cajas de colores para la página de prueba `visual/compare-slider-test` (e2e con ratón, teclado y sin
// JavaScript). Las capas son nodos React, así que no se pueden armar en un `.astro`.
import { CompareSlider } from "@jotis-me/react";
import { useState } from "react";

export default function CompareSliderTest() {
	const [value, setValue] = useState(30);
	return (
		<div className="flex flex-col gap-4">
			<CompareSlider
				label="Tema de la pantalla"
				before={
					<div className="flex h-full items-center justify-center bg-brand-solid text-xl font-semibold text-white">
						Capa de abajo
					</div>
				}
				after={
					<div className="flex h-full items-center justify-center bg-secondary text-xl font-semibold text-primary">
						Capa de arriba
					</div>
				}
				defaultValue={30}
				onChange={setValue}
				height={240}
			/>
			<output data-testid="valor">{value}</output>
		</div>
	);
}
