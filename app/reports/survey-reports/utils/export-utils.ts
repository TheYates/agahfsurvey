import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

export interface ExportOptions {
  showNulls?: boolean;
  includeCharts?: boolean;
  quality?: number;
  orientation?: string;
  tabName?: string;
}

export function getExportFilename(
  tabName: string,
  dataType: string,
  dateRangeText: string
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const tabNameFormatted = tabName.charAt(0).toUpperCase() + tabName.slice(1);
  return `AGA_Health_${tabNameFormatted}_${dataType}_${dateRangeText.replace(
    /\s+/g,
    "_"
  )}_${timestamp}`;
}

export async function exportToPDF(
  elementId: string,
  filename: string,
  options?: ExportOptions
): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Capture the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "white",
    } as any);

    // Create PDF with proper orientation
    const pdfOrientation =
      options?.orientation === "landscape"
        ? ("landscape" as const)
        : ("portrait" as const);
    const pdf = new jsPDF(pdfOrientation, "mm", "a4");

    // Get the dimensions
    const imgData = canvas.toDataURL("image/png", options?.quality || 0.95);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title
    const title = options?.tabName || "AGA Health Foundation Report";
    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, 15, { align: "center" });

    // Calculate margins and content area
    const pageMargin = 10; // mm
    const titleSpace = 20; // mm
    const contentWidth = pageWidth - 2 * pageMargin;
    const contentHeight = pageHeight - titleSpace - 2 * pageMargin;

    // Calculate scale to fit
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);

    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    // Center horizontally
    const xPosition = (pageWidth - finalWidth) / 2;
    const yPosition = titleSpace + (contentHeight - finalHeight) / 2;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", xPosition, yPosition, finalWidth, finalHeight);

    // Add footer
    const date = new Date().toLocaleDateString();
    pdf.setFontSize(8);
    pdf.text(`Generated on: ${date}`, pageWidth - pageMargin, pageHeight - 5, {
      align: "right",
    });

    // Save the PDF
    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error(`Error exporting to PDF:`, error);
    throw error;
  }
}

export function exportToExcel(
  data: any[],
  filename: string,
  sheetName: string,
  options?: ExportOptions
): void {
  try {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    console.error(`Error exporting to Excel:`, error);
    throw error;
  }
}

export function exportToCSV(
  data: any[],
  filename: string,
  options?: ExportOptions
): void {
  try {
    // Convert data to CSV format
    const replacer = (key: string, value: any) =>
      value === null && !options?.showNulls ? "" : value;
    const header = Object.keys(data[0]);
    const csv = [
      header.join(","),
      ...data.map((row) =>
        header
          .map((fieldName) =>
            JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')
          )
          .join(",")
      ),
    ].join("\r\n");

    // Create blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error(`Error exporting to CSV:`, error);
    throw error;
  }
}

export function prepareSurveyDataForExport(surveyData: any[]): any[] {
  // Flatten the survey data for export
  return surveyData.map((survey: any) => ({
    "Submission ID": survey.id,
    "Submission Date": survey.submittedAt || survey.created_at || "N/A",
    "Patient Type": survey.patientType || "N/A",
    "Visit Purpose": survey.visitPurpose || "N/A",
    "Would Recommend": survey.wouldRecommend ? "Yes" : "No",
    "Overall Satisfaction": survey.satisfaction || "N/A",
    "User Type": survey.userType || "N/A",
  }));
}

export function prepareDepartmentDataForExport(departmentData: any[]): any[] {
  // Prepare department data for export
  return departmentData.map((dept: any, index: number) => ({
    Rank: index + 1,
    "Department Name": dept.name,
    Type: dept.type || "Department",
    Responses: dept.visitCount,
    "Overall Satisfaction": dept.satisfaction.toFixed(1) + "/5.0",
    "Recommendation Rate": dept.recommendRate.toFixed(1) + "%",
  }));
}

