import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "index.html", // Source file to copy
          dest: "", // Destination folder (root in this case)
          rename: "404.html", // Rename to 404.html
        },
      ],
    }),
  ],
  base: "/sales-order-booking-dev",
});
