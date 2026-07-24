import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://challenge.belegendary.org"),
  title: {
    default: "Your 30-Day Challenge — Be Legendary",
    template: "%s | Your 30-Day Challenge",
  },
  description:
    "Pick one behavior. Get one text a day. For thirty days, we hold you to it — a morning nudge, a 4 p.m. check-in, and a line on how it went. No app to download.",
  applicationName: "The 30-Day Challenge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Be Legendary",
    title: "The 30-Day Challenge — Build a Leadership Habit That Sticks",
    description:
      "One behavior. Thirty days. A morning nudge and a 4 p.m. check-in hold you to it. No app to download. Free from Be Legendary.",
    images: [
      {
        url: "https://www.belegendary.org/assets/share-card.png",
        width: 1200,
        height: 630,
        alt: "The 30-Day Challenge — Be Legendary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 30-Day Challenge — Be Legendary",
    description:
      "One behavior. Thirty days. Held to it daily — no app to download. Free from Be Legendary.",
    images: ["https://www.belegendary.org/assets/share-card.png"],
  },
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
