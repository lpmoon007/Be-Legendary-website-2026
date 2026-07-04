import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 30-Day Challenge — Be Legendary",
  description:
    "Pick one behavior. Get one text a day. For thirty days, we hold you to it.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#15130E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
