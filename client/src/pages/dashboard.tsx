import { useCalls } from "@/hooks/use-calls";
import { Link } from "wouter";
import { format } from "date-fns";
import { 
  PhoneCall, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  Search,
  Inbox
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: calls, isLoading } = useCalls();
  const [search, setSearch] = useState("");

  const filteredCalls = calls?.filter(call => 
    call.salespersonName.toLowerCase().includes(search.toLowerCase()) ||
    call.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const averageScore = calls?.length 
    ? (calls.reduce((acc, call) => acc + call.analysis.overallScore, 0) / calls.length).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col gap-6">
        <div className="h-10 w-64 bg-secondary animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-secondary animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="h-[500px] bg-secondary animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Overview of your team's call performance and AI insights.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search calls..." 
            className="pl-9 rounded-xl bg-card border-border/50 shadow-sm focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-2xl shadow-sm border-border/50 bg-gradient-to-br from-card to-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Calls Analyzed</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{calls?.length || 0}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 rounded-2xl shadow-sm border-border/50 bg-gradient-to-br from-card to-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{averageScore} <span className="text-lg text-muted-foreground font-normal">/ 10</span></h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 rounded-2xl shadow-sm border-border/50 bg-gradient-to-br from-card to-secondary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {new Set(calls?.map(c => c.clientName)).size || 0}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Call List */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Calls
        </h2>
        
        {filteredCalls?.length === 0 ? (
          <Card className="p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed bg-card/50">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No calls found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              {search ? "No calls match your search criteria. Try a different term." : "You haven't uploaded any calls yet. Go to the Upload tab to analyze your first call."}
            </p>
            {!search && (
              <Link href="/upload" className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                Upload a Call
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCalls?.map((call, index) => {
              const score = call.analysis.overallScore;
              const isGood = score >= 8;
              const isWarning = score >= 5 && score < 8;
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={call.id}
                >
                  <Link href={`/calls/${call.id}`} className="block h-full group">
                    <Card className="h-full p-6 rounded-2xl border-border/50 hover-elevate bg-card relative overflow-hidden">
                      {/* Score Indicator Line */}
                      <div className={`absolute top-0 left-0 w-full h-1 ${isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</p>
                          <h3 className="font-bold text-lg text-foreground line-clamp-1">{call.clientName}</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm
                          ${isGood ? 'bg-emerald-500/10 text-emerald-700' : isWarning ? 'bg-amber-500/10 text-amber-700' : 'bg-rose-500/10 text-rose-700'}
                        `}>
                          {score.toFixed(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="font-medium text-foreground">{call.salespersonName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(call.createdAt), 'MMM d, yyyy')}</span>
                          <span className="mx-1">•</span>
                          <span>{call.duration}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground`}>
                          {call.analysis.sentiment}
                        </span>
                        <div className="flex items-center text-primary text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          View Report <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
