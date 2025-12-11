import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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

export function NPSCard({ npsData, title = "Net Promoter Score", className }: NPSCardProps) {
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
                NPS measures customer loyalty. Score = % Promoters (9-10) - %
                Detractors (0-6). Range: -100 to +100. Above 0 is good, above 50
                is excellent.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{npsData?.score || 0}</div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <ThumbsUp className="h-3 w-3 text-[#22c5bf]" />
                  <span className="font-medium">{npsData?.promoters || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Promoters (9-10)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <div className="h-3 w-3 flex items-center justify-center">
                    <div className="h-0.5 w-2 bg-[#f6a050]" />
                  </div>
                  <span className="font-medium">{npsData?.passives || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Passives (7-8)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <ThumbsDown className="h-3 w-3 text-[#e84e3c]" />
                  <span className="font-medium">{npsData?.detractors || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Detractors (0-6)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
