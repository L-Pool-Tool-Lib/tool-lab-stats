// ...existing code...
import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join, relative, resolve } from "path";
import process from "process";

async function mergeDir(dirName: string) {
  const cwd = process.cwd();
  const dir = join(cwd, "data", dirName);
  const masterFile = join(dir, "collection.csv");

  // Ensure directory exists
  mkdirSync(dir, { recursive: true });

  const header = '"Value","Count","Amount","Filename"\n';
  writeFileSync(masterFile, header, "utf8");

  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (!entry.toLowerCase().endsWith(".csv")) continue;
    const filePath = join(dir, entry);

    // Skip the master file itself
    if (resolve(filePath) === resolve(masterFile)) continue;

    const relPath = relative(cwd, filePath).replace(/\\/g, "/");
    const content = readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    // Append every line except the header, adding the filename column
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const outLine = `${line},${relPath}\n`;
      appendFileSync(masterFile, outLine, "utf8");
    }
  }
}

async function main() {
  try {
    await mergeDir("sex");
    await mergeDir("zip");
    console.log(
      "Merged CSV files into data/sex/collection.csv and data/zip/collection.csv"
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