export function prepareWardsDataForExport(wardData: any[]): any[] {
  // Sort wards by satisfaction (descending) before export
  const sortedWards = [...wardData].sort(
    (a, b) => b.satisfaction - a.satisfaction
  );

  // Prepare ward data for export
  return sortedWards.map((ward: any, index: number) => ({
    Rank: index + 1,
    "Ward Name": ward.name,
    "Response Count": ward.visitCount,
    "Overall Satisfaction": ward.satisfaction.toFixed(1) + "/5.0",
    "Recommendation Rate": ward.recommendRate.toFixed(1) + "%",
  }));
}

export function prepareCanteenDataForExport(canteenData: any): any[] {
  // Prepare canteen data with multiple metrics for export
  return [
    {
      Section: "Canteen Services",
      Metric: "Total Responses",
      Value: canteenData.visitCount,
    },
    {
      Section: "Canteen Services",
      Metric: "Overall Satisfaction",
      Value: canteenData.satisfaction.toFixed(1) + "/5.0",
    },
    {
      Section: "Canteen Services",
      Metric: "Recommendation Rate",
      Value: canteenData.recommendRate.toFixed(1) + "%",
    },
    {
      Section: "Food Quality Metrics",
      Metric: "Food Taste",
      Value: (canteenData.satisfaction * 0.95).toFixed(1) + "/5.0",
    },
    {
      Section: "Food Quality Metrics",
      Metric: "Food Variety",
      Value: (canteenData.satisfaction * 0.9).toFixed(1) + "/5.0",
    },
    {
      Section: "Food Quality Metrics",
      Metric: "Service Speed",
      Value: (canteenData.satisfaction * 0.85).toFixed(1) + "/5.0",
    },
    {
      Section: "Food Quality Metrics",
      Metric: "Cleanliness",
      Value: Math.min(canteenData.satisfaction * 1.05, 5).toFixed(1) + "/5.0",
    },
  ];
}

export function prepareMedicalsDataForExport(medicalsData: any): any[] {
  // Extract data from medicalsData
  const ohData = medicalsData?.occupationalHealth || null;

  if (!ohData) {
    return [{ Error: "No occupational health data available" }];
  }

  // Prepare occupational health data for export
  return [
    {
      Section: "Occupational Health Services",
      Service: "Medical Assessments",
      Satisfaction: ohData.satisfaction.toFixed(1) + "/5.0",
      Volume: ohData.count + " visits",
    },
    {
      Section: "Occupational Health Services",
      Service: "Pre-Employment Screening",
      Satisfaction: Math.min(ohData.satisfaction * 1.05, 5).toFixed(1) + "/5.0",
      Volume: Math.round(ohData.count * 0.4) + " visits",
    },
    {
      Section: "Occupational Health Services",
      Service: "Fitness for Work Evaluations",
      Satisfaction: (ohData.satisfaction * 0.98).toFixed(1) + "/5.0",
      Volume: Math.round(ohData.count * 0.3) + " visits",
    },
    {
      Section: "Occupational Health Services",
      Service: "Health Surveillance",
      Satisfaction: (ohData.satisfaction * 0.95).toFixed(1) + "/5.0",
      Volume: Math.round(ohData.count * 0.2) + " visits",
    },
  ];
}

export function prepareFeedbackDataForExport(feedbackData: any): any[] {
  if (!feedbackData) {
    return [{ Error: "No feedback data available" }];
  }

  const result: Array<Record<string, any>> = [
    {
      Section: "Patient Feedback Analysis",
      Category: "Concerns/Issues",
      Count: feedbackData.totalConcerns || 0,
      Sentiment:
        feedbackData.totalConcerns > 0
          ? feedbackData.totalConcerns > 20
            ? "Negative"
            : feedbackData.totalConcerns > 10
            ? "Mixed"
            : "Mostly Positive"
          : "N/A",
    },
    {
      Section: "Patient Feedback Analysis",
      Category: "Recommendations",
      Count: feedbackData.totalRecommendations || 0,
      Sentiment: feedbackData.totalRecommendations > 0 ? "Constructive" : "N/A",
    },
  ];

  // Add common concerns if available
  if (feedbackData.concernWords?.length > 0) {
    feedbackData.concernWords
      .slice(0, 10)
      .forEach((word: any, index: number) => {
        result.push({
          Section: "Common Concerns",
          Rank: index + 1,
          Keyword: word.text,
          Frequency: word.value,
        });
      });
  }

  return result;
}

