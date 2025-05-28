import { useToast } from "@/components/ui/use-toast";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  prepareSurveyDataForExport,
  prepareDepartmentDataForExport,
  prepareSummaryDataForExport,
  prepareOverviewDataForExport,
  prepareWardsDataForExport,
  prepareCanteenDataForExport,
  prepareMedicalsDataForExport,
  prepareFeedbackDataForExport,
  getExportFilename,
} from "./export-utils";

export function useExport() {
  const { toast } = useToast();

  const handleExport = async (
    format: string,
    dataType: string,
    options: Record<string, any>,
    state: {
      setIsLoading: (loading: boolean) => void;
      dateRange: string;
      activeTabRef: React.RefObject<string>;
      overviewData: any;
      data: any;
      dashboardRef: React.RefObject<HTMLDivElement | null>;
      visitPurposeData: any;
      patientTypeData: any;
      locations: any[];
      visitTimeData: any;
      textFeedback: any;
      improvementPriorities: any;
      exportMultipleTabsToPDF: (
        selectedTabs: string[],
        dateRangeText: string,
        orientation: string
      ) => Promise<void>;
      exportMultipleTabsToExcel: (
        selectedTabs: string[],
        dateRangeText: string
      ) => Promise<void>;
      exportMultipleTabsToCSV: (
        selectedTabs: string[],
        dateRangeText: string
      ) => Promise<void>;
      generateOverviewTabHTML: (data: any) => string;
      generateDepartmentsTabHTML: (data: any) => string;
      generateWardsTabHTML: (data: any) => string;
      generateCanteenTabHTML: (data: any) => string;
      generateMedicalsTabHTML: (data: any, visitTimeData: any) => string;
      generateFeedbackTabHTML: (
        data: any,
        improvementPriorities: any
      ) => string;
    }
  ) => {
    try {
      state.setIsLoading(true);

      // Show progress notification
      toast({
        title: "Export Started",
        description: "Preparing your data for export...",
      });

      const dateRangeText =
        state.dateRange === "all"
          ? "All Time"
          : state.dateRange === "month"
          ? "Last Month"
          : state.dateRange === "quarter"
          ? "Last Quarter"
          : "Last Year";

      // Special handling for multi-tab exports
      if (dataType === "multi-tab" && options?.selectedTabs) {
        const selectedTabs = options.selectedTabs as string[];

        if (format === "pdf") {
          // For PDF: Create a multi-page document with all selected tabs
          await state.exportMultipleTabsToPDF(
            selectedTabs,
            dateRangeText,
            options?.orientation || "landscape"
          );
          toast({
            title: "Export Complete",
            description: `Multi-tab report has been exported as PDF.`,
          });
        } else if (format === "excel") {
          // For Excel: Export each tab to a separate worksheet in one file
          await state.exportMultipleTabsToExcel(selectedTabs, dateRangeText);
          toast({
            title: "Export Complete",
            description: `Multi-tab report has been exported as Excel.`,
          });
        } else if (format === "csv") {
          // For CSV: Export each tab to a separate CSV file
          await state.exportMultipleTabsToCSV(selectedTabs, dateRangeText);
          toast({
            title: "Export Complete",
            description: `Multiple CSV files have been created.`,
          });
        }

        state.setIsLoading(false);
        return;
      }

      // Continue with original code for single tab exports...
      // Rest of the function implementation...

      // ... (implement the rest of the export logic)
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while exporting. Please try again.",
        variant: "destructive",
      });
    } finally {
      state.setIsLoading(false);
    }
  };

  return { handleExport };
}
