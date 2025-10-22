import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LastTrainTimerProps {
  departureTime: string;
  travelTime: number;
  notificationEnabled?: boolean;
}

export const LastTrainTimer = ({ 
  departureTime, 
  travelTime,
  notificationEnabled = false 
}: LastTrainTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const [hours, minutes] = departureTime.split(":").map(Number);
      const departure = new Date();
      departure.setHours(hours, minutes, 0, 0);

      if (departure < now) {
        departure.setDate(departure.getDate() + 1);
      }

      const leaveTime = new Date(departure.getTime() - travelTime * 60000);
      const diff = Math.max(0, Math.floor((leaveTime.getTime() - now.getTime()) / 1000));
      
      return diff;
    };

    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      // 10분 남았을 때 알림
      if (notificationEnabled && !hasNotified && remaining <= 600 && remaining > 0) {
        setHasNotified(true);
        new Notification("⚠️ 막차 시간 임박!", {
          body: `${Math.floor(remaining / 60)}분 후에 출발해야 막차를 탈 수 있습니다!`,
          icon: "/favicon.ico",
          tag: "last-train",
          requireInteraction: true,
        });
      }

      // 시간이 지나면 알림 초기화
      if (remaining === 0) {
        setHasNotified(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [departureTime, travelTime, notificationEnabled, hasNotified]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const totalSeconds = 4 * 60 * 60;
  const progress = Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100);

  const isUrgent = timeLeft <= 600 && timeLeft > 0;
  const isMissed = timeLeft === 0;

  return (
    <Card className={`p-6 ${isUrgent ? 'bg-gradient-alert border-destructive' : isMissed ? 'bg-muted' : 'bg-card'} shadow-[var(--shadow-card)]`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-6 h-6 ${isUrgent ? 'text-destructive-foreground' : 'text-primary'}`} />
            <span className={`text-lg font-semibold ${isUrgent ? 'text-destructive-foreground' : 'text-foreground'}`}>
              집 출발 시간까지
            </span>
          </div>
          {isUrgent && (
            <AlertTriangle className="w-6 h-6 text-destructive-foreground animate-pulse" />
          )}
        </div>

        <div className="text-center">
          <div className={`text-6xl font-bold ${isUrgent ? 'text-destructive-foreground' : isMissed ? 'text-muted-foreground' : 'text-primary'} tabular-nums`}>
            {isMissed ? "막차 종료" : `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
          </div>
          {!isMissed && (
            <p className={`text-sm mt-2 ${isUrgent ? 'text-destructive-foreground' : 'text-muted-foreground'}`}>
              막차 출발: {departureTime} • 소요시간: {travelTime}분
            </p>
          )}
        </div>

        {!isMissed && (
          <Progress value={progress} className="h-2" />
        )}

        {isUrgent && !isMissed && (
          <div className="text-center p-3 bg-destructive/10 rounded-lg animate-pulse-slow">
            <p className="text-destructive-foreground font-semibold">
              ⚠️ 지금 출발하세요!
            </p>
          </div>
        )}

        {isMissed && (
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              오늘의 막차가 종료되었습니다. 택시나 다른 교통수단을 이용하세요.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
