import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

await esbuild.build({
  entryPoints: [path.join(root, "scripts/storefront/satc-store.src.js")],
  outfile: path.join(root, "extensions/sticky-atc/assets/satc-store.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2018"],
  minify: true,
  legalComments: "none",
});

console.log("built extensions/sticky-atc/assets/satc-store.js");
