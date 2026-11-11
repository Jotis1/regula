import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Message, MessageInput, type MessageType } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { message: string; input: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/message-before.json"), "utf8"),
);

describe("Message y MessageInput: los de siempre", () => {
	it("sin las props nuevas el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<>
					<Message author="Emptor" time="10:24" online>
						Hola
					</Message>
					<Message sent time="10:25" footer={<span>Visto</span>}>
						Vale
					</Message>
					<Message author="Emptor" typing />
				</>,
			),
		).toBe(BEFORE.message);
		expect(renderToStaticMarkup(<MessageInput onAttach={() => {}} />)).toBe(BEFORE.input);
	});
});

describe("Message: estado", () => {
	it("un enviado fallido lleva el icono de fallo con texto para lectores y pulsarlo avisa con onRetry", async () => {
		const onRetry = vi.fn();
		render(
			<Message sent time="14:20" status="failed" onRetry={onRetry}>
				Vale
			</Message>,
		);
		const retry = screen.getByRole("button", { name: "No se ha enviado. Reintentar el envío" });
		await userEvent.click(retry);
		expect(onRetry).toHaveBeenCalled();
	});

	it("sin onRetry el fallo es un texto, y leído y enviado se anuncian", () => {
		render(
			<>
				<Message sent status="failed">
					A
				</Message>
				<Message sent status="read">
					B
				</Message>
				<Message sent status="unread">
					C
				</Message>
			</>,
		);
		expect(screen.getByText("No se ha enviado")).toBeTruthy();
		expect(screen.getByText("Leído")).toBeTruthy();
		expect(screen.getByText("Enviado")).toBeTruthy();
		expect(screen.queryByRole("button")).toBeNull();
	});
});

describe("Message: reacciones y acciones", () => {
	it("las reacciones son una lista con su contador accesible y, con onReact, botones con estado", async () => {
		const onReact = vi.fn();
		render(
			<Message
				author="Phoenix"
				reactions={[
					{ emoji: "❤️", label: "Me encanta" },
					{ emoji: "👌", count: 2, label: "Perfecto", reacted: true },
				]}
				onReact={onReact}
			>
				¿Lo revisas?
			</Message>,
		);
		const list = screen.getByRole("list", { name: "Reacciones" });
		expect(within(list).getAllByRole("listitem")).toHaveLength(2);
		const ok = screen.getByRole("button", { name: "Perfecto: 2" });
		expect(ok.getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByRole("button", { name: "Me encanta: 1" }).getAttribute("aria-pressed")).toBe(
			"false",
		);
		await userEvent.click(ok);
		expect(onReact).toHaveBeenCalledWith("👌");
	});

	it("sin onReact las reacciones son texto con su nombre", () => {
		render(
			<Message author="Phoenix" reactions={[{ emoji: "❤️", count: 3 }]}>
				Hola
			</Message>,
		);
		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByText("❤️: 3")).toBeTruthy();
	});

	it("el panel de acciones es una barra con un botón por acción", async () => {
		const onCopy = vi.fn();
		render(
			<Message
				sent
				actions={[
					{ icon: "edit-02", label: "Editar" },
					{ icon: "copy-01", label: "Copiar", onClick: onCopy },
				]}
			>
				Vale
			</Message>,
		);
		const bar = screen.getByRole("toolbar", { name: "Acciones del mensaje" });
		await userEvent.click(within(bar).getByRole("button", { name: "Copiar" }));
		expect(onCopy).toHaveBeenCalled();
	});
});

