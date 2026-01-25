import { format, parse, isValid } from "date-fns";

export function parseTransactionDate(
  dateStr: string,
  dateFormat: "DD/MM/YYYY" | "DD/MM/YY"
): Date {
  const parts = dateStr.trim().split("/");

  if (parts.length !== 3) {
    throw new Error("Invalid date format");
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;

  let year: number;
  if (dateFormat === "DD/MM/YY") {
    year = parseInt(parts[2], 10);

    year = 2000 + year;
  } else {
    year = parseInt(parts[2], 10);
  }

  const date = new Date(year, month, day);


  if (isNaN(date.getTime()) || !isValid(date)) {
    throw new Error("Invalid date");
  }

  return date;
}

export function formatTransactionDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM yyyy");
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseISODate(dateStr: string): Date {
  return parse(dateStr, "yyyy-MM-dd", new Date());
}
