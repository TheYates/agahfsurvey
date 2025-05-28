import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Table,
  FileDown,
  Smartphone,
  MonitorSmartphone,
  Layers,
} from "lucide-react";

// Define available tabs with their display names
const AVAILABLE_TABS = [
  { id: "overview", name: "Overview" },
  { id: "departments", name: "Departments" },
  { id: "wards", name: "Wards" },
  { id: "canteen", name: "Canteen" },
  { id: "occupational-health", name: "Occupational Health" },
  { id: "feedback", name: "Feedback" },
];

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    format: string,
    dataType: string,
    options?: Record<string, any>
  ) => void;
  currentTab?: string;
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  currentTab = "overview",
}: ExportModalProps) {
  const [exportFormat, setExportFormat] = React.useState<string>("pdf");
  const [dataType, setDataType] = React.useState<string>("summary");
  const [orientation, setOrientation] = React.useState<string>("landscape");
  const [selectedTabs, setSelectedTabs] = React.useState<string[]>([]);

  // Initialize with current tab whenever the modal opens
  React.useEffect(() => {
    if (isOpen && dataType === "multi-tab") {
      setSelectedTabs([currentTab]);
    }
  }, [isOpen, currentTab, dataType]);

  const handleExport = () => {
    const options: Record<string, any> = {};

    if (exportFormat === "pdf") {
      options.orientation = orientation;
    }

    if (dataType === "multi-tab") {
      options.selectedTabs = selectedTabs;
    }

    onExport(exportFormat, dataType, options);
    onClose();
  };

  // Format the current tab name for display
  const formatTabName = (tabName: string) => {
    return tabName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Toggle a tab selection
  const toggleTabSelection = (tabId: string) => {
    setSelectedTabs((prev) =>
      prev.includes(tabId)
        ? prev.filter((id) => id !== tabId)
        : [...prev, tabId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Report
          </DialogTitle>
          <DialogDescription>
            Choose the format and data to export from the dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <RadioGroup
                id="export-format"
                value={exportFormat}
                onValueChange={setExportFormat}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label
                    htmlFor="format-pdf"
                    className="flex items-center space-x-2 font-normal"
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>PDF Document</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="excel" id="format-excel" />
                  <Label
                    htmlFor="format-excel"
                    className="flex items-center space-x-2 font-normal"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span>Excel Spreadsheet</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label
                    htmlFor="format-csv"
                    className="flex items-center space-x-2 font-normal"
                  >
                    <Table className="h-4 w-4 text-amber-600" />
                    <span>CSV File</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {exportFormat === "pdf" && (
              <div className="space-y-2">
                <Label htmlFor="pdf-orientation">PDF Orientation</Label>
                <RadioGroup
                  id="pdf-orientation"
                  value={orientation}
                  onValueChange={setOrientation}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem
                      value="landscape"
                      id="orientation-landscape"
                    />
                    <Label
                      htmlFor="orientation-landscape"
                      className="flex items-center space-x-2 font-normal"
                    >
                      <MonitorSmartphone className="h-4 w-4 text-indigo-600" />
                      <span>Landscape (Wide)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem
                      value="portrait"
                      id="orientation-portrait"
                    />
                    <Label
                      htmlFor="orientation-portrait"
                      className="flex items-center space-x-2 font-normal"
                    >
                      <Smartphone className="h-4 w-4 text-indigo-600" />
                      <span>Portrait (Tall)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="data-type">Data to Export</Label>
              <RadioGroup
                id="data-type"
                value={dataType}
                onValueChange={setDataType}
                className="flex flex-col space-y-1"
              >
                <div
                  className={`flex items-center space-x-2 rounded-md border p-2 ${
                    exportFormat === "pdf" ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <RadioGroupItem
                    value="dashboard"
                    id="data-dashboard"
                    disabled={exportFormat !== "pdf"}
                  />
                  <Label
                    htmlFor="data-dashboard"
                    className="flex items-center space-x-2 font-normal"
                  >
                    <span>Complete Dashboard (PDF only)</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="summary" id="data-summary" />
                  <Label
                    htmlFor="data-summary"
                    className="flex items-center space-x-2 font-normal"
                  >
                    <span>Summary Report</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="multi-tab" id="data-multi-tab" />
                  <Label
                    htmlFor="data-multi-tab"
                    className="flex items-center space-x-2 font-normal"
                  >
                    <Layers className="h-4 w-4 text-purple-600" />
                    <span>Multiple Tabs</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem
                    value="raw"
                    id="data-raw"
                    disabled={exportFormat === "pdf"}
                  />
                  <Label
                    htmlFor="data-raw"
                    className={`flex items-center space-x-2 font-normal ${
                      exportFormat === "pdf" ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <span>Raw Survey Data (Excel/CSV only)</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem
                    value="departments"
                    id="data-departments"
                    disabled={exportFormat === "pdf"}
                  />
                  <Label
                    htmlFor="data-departments"
                    className={`flex items-center space-x-2 font-normal ${
                      exportFormat === "pdf" ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <span>Department Ratings (Excel/CSV only)</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {dataType === "multi-tab" && (
              <div className="space-y-2 border rounded-md p-3 mt-4">
                <Label className="block mb-2">Select Tabs to Export:</Label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {AVAILABLE_TABS.map((tab) => (
                    <div
                      key={tab.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`tab-${tab.id}`}
                        checked={selectedTabs.includes(tab.id)}
                        onCheckedChange={() => toggleTabSelection(tab.id)}
                      />
                      <Label htmlFor={`tab-${tab.id}`} className="font-normal">
                        {tab.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedTabs.length === 0 && (
                  <div className="text-sm text-red-500 mt-1">
                    Please select at least one tab
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            className="gap-1"
            onClick={handleExport}
            disabled={dataType === "multi-tab" && selectedTabs.length === 0}
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
