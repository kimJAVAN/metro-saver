import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LastTrainTimerProps {
  departureTime: Date;
  lineName: string;
}

export const LastTrainTimer = ({ departureTime, lineName }: LastTrainTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = departureTime.getTime() - now.getTime();
      setTimeLeft(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(interval);
  }, [departureTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const isUrgent = timeLeft < 30 * 60 * 1000; // 30분 미만
  const isCritical = timeLeft < 10 * 60 * 1000; // 10분 미만

  return (
    <Card className="relative overflow-hidden border-2 border-border bg-card shadow-[var(--shadow-card)]">
      {isCritical && (
        <div className="absolute inset-0 bg-gradient-alert opacity-10 animate-pulse-slow" />
      )}
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{lineName} 막차</span>
          </div>
          {isUrgent && (
            <div className="flex items-center gap-1 text-destructive animate-pulse-slow">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold">긴급</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-center gap-2">
            {hours > 0 && (
              <>
                <span className={`text-6xl font-bold tabular-nums ${isCritical ? 'text-gradient-sunset' : ''}`}>
                  {hours.toString().padStart(2, '0')}
                </span>
                <span className="text-2xl text-muted-foreground">시간</span>
              </>
            )}
            <span className={`text-6xl font-bold tabular-nums ${isCritical ? 'text-gradient-sunset' : ''}`}>
              {minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-2xl text-muted-foreground">분</span>
            <span className={`text-6xl font-bold tabular-nums ${isCritical ? 'text-gradient-sunset' : ''}`}>
              {seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-2xl text-muted-foreground">초</span>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            {departureTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 출발
          </p>
        </div>

        {isCritical && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium text-center">
              ⚠️ 지금 출발하세요!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