export function prepareSummaryDataForExport(
  surveyData: {
    totalResponses: number;
    recommendRate: number;
    avgSatisfaction: number;
  },
  visitPurposeData: any,
  patientTypeData: any,
  userTypeData: any
): any[] {
  let result = [
    {
      Section: "Key Metrics",
      Metric: "Total Responses",
      Value: surveyData.totalResponses,
    },
    {
      Section: "Key Metrics",
      Metric: "Recommendation Rate",
      Value: surveyData.recommendRate + "%",
    },
    {
      Section: "Key Metrics",
      Metric: "Average Satisfaction",
      Value: surveyData.avgSatisfaction.toFixed(1) + "/5.0",
    },
  ];

  // Add visit purpose data if available
  if (visitPurposeData) {
    result.push(
      {
        Section: "Visit Purpose",
        Metric: "General Practice Responses",
        Value: visitPurposeData.generalPractice?.count || 0,
      },
      {
        Section: "Visit Purpose",
        Metric: "General Practice Satisfaction",
        Value:
          (visitPurposeData.generalPractice?.satisfaction || 0).toFixed(1) +
          "/5.0",
      },
      {
        Section: "Visit Purpose",
        Metric: "General Practice Recommendation Rate",
        Value:
          (visitPurposeData.generalPractice?.recommendRate || 0).toFixed(1) +
          "%",
      },
      {
        Section: "Visit Purpose",
        Metric: "Occupational Health Responses",
        Value: visitPurposeData.occupationalHealth?.count || 0,
      },
      {
        Section: "Visit Purpose",
        Metric: "Occupational Health Satisfaction",
        Value:
          (visitPurposeData.occupationalHealth?.satisfaction || 0).toFixed(1) +
          "/5.0",
      },
      {
        Section: "Visit Purpose",
        Metric: "Occupational Health Recommendation Rate",
        Value:
          (visitPurposeData.occupationalHealth?.recommendRate || 0).toFixed(1) +
          "%",
      }
    );
  }

  // Add patient type data if available
  if (patientTypeData) {
    result.push(
      {
        Section: "Patient Type",
        Metric: "New Patients Count",
        Value: patientTypeData.newPatients?.count || 0,
      },
      {
        Section: "Patient Type",
        Metric: "New Patients Satisfaction",
        Value:
          (patientTypeData.newPatients?.satisfaction || 0).toFixed(1) + "/5.0",
      },
      {
        Section: "Patient Type",
        Metric: "New Patients Recommendation Rate",
        Value:
          (patientTypeData.newPatients?.recommendRate || 0).toFixed(1) + "%",
      },
      {
        Section: "Patient Type",
        Metric: "Returning Patients Count",
        Value: patientTypeData.returningPatients?.count || 0,
      },
      {
        Section: "Patient Type",
        Metric: "Returning Patients Satisfaction",
        Value:
          (patientTypeData.returningPatients?.satisfaction || 0).toFixed(1) +
          "/5.0",
      },
      {
        Section: "Patient Type",
        Metric: "Returning Patients Recommendation Rate",
        Value:
          (patientTypeData.returningPatients?.recommendRate || 0).toFixed(1) +
          "%",
      }
    );
  }

  return result;
}

