import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(new URL("./js-v3-loader.mjs", import.meta.url), pathToFileURL("./"));
