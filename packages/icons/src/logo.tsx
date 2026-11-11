import type { SVGProps } from "react";

/** `store`: insignias de las tiendas de apps (Google Play, App Store…), en relleno y contorno. */
export type LogoSet = "app" | "integration" | "social" | "store";

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, "children" | "dangerouslySetInnerHTML"> {
	/** Alto en px; el ancho sigue la proporción del logo. Por defecto, su tamaño en el Figma (32, 20 o 24; 40 las insignias de tienda). */
	size?: number;
	/** Nombre accesible («GitHub»). Sin él, el logo es decorativo y queda oculto a lectores de pantalla. */
	title?: string;
}

const escapeText = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/**
 * Crea el componente de un logo a partir de su SVG. Los generados en `logos.generated.tsx` la llaman con
 * `@__PURE__`: un bundler deja fuera los logos que no se importan.
 */
export function makeLogo(width: number, height: number, viewBox: string, inner: string) {
	// biome-ignore lint/correctness/noComponentHookFactories: se llama una vez por logo al cargar el módulo, no al pintar
	function Logo({ size, title, ...rest }: LogoProps) {
		const h = size ?? height;
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={(h * width) / height}
				height={h}
				viewBox={viewBox}
				fill="none"
				aria-hidden={title ? undefined : true}
				role={title ? "img" : undefined}
				focusable="false"
				{...rest}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG del propio paquete, generado del Figma
				dangerouslySetInnerHTML={{
					__html: (title ? `<title>${escapeText(title)}</title>` : "") + inner,
				}}
			/>
		);
	}
	return Logo;
}
