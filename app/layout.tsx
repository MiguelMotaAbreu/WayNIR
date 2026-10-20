import type { Metadata } from "next";
import "./globals.css";
import "./platform.css";

export const metadata: Metadata = {
  title: "WayNIR | Operação e inteligência para o NIR",
  description:
    "Censos, movimentações e indicadores do Núcleo Interno de Regulação em uma única plataforma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
