import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marquis Ledger — 1999 Grand Marquis",
    short_name: "Marquis Ledger",
    description:
      "Track payments and added debt on a 1999 Mercury Grand Marquis note.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a100c",
    theme_color: "#0a100c",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
