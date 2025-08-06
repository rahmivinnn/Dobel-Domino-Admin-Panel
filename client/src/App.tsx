import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Players from "@/pages/players";
import Currency from "@/pages/currency";
import Ranking from "@/pages/ranking";
import Tournaments from "@/pages/tournaments";
import Rewards from "@/pages/rewards";
import Leaderboard from "@/pages/leaderboard";
import Monitoring from "@/pages/monitoring";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/players" component={Players} />
            <Route path="/currency" component={Currency} />
            <Route path="/ranking" component={Ranking} />
            <Route path="/tournaments" component={Tournaments} />
            <Route path="/rewards" component={Rewards} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/monitoring" component={Monitoring} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
