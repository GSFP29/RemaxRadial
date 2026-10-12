import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { RegistarServiceWorker } from "@/components/registar-service-worker";
import { TemaScript } from "@/components/tema-script";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const TITULO = "RE/MAX Radial — Odivelas";
const DESCRICAO =
  "RE/MAX Radial, agência 12116 em Odivelas. Compra, venda e arrendamento de imóveis.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    siteName: "RE/MAX Radial",
    locale: "pt_PT",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITULO }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0033a0",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // /painel não passa pelo middleware do next-intl, por isso cai sempre no
  // "pt" por omissão aqui — está correto, o painel é só em português.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${sora.variable} h-full antialiased`}
    >
      <head>
        <TemaScript />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <RegistarServiceWorker />
      </body>
    </html>
  );
}
