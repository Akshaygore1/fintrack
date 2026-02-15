import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { 
  CloudArrowUp, 
  Table, 
  Eye, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Sparkle
} from "@phosphor-icons/react";
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

const steps = [
  { id: "upload", label: "Upload", icon: CloudArrowUp },
  { id: "mapping", label: "Map Columns", icon: Table },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "importing", label: "Import", icon: CheckCircle },
] as const;

function StepIndicator({ currentStep }: { currentStep: UploadStep }) {
  const currentIndex = steps.findIndex(s => 
    s.id === currentStep || (currentStep === "complete" && s.id === "importing")
  );

  return (
    <div className="relative">
      {/* Background track */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border/50" />
      
      {/* Progress track */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-400"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />

      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isPending = index > currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`
                  relative w-10 h-10 rounded-xl flex items-center justify-center
                  transition-all duration-300 border
                  ${isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-glow-sm" 
                    : isCompleted 
                      ? "bg-income/10 text-income border-income/30" 
                      : "bg-muted/30 text-muted-foreground border-border/50"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle size={20} weight="fill" />
                ) : (
                  <Icon size={20} weight={isActive ? "fill" : "duotone"} />
                )}
              </div>
              
              <span className={`
                mt-2 text-xs font-medium transition-colors duration-300
                ${isActive ? "text-foreground" : isPending ? "text-muted-foreground/60" : "text-muted-foreground"}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UploadPage() {
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
        navigate("/app/dashboard");
      }, 2500);
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
    <div className="min-h-[calc(100vh-4rem)] p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <CloudArrowUp size={22} weight="duotone" className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Transactions</h1>
            <p className="text-sm text-muted-foreground">
              Upload your bank statement to get started
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-10 px-4">
        <StepIndicator currentStep={step} />
      </div>

      {/* Content */}
      {step === "upload" && (
        <div>
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle size={18} weight="duotone" className="text-accent" />
                  Select Your CSV File
                </CardTitle>
                <CardDescription>
                  Upload a CSV file from your bank statement. We support most Indian bank
                  formats with date, description, and amount columns.
                </CardDescription>
              </CardHeader>
              <CardContent>
              <FileUploadZone onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        </div>
      )}

      {step === "mapping" && csvData && (
        <div className="space-y-6">
            <ColumnMapper
              headers={csvData.headers}
              preview={csvData.preview}
              onMappingComplete={handleMappingComplete}
              onCancel={handleCancelMapping}
            />

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">Data Preview</CardTitle>
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
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Review Your Mapping</CardTitle>
                <CardDescription>
                  Confirm the column mappings are correct before importing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mapping summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Date Column", value: mapping.dateColumn },
                    { label: "Date Format", value: mapping.dateFormat },
                    { label: "Description", value: mapping.descriptionColumn },
                    mapping.amountColumn && { label: "Amount", value: mapping.amountColumn },
                    mapping.creditColumn && { label: "Credit", value: mapping.creditColumn },
                    mapping.debitColumn && { label: "Debit", value: mapping.debitColumn },
                    mapping.refNoColumn && { label: "Reference No", value: mapping.refNoColumn },
                    mapping.balanceColumn && { label: "Balance", value: mapping.balanceColumn },
                  ].filter((item): item is { label: string; value: string } => Boolean(item)).map((item, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="font-medium text-sm font-mono">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Transaction count */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Table size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ready to import</p>
                      <p className="text-lg font-semibold font-mono text-foreground">
                        {csvData.rows.length.toLocaleString()} transactions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={handleBackToMapping} className="gap-2" data-testid="back-to-mapping-button">
                    <ArrowLeft size={16} weight="bold" />
                    Back to Mapping
                  </Button>
                  <Button onClick={handleStartImport} className="gap-2 shadow-glow-sm" data-testid="start-import-button">
                    Start Import
                    <ArrowRight size={16} weight="bold" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">Data Preview</CardTitle>
                <CardDescription>
                  Preview with mapped columns highlighted
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
        <div className="space-y-6">
            <ImportProgress
              status={importStatus.status}
              processedCount={importStatus.processedCount}
              totalCount={importStatus.totalCount}
              errorMessage={importStatus.errorMessage}
            />

            {importStatus.status === "error" && (
              <div className="flex justify-center">
                <Button onClick={handleStartOver} variant="outline" className="gap-2">
                  <ArrowLeft size={16} weight="bold" />
                  Start Over
                </Button>
              </div>
            )}

            {importStatus.status === "success" && (
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleStartOver} className="gap-2">
                  Import More
                </Button>
                <Button onClick={() => navigate("/app/dashboard")} className="gap-2 shadow-glow-sm">
                  Go to Dashboard
                  <ArrowRight size={16} weight="bold" />
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default UploadPage;
