import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency } from "@/lib/transactionHelpers";
import { useMemo } from "react";
import type { Transaction } from "@/types";
import { Money, Wallet, CaretRight } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

interface TopIncomeChartProps {
  transactions: Transaction[];
}

export function TopIncomeChart({ transactions }: TopIncomeChartProps) {
  const navigate = useNavigate();
  
  const tableData = useMemo(() => {
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const merchantMap = new Map<string, { total: number; count: number }>();

    incomeTransactions.forEach((t) => {
      const merchant = t.merchant || "Unknown";
      const existing = merchantMap.get(merchant) || { total: 0, count: 0 };
      merchantMap.set(merchant, {
        total: existing.total + Math.abs(t.amount),
        count: existing.count + 1,
      });
    });

    return Array.from(merchantMap.entries())
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [transactions]);

  const maxAmount = tableData[0]?.total || 0;

  if (tableData.length === 0) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Money size={20} weight="duotone" className="text-primary" />
            Income Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Wallet size={32} weight="duotone" className="text-muted-foreground/50" />
          </div>
          <p className="text-sm">No income data available</p>
        </CardContent>
      </Card>
    );
  }

  const handleSourceClick = (source: string) => {
    navigate(`/transactions?search=${encodeURIComponent(source)}&type=income`);
  };

  return (
    <div
      className="h-full"
    >
      <Card variant="glass" hover="glow" className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground/90 flex items-center gap-2">
            <Money size={18} weight="duotone" className="text-income" />
            Income Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-3">
          <div className="space-y-1">
            {tableData.map((item, index) => {
              const percentage = (item.total / maxAmount) * 100;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleSourceClick(item.name)}
                  className="w-full group"
                >
                  <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200">
                    {/* Progress bar background */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-income/10 rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <div className="relative flex items-center gap-3 w-full">
                      {/* Rank */}
                      <span className="w-5 h-5 rounded-full bg-muted/80 text-[10px] font-bold text-muted-foreground flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      
                      {/* Source name */}
                      <span className="flex-1 text-sm font-medium text-foreground/90 truncate text-left">
                        {item.name}
                      </span>
                      
                      {/* Count */}
                      <span className="text-xs text-muted-foreground tabular-nums px-1.5 py-0.5 rounded bg-muted/50">
                        {item.count}x
                      </span>
                      
                      {/* Amount */}
                      <span className="text-sm font-mono font-bold text-income tabular-nums">
                        +{formatCompactCurrency(item.total)}
                      </span>
                      
                      <CaretRight 
                        size={14} 
                        className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" 
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
