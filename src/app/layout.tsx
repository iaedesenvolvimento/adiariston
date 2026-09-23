import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Igreja | Acolhimento e Comunidade",
    template: "%s | Igreja",
  },
  description:
    "Plataforma digital de acolhimento, programação, visitantes e pedidos de oração.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary-900 focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <div id="conteudo" className="contents">
          {children}
        </div>
      </body>
    </html>
  );
}
