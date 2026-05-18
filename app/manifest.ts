import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Impala Ledger — Buy-Back Debt",
    short_name: "Impala Ledger",
    description:
      "Track your 1968 Impala buy-back payment plan with Dad.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a1f15",
    theme_color: "#0a1f15",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
