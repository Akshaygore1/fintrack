import {
  UploadIcon,
  ChartLineIcon,
  ListBulletsIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  {
    title: "Upload",
    url: "/upload",
    icon: UploadIcon,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartLineIcon,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ListBulletsIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: GearIcon,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground px-2">
          FinTrack
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <SidebarMenuButton
                          render={<Link to={item.url} />}
                          isActive={location.pathname === item.url}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      }
                    />
                    <TooltipContent
                      side="right"
                      align="center"
                      hidden={state !== "collapsed" || isMobile}
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
