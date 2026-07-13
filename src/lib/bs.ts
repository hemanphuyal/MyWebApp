import bsData from '../data/bs-calendar.json'

const BS: Record<string, number[]> = bsData as Record<string, number[]>

// Anchor: BS 2000-01-01 = AD 1943-04-14 (Wednesday)
const ANCHOR = Date.UTC(1943, 3, 14)
const MS_PER_DAY = 86400000

export type BSDate = { y: number; m: number; d: number }

export const BS_MIN_YEAR = 2000
export const BS_MAX_YEAR = 2100

export const BS_MONTHS_EN = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
]

export const BS_MONTHS_NE = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत',
]

export const WEEKDAYS_EN_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAYS_NE_SHORT = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि']

const AD_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const NE_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

export function toNepaliDigits(input: number | string): string {
  return String(input).replace(/\d/g, (d) => NE_DIGITS[Number(d)])
}

export function daysInBSMonth(y: number, m: number): number {
  const arr = BS[String(y)]
  if (!arr) throw new Error(`BS year ${y} out of range`)
  return arr[m - 1]
}

function utcFromDate(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

export function adToBS(date: Date): BSDate {
  const utc = utcFromDate(date)
  let delta = Math.round((utc - ANCHOR) / MS_PER_DAY)
  let y = BS_MIN_YEAR
  let m = 1
  let d = 1
  while (delta > 0) {
    const dim = daysInBSMonth(y, m)
    const remainInMonth = dim - d + 1
    if (delta < remainInMonth) {
      d += delta
      delta = 0
    } else {
      delta -= remainInMonth
      d = 1
      m += 1
      if (m > 12) { m = 1; y += 1 }
      if (y > BS_MAX_YEAR) throw new Error('BS year overflow')
    }
  }
  return { y, m, d }
}

export function bsToAD(bs: BSDate): Date {
  let days = 0
  for (let y = BS_MIN_YEAR; y < bs.y; y++) {
    for (let m = 1; m <= 12; m++) days += daysInBSMonth(y, m)
  }
  for (let m = 1; m < bs.m; m++) days += daysInBSMonth(bs.y, m)
  days += bs.d - 1
  return new Date(ANCHOR + days * MS_PER_DAY)
}

/** Weekday index for a BS date (0=Sun ... 6=Sat) */
export function bsWeekday(bs: BSDate): number {
  return bsToAD(bs).getUTCDay()
}

/** BS date after which Sunday is also a public holiday (2082 Chaitra 29 inclusive). */
const SUNDAY_HOLIDAY_START: BSDate = { y: 2082, m: 12, d: 29 }

function bsCompare(a: BSDate, b: BSDate): number {
  if (a.y !== b.y) return a.y - b.y
  if (a.m !== b.m) return a.m - b.m
  return a.d - b.d
}

/** Returns true if the given BS date is a weekly public holiday. */
export function isHoliday(bs: BSDate): boolean {
  const wd = bsWeekday(bs)
  if (wd === 6) return true // Saturday always
  if (wd === 0 && bsCompare(bs, SUNDAY_HOLIDAY_START) >= 0) return true
  return false
}

/** Format AD date, always in English regardless of app locale. */
export function formatAD(date: Date): string {
  const d = date.getDate()
  const m = AD_MONTHS_EN[date.getMonth()]
  const y = date.getFullYear()
  return `${m} ${d}, ${y}`
}

/** Format BS date, always in Nepali digits + Nepali month name. */
export function formatBSNepali(bs: BSDate): string {
  return `${BS_MONTHS_NE[bs.m - 1]} ${toNepaliDigits(bs.d)}, ${toNepaliDigits(bs.y)}`
}

export function formatBSEnglish(bs: BSDate): string {
  return `${BS_MONTHS_EN[bs.m - 1]} ${bs.d}, ${bs.y}`
}
