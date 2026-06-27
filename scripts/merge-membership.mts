// ...existing code...
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join, relative, resolve } from "path";
import process from "process";

async function mergeDir(dirName: string) {
  const cwd = process.cwd();
  const dir = join(cwd, "data", "membershipType", dirName);
  // data\membershipType\any\2022-1-to-2022-11.csv
  // const masterFile = join(dir, dirName + "collection.csv");
  const masterFile = join(dir, `collection-${dirName}.csv`);

  // Ensure directory exists
  mkdirSync(dir, { recursive: true });

  // "Year","Month","New","Renewed","Changed","Downgraded","Canceled","Expired","Active","Contacts"

  let header =
    '"Year","Month","New","Renewed","Downgraded","Canceled","Expired","Active","Contacts","Filename"\n';
  if (dirName === "any") {
    header =
      '"Year","Month","New","Renewed","Changed","Downgraded","Canceled","Expired","Active","Contacts","Filename"\n';
  }

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
  const destinationFile = join("src", "data", "membership-" + dirName + ".csv");
  copyFileSync(masterFile, destinationFile);
}

function getTypeNameFromId(id: string): string {
  // type
  // any = 0
  // pay it forward = 7965
  // standard = 5426
  // concession = 7964
  // aspen yard = 8914
  // employee = 9961
  // volunteer = 5682

  const typeById: Record<string, string> = getTypeNameById();
  return typeById[id];
}

function getTypeNameById(): Record<string, string> {
  return {
    "0": "any",
    "7965": "payItForward",
    // pay it forward = 7965
    // standard = 5426
    "5426": "standard",
    "7964": "concession",
    "8914": "aspenYard",
    "9961": "employee",
    "5682": "volunteer",
  };
}

async function main() {
  const typeNameById = getTypeNameById();
  const typeNames = [];

  for (const id in typeNameById) {
    typeNames.push(typeNameById[id]);
  }

  for (let i = 0; i < typeNames.length; i++) {
    try {
      await mergeDir(typeNames[i]);
      await mergeDir(typeNames[i]);
      console.log("Merged CSV files");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

// if (require.main === module) {
main();
// }
