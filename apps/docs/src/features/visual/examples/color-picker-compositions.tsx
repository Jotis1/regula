// Composición del `Color picker modal` del Figma (`12427:142023`): el selector de paleta en un diálogo sobre la
// página, en escritorio y en móvil. Solo componentes de Regula; no se exporta del paquete.

import { BackgroundOverlay, ColorPicker } from "@jotis-me/react";
import type { ReactNode } from "react";

/** El lienzo de cada composición: la página de fondo con su velo, del alto que pide. */
function Lienzo({ alto, children }: { alto: number; children: ReactNode }) {
	return (
		<div className="relative overflow-hidden rounded-xl" style={{ height: alto }}>
			{children}
		</div>
	);
}
// color-fijo: los colores guardados del Figma
const GUARDADOS = ["#16a34a", "#2563eb", "#4f46e5", "#9333ea", "#c026d3", "#db2777", "#dc2626", "#ea580c"];

/** El diálogo: el velo y, encima, el selector centrado. */
function SelectorDeColor({ onClose }: { onClose: () => void }) {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-4">
			<BackgroundOverlay blur />
			<div role="dialog" aria-label="Color" className="relative w-full max-w-[320px]">
				<ColorPicker
					type="palette"
					defaultValue="#4f46e5"
					swatches={GUARDADOS}
					onAddSwatch={() => {}}
					onClose={onClose}
					className="w-full"
				/>
			</div>
		</div>
	);
}

export function ColorPickerModalExample() {
	return (
		<Lienzo alto={560}>
			<SelectorDeColor onClose={() => {}} />
		</Lienzo>
	);
}

export function ColorPickerModalMobileExample() {
	return (
		<Lienzo alto={640}>
			{/* El ancho de un móvil (375 px), centrado en el lienzo */}
			<div className="relative mx-auto h-full w-[375px] overflow-hidden">
				<SelectorDeColor onClose={() => {}} />
			</div>
		</Lienzo>
	);
}
