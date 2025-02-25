import esbuild from "esbuild";
import nodeExternals from "esbuild-plugin-node-externals";
import { fileURLToPath } from "url";
import { dirname } from "path";

const antelope_ecc_path =
  dirname(fileURLToPath(import.meta.url)) +
  "/node_modules/antelope-ecc/index.js"; // Get __dirname equivalent

esbuild
  .build({
    entryPoints: [antelope_ecc_path],
    outfile: "main/antelope-ecc.js",
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "esnext",
    plugins: [nodeExternals()],
  })
  .catch(() => process.exit(1));
