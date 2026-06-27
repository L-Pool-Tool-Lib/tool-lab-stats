import dotenv from "dotenv";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import process from "process";
import { getCookies } from "./get-cookies.mts";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseDateStrict(input: string): YearMonth {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${input}`);
  // normalize to start of day UTC-equivalent (but keep local date semantics)
  // return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

// function addDays(d: Date, days: number) {
//   const out = new Date(d);
//   out.setDate(out.getDate() + days);
//   return out;
// }

// function formatYMD(d: Date) {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// function formatDMY(d: Date) {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${dd}/${mm}/${yyyy}`;
// }

function formatYm(yearMonth: YearMonth) {
  return yearMonth.year + "-" + yearMonth.month;
}

// function getNextStep(endDate: Date): number {
//   // return the number of days until the following Thursday or Monday, whichever comes first
//   const dayOfWeek = endDate.getDay(); // 0=Sun,1=Mon,...6=Sat
//   let daysToThursday = (4 - dayOfWeek + 7) % 7;
//   const daysToSunday = (7 - dayOfWeek + 7) % 7;
//   if (daysToThursday === 0) daysToThursday = 7;

//   return Math.min(daysToThursday, daysToSunday);
// }

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

function addOneMonth(currentYearMonth: YearMonth): YearMonth {
  if (currentYearMonth.month === 12) {
    return { year: currentYearMonth.year + 1, month: 1 };
  }
  return { year: currentYearMonth.year, month: currentYearMonth.month + 1 };
}

function addOneYear(currentYearMonth: YearMonth): YearMonth {
  return { year: currentYearMonth.year + 1, month: currentYearMonth.month };
}

function getLastMonth(currentYearMonth: YearMonth): YearMonth {
  return { year: currentYearMonth.year, month: 11 };
}

type YearMonth = { year: number; month: number };

// TODO: rename this function
async function getMembershipDataForTypeId(typeId: string) {
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

  // TODO: only get cookies if needed
  const COOKIE = await getCookies();

  const typeName = getTypeNameFromId(typeId);

  let yearMonthStart: YearMonth = parseDateStrict(GATSBY_RANGE_START_DATE);
  let endDate: YearMonth = getLastMonth(yearMonthStart);
  const rangeEndDate: YearMonth = parseDateStrict(GATSBY_RANGE_END_DATE);

  const outDirBase = join(process.cwd(), "data", "membershipType", typeName);
  mkdirSync(outDirBase, { recursive: true });

  const gettingData = "Getting all the data.";
  console.time(gettingData);

  let loops = 0;

  const sleepDurationMs = 3000;

  while (
    yearMonthStart.year <= rangeEndDate.year &&
    yearMonthStart.month <= rangeEndDate.month
  ) {
    const formattedStart = formatYm(yearMonthStart);
    const formattedEnd = formatYm(endDate);
    console.log(`Getting ${typeName} - ${formattedStart}...`);

    // TODO: cache the amount of days in both steps and alternate

    const url = `https://${MT_API_URL}/library/orgMembership/exportMembershipReport`;

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

    // type
    // any = 0
    // pay it forward = 7965
    // standard = 5426
    // concession = 7964
    // aspen yard = 8914
    // employee = 9961
    // volunteer = 5682

    const params = new URLSearchParams();

    // "from_date=2025-02&
    params.set("from_date", formattedStart);
    params.set("from", "struct");
    params.set("from_tz", "Europe/London");
    params.set("from_time", "00:00");
    // to_date=2026-02
    params.set("to_date", formattedEnd);
    params.set("to", "struct");
    params.set("to_tz", "Europe/London");
    params.set("to_time", "00:00");
    params.set("type", typeId);
    params.set("format", "csv");
    params.set("extension", "csv");

    const outName = `${formattedStart}-to-${formattedEnd}.csv`;
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
      console.log(`${typeName} - ${formattedStart} already exist, skipping...`);
    }

    // startDate = addDays(endDate, 1);
    // endDate = addDays(startDate, getNextStep(startDate));

    yearMonthStart = addOneYear(yearMonthStart);
    endDate = getLastMonth(yearMonthStart);
  }

  console.log("Done.");
  console.timeEnd(gettingData);
  console.log(
    `Including ${(sleepDurationMs * loops) / 1000 / 60} minutes of sleep.`,
  );
}

const typeNameById = getTypeNameById();

for (const id in typeNameById) {
  await getMembershipDataForTypeId(id);
}
