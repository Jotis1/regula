"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Estado controlado o no controlado, como un `<input>`: si llega `value`, manda el padre;
 * si no, el componente guarda el suyo empezando por `defaultValue`.
 */
export function useControllable<T>(
	value: T | undefined,
	defaultValue: T,
	onChange?: (next: T) => void,
): [T, (next: T) => void] {
	const [inner, setInner] = useState(defaultValue);
	const controlled = useRef(value !== undefined).current;
	const current = controlled ? (value as T) : inner;
	const set = useCallback(
		(next: T) => {
			if (!controlled) setInner(next);
			onChange?.(next);
		},
		[controlled, onChange],
	);
	return [current, set];
}
