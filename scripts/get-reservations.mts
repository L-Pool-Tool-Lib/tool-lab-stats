import dotenv from "dotenv";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import process from "process";
import { getCookies } from "./get-cookies.mts";

const {
  GATSBY_RANGE_START_DATE,
  GATSBY_RANGE_END_DATE,
  // GATSBY_STEP_SIZE_IN_DAYS,
  MT_API_URL,
} = process.env;

const url = `https://${MT_API_URL}/library/orgInventory/exportReservationReport`;

await fetch(url, {
  credentials: "include",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.7,fr;q=0.3",
    "Content-type": "application/x-www-form-urlencoded",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    Priority: "u=0",
    Referer: `https://${MT_API_URL}/`,
    Origin: `https://${MT_API_URL}`,
  },
  body: "after_date=11%2F12%2F2025&after=struct&after_tz=Europe%2FLondon&after_time=00%3A00&before_date=11%2F01%2F2026&before=struct&before_tz=Europe%2FLondon&before_time=00%3A00&endAfter_date=&endAfter=struct&endAfter_tz=Europe%2FLondon&endAfter_time=00%3A00&endBefore_date=&endBefore=struct&endBefore_tz=Europe%2FLondon&endBefore_time=00%3A00&showCompleted=true&includeItemData=true&format=csv&extension=csv",
  method: "POST",
  mode: "cors",
});
