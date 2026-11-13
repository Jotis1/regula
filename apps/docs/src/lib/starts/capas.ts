// Puntos de partida del ejemplo interactivo del grupo «capas» del catálogo (design D3).
import type { Start } from "../playground";

export const capas: Record<string, Start> = {
	HelpIcon: { props: { title: "Qué incluye", text: "Impuestos incluidos, sin descuentos." } },
	Tooltip: {
		props: {
			title: "Exporta a CSV",
			text: "Con los filtros que tengas puestos.",
			open: true,
			children: "Botón",
		},
	},
	Spotlight: {
		props: { active: true, note: "Ahora en gris" },
		children: "Guardar cambios",
	},
	CopyTooltip: { props: { copyAttribute: "data-copy" } },
	Slideout: {
		props: {
			open: true,
			contained: true,
			title: "Alquiler",
			description: "Movimiento del 1 de octubre",
			children: "Importe 650,00 €",
			actions: "Guardar y cancelar",
		},
		fill: 360,
	},
	Modal: {
		props: {
			open: true,
			contained: true,
			icon: "Trash01",
			title: "¿Eliminar este gasto?",
			description: "Se borrará también de los informes. No se puede deshacer.",
		},
		// `contained` llena a su padre (`absolute inset-0`): sin marco, su padre no mide nada y el diálogo se encoge
		fill: 360,
		// Los pies son frases de la ficha (content/components/modal.md), letra a letra
		examples: [
			{
				do: {
					caption:
						"Solo un `Button` primario en `actions`: el que confirma la decisión del título.",
					specimens: [
						{
							props: {
								contained: true,
								title: "¿Eliminar este gasto?",
								description: "Se borrará también de los informes.",
								actions: [
									{
										component: "Button",
										props: { hierarchy: "secondary" },
										children: "Cancelar",
									},
									{
										component: "Button",
										props: { destructive: true },
										children: "Eliminar",
									},
								],
							},
						},
					],
					frame: 300,
				},
				dont: {
					caption:
						"Si un modal necesita dos acciones principales, son dos decisiones y van en dos pasos.",
					specimens: [
						{
							props: {
								contained: true,
								title: "¿Guardar los cambios?",
								description: "Puedes guardarlos y enviarlos ahora o más tarde.",
								actions: [
									{ component: "Button", children: "Guardar" },
									{ component: "Button", children: "Guardar y enviar" },
								],
							},
						},
					],
					frame: 300,
				},
			},
		],
	},
};
