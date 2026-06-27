import dotenv from "dotenv";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import process from "process";
import { getCookies } from "./get-cookies.mts";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseDateStrict(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${input}`);
  // normalize to start of day UTC-equivalent (but keep local date semantics)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function formatYMD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDMY(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}

function getNextStep(endDate: Date): number {
  // return the number of days until the following Thursday or Monday, whichever comes first
  const dayOfWeek = endDate.getDay(); // 0=Sun,1=Mon,...6=Sat
  let daysToThursday = (4 - dayOfWeek + 7) % 7;
  const daysToSunday = (7 - dayOfWeek + 7) % 7;
  if (daysToThursday === 0) daysToThursday = 7;

  return Math.min(daysToThursday, daysToSunday);
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

async function getMembershipChangeDataForTypeId(typeId: string) {
  dotenv.config({
    path: ".env.development",
  });

  const {
    GATSBY_RANGE_START_DATE,
    GATSBY_RANGE_END_DATE,
    // GATSBY_STEP_SIZE_IN_DAYS,
    MT_API_URL,
  } = process.env;

  if (
    !GATSBY_RANGE_START_DATE ||
    !GATSBY_RANGE_END_DATE
    // !GATSBY_RANGE_END_DATE ||
    // !GATSBY_STEP_SIZE_IN_DAYS
  ) {
    console.error(
      // "Missing GATSBY_RANGE_START_DATE, GATSBY_RANGE_END_DATE or GATSBY_STEP_SIZE_IN_DAYS in env"
      "Missing GATSBY_RANGE_START_DATE, GATSBY_RANGE_END_DATE in env",
    );
    process.exit(1);
  }
  if (!MT_API_URL) {
    console.error("Missing MT_API_URL in env");
    process.exit(1);
  }

  const COOKIE = await getCookies();

  const typeName = getTypeNameFromId(typeId);

  let startDate = parseDateStrict(GATSBY_RANGE_START_DATE);
  let endDate = addDays(startDate, getNextStep(startDate));
  const rangeEndDate = parseDateStrict(GATSBY_RANGE_END_DATE);

  const outDirBase = join(process.cwd(), "data", "membershipChange", typeName);
  mkdirSync(outDirBase, { recursive: true });

  const gettingData = "Getting all the data.";
  console.time(gettingData);

  let loops = 0;

  const sleepDurationMs = 3000;

  while (
    addDays(endDate, getNextStep(endDate)).getTime() <= rangeEndDate.getTime()
  ) {
    const formattedStart = formatDMY(startDate);
    const formattedEnd = formatDMY(endDate);
    console.log(`Getting ${typeName} - ${formattedStart}...`);

    // TODO: cache the amount of days in both steps and alternate

    const url = `https://${MT_API_URL}/library/orgMembership/exportMembershipChangeReport`;

    const headers: Record<string, string> = {
      Host: MT_API_URL,
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.7,fr;q=0.3",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: `https://${MT_API_URL}/`,
      "User-Agent": "nodeJS for ltl-usage-graph",
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

    //  "from_date=26%2F02%2F2025
    // from=struct
    // from_tz=Europe%2FLondon
    // from_time=00%3A00
    // to_date=26%2F02%2F2026
    // to=struct
    // to_tz=Europe%2FLondon
    // to_time=23%3A59%3A59.999
    // transactionType=
    // type=0
    // format=csv
    // extension=csv",

    params.set("from_date", formattedStart);
    params.set("from", "struct");
    params.set("from_tz", "Europe/London");
    params.set("from_time", "00:00");
    params.set("to_date", formattedEnd);
    params.set("to", "struct");
    params.set("to_tz", "Europe/London");
    params.set("to_time", "23:59.999");
    // params.set("aggregateAttribute", aggregate);

    params.set("transactionType", "");
    params.set("type", typeId);
    params.set("format", "csv");
    params.set("extension", "csv");

    const outName = `${formatYMD(startDate)}-to-${formatYMD(endDate)}.csv`;
    const outPath = join(outDirBase, outName);

    if (!existsSync(outPath)) {
      let resp;
      try {
        resp = await fetch(url, {
          method: "POST",
          headers,
          body: params.toString(),
        });
      } catch (err) {
        console.error("Fetch failed:", String(err));
        process.exit(1);
      }
      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        console.error(`Request failed: ${resp.status} ${resp.statusText}`);
        if (text) console.error(text.slice(0, 500));
        process.exit(1);
      }
      const buffer = Buffer.from(await resp.arrayBuffer());
      writeFileSync(outPath, buffer);
      await sleep(sleepDurationMs);
      loops++;
    } else {
      console.log(`Skipping ${typeName} - ${formattedStart}`);
    }

    startDate = addDays(endDate, 1);
    endDate = addDays(startDate, getNextStep(startDate));
  }

  console.log("Done.");
  console.timeEnd(gettingData);
  console.log(
    `Including ${(sleepDurationMs * loops) / 1000 / 60} minutes of sleep.`,
  );
}

const typeNameById = getTypeNameById();

for (const id in typeNameById) {
  await getMembershipChangeDataForTypeId(id);
}
