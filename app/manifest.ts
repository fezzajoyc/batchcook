import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Batchcook — free recipe tools",
    short_name: "Batchcook",
    description:
      "Scale any recipe with fractions, adjust servings and compute baker's percentages — right in your browser.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
