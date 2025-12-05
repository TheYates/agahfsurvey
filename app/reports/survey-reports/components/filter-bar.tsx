"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter as FilterIcon } from "lucide-react";

export interface FilterOptions {
  userType?: string;
  patientType?: string;
  visitPurpose?: string;
  visitTime?: string;
  dateRange?: string;
}

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string | undefined) => void;
  onClearAll?: () => void;
  showDateRange?: boolean;
  compact?: boolean;
}

const USER_TYPE_OPTIONS = [
  { value: "AGAG Employee", label: "AGAG Employee" },
  { value: "AGAG/Contractor Dependant", label: "AGAG/Contractor Dependant" },
  { value: "Community", label: "Community" },
  { value: "Contractor Employee", label: "Contractor Employee" },
  { value: "Other Corporate Employee", label: "Other Corporate Employee" },
];

const PATIENT_TYPE_OPTIONS = [
  { value: "New Patient", label: "New Patient" },
  { value: "Returning Patient", label: "Returning Patient" },
];

const VISIT_PURPOSE_OPTIONS = [
  { value: "General Practice", label: "General Practice" },
  {
    value: "Medicals (Occupational Health)",
    label: "Medical Surveillance (Occupational Health)",
  },
];

const VISIT_TIME_OPTIONS = [
  { value: "less-than-month", label: "Less than a month ago" },
  { value: "one-two-months", label: "1-2 months ago" },
  { value: "three-six-months", label: "3-6 months ago" },
  { value: "more-than-six-months", label: "More than 6 months ago" },
];

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "month", label: "Last Month" },
  { value: "quarter", label: "Last 3 Months" },
  { value: "year", label: "Last Year" },
];

export function FilterBar({
  filters,
  onFilterChange,
  onClearAll,
  showDateRange = false,
  compact = false,
}: FilterBarProps) {
  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== "all"
  ).length;

  const handleClear = (key: keyof FilterOptions) => {
    onFilterChange(key, undefined);
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      Object.keys(filters).forEach((key) => {
        onFilterChange(key as keyof FilterOptions, undefined);
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`grid gap-4 ${
          compact
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
        }`}
      >
        {showDateRange && (
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Date Range
            </label>
            <Select
              value={filters.dateRange || "all"}
              onValueChange={(value) => onFilterChange("dateRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-1.5 block">User Type</label>
          <Select
            value={filters.userType || "all"}
            onValueChange={(value) =>
              onFilterChange("userType", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All user types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All User Types</SelectItem>
              {USER_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Patient Type
          </label>
          <Select
            value={filters.patientType || "all"}
            onValueChange={(value) =>
              onFilterChange(
                "patientType",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All patient types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patient Types</SelectItem>
              {PATIENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Visit Purpose
          </label>
          <Select
            value={filters.visitPurpose || "all"}
            onValueChange={(value) =>
              onFilterChange(
                "visitPurpose",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All purposes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes</SelectItem>
              {VISIT_PURPOSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Visit Time</label>
          <Select
            value={filters.visitTime || "all"}
            onValueChange={(value) =>
              onFilterChange("visitTime", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All visit times" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visit Times</SelectItem>
              {VISIT_TIME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <FilterIcon size={14} />
            Active Filters:
          </span>
          {filters.userType && (
            <Badge variant="secondary" className="gap-1">
              User: {filters.userType}
              <X
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={() => handleClear("userType")}
              />
            </Badge>
          )}
          {filters.patientType && (
            <Badge variant="secondary" className="gap-1">
              Patient: {filters.patientType}
              <X
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={() => handleClear("patientType")}
              />
            </Badge>
          )}
          {filters.visitPurpose && (
            <Badge variant="secondary" className="gap-1">
              Purpose:{" "}
              {filters.visitPurpose === "Medicals (Occupational Health)"
                ? "Medical Surveillance"
                : filters.visitPurpose}
              <X
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={() => handleClear("visitPurpose")}
              />
            </Badge>
          )}
          {filters.visitTime && (
            <Badge variant="secondary" className="gap-1">
              Time:{" "}
              {VISIT_TIME_OPTIONS.find((opt) => opt.value === filters.visitTime)
                ?.label || filters.visitTime}
              <X
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={() => handleClear("visitTime")}
              />
            </Badge>
          )}
          {filters.dateRange && filters.dateRange !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Date:{" "}
              {DATE_RANGE_OPTIONS.find(
                (opt) => opt.value === filters.dateRange
              )?.label || filters.dateRange}
              <X
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={() => handleClear("dateRange")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
