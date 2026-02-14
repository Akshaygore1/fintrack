import { CircleNotch, CheckCircle, XCircle } from "@phosphor-icons/react";
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
    <Card variant="glass" className="overflow-hidden">
      <CardContent className="py-10 px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {status === "processing" && (
            <div className="flex flex-col items-center space-y-6">
              {/* Animated spinner with glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative animate-spin">
                  <CircleNotch size={56} weight="bold" className="text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground">Processing Transactions</h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Importing and categorizing your data...
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="w-full max-w-sm space-y-3">
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/30">
                  <div
                    className="h-full bg-primary rounded-full relative transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono font-medium text-foreground">
                    {processedCount.toLocaleString()} / {totalCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-6">
              {/* Success icon with celebration effects */}
              <div className="relative">
                <div className="absolute inset-0 bg-income/30 rounded-full blur-2xl" />
                <div className="relative">
                  <CheckCircle size={64} weight="fill" className="text-income" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-income">Import Complete!</h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Successfully imported{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {processedCount.toLocaleString()}
                  </span>{" "}
                  transactions
                </p>
              </div>
              
              {/* Success stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-income/10 border border-income/20">
                  <div className="w-2 h-2 rounded-full bg-income" />
                  <span className="text-income font-medium">Ready to explore</span>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-6">
              {/* Error icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl" />
                <XCircle size={64} weight="fill" className="text-destructive relative" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-destructive">Import Failed</h3>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                  {errorMessage || "An error occurred while importing transactions."}
                </p>
                {processedCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-mono font-semibold text-foreground">
                      {processedCount.toLocaleString()}
                    </span>{" "}
                    transactions were imported before the error.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
