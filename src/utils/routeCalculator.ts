interface RouteStep {
  type: "subway" | "bus" | "walk";
  line?: string;
  from: string;
  to: string;
  duration: number;
  lineColor?: string;
}

interface RouteInfo {
  route: RouteStep[];
  totalTime: number;
  lastTrainTime: string;
  distance: number;
  taxiFare: number;
}

// 경로 계산 함수 (실제로는 대중교통 API 사용)
export const calculateRoute = (from: string, to: string): RouteInfo => {
  // Mock 경로 계산
  const baseTime = 20 + Math.floor(Math.random() * 40); // 20-60분
  const distance = 5 + Math.floor(Math.random() * 20); // 5-25km
  
  // 지하철 노선 목록
  const subwayLines = [
    { line: "1호선", color: "#0052A4" },
    { line: "2호선", color: "#00A84D" },
    { line: "3호선", color: "#EF7C1C" },
    { line: "4호선", color: "#00A5DE" },
    { line: "5호선", color: "#996CAC" },
    { line: "6호선", color: "#CD7C2F" },
    { line: "7호선", color: "#747F00" },
    { line: "8호선", color: "#E6186C" },
    { line: "9호선", color: "#BDB092" },
  ];
  
  const randomLine = subwayLines[Math.floor(Math.random() * subwayLines.length)];
  
  const route: RouteStep[] = [
    {
      type: "walk",
      from: from,
      to: `${from} 역`,
      duration: Math.floor(Math.random() * 5) + 3, // 3-7분
    },
    {
      type: "subway",
      line: randomLine.line,
      lineColor: randomLine.color,
      from: `${from} 역`,
      to: `${to.split(" ")[to.split(" ").length - 1]} 역`,
      duration: baseTime,
    },
    {
      type: "walk",
      from: `${to.split(" ")[to.split(" ").length - 1]} 역`,
      to: to,
      duration: Math.floor(Math.random() * 5) + 5, // 5-9분
    },
  ];
  
  const totalTime = route.reduce((sum, step) => sum + step.duration, 0);
  
  // 막차 시간 계산 (23:00 ~ 00:30 사이)
  const lastTrainHour = 23;
  const lastTrainMinute = Math.floor(Math.random() * 60);
  const lastTrainTime = `${lastTrainHour}:${lastTrainMinute.toString().padStart(2, '0')}`;
  
  // 택시 요금 계산 (기본 4,800원 + 거리당 요금 + 심야할증 20%)
  const baseFare = 4800;
  const distanceFare = Math.floor(distance * 1000); // 1km당 약 1000원
  const nightSurcharge = 0.2;
  const taxiFare = Math.floor((baseFare + distanceFare) * (1 + nightSurcharge));
  
  return {
    route,
    totalTime,
    lastTrainTime,
    distance,
    taxiFare,
  };
};
