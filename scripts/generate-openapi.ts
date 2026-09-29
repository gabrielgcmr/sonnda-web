// scripts/generate-openapi.ts
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultSpecPath = resolve(
  rootDirectory,
  "..",
  "sonnda-api",
  "artifacts",
  "openapi.json",
);
const specPath = resolve(process.env.OPENAPI_SPEC ?? defaultSpecPath);
const generatedTypesPath = resolve(rootDirectory, "src/generated/openapi.d.ts");

await readFile(specPath);
const ast = await openapiTS(pathToFileURL(specPath));
await mkdir(dirname(generatedTypesPath), { recursive: true });
await writeFile(generatedTypesPath, astToString(ast));

console.log(`Generated TypeScript API types from ${specPath}`);
