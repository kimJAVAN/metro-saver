import { DollarSign, Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaxiFareEstimateProps {
  estimatedFare: number;
  distance: number;
  onCallTaxi?: () => void;
}

export const TaxiFareEstimate = ({ estimatedFare, distance, onCallTaxi }: TaxiFareEstimateProps) => {
  return (
    <Card className="p-4 bg-warning/5 border-warning/20 shadow-[var(--shadow-card)]">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-warning" />
          <span className="text-sm font-semibold text-warning">택시 대체 경로</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <DollarSign className="w-4 h-4 text-warning mt-1" />
            <span className="text-3xl font-bold text-warning">
              {estimatedFare.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">원</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>예상 거리: {distance}km</span>
            <span>심야 할증 포함</span>
          </div>
        </div>

        {onCallTaxi && (
          <Button 
            variant="warning" 
            className="w-full"
            onClick={onCallTaxi}
          >
            택시 호출하기
          </Button>
        )}

        <p className="text-xs text-center text-muted-foreground">
          💡 막차를 놓치면 이 정도 비용이 듭니다
        </p>
      </div>
    </Card>
  );
};
