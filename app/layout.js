import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuickTrace - Gestión de Clientes",
  description: "Plataforma de seguimiento y gestión de clientes",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Script 
          src="https://apps.clientify.net/widget-whatsapp2.0/app/assets/index-5yccDyx4.js?id=6d9f3bb5-ac27-4a8a-9b42-3f706307dc8c&path=https://plus.clientify.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
