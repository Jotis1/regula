// Vista previa de Message: el de siempre y los nueve tipos del Figma, con reacciones, estado y panel de acciones.

import { FileImageJpg } from "@jotis-me/icons/files";
import { Message, type MessageReaction } from "@jotis-me/react";

const phoenix = { author: "Phoenix Baker", avatar: { initials: "PB" }, online: true, time: "Viernes 14:20" };
const reacciones: MessageReaction[] = [
	{ emoji: "❤️", label: "Me encanta" },
	{ emoji: "👌", count: 2, label: "Perfecto", reacted: true },
];
const onReact = () => {};
const bloque = (clase: string) => <div className={`aspect-[4/3] w-full ${clase}`} />;

export function MessageExample() {
	return (
		<div className="flex flex-col gap-10">
			<div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
				<Message author="Emptor" avatar={{ initials: "Em" }} time="Jueves 18:02">
					He encontrado tres aspiradoras escoba por debajo de 300 €. ¿Te las comparo por autonomía?
				</Message>
				<Message sent time="Jueves 18:03">
					Sí, y quita las que no tengan batería extraíble.
				</Message>
				<Message author="Emptor" avatar={{ initials: "Em" }} typing />
			</div>
			<div className="grid grid-cols-2 items-start gap-x-8 gap-y-6">
				<Message type="message" {...phoenix} reactions={reacciones} onReact={onReact}>
					Hola, Olivia, ¿puedes revisar el último diseño?
				</Message>
				<Message
					type="message"
					sent
					time="Viernes 14:20"
					status="read"
					actions={[
						{ icon: "stars-02", label: "Mejorar con IA" },
						{ icon: "edit-02", label: "Editar" },
						{ icon: "refresh-cw-01", label: "Volver a generar" },
						{ icon: "copy-01", label: "Copiar" },
					]}
				>
					Claro, hoy lo miro.
				</Message>
				<Message
					type="reply"
					sent
					time="Viernes 14:20"
					status="read"
					reply="Hola, Olivia, ¿puedes revisar el último diseño?"
					reactions={reacciones}
				>
					Claro, hoy lo miro.
				</Message>
				<Message
					type="file"
					{...phoenix}
					file={{ name: "Captura del diseño.jpg", size: "1,2 MB", icon: <FileImageJpg /> }}
					reactions={reacciones}
				/>
				<Message type="audio" {...phoenix} audio={{ duration: "00:28" }} reactions={reacciones} />
				<Message
					type="image"
					sent
					time="Viernes 14:20"
					status="unread"
					media={{ node: bloque("bg-utility-brand-200"), name: "Fondo.jpg", size: "128 KB" }}
				/>
				<Message
					type="video"
					{...phoenix}
					media={{ node: bloque("bg-utility-neutral-300") }}
					reactions={reacciones}
				/>
				<Message
					type="link-preview"
					{...phoenix}
					link={{ url: "https://regula.jotis.me", image: bloque("bg-utility-purple-200") }}
				/>
				<Message
					type="link"
					{...phoenix}
					link={{
						url: "https://regula.jotis.me",
						title: "Regula: el sistema de diseño de jotis.me",
						description: "Componentes, tokens e iconos.",
					}}
				/>
				<Message type="message" sent time="Viernes 14:21" status="failed" onRetry={() => {}}>
					¿Te va bien a las cinco?
				</Message>
				<Message type="typing" {...phoenix} />
			</div>
		</div>
	);
}
