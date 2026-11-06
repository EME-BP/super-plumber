import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const skillScripts = dirname(fileURLToPath(import.meta.url));
const gameRoot = join(skillScripts, "../../../..");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("/js-v3/")) {
    return {
      url: pathToFileURL(join(gameRoot, specifier.slice(1))).href,
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
