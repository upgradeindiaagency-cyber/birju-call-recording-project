import { useRoute, Link } from "wouter";
import { useCall } from "@/hooks/use-calls";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  MessageSquare,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ScoreProgress } from "@/components/score-progress";
import { motion } from "framer-motion";

export default function CallDetail() {
  const [, params] = useRoute("/calls/:id");
  const id = parseInt(params?.id || "0", 10);
  const { data: call, isLoading } = useCall(id);

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="h-12 w-48 bg-secondary animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-secondary animate-pulse rounded-3xl" />
          <div className="h-96 bg-secondary animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[80vh] text-center">
        <h2 className="text-2xl font-bold text-foreground">Call Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The report you're looking for doesn't exist.</p>
        <Link href="/">
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium">
            Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  const { analysis } = call;
  const overallScoreColor = analysis.overallScore >= 8 ? 'text-emerald-500' : analysis.overallScore >= 5 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {call.clientName}
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full uppercase tracking-widest">
              {analysis.sentiment}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Rep: {call.salespersonName}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(call.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {call.duration}</span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Interest: {analysis.clientInterestLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scores */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-3xl shadow-sm border-border/50 bg-card text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Overall Performance</h3>
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 - (440 * analysis.overallScore) / 10}
                  className={`${overallScoreColor} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-4xl font-black ${overallScoreColor}`}>{analysis.overallScore.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground font-medium">/ 10</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl shadow-sm border-border/50 bg-card space-y-6">
            <h3 className="font-bold text-lg border-b border-border pb-3">Sub-Scores</h3>
            <ScoreProgress label="Greeting & Opening" score={analysis.greetingScore} />
            <ScoreProgress label="Communication" score={analysis.communicationScore} />
            <ScoreProgress label="Objection Handling" score={analysis.objectionHandlingScore} />
            <ScoreProgress label="Closing" score={analysis.closingScore} />
          </Card>
        </div>

        {/* Right Column: Insights & Transcript */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 rounded-3xl h-full border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-4 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-emerald-900/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 rounded-3xl h-full border-rose-500/20 bg-rose-500/5">
                <div className="flex items-center gap-2 mb-4 text-rose-700">
                  <XCircle className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Weaknesses</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-rose-900/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 rounded-3xl h-full border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-4 text-amber-700">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.improvementSuggestions.map((s, i) => (
                    <li key={i} className="text-sm text-amber-900/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          <Card className="p-6 md:p-8 rounded-3xl shadow-sm border-border/50 bg-card mt-8">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-foreground">Call Transcript</h3>
            </div>
            <div className="bg-secondary/30 rounded-2xl p-6 text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-[500px] overflow-y-auto font-sans">
              {call.transcript}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
