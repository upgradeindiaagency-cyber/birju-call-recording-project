import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  UploadCloud, 
  PhoneCall, 
  Activity, 
  Settings 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [location] = useLocation();

  const navItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Upload Call", url: "/upload", icon: UploadCloud },
  ];

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          <Activity className="w-6 h-6 stroke-[2.5]" />
          <span>CallSight AI</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`rounded-xl transition-all duration-200 py-3 ${
                        isActive 
                          ? "bg-primary/10 text-primary font-medium shadow-sm hover:bg-primary/15" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            JD
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-foreground">John Doe</span>
            <span className="text-xs text-muted-foreground">Sales Manager</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
