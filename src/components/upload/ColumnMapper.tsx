import { useState, useEffect } from "react";
import { InfoIcon, CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnMapping } from "@/types";
import {
  detectDateColumn,
  detectDescriptionColumn,
  detectAmountColumns,
  detectBalanceColumn,
} from "@/lib/csvParser";

interface ColumnMapperProps {
  headers: string[];
  preview: string[][];
  onMappingComplete: (mapping: ColumnMapping) => void;
  onCancel: () => void;
}

type AmountMode = "single" | "separate";

const NONE_VALUE = "__none__";

export function ColumnMapper({
  headers,
  preview,
  onMappingComplete,
  onCancel,
}: ColumnMapperProps) {

  const [dateColumn, setDateColumn] = useState<string>("");
  const [descriptionColumn, setDescriptionColumn] = useState<string>("");
  const [amountMode, setAmountMode] = useState<AmountMode>("separate");
  const [amountColumn, setAmountColumn] = useState<string>("");
  const [creditColumn, setCreditColumn] = useState<string>("");
  const [debitColumn, setDebitColumn] = useState<string>("");
  const [refNoColumn, setRefNoColumn] = useState<string>("");
  const [balanceColumn, setBalanceColumn] = useState<string>("");
  const [dateFormat, setDateFormat] = useState<"DD/MM/YYYY" | "DD/MM/YY">("DD/MM/YYYY");


  useEffect(() => {
    const detectedDate = detectDateColumn(headers);
    const detectedDesc = detectDescriptionColumn(headers);
    const detectedAmounts = detectAmountColumns(headers);
    const detectedBalance = detectBalanceColumn(headers);

    if (detectedDate) setDateColumn(detectedDate);
    if (detectedDesc) setDescriptionColumn(detectedDesc);
    if (detectedBalance) setBalanceColumn(detectedBalance);


    if (detectedAmounts.creditColumn && detectedAmounts.debitColumn) {
      setAmountMode("separate");
      setCreditColumn(detectedAmounts.creditColumn);
      setDebitColumn(detectedAmounts.debitColumn);
    } else if (detectedAmounts.amountColumn) {
      setAmountMode("single");
      setAmountColumn(detectedAmounts.amountColumn);
    }


    if (preview.length > 0 && detectedDate) {
      const dateColIndex = headers.indexOf(detectedDate);
      if (dateColIndex !== -1) {
        const sampleDate = preview[0][dateColIndex];
        if (sampleDate) {
          const parts = sampleDate.split("/");
          if (parts.length === 3 && parts[2].length === 2) {
            setDateFormat("DD/MM/YY");
          }
        }
      }
    }
  }, [headers, preview]);


  const isValid = () => {
    if (!dateColumn || !descriptionColumn) return false;
    if (amountMode === "single" && !amountColumn) return false;
    if (amountMode === "separate" && (!creditColumn && !debitColumn)) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isValid()) return;

    const mapping: ColumnMapping = {
      dateColumn,
      descriptionColumn,
      dateFormat,
      refNoColumn: refNoColumn || undefined,
      balanceColumn: balanceColumn || undefined,
    };

    if (amountMode === "single") {
      mapping.amountColumn = amountColumn;
    } else {
      mapping.creditColumn = creditColumn || undefined;
      mapping.debitColumn = debitColumn || undefined;
    }

    onMappingComplete(mapping);
  };


  const getPreviewValue = (column: string): string => {
    if (!column || preview.length === 0) return "-";
    const colIndex = headers.indexOf(column);
    if (colIndex === -1) return "-";
    return preview[0][colIndex] || "-";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map CSV Columns</CardTitle>
        <CardDescription>
          Match your CSV columns to the required fields. We've auto-detected some columns for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Required Fields</h3>
            <Badge variant="destructive">Required</Badge>
          </div>


          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Date</label>
            <Select value={dateColumn} onValueChange={(v) => setDateColumn(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground truncate">
              {getPreviewValue(dateColumn)}
            </span>
          </div>


          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Date Format</label>
            <Select value={dateFormat} onValueChange={(v) => setDateFormat(v as typeof dateFormat)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (e.g., 25/01/2026)</SelectItem>
                <SelectItem value="DD/MM/YY">DD/MM/YY (e.g., 25/01/26)</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">-</span>
          </div>


          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Description</label>
            <Select value={descriptionColumn} onValueChange={(v) => setDescriptionColumn(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground truncate">
              {getPreviewValue(descriptionColumn)}
            </span>
          </div>


          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Amount Type</label>
            <Select value={amountMode} onValueChange={(v) => setAmountMode(v as AmountMode)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="separate">Separate Credit/Debit columns</SelectItem>
                <SelectItem value="single">Single Amount column</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">-</span>
          </div>


          {amountMode === "single" ? (
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
              <label className="text-sm font-medium">Amount</label>
              <Select value={amountColumn} onValueChange={(v) => setAmountColumn(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground truncate">
                {getPreviewValue(amountColumn)}
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                <label className="text-sm font-medium">Credit (Deposit)</label>
                <Select value={creditColumn || NONE_VALUE} onValueChange={(v) => setCreditColumn(v === NONE_VALUE ? "" : (v ?? ""))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>None</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground truncate">
                  {creditColumn ? getPreviewValue(creditColumn) : "-"}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                <label className="text-sm font-medium">Debit (Withdrawal)</label>
                <Select value={debitColumn || NONE_VALUE} onValueChange={(v) => setDebitColumn(v === NONE_VALUE ? "" : (v ?? ""))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>None</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground truncate">
                  {debitColumn ? getPreviewValue(debitColumn) : "-"}
                </span>
              </div>
            </>
          )}
        </div>


        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Optional Fields</h3>
            <Badge variant="secondary">Optional</Badge>
          </div>


          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Reference No.</label>
            <Select value={refNoColumn || NONE_VALUE} onValueChange={(v) => setRefNoColumn(v === NONE_VALUE ? "" : (v ?? ""))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>None</SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground truncate">
              {refNoColumn ? getPreviewValue(refNoColumn) : "-"}
            </span>
          </div>


          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Balance</label>
            <Select value={balanceColumn || NONE_VALUE} onValueChange={(v) => setBalanceColumn(v === NONE_VALUE ? "" : (v ?? ""))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>None</SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground truncate">
              {balanceColumn ? getPreviewValue(balanceColumn) : "-"}
            </span>
          </div>
        </div>


        <div className="border p-4">
          <div className="flex items-start gap-3">
            {isValid() ? (
              <>
                <CheckCircleIcon className="size-5 text-green-600 shrink-0 mt-0.5" weight="fill" />
                <div>
                  <p className="text-sm font-medium text-green-600">Ready to import</p>
                  <p className="text-sm text-muted-foreground">
                    All required fields are mapped. Click "Import Transactions" to continue.
                  </p>
                </div>
              </>
            ) : (
              <>
                <WarningIcon className="size-5 text-amber-500 shrink-0 mt-0.5" weight="fill" />
                <div>
                  <p className="text-sm font-medium text-amber-500">Missing required fields</p>
                  <p className="text-sm text-muted-foreground">
                    Please map Date, Description, and{" "}
                    {amountMode === "single" ? "Amount" : "at least one of Credit/Debit"} columns.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>


        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <InfoIcon className="size-4 shrink-0 mt-0.5" />
          <p>
            Transactions will be automatically categorized based on the description.
            You can change categories later from the Transactions page.
          </p>
        </div>


        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid()}>
            Import Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
