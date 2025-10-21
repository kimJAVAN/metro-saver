import { useState } from "react";
import { Bell, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LastTrainTimer } from "@/components/LastTrainTimer";
import { LocationSelector } from "@/components/LocationSelector";
import { RouteCard } from "@/components/RouteCard";
import { TaxiFareEstimate } from "@/components/TaxiFareEstimate";
import { toast } from "sonner";

const Index = () => {
  // 예시 데이터 - 실제로는 API에서 가져올 데이터
  const [currentLocation] = useState("강남역");
  const [homeLocation] = useState("노원역");
  
  // 오늘 막차 시간 (예: 23:30)
  const lastTrainTime = new Date();
  lastTrainTime.setHours(23, 30, 0, 0);
  
  // 막차가 이미 지났다면 내일 첫차로 설정 (테스트용)
  if (lastTrainTime < new Date()) {
    lastTrainTime.setDate(lastTrainTime.getDate() + 1);
  }

  const recommendedRoute = [
    { type: "subway" as const, line: "2호선", from: "강남", to: "신림", duration: 25, lineColor: "#00a84d" },
    { type: "subway" as const, line: "7호선", from: "신림", to: "노원", duration: 35, lineColor: "#636466" },
  ];

  const alternativeRoute = [
    { type: "subway" as const, line: "2호선", from: "강남", to: "을지로입구", duration: 20, lineColor: "#00a84d" },
    { type: "subway" as const, line: "4호선", from: "을지로입구", to: "노원", duration: 45, lineColor: "#00a4e3" },
  ];

  const handleSetAlarm = () => {
    toast.success("30분 전 알림이 설정되었습니다!", {
      description: "막차 출발 30분 전에 알려드릴게요",
    });
  };

  const handleShareLocation = () => {
    toast.success("위치가 공유되었습니다", {
      description: "친구에게 현재 위치를 전송했습니다",
    });
  };

  const handleRefreshLocation = () => {
    toast.success("위치를 새로고침했습니다");
  };

  const handleSetHome = () => {
    toast.success("집 위치를 설정했습니다");
  };

  return (
    <div className="min-h-screen bg-gradient-night">
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-sunset">
              막차 알림
            </h1>
            <p className="text-sm text-muted-foreground">놓치지 말고 안전하게 귀가하세요</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShareLocation}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Timer Section */}
        <div className="space-y-4">
          <LastTrainTimer 
            departureTime={lastTrainTime}
            lineName="7호선 노원행"
          />
          
          <Button 
            variant="alert" 
            className="w-full text-base font-bold"
            onClick={handleSetAlarm}
          >
            <Bell className="w-5 h-5 mr-2" />
            30분 전 알림 설정하기
          </Button>
        </div>

        {/* Location Section */}
        <LocationSelector
          currentLocation={currentLocation}
          homeLocation={homeLocation}
          onSetHome={handleSetHome}
          onRefreshLocation={handleRefreshLocation}
        />

        {/* Routes Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>추천 경로</span>
          </h2>
          
          <RouteCard 
            route={recommendedRoute}
            totalTime={60}
          />
          
          <RouteCard 
            route={alternativeRoute}
            totalTime={65}
            isAlternative
          />
        </div>

        {/* Taxi Fare Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-warning">
            막차 놓치면?
          </h2>
          
          <TaxiFareEstimate 
            estimatedFare={48000}
            distance={24.5}
          />
        </div>

        {/* Footer Info */}
        <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-semibold">Tip:</span> 알림을 설정하면 막차 30분 전에 자동으로 알려드려요
          </p>
          <p className="text-xs text-muted-foreground">
            🚕 택시비는 심야 할증(20%)과 거리를 고려한 예상 금액입니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
