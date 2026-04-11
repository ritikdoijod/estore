import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

await build({
  entryPoints: ["src/server.ts", "src/workers.ts"],
  outdir: "dist",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",

  plugins: [nodeExternalsPlugin()],
  logLevel: "info",
});
