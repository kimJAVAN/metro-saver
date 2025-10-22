import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

// 역지오코딩 함수 (실제로는 Kakao Maps API 등을 사용)
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Mock 역지오코딩 - 실제로는 Kakao Local API 사용
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 서울 주요 지역 예시
  const mockAddresses = [
    "서울시 강남구 역삼동",
    "서울시 서초구 서초동",
    "서울시 송파구 잠실동",
    "서울시 강동구 천호동",
    "서울시 종로구 종로1가",
    "서울시 마포구 상암동",
  ];
  
  return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: true,
  });

  const getCurrentPosition = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        address: null,
        error: "위치 서비스를 지원하지 않는 브라우저입니다.",
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const address = await reverseGeocode(lat, lng);
          setState({
            latitude: lat,
            longitude: lng,
            address,
            error: null,
            loading: false,
          });
        } catch (error) {
          setState({
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        let errorMessage = "위치를 가져올 수 없습니다.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }
        
        setState({
          latitude: null,
          longitude: null,
          address: null,
          error: errorMessage,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  return { ...state, refetch: getCurrentPosition };
};
