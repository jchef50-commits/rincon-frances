import type { Metadata } from "next";
import { Dancing_Script, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/app/context/CarritoContext";
import { PedidosProvider } from "@/app/context/PedidosContext";
import { ToastProvider } from "@/app/context/ToastContext";
import { AuthProvider } from "@/app/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandScript = Dancing_Script({
  variable: "--font-brand-script",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Rincón Francés",
  description: "Sistema de pedidos para restaurante Rincón Francés",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${brandScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <PedidosProvider>
            <CarritoProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CarritoProvider>
          </PedidosProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
