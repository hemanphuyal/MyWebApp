import bsCalendarData from "../data/bs-calendar.json";

const bsData: Record<string, number[]> = bsCalendarData;

// Reference date: BS 2000/01/01 = AD 1943/04/17 (calibrated)
const BS_REF_YEAR = 2000;
const BS_REF_MONTH = 1;
const BS_REF_DAY = 1;

// Use UTC to avoid DST shifts in day calculations
const AD_REF = new Date(Date.UTC(1943, 3, 14)); // April 17, 1943 UTC (calibrated)

export const BS_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const AD_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Get all supported BS years from JSON */
export function getBsYears(): number[] {
  return Object.keys(bsData)
    .map(Number)
    .sort((a, b) => a - b);
}

/** Get number of days in a BS month (STRICT from JSON) */
export function getBsDaysInMonth(year: number, month: number): number {
  const yearData = bsData[String(year)];

  if (!yearData) {
    throw new Error(`BS year ${year} not found in bs-calendar.json`);
  }

  if (month < 1 || month > 12) {
    throw new Error(`Invalid BS month: ${month}`);
  }

  return yearData[month - 1];
}

/** Get total number of days in a BS year (STRICT from JSON) */
export function getTotalBsDaysInYear(year: number): number {
  const yearData = bsData[String(year)];

  if (!yearData) {
    throw new Error(`BS year ${year} not found in bs-calendar.json`);
  }

  return yearData.reduce((sum, days) => sum + days, 0);
}

/** Convert BS date → AD Date */
export function bsToAd(
  bsYear: number,
  bsMonth: number,
  bsDay: number
): Date | null {
  if (!bsData[String(bsYear)]) return null;

  let totalDays = 0;

  // Add days for full years
  for (let y = BS_REF_YEAR; y < bsYear; y++) {
    totalDays += getTotalBsDaysInYear(y);
  }

  // Add days for full months in target year
  for (let m = 1; m < bsMonth; m++) {
    totalDays += getBsDaysInMonth(bsYear, m);
  }

  // Add remaining days
  totalDays += bsDay - 1;

  const adUtc = new Date(AD_REF.getTime() + totalDays * 86400000);

  // Return local date version
  return new Date(
    adUtc.getUTCFullYear(),
    adUtc.getUTCMonth(),
    adUtc.getUTCDate()
  );
}

/** Convert AD Date → BS date */
export function adToBs(
  adDate: Date
): { year: number; month: number; day: number } | null {
  const targetUtc = Date.UTC(
    adDate.getFullYear(),
    adDate.getMonth(),
    adDate.getDate()
  );

  const refUtc = AD_REF.getTime();

  if (targetUtc < refUtc) return null;

  let totalDays = Math.round((targetUtc - refUtc) / 86400000);

  let bsYear = BS_REF_YEAR;
  let bsMonth = BS_REF_MONTH;
  let bsDay = BS_REF_DAY;

  const years = getBsYears();
  const maxYear = years[years.length - 1];

  // Count years
  while (totalDays > 0) {
    const daysInYear = getTotalBsDaysInYear(bsYear);

    if (totalDays >= daysInYear) {
      totalDays -= daysInYear;
      bsYear++;

      if (bsYear > maxYear) return null;
    } else {
      break;
    }
  }

  // Count months
  while (totalDays > 0) {
    const daysInMonth = getBsDaysInMonth(bsYear, bsMonth);

    if (totalDays >= daysInMonth) {
      totalDays -= daysInMonth;
      bsMonth++;

      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;

        if (bsYear > maxYear) return null;
      }
    } else {
      break;
    }
  }

  bsDay += totalDays;

  if (!bsData[String(bsYear)]) return null;

  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
  };
}

/** Get AD year range supported by BS dataset */
export function getAdYearRange(): { min: number; max: number } {
  const years = getBsYears();

  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const minAd = bsToAd(firstYear, 1, 1);
  const lastMonthDays = getBsDaysInMonth(lastYear, 12);
  const maxAd = bsToAd(lastYear, 12, lastMonthDays);

  if (!minAd || !maxAd) {
    throw new Error("Unable to calculate AD year range from BS data");
  }

  return {
    min: minAd.getFullYear(),
    max: maxAd.getFullYear(),
  };
}

/** Leap year check (AD only) */
function isLeapYear(year: number): boolean {
  return (
    (year % 4 === 0 && year % 100 !== 0) ||
    year % 400 === 0
  );
}

/** Get days in AD month */
export function getAdDaysInMonth(
  year: number,
  month: number
): number {
  const daysPerMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return daysPerMonth[month - 1];
}
