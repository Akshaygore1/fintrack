import Papa from "papaparse";
import type { CSVParseResult } from "@/types";

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const data = results.data as string[][];

          // Remove empty rows
          const filteredData = data.filter((row) =>
            row.some((cell) => cell.trim() !== "")
          );

          if (filteredData.length === 0) {
            reject(new Error("CSV file is empty"));
            return;
          }

          const headers = filteredData[0].map((h) => h.trim());
          const rows = filteredData.slice(1);
          const preview = rows.slice(0, 10); // First 10 rows for preview

          resolve({
            headers,
            rows,
            preview,
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
      skipEmptyLines: true,
    });
  });
}

export function detectDateColumn(headers: string[]): string | null {
  const dateKeywords = [
    "date",
    "transaction date",
    "txn date",
    "value date",
    "posting date",
  ];

  const lowerHeaders = headers.map((h) => h.toLowerCase());

  for (const keyword of dateKeywords) {
    const index = lowerHeaders.findIndex((h) => h.includes(keyword));
    if (index !== -1) {
      return headers[index];
    }
  }

  return null;
}

export function detectDescriptionColumn(headers: string[]): string | null {
  const descKeywords = [
    "description",
    "narration",
    "particulars",
    "details",
    "transaction details",
    "remarks",
  ];

  const lowerHeaders = headers.map((h) => h.toLowerCase());

  for (const keyword of descKeywords) {
    const index = lowerHeaders.findIndex((h) => h.includes(keyword));
    if (index !== -1) {
      return headers[index];
    }
  }

  return null;
}

export function detectAmountColumns(
  headers: string[]
): {
  creditColumn: string | null;
  debitColumn: string | null;
  amountColumn: string | null;
} {
  const lowerHeaders = headers.map((h) => h.toLowerCase());

  // Check for credit/debit columns
  const creditKeywords = ["credit", "deposit", "cr"];
  const debitKeywords = ["debit", "withdrawal", "dr"];

  let creditColumn: string | null = null;
  let debitColumn: string | null = null;

  for (const keyword of creditKeywords) {
    const index = lowerHeaders.findIndex((h) => h.includes(keyword));
    if (index !== -1) {
      creditColumn = headers[index];
      break;
    }
  }

  for (const keyword of debitKeywords) {
    const index = lowerHeaders.findIndex((h) => h.includes(keyword));
    if (index !== -1) {
      debitColumn = headers[index];
      break;
    }
  }

  // Check for single amount column
  let amountColumn: string | null = null;
  if (!creditColumn && !debitColumn) {
    const amountKeywords = ["amount", "value", "transaction amount"];
    for (const keyword of amountKeywords) {
      const index = lowerHeaders.findIndex((h) => h.includes(keyword));
      if (index !== -1) {
        amountColumn = headers[index];
        break;
      }
    }
  }

  return { creditColumn, debitColumn, amountColumn };
}

export function detectBalanceColumn(headers: string[]): string | null {
  const balanceKeywords = ["balance", "closing balance", "available balance"];

  const lowerHeaders = headers.map((h) => h.toLowerCase());

  for (const keyword of balanceKeywords) {
    const index = lowerHeaders.findIndex((h) => h.includes(keyword));
    if (index !== -1) {
      return headers[index];
    }
  }

  return null;
}

export function parseAmount(value: string): number {
  if (!value || value.trim() === "") return 0;
  // Remove commas and parse
  const cleaned = value.replace(/,/g, "").trim();
  return parseFloat(cleaned) || 0;
}
