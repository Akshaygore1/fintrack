import { SpinnerIcon, CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

interface ImportProgressProps {
  status: "processing" | "success" | "error";
  processedCount: number;
  totalCount: number;
  errorMessage?: string;
}

export function ImportProgress({
  status,
  processedCount,
  totalCount,
  errorMessage,
}: ImportProgressProps) {
  const percentage = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardContent className="py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === "processing" && (
            <>
              <SpinnerIcon className="size-12 text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-medium">Processing Transactions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Importing and categorizing your transactions...
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {processedCount} of {totalCount} rows processed ({percentage}%)
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon className="size-12 text-green-600" weight="fill" />
              <div>
                <h3 className="text-lg font-medium text-green-600">Import Complete!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Successfully imported {processedCount} transactions.
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <WarningCircleIcon className="size-12 text-destructive" weight="fill" />
              <div>
                <h3 className="text-lg font-medium text-destructive">Import Failed</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {errorMessage || "An error occurred while importing transactions."}
                </p>
                {processedCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {processedCount} transactions were imported before the error.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
