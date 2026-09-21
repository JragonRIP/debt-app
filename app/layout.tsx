import type { Metadata, Viewport } from "next";
import { Geist, Orbitron, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Marquis Ledger",
  description:
    "Debt ledger for a 1999 Mercury Grand Marquis. Log payments and added borrows.",
  applicationName: "Marquis Ledger",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Marquis Ledger",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a100c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${orbitron.variable} h-full`}
    >
      <body className="min-h-dvh antialiased pb-safe">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
