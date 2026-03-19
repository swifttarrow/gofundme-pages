import fs from "fs";
import path from "path";

function loadEnvFromFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();
    if (!key) continue;
    if (process.env[key] !== undefined) continue;

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

export function loadLocalEnv(): void {
  const rootDir = path.resolve(__dirname, "../../../../");
  // Prioritize local overrides when present.
  loadEnvFromFile(path.join(rootDir, ".env.local"));
  loadEnvFromFile(path.join(rootDir, ".env"));
}
