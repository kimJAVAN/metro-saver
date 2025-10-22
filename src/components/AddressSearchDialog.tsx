import { useState } from "react";
import { Search, MapPin, Clock, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResult {
  address: string;
  name?: string;
  latitude?: number;
  longitude?: number;
}

interface AddressSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAddress: (address: string) => void;
  searchHistory: string[];
  onClearHistory: () => void;
}

export const AddressSearchDialog = ({
  open,
  onOpenChange,
  onSelectAddress,
  searchHistory,
  onClearHistory,
}: AddressSearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Mock 검색 결과 - 실제로는 Kakao Local API 등을 사용
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        { address: `${query} 123-45`, name: `${query} 주변` },
        { address: `서울시 강남구 ${query}동`, name: `${query}동` },
        { address: `서울시 서초구 ${query}로`, name: `${query}로` },
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectAddress = (address: string) => {
    onSelectAddress(address);
    setQuery("");
    setResults([]);
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>집 위치 검색</DialogTitle>
          <DialogDescription>
            주소 또는 건물명을 검색하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 검색 입력 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="예: 강남역, 테헤란로 123"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "검색 중..." : "검색"}
            </Button>
          </div>

          {/* 검색 결과 */}
          {results.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">검색 결과</p>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAddress(result.address)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
                    >
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        {result.name && (
                          <p className="font-semibold text-sm truncate">{result.name}</p>
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {result.address}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* 최근 검색 */}
          {searchHistory.length > 0 && results.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  최근 검색
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearHistory}
                  className="h-7 text-xs"
                >
                  전체 삭제
                </Button>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {searchHistory.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAddress(address)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
                    >
                      <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {query && results.length === 0 && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">검색 버튼을 눌러주세요</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
