import { Progress } from "@/components/ui/progress";

interface ScoreProgressProps {
  label: string;
  score: number;
  maxScore?: number;
  colorClass?: string;
}

export function ScoreProgress({ 
  label, 
  score, 
  maxScore = 10,
  colorClass = "bg-primary"
}: ScoreProgressProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  
  // Determine color based on score if no explicit color provided
  let activeColorClass = colorClass;
  if (colorClass === "bg-primary") {
    if (percentage >= 80) activeColorClass = "bg-emerald-500";
    else if (percentage >= 60) activeColorClass = "bg-amber-500";
    else activeColorClass = "bg-rose-500";
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">
          {score.toFixed(1)} <span className="text-muted-foreground font-normal">/ {maxScore}</span>
        </span>
      </div>
      <div className="h-2.5 relative overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full flex-1 transition-all duration-1000 ease-out ${activeColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
