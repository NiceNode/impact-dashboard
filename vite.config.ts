import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import envOnly from "vite-env-only";

// Path to your index.scss or variables/mixins if you want to include those globally
// const globalSassFile = '@import "./app/src/sass/index.scss";';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [remix(), tsconfigPaths(), envOnly()],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: globalSassFile,
  //     },
  //   },
  // },
});
