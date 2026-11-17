/** Minúsculas y sin tildes: "tipografia" encuentra "Tipografía". */
export const fold = (s: string) =>
	s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
