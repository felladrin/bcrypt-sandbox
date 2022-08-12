import { defineConfig } from "vite";
import { execSync } from "node:child_process";

export default defineConfig({
  base: "./",
  server: (() => {
    try {
      const port = 5173;
      const gitpodPortUrl = execSync(`gp url ${port}`).toString().trim();
      return {
        strictPort: true,
        port,
        hmr: {
          protocol: "wss",
          host: new URL(gitpodPortUrl).hostname,
          clientPort: 443,
        },
      };
    } catch {}
  })(),
});
