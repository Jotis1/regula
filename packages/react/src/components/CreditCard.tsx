import type { CSSProperties, ReactNode } from "react";
import { cx } from "../internal/cx.js";

export type CreditCardTheme = "brand-dark" | "brand-light" | "gray-dark" | "gray-light" | "transparent";

export interface CreditCardProps {
	/**
	 * Acabado de la tarjeta. Sus colores son fijos: es un objeto y no cambia con el tema.
	 * @default "brand-dark"
	 */
	theme?: CreditCardTheme;
	/** Texto arriba a la izquierda, en Bricolage Grotesque. @default "jotis.me" */
	company?: ReactNode;
	/** Titular, en mayúsculas. @default "ADMINISTRADOR" */
	holder?: string;
	/** Caducidad, como "06/29". */
	expiry?: string;
	/** Los cuatro últimos dígitos: nunca se muestra el número entero. @default "1234" */
	last4?: string;
	/** Red de pago como texto, abajo a la derecha. Sin logotipos. */
	network?: ReactNode;
	/**
	 * Nombre para lectores de pantalla (ampliación sobre la guía). Por defecto resume los datos:
	 * "Tarjeta Pecunia terminada en 4821, titular Administrador, caduca 06/29".
	 */
	"aria-label"?: string;
	className?: string;
	style?: CSSProperties;
}

// Colores fijos de la ficha: la tarjeta es un objeto, no parte de la interfaz.
const THEME: Record<
	CreditCardTheme,
	{ card: string; fg: string; sub: string; edge: boolean; darkChip: boolean }
> = {
	"brand-dark": {
		card: "bg-[linear-gradient(45deg,#312c85,#432dd7)] shadow-lg",
		fg: "text-[#ffffff]",
		sub: "text-[#ffffffcc]",
		edge: true,
		darkChip: false,
	},
	"brand-light": {
		card: "bg-[linear-gradient(45deg,#c6d2ff,#e0e7ff)] shadow-lg",
		fg: "text-[#312c85]",
		sub: "text-[#432dd7]",
		edge: false,
		darkChip: true,
	},
	"gray-dark": {
		card: "bg-[linear-gradient(45deg,#0a0a0a,#404040)] shadow-lg",
		fg: "text-[#ffffff]",
		sub: "text-[#ffffffcc]",
		edge: true,
		darkChip: false,
	},
	"gray-light": {
		card: "bg-[#f5f5f5] shadow-[var(--shadow-lg),inset_0_0_0_1px_#e5e5e5]",
		fg: "text-[#404040]",
		sub: "text-[#525252]",
		edge: false,
		darkChip: true,
	},
	transparent: {
		card: "bg-[linear-gradient(135deg,#ffffff47,#ffffff0f)] shadow-lg backdrop-blur-lg",
		fg: "text-[#ffffff]",
		sub: "text-[#ffffffcc]",
		edge: true,
		darkChip: false,
	},
};

// Canto: borde degradado blanco (0,5 → 0,08) recortado al anillo de 1px
const EDGE: CSSProperties = {
	padding: 1,
	background: "linear-gradient(135deg, #ffffff80, #ffffff14)",
	mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
	WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
	WebkitMaskComposite: "xor",
};

function Contactless({ className }: { className: string }) {
	return (
		<svg
			aria-hidden="true"
			width={20}
			height={20}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			className={className}
		>
			<path d="M8.5 8.5a5 5 0 0 1 0 7" />
			<path d="M12 6a8.5 8.5 0 0 1 0 12" />
			<path d="M15.5 3.5a12 12 0 0 1 0 17" />
		</svg>
	);
}

/** Maqueta de tarjeta de pago (316×190) para métodos de pago, onboarding o capturas. Es una imagen con nombre. */
export function CreditCard({
	theme = "brand-dark",
	company = "jotis.me",
	holder = "ADMINISTRADOR",
	expiry,
	last4 = "1234",
	network,
	className,
	style,
	...rest
}: CreditCardProps) {
	const t = THEME[theme];
	const last = String(last4).slice(-4);
	const label =
		rest["aria-label"] ??
		`Tarjeta ${typeof company === "string" ? `${company} ` : ""}terminada en ${last}` +
			(holder ? `, titular ${holder}` : "") +
			(expiry ? `, caduca ${expiry}` : "");
	return (
		<div
			role="img"
			aria-label={label}
			className={cx(
				"relative isolate flex h-[190px] w-[316px] shrink-0 flex-col overflow-hidden rounded-2xl py-4 pr-4 pl-5 font-body",
				t.card,
				t.fg,
				className,
			)}
			style={style}
		>
			{t.edge ? (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
					style={EDGE}
				/>
			) : null}
			<div className="flex items-start justify-between">
				<span className="font-display text-md font-semibold tracking-[-0.01em]">{company}</span>
				<Contactless className={t.sub} />
			</div>
			<div
				className={cx(
					"mt-3.5 h-7 w-9 rounded-md",
					t.darkChip
						? "bg-[linear-gradient(135deg,#0000001f,#0000000a)] shadow-[inset_0_0_0_1px_#00000014]"
						: "bg-[linear-gradient(135deg,#ffffff8c,#ffffff26)] shadow-[inset_0_0_0_1px_#ffffff59]",
				)}
			/>
			<div className="mt-auto flex items-end gap-3">
				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<div
						className={cx(
							"flex justify-between gap-2 text-xs font-semibold tracking-[0.05em]",
							t.sub,
						)}
					>
						<span className="truncate uppercase">{holder}</span>
						{expiry ? <span>{expiry}</span> : null}
					</div>
					<span className="text-md font-medium tracking-[0.06em] tabular-nums">
						•••• •••• •••• {last}
					</span>
				</div>
				{network ? (
					<span className="rounded-md bg-[#ffffff1a] px-2 py-1 text-sm/6 font-bold italic">
						{network}
					</span>
				) : null}
			</div>
		</div>
	);
}
