"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ThumbsUp,
  ThumbsDown,
  Minus,
  MessageSquare,
  Calendar,
  User,
  Building,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface NPSFeedbackItem {
  submissionId: string;
  submittedAt: string;
  locationName: string;
  npsRating: number;
  npsFeedback: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
  category: "promoter" | "passive" | "detractor";
}

interface NPSFeedbackCardProps {
  feedback: NPSFeedbackItem[];
  title?: string;
  description?: string;
  showLocationFilter?: boolean;
  initialLimit?: number;
}

export function NPSFeedbackCard({
  feedback,
  title = "NPS Feedback",
  description = "Customer feedback categorized by Net Promoter Score",
  showLocationFilter = true,
  initialLimit = 5,
}: NPSFeedbackCardProps) {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "promoter" | "passive" | "detractor"
  >("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAllDialog, setShowAllDialog] = useState(false);

  // Get unique locations
  const locations = Array.from(
    new Set(feedback.map((f) => f.locationName))
  ).sort();

  // Filter feedback
  const filteredFeedback = feedback.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || item.category === activeCategory;
    const locationMatch =
      selectedLocation === "all" || item.locationName === selectedLocation;
    return categoryMatch && locationMatch;
  });

  // Limit display for main view
  const displayedFeedback = filteredFeedback.slice(0, initialLimit);
  const hasMore = filteredFeedback.length > initialLimit;

  // Count by category
  const counts = {
    promoter: feedback.filter((f) => f.category === "promoter").length,
    passive: feedback.filter((f) => f.category === "passive").length,
    detractor: feedback.filter((f) => f.category === "detractor").length,
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "promoter":
        return <ThumbsUp className="h-4 w-4" />;
      case "passive":
        return <Minus className="h-4 w-4" />;
      case "detractor":
        return <ThumbsDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "promoter":
        return "bg-green-100 text-green-800 border-green-200";
      case "passive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "detractor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "promoter":
        return "Promoter (9-10)";
      case "passive":
        return "Passive (7-8)";
      case "detractor":
        return "Detractor (0-6)";
      default:
        return category;
    }
  };

  const renderFeedbackList = (items: NPSFeedbackItem[]) => (
    <div className="space-y-4">
      {items.map((item, index) => {
        const uniqueKey = `${item.submissionId}-${item.locationName}-${index}`;
        const isExpanded = expandedItems.has(uniqueKey);
        const feedbackPreview =
          item.npsFeedback.length > 150
            ? item.npsFeedback.substring(0, 150) + "..."
            : item.npsFeedback;

        return (
          <div
            key={uniqueKey}
            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("gap-1", getCategoryColor(item.category))}
                >
                  {getCategoryIcon(item.category)}
                  {getCategoryLabel(item.category)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span className="font-semibold">{item.npsRating}</span>/10
                </Badge>
                {showLocationFilter && (
                  <Badge variant="secondary" className="gap-1">
                    <Building className="h-3 w-3" />
                    {item.locationName}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.submittedAt), "MMM d, yyyy")}
              </div>
            </div>

            <div className="text-sm leading-relaxed">
              <p className="text-foreground">
                {isExpanded || item.npsFeedback.length <= 150
                  ? item.npsFeedback
                  : feedbackPreview}
              </p>
              {item.npsFeedback.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(uniqueKey)}
                  className="mt-2 h-auto p-0 text-primary hover:bg-transparent"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show more
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.userType}
              </span>
              <span>•</span>
              <span>{item.patientType}</span>
              <span>•</span>
              <span>{item.visitPurpose}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {showLocationFilter && locations.length > 1 && (
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({feedback.length})</TabsTrigger>
            <TabsTrigger value="promoter" className="gap-1">
              <ThumbsUp className="h-3 w-3" />
              Promoters ({counts.promoter})
            </TabsTrigger>
            <TabsTrigger value="passive" className="gap-1">
              <Minus className="h-3 w-3" />
              Passives ({counts.passive})
            </TabsTrigger>
            <TabsTrigger value="detractor" className="gap-1">
              <ThumbsDown className="h-3 w-3" />
              Detractors ({counts.detractor})
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No feedback available for this category</p>
              </div>
            ) : (
              <>
                {renderFeedbackList(displayedFeedback)}

                {hasMore && (
                  <div className="mt-4 text-center">
                    <Dialog
                      open={showAllDialog}
                      onOpenChange={setShowAllDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Show All ({filteredFeedback.length} total)
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{title} - All Feedback</DialogTitle>
                          <DialogDescription>
                            Showing all {filteredFeedback.length} feedback items
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          {renderFeedbackList(filteredFeedback)}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
