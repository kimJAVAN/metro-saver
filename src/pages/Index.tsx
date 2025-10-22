import { useState, useEffect, useMemo } from "react";
import { Train, Clock, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/LocationSelector";
import { LastTrainTimer } from "@/components/LastTrainTimer";
import { RouteCard } from "@/components/RouteCard";
import { TaxiFareEstimate } from "@/components/TaxiFareEstimate";
import { AddressSearchDialog } from "@/components/AddressSearchDialog";
import { toast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { calculateRoute } from "@/utils/routeCalculator";

const Index = () => {
  const { address, error: locationError, loading: loadingLocation, refetch: refetchLocation } = useGeolocation();
  const [homeLocation, setHomeLocation] = useLocalStorage<string>("homeLocation", "집 위치를 설정하세요");
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>("addressSearchHistory", []);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("위치 확인 중...");

  useEffect(() => {
    // 알림 권한 확인
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationEnabled(true);
      }
    }
  }, []);

  useEffect(() => {
    // 위치 정보 업데이트
    if (locationError) {
      setCurrentLocation(locationError);
    } else if (address) {
      setCurrentLocation(address);
    }
  }, [address, locationError]);

  // 경로 계산 (현재 위치와 집 위치가 모두 설정되었을 때)
  const routeInfo = useMemo(() => {
    if (currentLocation === "위치 확인 중..." || 
        currentLocation === locationError || 
        homeLocation === "집 위치를 설정하세요") {
      return null;
    }
    return calculateRoute(currentLocation, homeLocation);
  }, [currentLocation, homeLocation, locationError]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "알림 미지원",
        description: "이 브라우저는 알림을 지원하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationEnabled(true);
        toast({
          title: "알림 활성화",
          description: "막차 알림이 활성화되었습니다!",
        });
        
        // 테스트 알림
        new Notification("막차 알림 활성화", {
          body: "막차 시간이 되면 알림을 보내드립니다.",
          icon: "/favicon.ico",
        });
      } else {
        toast({
          title: "알림 거부됨",
          description: "브라우저 설정에서 알림 권한을 허용해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      toast({
        title: "오류",
        description: "알림 권한 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSetHome = () => {
    setShowSearchDialog(true);
  };

  const handleSelectAddress = (address: string) => {
    setHomeLocation(address);
    
    // 검색 기록에 추가 (중복 제거)
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== address);
      return [address, ...filtered].slice(0, 10); // 최대 10개까지 저장
    });

    toast({
      title: "집 위치 설정 완료",
      description: address,
    });
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    toast({
      title: "검색 기록 삭제",
      description: "모든 검색 기록이 삭제되었습니다.",
    });
  };

  const handleRefreshLocation = () => {
    refetchLocation();
    toast({
      title: "위치 갱신 중",
      description: "현재 위치를 갱신하고 있습니다...",
    });
  };

  const handleCallTaxi = () => {
    toast({
      title: "택시 호출",
      description: "택시 호출 서비스로 연결됩니다...",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Train className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gradient-sunset">막차 세이버</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            막차 시간을 놓치지 마세요! 🚇
          </p>
        </header>

        {/* 알림 설정 */}
        {!notificationEnabled && (
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-semibold text-warning">알림 권한 필요</p>
                  <p className="text-sm text-muted-foreground">막차 시간 알림을 받으려면 권한을 허용해주세요</p>
                </div>
              </div>
              <Button variant="default" onClick={requestNotificationPermission}>
                알림 허용
              </Button>
            </div>
          </Card>
        )}

        {/* 위치 정보 */}
        <LocationSelector
          currentLocation={currentLocation}
          homeLocation={homeLocation}
          onSetHome={handleSetHome}
          onRefreshLocation={handleRefreshLocation}
          isLoadingLocation={loadingLocation}
        />

        {/* 주소 검색 다이얼로그 */}
        <AddressSearchDialog
          open={showSearchDialog}
          onOpenChange={setShowSearchDialog}
          onSelectAddress={handleSelectAddress}
          searchHistory={searchHistory}
          onClearHistory={handleClearHistory}
        />

        {/* 경로 정보가 있을 때만 표시 */}
        {routeInfo ? (
          <>
            {/* 막차 타이머 */}
            <LastTrainTimer 
              departureTime={routeInfo.lastTrainTime} 
              travelTime={routeInfo.totalTime}
              notificationEnabled={notificationEnabled}
            />

            {/* 추천 경로 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">추천 경로</h2>
              </div>
              <RouteCard route={routeInfo.route} totalTime={routeInfo.totalTime} />
            </div>

            {/* 택시 요금 예상 */}
            <TaxiFareEstimate
              estimatedFare={routeInfo.taxiFare}
              distance={routeInfo.distance}
              onCallTaxi={handleCallTaxi}
            />
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {homeLocation === "집 위치를 설정하세요" 
                ? "집 위치를 설정하면 막차 정보를 확인할 수 있습니다."
                : "현재 위치를 확인하는 중입니다..."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
