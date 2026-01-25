import { cn } from "@/lib/utils";
import type { ColumnMapping } from "@/types";

interface CSVPreviewProps {
  headers: string[];
  rows: string[][];
  mapping?: ColumnMapping;
  maxRows?: number;
}

export function CSVPreview({
  headers,
  rows,
  mapping,
  maxRows = 10,
}: CSVPreviewProps) {
  const displayRows = rows.slice(0, maxRows);


  const getHighlightedColumns = (): Set<number> => {
    if (!mapping) return new Set();

    const highlighted = new Set<number>();
    const mappedColumns = [
      mapping.dateColumn,
      mapping.descriptionColumn,
      mapping.amountColumn,
      mapping.creditColumn,
      mapping.debitColumn,
      mapping.refNoColumn,
      mapping.balanceColumn,
    ].filter(Boolean) as string[];

    mappedColumns.forEach((col) => {
      const index = headers.indexOf(col);
      if (index !== -1) {
        highlighted.add(index);
      }
    });

    return highlighted;
  };

  const highlightedColumns = getHighlightedColumns();


  const getColumnLabel = (header: string): string | null => {
    if (!mapping) return null;

    if (mapping.dateColumn === header) return "Date";
    if (mapping.descriptionColumn === header) return "Description";
    if (mapping.amountColumn === header) return "Amount";
    if (mapping.creditColumn === header) return "Credit";
    if (mapping.debitColumn === header) return "Debit";
    if (mapping.refNoColumn === header) return "Ref No";
    if (mapping.balanceColumn === header) return "Balance";

    return null;
  };

  return (
    <div className="border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {headers.map((header, index) => {
                const label = getColumnLabel(header);
                const isHighlighted = highlightedColumns.has(index);

                return (
                  <th
                    key={index}
                    className={cn(
                      "px-3 py-2 text-left font-medium whitespace-nowrap",
                      isHighlighted && "bg-primary/10"
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground">{header}</span>
                      {label && (
                        <span className="text-xs text-primary font-normal">
                          ({label})
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b last:border-0",
                  rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30"
                )}
              >
                {headers.map((_, colIndex) => {
                  const isHighlighted = highlightedColumns.has(colIndex);
                  const cellValue = row[colIndex] ?? "";

                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-3 py-2 whitespace-nowrap",
                        isHighlighted && "bg-primary/5"
                      )}
                    >
                      <span
                        className={cn(
                          "text-muted-foreground",
                          isHighlighted && "text-foreground"
                        )}
                      >
                        {cellValue || "-"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > maxRows && (
        <div className="px-3 py-2 bg-muted/50 border-t text-sm text-muted-foreground text-center">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}
