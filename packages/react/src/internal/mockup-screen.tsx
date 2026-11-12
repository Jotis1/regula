// Lo que comparten ScreenMockup, LaptopMockup y PhoneMockup: el contenido de la pantalla.
import type { ReactNode } from "react";

export interface ScreenContent {
	/** Imagen de la pantalla. Con `alt`, es lo único que anuncian los lectores; el marco es decorativo. */
	src?: string;
	/** Texto alternativo de la imagen: qué enseña la pantalla. */
	alt?: string;
	/** Contenido de la pantalla en lugar de una imagen: componentes, un iframe… */
	children?: ReactNode;
	className?: string;
}

/** La pantalla: la imagen a sangre o el contenido, recortados a su caja. */
export function Screen({ src, alt, children }: Pick<ScreenContent, "src" | "alt" | "children">) {
	return src ? (
		<img src={src} alt={alt ?? ""} className="absolute inset-0 size-full object-cover object-top" />
	) : (
		children
	);
}
