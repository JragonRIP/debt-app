import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title: "1500 Ledger",
  description:
    "Personal buy-back debt ledger for the 2012 Chevrolet 1500 Regular Cab Short Bed payment plan.",
  applicationName: "1500 Ledger",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "1500 Ledger",
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
  themeColor: "#0a1528",
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
      className={`${geistSans.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-dvh antialiased pb-safe">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
