import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import envOnly from "vite-env-only"

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [remix(), tsconfigPaths(), envOnly()],
});
