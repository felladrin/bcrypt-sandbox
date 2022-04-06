import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    hmr: {
      clientPort: process.env.GITPOD_WORKSPACE_ID ? 443 : undefined,
    },
  },
});
