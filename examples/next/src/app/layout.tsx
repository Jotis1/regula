import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Ejemplo Next - jotis.me" };

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="es">
			<body className="bg-primary p-8 text-primary antialiased">
				<a
					href="#contenido"
					className="fixed -top-24 left-4 z-60 rounded-lg bg-primary_alt px-3 py-2 text-sm font-semibold text-primary shadow-lg focus:top-3 focus-visible:outline-none"
				>
					Saltar al contenido
				</a>
				{children}
			</body>
		</html>
	);
}
