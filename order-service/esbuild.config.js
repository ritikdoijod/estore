import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

await build({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",

  plugins: [nodeExternalsPlugin()],
  logLevel: "info",
});