describe("Message: los nueve tipos", () => {
	it("reply cita el mensaje al que responde", () => {
		render(
			<Message type="reply" sent reply="¿Puedes revisar el diseño?">
				Claro, hoy lo miro.
			</Message>,
		);
		expect(screen.getByText("¿Puedes revisar el diseño?").tagName).toBe("BLOCKQUOTE");
	});

	it("file enseña nombre y tamaño y, con href, es un enlace", () => {
		render(
			<Message
				type="file"
				author="Phoenix"
				file={{ name: "captura.jpg", size: "1,2 MB", href: "/captura.jpg" }}
			/>,
		);
		expect(screen.getByRole("link", { name: /captura\.jpg/ }).getAttribute("href")).toBe("/captura.jpg");
	});

	it("audio tiene botón de reproducir con nombre, la duración y la onda decorativa", () => {
		render(<Message type="audio" author="Phoenix" audio={{ src: "/voz.mp3", duration: "00:28" }} />);
		expect(screen.getByRole("button", { name: "Reproducir el audio" })).toBeTruthy();
		expect(screen.getByText("00:28")).toBeTruthy();
	});

	it("image con nombre y tamaño, link-preview y link con su URL", () => {
		render(
			<>
				<Message
					type="image"
					sent
					media={{ node: <div data-testid="foto" />, name: "fondo.jpg", size: "128 KB" }}
				/>
				<Message
					type="link-preview"
					author="Phoenix"
					link={{ url: "https://jotis.me", image: <div /> }}
				/>
				<Message
					type="link"
					author="Phoenix"
					link={{
						url: "https://regula.jotis.me",
						title: "Regula",
						description: "El sistema de diseño",
					}}
				/>
			</>,
		);
		expect(screen.getByTestId("foto")).toBeTruthy();
		expect(screen.getByText("fondo.jpg")).toBeTruthy();
		expect(screen.getByRole("link", { name: "https://jotis.me" })).toBeTruthy();
		expect(screen.getByText("El sistema de diseño")).toBeTruthy();
	});

	it("typing anuncia que está escribiendo", () => {
		render(<Message type="typing" author="Phoenix" />);
		expect(screen.getByText("Escribiendo")).toBeTruthy();
	});

	it.each<MessageType>([
		"message",
		"reply",
		"file",
		"audio",
		"image",
		"video",
		"link-preview",
		"link",
		"typing",
	])("%s es accesible en claro y oscuro", async (type) => {
		await expectAccessibleInThemes(
			<Message
				type={type}
				author="Phoenix"
				time="14:20"
				reply="Cita"
				file={{ name: "captura.jpg", size: "1,2 MB" }}
				audio={{ duration: "00:28" }}
				media={{ node: <div className="h-20" /> }}
				link={{ url: "https://jotis.me", title: "Jotis", image: <div /> }}
				reactions={[{ emoji: "❤️", label: "Me encanta" }]}
				onReact={() => {}}
			>
				Hola
			</Message>,
		);
	});
});

describe("MessageInput: variantes", () => {
	it("minimal: una línea y el botón de enviar al lado, que avisa con el texto", async () => {
		const onSend = vi.fn();
		render(<MessageInput variant="minimal" placeholder="Mensaje" onSend={onSend} />);
		const send = screen.getByRole("button", { name: "Enviar" });
		expect(send.hasAttribute("disabled")).toBe(true);
		await userEvent.type(screen.getByRole("textbox", { name: "Mensaje" }), "Hola");
		await userEvent.click(send);
		expect(onSend).toHaveBeenCalledWith("Hola");
	});

	it("textarea: micrófono, adjuntar, emoji y «Enviar», cada uno con su nombre", async () => {
		const onVoice = vi.fn();
		const onEmoji = vi.fn();
		const onSend = vi.fn();
		render(
			<MessageInput
				variant="textarea"
				onVoice={onVoice}
				onEmoji={onEmoji}
				onAttach={() => {}}
				onSend={onSend}
			/>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Dictar con la voz" }));
		await userEvent.click(screen.getByRole("button", { name: "Añadir un emoji" }));
		expect(onVoice).toHaveBeenCalled();
		expect(onEmoji).toHaveBeenCalled();
		expect(screen.getByRole("button", { name: "Adjuntar archivo" })).toBeTruthy();
		await userEvent.type(screen.getByRole("textbox"), "Hola{Enter}");
		expect(onSend).toHaveBeenCalledWith("Hola");
	});

	it("advanced: barra con toolbar a la izquierda y Atajos y Adjuntar a la derecha", async () => {
		const onShortcuts = vi.fn();
		render(
			<MessageInput
				variant="advanced"
				placeholder="Pregúntame lo que quieras…"
				toolbar={<span>Olivia</span>}
				onShortcuts={onShortcuts}
				onAttach={() => {}}
			/>,
		);
		expect(screen.getByText("Olivia")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Atajos" }));
		expect(onShortcuts).toHaveBeenCalled();
		expect(screen.getByRole("button", { name: "Adjuntar archivo" })).toBeTruthy();
	});

	it.each(["minimal", "textarea", "advanced"] as const)(
		"%s es accesible en claro y oscuro",
		async (variant) => {
			await expectAccessibleInThemes(
				<MessageInput
					variant={variant}
					onVoice={() => {}}
					onEmoji={() => {}}
					onAttach={() => {}}
					onShortcuts={() => {}}
				/>,
			);
		},
	);
});
