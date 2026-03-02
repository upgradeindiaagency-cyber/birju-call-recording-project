import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";

import { AppSidebar } from "./components/app-sidebar";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import CallDetail from "./pages/call-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/upload" component={Upload}/>
      <Route path="/calls/:id" component={CallDetail}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full bg-background overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden relative">
              <header className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 bg-background/80 backdrop-blur-sm z-10 border-b border-border/50 md:hidden">
                <SidebarTrigger className="text-foreground shrink-0" />
              </header>
              <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
