import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Digital Doppelgänger – Personal AI Dashboard",
  description: "Manage health, finance, study, and lifestyle agents – always under your control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
