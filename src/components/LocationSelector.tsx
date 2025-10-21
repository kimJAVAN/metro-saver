import { MapPin, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  currentLocation: string;
  homeLocation: string;
  onSetHome: () => void;
  onRefreshLocation: () => void;
}

export const LocationSelector = ({
  currentLocation,
  homeLocation,
  onSetHome,
  onRefreshLocation,
}: LocationSelectorProps) => {
  return (
    <Card className="p-4 bg-card border-border shadow-[var(--shadow-card)]">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">현재 위치</p>
            <p className="text-sm font-medium truncate">{currentLocation}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshLocation}
              className="mt-2 h-7 text-xs"
            >
              위치 새로고침
            </Button>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
            <Home className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">집 위치</p>
            <p className="text-sm font-medium truncate">{homeLocation}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSetHome}
              className="mt-2 h-7 text-xs"
            >
              집 위치 설정
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
