import { describe, expect, it } from "vitest";
import { STARTS } from "../src/lib/playground";
import { playgroundComponents } from "../src/lib/playground-components";

describe("playgroundComponents", () => {
	it("tiene exactamente los componentes con punto de partida", () => {
		expect(Object.keys(playgroundComponents).sort()).toEqual(Object.keys(STARTS).sort());
	});

	it("cada entrada es un componente, no undefined", () => {
		for (const [name, Component] of Object.entries(playgroundComponents))
			expect(["function", "object"], name).toContain(typeof Component);
	});
});