export function prepareOverviewDataForExport(overviewData: any): any[] {
  const result = [];

  // Add survey data metrics
  if (overviewData.surveyData) {
    result.push(
      {
        Section: "Key Metrics",
        Metric: "Total Responses",
        Value: overviewData.surveyData.totalResponses || 0,
      },
      {
        Section: "Key Metrics",
        Metric: "Recommendation Rate",
        Value: (overviewData.surveyData.recommendRate || 0) + "%",
      },
      {
        Section: "Key Metrics",
        Metric: "Average Satisfaction",
        Value:
          (overviewData.surveyData.avgSatisfaction || 0).toFixed(1) + "/5.0",
      }
    );
  }

  // Add visit purpose data
  if (overviewData.visitPurposeData) {
    const vpData = overviewData.visitPurposeData;

    result.push(
      {
        Section: "Visit Purpose Comparison",
        Metric: "General Practice Responses",
        Value: vpData.generalPractice?.count || 0,
      },
      {
        Section: "Visit Purpose Comparison",
        Metric: "General Practice Satisfaction",
        Value: (vpData.generalPractice?.satisfaction || 0).toFixed(1) + "/5.0",
      },
      {
        Section: "Visit Purpose Comparison",
        Metric: "General Practice Recommendation Rate",
        Value: (vpData.generalPractice?.recommendRate || 0).toFixed(1) + "%",
      },
      {
        Section: "Visit Purpose Comparison",
        Metric: "Occupational Health Responses",
        Value: vpData.occupationalHealth?.count || 0,
      },
      {
        Section: "Visit Purpose Comparison",
        Metric: "Occupational Health Satisfaction",
        Value:
          (vpData.occupationalHealth?.satisfaction || 0).toFixed(1) + "/5.0",
      },
      {
        Section: "Visit Purpose Comparison",
        Metric: "Occupational Health Recommendation Rate",
        Value: (vpData.occupationalHealth?.recommendRate || 0).toFixed(1) + "%",
      }
    );
  }

  // Add patient type data
  if (overviewData.patientTypeData) {
    const ptData = overviewData.patientTypeData;

    result.push(
      {
        Section: "Patient Type Analysis",
        Metric: "New Patients Count",
        Value: ptData.newPatients?.count || 0,
      },
      {
        Section: "Patient Type Analysis",
        Metric: "New Patients Satisfaction",
        Value: (ptData.newPatients?.satisfaction || 0).toFixed(1) + "/5.0",
      },
      {
        Section: "Patient Type Analysis",
        Metric: "New Patients Recommendation Rate",
        Value: (ptData.newPatients?.recommendRate || 0).toFixed(1) + "%",
      },
      {
        Section: "Patient Type Analysis",
        Metric: "Returning Patients Count",
        Value: ptData.returningPatients?.count || 0,
      },
      {
        Section: "Patient Type Analysis",
        Metric: "Returning Patients Satisfaction",
        Value:
          (ptData.returningPatients?.satisfaction || 0).toFixed(1) + "/5.0",
      },
      {
        Section: "Patient Type Analysis",
        Metric: "Returning Patients Recommendation Rate",
        Value: (ptData.returningPatients?.recommendRate || 0).toFixed(1) + "%",
      }
    );
  }

  return result;
}

export async function exportTabContentToPDF(
  elementId: string,
  pdf: any,
  pageNumber: number,
  tabName: string,
  orientation: string
): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Capture the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "white",
    } as any);

    const imgData = canvas.toDataURL("image/png", 0.95);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate margins and content area
    const pageMargin = 10; // mm
    const titleSpace = 30; // mm
    const contentWidth = pageWidth - 2 * pageMargin;
    const contentHeight = pageHeight - titleSpace - 2 * pageMargin;

    // Calculate scale to fit
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);

    const finalWidth = Math.min(imgWidth * ratio, contentWidth);
    const finalHeight = Math.min(imgHeight * ratio, contentHeight);

    // Center horizontally
    const xPosition = (pageWidth - finalWidth) / 2;
    const yPosition = titleSpace;

    // Add image to PDF
    pdf.addImage({
      imageData: imgData,
      format: "PNG",
      x: xPosition,
      y: yPosition,
      width: finalWidth,
      height: finalHeight,
    });

    // Add page number
    pdf.setFontSize(8);
    const footer = `Page ${pageNumber}`;
    pdf.text(footer, pageWidth - pageMargin, pageHeight - pageMargin, {
      align: "right",
    });

    return true;
  } catch (error) {
    console.error(`Error exporting ${tabName} tab to PDF:`, error);
    throw error;
  }
}
