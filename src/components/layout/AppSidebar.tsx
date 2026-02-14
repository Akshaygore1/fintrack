import { useMemo } from "react";
import {
  UploadIcon,
  ChartLineIcon,
  ListBulletsIcon,
  GearIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { storage } from "@/lib/storage";
import type { Transaction } from "@/types";

const navItems = [
  {
    title: "Upload",
    url: "/upload",
    icon: UploadIcon,
    description: "Import transactions",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartLineIcon,
    description: "Financial overview",
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ListBulletsIcon,
    description: "View all transactions",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: GearIcon,
    description: "App preferences",
  },
];

function formatCompact(num: number): string {
  const absNum = Math.abs(num);
  if (absNum >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (absNum >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
}

function QuickStats() {
  const { state } = useSidebar();
  
  const stats = useMemo(() => {
    const transactions: Transaction[] = storage.getTransactions();
    
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = income - expenses;
    
    return { income, expenses, balance };
  }, []);

  if (state === "collapsed") return null;

  return (
    <div
      className="px-3 py-2"
    >
      <div className="rounded-xl bg-sidebar-accent/50 p-3 space-y-3 border border-sidebar-border/50">
        <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
          <WalletIcon size={14} weight="duotone" />
          Quick Overview
        </div>
        
        <div className="space-y-2">
          {/* Balance */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-sidebar-foreground/70">Balance</span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${
              stats.balance >= 0 ? "text-income" : "text-expense"
            }`}>
              ${formatCompact(stats.balance)}
            </span>
          </div>
          
          {/* Income */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-income" />
              <span className="text-xs text-sidebar-foreground/70">Income</span>
            </div>
            <span className="font-mono text-xs font-medium text-income tabular-nums">
              +${formatCompact(stats.income)}
            </span>
          </div>
          
          {/* Expenses */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-expense" />
              <span className="text-xs text-sidebar-foreground/70">Expenses</span>
            </div>
            <span className="font-mono text-xs font-medium text-expense tabular-nums">
              -${formatCompact(stats.expenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3 px-2 group">
          <div
            className="relative"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <WalletIcon size={20} weight="duotone" className="text-primary-foreground" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
                FinTrack
              </h1>
              <p className="text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-widest">
                Personal Finance
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <SidebarMenuButton
                            render={<Link to={item.url} />}
                            isActive={isActive}
                            className={`
                              relative overflow-hidden transition-all duration-200
                              ${isActive 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "hover:bg-sidebar-accent/50"
                              }
                            `}
                          >
                            <div
                              className="flex items-center gap-3 w-full"
                            >
                              <div className={`
                                relative p-1 rounded-lg transition-all duration-200
                                ${isActive 
                                  ? "text-primary" 
                                  : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                                }
                              `}>
                                <item.icon size={18} weight={isActive ? "duotone" : "regular"} />
                                {isActive && (
                                  <div
                                    className="absolute inset-0 rounded-lg bg-primary/20 blur-md"
                                  />
                                )}
                              </div>
                              <span className={`font-medium ${isActive ? "text-sidebar-foreground" : ""}`}>
                                {item.title}
                              </span>
                            </div>
                            
                            {/* Active indicator bar */}
                            {isActive && (
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full"
                              />
                            )}
                          </SidebarMenuButton>
                        }
                      />
                      <TooltipContent
                        side="right"
                        align="center"
                        hidden={state !== "collapsed" || isMobile}
                        className="flex flex-col gap-0.5"
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <QuickStats />
        
        {state !== "collapsed" && (
          <div
            className="px-4 py-3 text-center"
          >
            <p className="text-[10px] text-sidebar-foreground/40 font-medium">
              Press <kbd className="px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-foreground/60 font-mono text-[9px]">⌘B</kbd> to toggle sidebar
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
