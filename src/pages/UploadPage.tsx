import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { ColumnMapper } from "@/components/upload/ColumnMapper";
import { CSVPreview } from "@/components/upload/CSVPreview";
import { ImportProgress } from "@/components/upload/ImportProgress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseCSVFile, parseAmount } from "@/lib/csvParser";
import { parseTransactionDate, toISODate } from "@/lib/dateHelpers";
import { categorizeTransaction } from "@/lib/categoryMatcher";
import { extractMerchant } from "@/lib/transactionHelpers";
import { storage } from "@/lib/storage";
import type { ColumnMapping, CSVParseResult, Transaction } from "@/types";

type UploadStep = "upload" | "mapping" | "preview" | "importing" | "complete";

export function UploadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<UploadStep>("upload");
  const [csvData, setCsvData] = useState<CSVParseResult | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [importStatus, setImportStatus] = useState<{
    status: "processing" | "success" | "error";
    processedCount: number;
    totalCount: number;
    errorMessage?: string;
  }>({
    status: "processing",
    processedCount: 0,
    totalCount: 0,
  });

  const handleFileSelect = async (file: File) => {
    try {
      const result = await parseCSVFile(file);
      setCsvData(result);
      setStep("mapping");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse CSV file");
    }
  };

  const handleMappingComplete = (columnMapping: ColumnMapping) => {
    setMapping(columnMapping);
    setStep("preview");
  };

  const handleCancelMapping = () => {
    setCsvData(null);
    setMapping(null);
    setStep("upload");
  };

  const handleBackToMapping = () => {
    setStep("mapping");
  };

  const handleStartImport = async () => {
    if (!csvData || !mapping) return;

    setStep("importing");
    setImportStatus({
      status: "processing",
      processedCount: 0,
      totalCount: csvData.rows.length,
    });

    try {

      const currentCount = storage.getTransactionCount();
      if (currentCount + csvData.rows.length > 5000) {
        throw new Error(
          `Cannot import ${csvData.rows.length} transactions. You have ${currentCount} transactions and the limit is 5000.`
        );
      }


      const categories = storage.getCategories();


      const headers = csvData.headers;
      const dateIdx = headers.indexOf(mapping.dateColumn);
      const descIdx = headers.indexOf(mapping.descriptionColumn);
      const amountIdx = mapping.amountColumn ? headers.indexOf(mapping.amountColumn) : -1;
      const creditIdx = mapping.creditColumn ? headers.indexOf(mapping.creditColumn) : -1;
      const debitIdx = mapping.debitColumn ? headers.indexOf(mapping.debitColumn) : -1;
      const refNoIdx = mapping.refNoColumn ? headers.indexOf(mapping.refNoColumn) : -1;
      const balanceIdx = mapping.balanceColumn ? headers.indexOf(mapping.balanceColumn) : -1;

      const transactions: Transaction[] = [];
      const errors: string[] = [];

      for (let i = 0; i < csvData.rows.length; i++) {
        const row = csvData.rows[i];

        try {

          const dateStr = row[dateIdx];
          if (!dateStr || !dateStr.trim()) {
            errors.push(`Row ${i + 2}: Empty date`);
            continue;
          }

          let parsedDate: Date;
          try {
            parsedDate = parseTransactionDate(dateStr.trim(), mapping.dateFormat);
          } catch {
            errors.push(`Row ${i + 2}: Invalid date "${dateStr}"`);
            continue;
          }


          const description = row[descIdx]?.trim() || "";
          if (!description) {
            errors.push(`Row ${i + 2}: Empty description`);
            continue;
          }


          let amount: number;
          if (amountIdx !== -1) {

            amount = parseAmount(row[amountIdx]);
          } else {

            const credit = creditIdx !== -1 ? parseAmount(row[creditIdx]) : 0;
            const debit = debitIdx !== -1 ? parseAmount(row[debitIdx]) : 0;

            amount = credit > 0 ? credit : -Math.abs(debit);
          }


          if (amount === 0) {
            continue;
          }


          const refNo = refNoIdx !== -1 ? row[refNoIdx]?.trim() || "" : "";
          const balance = balanceIdx !== -1 ? parseAmount(row[balanceIdx]) : 0;


          const category = categorizeTransaction(description, amount, categories);
          const merchant = extractMerchant(description);

          const transaction: Transaction = {
            id: uuidv4(),
            date: toISODate(parsedDate),
            description,
            refNo,
            amount,
            type: amount > 0 ? "income" : "expense",
            balance,
            category,
            merchant,
            isManualCategory: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          transactions.push(transaction);
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }


        if (i % 50 === 0) {
          setImportStatus((prev) => ({
            ...prev,
            processedCount: i + 1,
          }));

          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }


      if (transactions.length > 0) {
        storage.addTransactions(transactions);
      }


      if (errors.length > 0) {
        console.warn("Import warnings:", errors);
        if (transactions.length === 0) {
          throw new Error(`No valid transactions found. ${errors.length} rows had errors.`);
        }
        toast.success(
          `Imported ${transactions.length} transactions. ${errors.length} rows skipped.`
        );
      } else {
        toast.success(`Successfully imported ${transactions.length} transactions!`);
      }

      setImportStatus({
        status: "success",
        processedCount: transactions.length,
        totalCount: csvData.rows.length,
      });
      setStep("complete");


      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Import failed";
      toast.error(errorMessage);
      setImportStatus((prev) => ({
        ...prev,
        status: "error",
        errorMessage,
      }));
    }
  };

  const handleStartOver = () => {
    setCsvData(null);
    setMapping(null);
    setStep("upload");
    setImportStatus({
      status: "processing",
      processedCount: 0,
      totalCount: 0,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload CSV</h1>
        <p className="text-muted-foreground mt-1">
          Import transactions from your bank statement CSV file
        </p>
      </div>


      <div className="flex items-center gap-2 text-sm">
        <span className={step === "upload" ? "font-medium text-primary" : "text-muted-foreground"}>
          1. Select File
        </span>
        <span className="text-muted-foreground">/</span>
        <span className={step === "mapping" ? "font-medium text-primary" : "text-muted-foreground"}>
          2. Map Columns
        </span>
        <span className="text-muted-foreground">/</span>
        <span className={step === "preview" ? "font-medium text-primary" : "text-muted-foreground"}>
          3. Preview
        </span>
        <span className="text-muted-foreground">/</span>
        <span
          className={
            step === "importing" || step === "complete"
              ? "font-medium text-primary"
              : "text-muted-foreground"
          }
        >
          4. Import
        </span>
      </div>


      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Select CSV File</CardTitle>
            <CardDescription>
              Upload a CSV file from your bank statement. Supported formats include most Indian bank
              statements with date, description, and amount columns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone onFileSelect={handleFileSelect} />
          </CardContent>
        </Card>
      )}

      {step === "mapping" && csvData && (
        <div className="space-y-6">
          <ColumnMapper
            headers={csvData.headers}
            preview={csvData.preview}
            onMappingComplete={handleMappingComplete}
            onCancel={handleCancelMapping}
          />

          <Card>
            <CardHeader>
              <CardTitle>CSV Preview</CardTitle>
              <CardDescription>
                First {Math.min(5, csvData.preview.length)} rows from your file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVPreview headers={csvData.headers} rows={csvData.preview} maxRows={5} />
            </CardContent>
          </Card>
        </div>
      )}

      {step === "preview" && csvData && mapping && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Mapping</CardTitle>
              <CardDescription>
                Confirm the column mappings are correct before importing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date Column:</span>
                  <span className="ml-2 font-medium">{mapping.dateColumn}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date Format:</span>
                  <span className="ml-2 font-medium">{mapping.dateFormat}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <span className="ml-2 font-medium">{mapping.descriptionColumn}</span>
                </div>
                {mapping.amountColumn && (
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="ml-2 font-medium">{mapping.amountColumn}</span>
                  </div>
                )}
                {mapping.creditColumn && (
                  <div>
                    <span className="text-muted-foreground">Credit:</span>
                    <span className="ml-2 font-medium">{mapping.creditColumn}</span>
                  </div>
                )}
                {mapping.debitColumn && (
                  <div>
                    <span className="text-muted-foreground">Debit:</span>
                    <span className="ml-2 font-medium">{mapping.debitColumn}</span>
                  </div>
                )}
                {mapping.refNoColumn && (
                  <div>
                    <span className="text-muted-foreground">Reference No:</span>
                    <span className="ml-2 font-medium">{mapping.refNoColumn}</span>
                  </div>
                )}
                {mapping.balanceColumn && (
                  <div>
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="ml-2 font-medium">{mapping.balanceColumn}</span>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>{csvData.rows.length}</strong> transactions will be imported and
                  automatically categorized.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleBackToMapping}>
                  Back to Mapping
                </Button>
                <Button onClick={handleStartImport}>Start Import</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Preview showing mapped columns highlighted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVPreview
                headers={csvData.headers}
                rows={csvData.preview}
                mapping={mapping}
                maxRows={10}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {(step === "importing" || step === "complete") && (
        <div className="space-y-4">
          <ImportProgress
            status={importStatus.status}
            processedCount={importStatus.processedCount}
            totalCount={importStatus.totalCount}
            errorMessage={importStatus.errorMessage}
          />

          {importStatus.status === "error" && (
            <div className="flex justify-center">
              <Button onClick={handleStartOver}>Start Over</Button>
            </div>
          )}

          {importStatus.status === "success" && (
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleStartOver}>
                Import More
              </Button>
              <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
