// Formatos de la guía: castellano de España, `1.284,50 €`, `29 oct 2026`.

const LOCALE = "es-ES";

// En es-ES, Intl no agrupa los números de cuatro cifras (1284,50); la guía pide 1.284,50.
const number = (options: Intl.NumberFormatOptions) =>
	new Intl.NumberFormat(LOCALE, { useGrouping: "always", ...options } as Intl.NumberFormatOptions);

/** `1284.5` → `1.284,50 €`. */
export function formatCurrency(value: number, currency = "EUR"): string {
	return number({ style: "currency", currency }).format(value);
}

/** `1284.5` → `1.284,5`; con `decimals` fija los decimales. */
export function formatNumber(value: number, decimals?: number): string {
	return number(
		decimals === undefined ? {} : { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
	).format(value);
}

/** `0.08` → `8 %`. */
export function formatPercent(value: number, decimals = 0): string {
	return number({ style: "percent", maximumFractionDigits: decimals }).format(value);
}

/** `new Date(2026, 9, 29)` → `29 oct 2026`. */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

/** Nombre del mes con mayúscula inicial: `Octubre 2026`. */
export function formatMonth(date: Date): string {
	const s = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" })
		.format(date)
		.replace(" de ", " ");
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/** `204800` → `200 KB`. */
export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	const units = ["KB", "MB", "GB"];
	let v = bytes / 1024;
	let i = 0;
	while (v >= 1024 && i < units.length - 1) {
		v /= 1024;
		i++;
	}
	return `${formatNumber(Math.round(v * 10) / 10)} ${units[i]}`;
}
