// Vista previa de ColorPicker (el de siempre y los doce tipos del Figma) y de ColorPickerDropdown. Va en su propio fichero para que las páginas que
// comparten `forms.tsx` no carguen las pestañas, el degradado ni la subida de imagen.

import { ColorPicker, ColorPickerDropdown } from "@jotis-me/react";

// color-fijo: muestras guardadas de la vista previa, como en el Figma
const GUARDADOS = ["#4f39f6", "#615fff", "#00a63e", "#d08700", "#e7000b", "#00a6f4", "#e12afb", "#171717"];
// color-fijo: degradado de la vista previa, de violeta a violeta oscuro como el Figma
const DEGRADADO = [
	{ offset: 0, color: "#7f56d9" },
	{ offset: 100, color: "#432e73" },
];
const nada = () => {};

export function ColorPickerExample() {
	return (
		<div className="flex flex-col gap-8">
			<ColorPicker defaultValue="#4f39f6" swatches={GUARDADOS} />
			<div className="flex flex-wrap items-start gap-6">
				<ColorPicker
					type="solid"
					defaultValue="#7f56d9"
					swatches={GUARDADOS}
					onAddSwatch={nada}
					onClose={nada}
				/>
				<ColorPicker type="gradient" defaultGradient={DEGRADADO} onClose={nada} />
				<ColorPicker type="image" onClose={nada} />
			</div>
			<div className="flex flex-wrap items-start gap-6">
				<ColorPicker type="swatch" defaultValue="#7f56d9" onAddSwatch={nada} />
				<ColorPicker type="saved-sm" defaultValue="#171717" />
				<ColorPicker type="saved-md" defaultValue="#171717" onAddSwatch={nada} />
				<ColorPicker
					type="brand"
					defaultValue="#4f46e5"
					source="Tailwind CSS v4.2"
					docsHref="#"
					onReset={nada}
				/>
				<ColorPicker
					type="gray"
					defaultValue="#52525b"
					source="Tailwind CSS v4.2"
					docsHref="#"
					onReset={nada}
				/>
			</div>
			<div className="flex flex-wrap items-start gap-6">
				<div className="flex flex-col gap-4">
					<ColorPicker type="minimal" defaultValue="#7f56d9" />
					<ColorPicker type="hue-slider" defaultValue="#4f39f6" />
					<ColorPicker type="transparency-slider" defaultValue="#7f56d9" />
				</div>
				<ColorPicker type="palette" defaultValue="#4f46e5" swatches={GUARDADOS} onAddSwatch={nada} />
			</div>
		</div>
	);
}

/** Los seis disparadores del Figma; cada uno abre el selector en un popover. */
export function ColorPickerDropdownExample() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center gap-6">
				<ColorPickerDropdown
					trigger="swatch-sm"
					label="Color del fondo"
					pickerProps={{ swatches: GUARDADOS }}
				/>
				<ColorPickerDropdown
					trigger="swatch-md"
					label="Color del fondo"
					pickerProps={{ swatches: GUARDADOS }}
				/>
				<ColorPickerDropdown trigger="swatch-button-link" pickerProps={{ swatches: GUARDADOS }} />
				<ColorPickerDropdown trigger="swatch-button" pickerProps={{ swatches: GUARDADOS }} />
				<ColorPickerDropdown
					trigger="hex-input"
					label="Color del borde"
					pickerProps={{ swatches: GUARDADOS }}
				/>
			</div>
			<ColorPickerDropdown
				trigger="select"
				label="Color de la marca"
				pickerProps={{ swatches: GUARDADOS }}
			/>
		</div>
	);
}
