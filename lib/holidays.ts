import Holidays from "date-holidays"

const hd = new Holidays("BR");

export function isHoliday(date: Date): boolean {
  const holiday = hd.isHoliday(date);

  return holiday !== false;
}

export function getHolidayName(date: Date): string | null {
  const holiday = hd.isHoliday(date);

  if (!holiday) return null;

   if (Array.isArray(holiday)) {
    return (holiday[0] as any).name;
  }

  return (holiday as any).name
}