// scripts/sync-contracts.ts
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

type ContractLock = {
  source: string;
  asset: string;
  version: string;
  sha256: string;
};

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = resolve(rootDirectory, "contracts.lock");
const bundlePath = resolve(rootDirectory, "dist/openapi.yaml");
const generatedTypesPath = resolve(rootDirectory, "src/generated/openapi.d.ts");

function parseLock(contents: string): ContractLock {
  const values = new Map<string, string>();

  for (const line of contents.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separator = trimmedLine.indexOf("=");
    if (separator < 1)
      throw new Error(`Invalid contracts.lock line: ${trimmedLine}`);
    values.set(
      trimmedLine.slice(0, separator).trim(),
      trimmedLine.slice(separator + 1).trim(),
    );
  }

  const lock = {
    source: values.get("source") ?? "",
    asset: values.get("asset") ?? "",
    version: values.get("version") ?? "",
    sha256: values.get("sha256") ?? "",
  };

  if (Object.values(lock).some((value) => !value)) {
    throw new Error(
      "contracts.lock requires source, asset, version and sha256",
    );
  }
  if (!/^[a-f0-9]{64}$/i.test(lock.sha256)) {
    throw new Error(
      "contracts.lock sha256 must contain 64 hexadecimal characters",
    );
  }

  return lock;
}

const lock = parseLock(await readFile(lockPath, "utf8"));
const downloadUrl = `${lock.source.replace(/\/+$/, "")}/${lock.version}/${lock.asset}`;
const response = await fetch(downloadUrl);

if (!response.ok) {
  throw new Error(
    `Contract download failed: ${response.status} ${response.statusText}`,
  );
}

const bundle = new Uint8Array(await response.arrayBuffer());
const actualSha256 = createHash("sha256").update(bundle).digest("hex");

if (actualSha256 !== lock.sha256.toLowerCase()) {
  throw new Error(
    `Contract checksum mismatch: expected ${lock.sha256}, got ${actualSha256}`,
  );
}

await mkdir(dirname(bundlePath), { recursive: true });
await writeFile(bundlePath, bundle);

const ast = await openapiTS(pathToFileURL(bundlePath));
await mkdir(dirname(generatedTypesPath), { recursive: true });
await writeFile(generatedTypesPath, astToString(ast));

console.log(
  `Generated TypeScript API types from ${lock.asset}@${lock.version} (${actualSha256})`,
);
