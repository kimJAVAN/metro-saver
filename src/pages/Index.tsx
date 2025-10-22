import { useState, useEffect } from "react";
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

const Index = () => {
  const { latitude, longitude, error: locationError, loading: loadingLocation, refetch: refetchLocation } = useGeolocation();
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
    } else if (latitude && longitude) {
      // 실제로는 역지오코딩 API를 사용해서 주소로 변환
      setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  }, [latitude, longitude, locationError]);

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

  const mockRoute = [
    {
      type: "subway" as const,
      line: "2호선",
      lineColor: "#00A84D",
      from: "강남역",
      to: "역삼역",
      duration: 3,
    },
    {
      type: "walk" as const,
      from: "역삼역",
      to: "집",
      duration: 7,
    },
  ];

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

        {/* 막차 타이머 */}
        <LastTrainTimer 
          departureTime="23:45" 
          travelTime={10}
          notificationEnabled={notificationEnabled}
        />

        {/* 추천 경로 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">추천 경로</h2>
          </div>
          <RouteCard route={mockRoute} totalTime={10} />
        </div>

        {/* 택시 요금 예상 */}
        <TaxiFareEstimate
          estimatedFare={15000}
          distance={8.5}
          onCallTaxi={handleCallTaxi}
        />
      </div>
    </div>
  );
};

export default Index;
