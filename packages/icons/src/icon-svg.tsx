import type { IconProps } from "./Icon.js";

/** Props de un icono suelto (`IconRocket02`): las de `Icon` menos `name`, que ya es el propio componente. */
export type IconComponentProps = Omit<IconProps, "name">;

const SPIN_CSS =
	"@keyframes jm-icon-spin{to{transform:rotate(360deg)}}.jm-icon-spin{animation:jm-icon-spin 1s linear infinite;transform-origin:center}@media (prefers-reduced-motion:reduce){.jm-icon-spin{animation:none}}";

/** Pinta los trazos de un icono de línea (24×24, trazo de 2px redondeado) con el color del texto. */
export function IconSvg({
	paths,
	size = 20,
	strokeWidth = 2,
	title,
	spin,
	className,
	...rest
}: IconComponentProps & { paths: readonly string[] }) {
	const classes = [spin ? "jm-icon-spin" : "", className ?? ""].filter(Boolean).join(" ") || undefined;
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: con `title` lleva <title>; sin él es decorativo y va con aria-hidden
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden={title ? undefined : true}
			role={title ? "img" : undefined}
			focusable="false"
			className={classes}
			{...rest}
		>
			{title ? <title>{title}</title> : null}
			{spin ? <style>{SPIN_CSS}</style> : null}
			{paths.map((d) => (
				<path key={d} d={d} />
			))}
		</svg>
	);
}

/**
 * Crea el componente de un icono suelto a partir de sus trazos. Los generados en `components.generated.tsx` la llaman
 * con `@__PURE__`: un bundler deja fuera los iconos que no se importan, y cada uno lleva su propio dibujo.
 */
export function makeIcon(paths: readonly string[]) {
	// biome-ignore lint/correctness/noComponentHookFactories: se llama una vez por icono al cargar el módulo, no al pintar
	function IconComponent(props: IconComponentProps) {
		return <IconSvg paths={paths} {...props} />;
	}
	return IconComponent;
}
