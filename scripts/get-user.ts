import path from "path";
import process from "process";
import dotenv from "dotenv";
import { getCookies } from "./get-cookies.ts";
import { mkdirSync, writeFileSync } from "fs";

async function main() {
  dotenv.config();

  const MT_API_URL = process.env.MT_API_URL;
  const COOKIE = await getCookies();

  const userId = process.argv[2];
  if (!userId) {
    console.error("Usage: node scripts/get_user.ts <USER_ID>");
    process.exit(1);
  }
  if (!MT_API_URL || !COOKIE) {
    console.error("MT_API_URL or COOKIE not set in environment");
    process.exit(1);
  }

  const url = `https://${MT_API_URL}/library/orgLoan/exportLoans`;

  const headers: Record<string, string> = {
    Host: MT_API_URL,
    "User-Agent": "curl for ltl-usage-graph",
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.7,fr;q=0.3",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    Referer: `https://${MT_API_URL}/`,
    "Content-type": "application/x-www-form-urlencoded",
    Origin: `https://${MT_API_URL}`,
    DNT: "1",
    Connection: "keep-alive",
    Cookie: COOKIE,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    host: MT_API_URL,
  };

  const params = new URLSearchParams();
  params.set("borrowedBy.id", userId);
  params.set("item.id", "");
  params.set("checkedOutBefore", "struct");
  params.set("checkedOutBefore_date", "");
  params.set("checkedOutBefore_time", "23:59");
  params.set("checkedOutBefore_tz", "Europe/London");
  params.set("checkedOutAfter", "struct");
  params.set("checkedOutAfter_date", "");
  params.set("checkedOutAfter_time", "00:00");
  params.set("checkedOutAfter_tz", "Europe/London");
  params.set("checkedInBefore", "struct");
  params.set("checkedInBefore_date", "");
  params.set("checkedInBefore_time", "23:59");
  params.set("checkedInBefore_tz", "Europe/London");
  params.set("checkedInAfter", "struct");
  params.set("checkedInAfter_date", "");
  params.set("checkedInAfter_time", "00:00");
  params.set("checkedInAfter_tz", "Europe/London");
  params.set("dueBefore", "struct");
  params.set("dueBefore_date", "");
  params.set("dueBefore_time", "23:59");
  params.set("dueBefore_tz", "Europe/London");
  params.set("dueAfter", "struct");
  params.set("dueAfter_date", "");
  params.set("dueAfter_time", "00:00");
  params.set("dueOutAfter_tz", "Europe/London");
  params.set("location.id", "");
  params.set("out", "");
  params.set("project.id", "");
  params.set("projectPhase.id", "");
  params.set("includeProjectData", "false");
  params.set("format", "csv");
  params.set("extension", "csv");

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: params.toString(),
  });

  if (!resp.ok) {
    console.error(`Request failed: ${resp.status} ${resp.statusText}`);
    const text = await resp.text().catch(() => "");
    if (text) console.error(text.slice(0, 200));
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "data", "users");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${userId}.csv`);
  const buffer = Buffer.from(await resp.arrayBuffer());
  writeFileSync(outPath, buffer);
  // TODO: improve rate limiting
  await new Promise((r) => setTimeout(r, 3000));
  console.log(`Saved ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
