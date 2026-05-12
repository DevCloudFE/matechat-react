import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const registryDir = process.argv[2];
if (!registryDir) {
  console.error("Usage: tsx scripts/strip-tailwind-registry.ts <registry-output-dir>");
  process.exit(1);
}

const tailwindImportRE = /^import\s+["']\.\.?\/tailwind\.css["'];?\s*\n?/m;

let cleaned = 0;
for (const file of readdirSync(registryDir)) {
  if (!file.endsWith(".json") || file === "registry.json") continue;
  const filePath = join(registryDir, file);
  const raw = readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  if (!data.files) continue;

  for (const f of data.files) {
    if (!f.content) continue;
    const original = f.content;
    f.content = f.content.replace(tailwindImportRE, "");
    if (f.content !== original) {
      cleaned++;
    }
  }

  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

console.log(`Cleaned ${cleaned} tailwind.css imports across ${registryDir}`);
