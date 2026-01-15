import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NPSCardProps {
  npsData?: {
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
    total: number;
  } | null;
  title?: string;
  className?: string;
}

export function NPSCard({
  npsData,
  title = "Net Promoter Score",
  className,
}: NPSCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
          {title}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                <Info size={14} className="text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>
                NPS measures customer loyalty. Score = (% Promoters (9-10) - %
                Detractors (0-6) + 100) / 2. Range: 0% to 100%. Above 50%
                is good, above 75% is excellent.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 text-center">
            <ThumbsUp className="h-4 w-4 text-[#22c5bf]" />
            <div className="text-xl font-bold text-[#22c5bf]">
              {npsData?.promoters || 0}
            </div>
            <span className="text-[10px] text-[#22c5bf]">
              Promoters {npsData?.total ? Math.round((npsData.promoters / npsData.total) * 100) : 0}%
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="h-0.5 w-3 bg-[#f6a050]" />
            </div>
            <div className="text-xl font-bold text-[#f6a050]">
              {npsData?.passives || 0}
            </div>
            <span className="text-[10px] text-[#f6a050]">
              Passives {npsData?.total ? Math.round((npsData.passives / npsData.total) * 100) : 0}%
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <ThumbsDown className="h-4 w-4 text-[#e84e3c]" />
            <div className="text-xl font-bold text-[#e84e3c]">
              {npsData?.detractors || 0}
            </div>
            <span className="text-[10px] text-[#e84e3c]">
              Detractors {npsData?.total ? Math.round((npsData.detractors / npsData.total) * 100) : 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
