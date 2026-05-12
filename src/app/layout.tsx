import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meine Rezepte",
  description: "Digitale Rezeptsammlung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-background text-on-background font-body antialiased">{children}</body>
    </html>
  );
}
