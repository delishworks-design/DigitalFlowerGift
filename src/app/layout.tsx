import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Flower Gift",
  description: "Give someone a flower that grows with them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-cream text-charcoal min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
