import { Train, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RouteStep {
  type: "subway" | "bus" | "walk";
  line?: string;
  from: string;
  to: string;
  duration: number;
  lineColor?: string;
}

interface RouteCardProps {
  route: RouteStep[];
  totalTime: number;
  isAlternative?: boolean;
}

export const RouteCard = ({ route, totalTime, isAlternative }: RouteCardProps) => {
  return (
    <Card className={`p-4 border-border bg-card shadow-[var(--shadow-card)] ${isAlternative ? 'opacity-75' : ''}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">
              {isAlternative ? "대체 경로" : "추천 경로"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{totalTime}분</span>
          </div>
        </div>

        <div className="space-y-2">
          {route.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                {step.line && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-bold"
                    style={{ 
                      backgroundColor: step.lineColor || 'hsl(var(--secondary))',
                      color: 'white'
                    }}
                  >
                    {step.line}
                  </Badge>
                )}
                <span className="text-sm">{step.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{step.to}</span>
              </div>
              <span className="text-xs text-muted-foreground">{step.duration}분</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
