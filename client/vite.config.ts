import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  envPrefix: "DURING",
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});
