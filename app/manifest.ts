import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "1500 Ledger — Buy-Back Debt",
    short_name: "1500 Ledger",
    description:
      "Track your 2012 Chevrolet 1500 Regular Cab Short Bed buy-back payment plan with Dad.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a1528",
    theme_color: "#0a1528",
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
