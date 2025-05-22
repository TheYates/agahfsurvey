import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Common types for export functions
export interface ExportOptions {
  includeCharts?: boolean;
  quality?: number;
  tabName?: string;
  showNulls?: boolean;
  orientation?: string;
}

/**
 * Export dashboard data to PDF
 * @param elementId - ID of the HTML element to capture
 * @param filename - Name of the file to download
 * @param options - Additional export options
 */
export const exportToPDF = async (
  elementId: string,
  filename: string,
  options?: ExportOptions
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Create a new jsPDF instance based on orientation
    const isLandscape = (options?.orientation || "landscape") === "landscape";
    const pdf = new jsPDF(options?.orientation || "landscape", "mm", "a4");
    const title = options?.tabName
      ? `AGA Health Foundation - ${options.tabName} Report`
      : "AGA Health Foundation - Survey Analysis";
    const dateRange =
      document.querySelector(".survey-date-range")?.textContent || "All time";

    // Get page dimensions - A4 = 210×297mm
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title and date information
    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, 15, {
      align: "center",
    });
    pdf.setFontSize(10);
    pdf.text(
      `Report generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      22,
      { align: "center" }
    );
    pdf.text(`Date range: ${dateRange}`, pageWidth / 2, 27, {
      align: "center",
    });

    // Special case for summary reports which are already formatted for PDF
    const isSummaryReport = elementId === "export-summary";

    if (isSummaryReport) {
      // For summary reports, directly capture the element with minimal modifications
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality for text-heavy reports
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "white",
      } as any);

      const imgData = canvas.toDataURL("image/png", options?.quality || 0.95);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate margins and content area
      const pageMargin = 10; // mm
      const titleSpace = 30; // mm, space for title and date
      const contentWidth = pageWidth - 2 * pageMargin;
      const contentHeight = pageHeight - titleSpace - 2 * pageMargin;

      // Calculate optimal ratio to fit content on page
      const ratio = Math.min(
        contentWidth / imgWidth,
        contentHeight / imgHeight
      );
      const finalWidth = Math.min(imgWidth * ratio, contentWidth);
      const finalHeight = Math.min(imgHeight * ratio, contentHeight);

      // Center the image horizontally
      const xPosition = (pageWidth - finalWidth) / 2;
      const yPosition = titleSpace;

      // Add the image to PDF
      pdf.addImage({
        imageData: imgData,
        format: "PNG",
        x: xPosition,
        y: yPosition,
        width: finalWidth,
        height: finalHeight,
      });

      // Handle multi-page content
      if (finalHeight > contentHeight) {
        let remainingHeight = imgHeight * ratio;
        let currentPosition = 0;
        let currentPage = 1;

        // Determine how much of the image has been rendered on the first page
        const firstPageImageHeight = contentHeight;
        remainingHeight -= firstPageImageHeight;
        currentPosition += firstPageImageHeight / ratio;

        // Add additional pages if needed
        while (remainingHeight > 0) {
          const pageContentHeight = Math.min(contentHeight, remainingHeight);

          pdf.addPage();
          currentPage++;

          // Add header to subsequent pages
          pdf.setFontSize(12);
          pdf.text(`${title} (continued)`, pageWidth / 2, 10, {
            align: "center",
          });

          // Calculate what portion of the image to use for this page
          const sourceY = currentPosition;
          const sourceHeight = pageContentHeight / ratio;

          // Use the slice of the image for this page
          pdf.addImage({
            imageData: imgData,
            format: "PNG",
            x: xPosition,
            y: pageMargin,
            width: finalWidth,
            height: pageContentHeight,
            alias: `page-${currentPage}`,
            compression: "NONE",
            rotation: 0,
            sx: 0, // source x
            sy: sourceY, // source y
            sWidth: canvas.width, // source width
            sHeight: sourceHeight, // source height
          });

          // Update for next page
          remainingHeight -= pageContentHeight;
          currentPosition += sourceHeight;

          // Add page number
          pdf.setFontSize(8);
          pdf.text(
            `Page ${currentPage}`,
            pageWidth - pageMargin,
            pageHeight - pageMargin,
            { align: "right" }
          );
        }

        // Add page number to first page
        pdf.setPage(1);
        pdf.setFontSize(8);
        pdf.text(
          `Page 1 of ${currentPage}`,
          pageWidth - pageMargin,
          pageHeight - pageMargin,
          { align: "right" }
        );
      }
    } else {
      // For dashboard content, use the temporary container approach
      const tempContainer = document.createElement("div");
      tempContainer.id = "pdf-export-temp-container";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.opacity = "0";

      // Set a fixed width based on orientation
      tempContainer.style.width = isLandscape ? "1200px" : "800px";
      tempContainer.style.overflow = "visible";

      // Clone the element
      const elementClone = element.cloneNode(true) as HTMLElement;
      elementClone.style.width = "100%";
      elementClone.style.boxSizing = "border-box";
      elementClone.style.margin = "0";
      elementClone.style.padding = "10px";
      elementClone.style.transform = "scale(1)";
      elementClone.style.transformOrigin = "top left";

      // Add the clone to the temp container
      tempContainer.appendChild(elementClone);
      document.body.appendChild(tempContainer);

      // Prepare and size all charts and tables
      const chartCanvases = elementClone.querySelectorAll("canvas");
      chartCanvases.forEach((canvas: HTMLCanvasElement) => {
        if (canvas.style) {
          canvas.style.maxHeight = "none";
          canvas.style.maxWidth = "100%";
          canvas.style.width = "100%";
          canvas.style.display = "block";
        }
      });

      // Adjust table layouts
      const tables = elementClone.querySelectorAll("table");
      tables.forEach((table) => {
        if (table.style) {
          table.style.width = "100%";
          table.style.maxWidth = "100%";
          table.style.tableLayout = "fixed";
        }
      });

      // Fix chart container sizes
      const chartContainers = elementClone.querySelectorAll(
        ".recharts-wrapper, .chart-container"
      );
      chartContainers.forEach((container) => {
        if (container instanceof HTMLElement && container.style) {
          container.style.width = "100%";
          container.style.maxWidth = "100%";
        }
      });

      // Use html2canvas to capture the element
      const canvas = await html2canvas(elementClone, {
        scale: isLandscape ? 1.2 : 1.5, // Higher scale for portrait orientation
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        width: parseInt(tempContainer.style.width),
      } as any);

      // Remove the temporary container
      document.body.removeChild(tempContainer);

      // Calculate dimensions to fit on page
      const imgData = canvas.toDataURL("image/png", options?.quality || 0.9);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate margins and content area
      const pageMargin = 10; // mm
      const titleSpace = 30; // mm, space for title and date
      const contentWidth = pageWidth - 2 * pageMargin;
      const contentHeight = pageHeight - titleSpace - 2 * pageMargin;

      // Calculate optimal ratio to fit content on page
      const ratio = Math.min(
        contentWidth / imgWidth,
        contentHeight / imgHeight
      );

      // Calculate dimensions of the image in the PDF
      const finalWidth = Math.min(imgWidth * ratio, contentWidth);
      const finalHeight = Math.min(imgHeight * ratio, contentHeight);

      // Calculate centered position
      const xPosition = (pageWidth - finalWidth) / 2;
      const yPosition = titleSpace;

      // Add the image to PDF
      pdf.addImage({
        imageData: imgData,
        format: "PNG",
        x: xPosition,
        y: yPosition,
        width: finalWidth,
        height: finalHeight,
      });

      // For multi-page content if needed
      if (finalHeight > contentHeight) {
        let remainingHeight = imgHeight * ratio;
        let currentPosition = 0; // In the original image
        let currentPage = 1;
        let pagePosition = titleSpace;

        // Determine how much of the image has been rendered on the first page
        const firstPageImageHeight = contentHeight;
        remainingHeight -= firstPageImageHeight;
        currentPosition += firstPageImageHeight / ratio;

        // Add additional pages if needed
        while (remainingHeight > 0) {
          const pageContentHeight = Math.min(contentHeight, remainingHeight);

          pdf.addPage();
          currentPage++;

          // Add header to subsequent pages
          pdf.setFontSize(12);
          pdf.text(`${title} (continued)`, pageWidth / 2, 10, {
            align: "center",
          });

          // Calculate what portion of the image to use for this page
          const sourceY = currentPosition;
          const sourceHeight = pageContentHeight / ratio;

          // Use the slice of the image for this page
          pdf.addImage({
            imageData: imgData,
            format: "PNG",
            x: xPosition,
            y: pageMargin,
            width: finalWidth,
            height: pageContentHeight,
            alias: `page-${currentPage}`,
            compression: "NONE",
            rotation: 0,
            sx: 0, // source x
            sy: sourceY, // source y
            sWidth: canvas.width, // source width
            sHeight: sourceHeight, // source height
          });

          // Update for next page
          remainingHeight -= pageContentHeight;
          currentPosition += sourceHeight;

          // Add page number
          pdf.setFontSize(8);
          pdf.text(
            `Page ${currentPage}`,
            pageWidth - pageMargin,
            pageHeight - pageMargin,
            { align: "right" }
          );
        }

        // Add page number to first page
        pdf.setPage(1);
        pdf.setFontSize(8);
        pdf.text(
          `Page 1 of ${currentPage}`,
          pageWidth - pageMargin,
          pageHeight - pageMargin,
          { align: "right" }
        );
      }
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw error;
  }
};

/**
 * Export data to Excel
 * @param data - Array of objects to export
 * @param filename - Name of the file to download
 * @param sheetName - Name of the worksheet
 * @param options - Additional export options
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName = "Survey Data",
  options?: ExportOptions
): void => {
  try {
    // Format data for display if needed
    const formattedData =
      options?.showNulls === false
        ? data.map((item) =>
            Object.fromEntries(
              Object.entries(item).map(([key, value]) => [
                key,
                value === null || value === undefined ? "" : value,
              ])
            )
          )
        : data;

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Apply styling to worksheet (column widths, etc.)
    const columnWidths = [];
    for (const key in formattedData[0] || {}) {
      columnWidths.push({ wch: Math.max(key.length, 20) });
    }
    ws["!cols"] = columnWidths;

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
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

/**
 * Export data to CSV
 * @param data - Array of objects to export
 * @param filename - Name of the file to download
 * @param options - Additional export options
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  options?: ExportOptions
): void => {
  try {
    // Format data for display if needed
    const formattedData =
      options?.showNulls === false
        ? data.map((item) =>
            Object.fromEntries(
              Object.entries(item).map(([key, value]) => [
                key,
                value === null || value === undefined ? "" : value,
              ])
            )
          )
        : data;

    // Convert data to CSV string
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    // Create blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw error;
  }
};

/**
 * Prepare survey data for export
 * @param surveyData - Raw survey data
 * @returns Formatted data for export
 */
export const prepareSurveyDataForExport = (surveyData: any[]): any[] => {
  return surveyData.map((survey) => ({
    "Submission ID": survey.id || survey.submissionId,
    "Date Submitted": survey.submittedAt
      ? new Date(survey.submittedAt).toLocaleDateString()
      : "Unknown",
    "Visit Purpose": survey.visitPurpose || "Not specified",
    "Patient Type": survey.patientType || "Not specified",
    "User Type": survey.userType || "Not specified",
    "Department/Location": survey.location || "Not specified",
    "Satisfaction Rating":
      survey.satisfaction ||
      (survey.ratings?.overall ? survey.ratings.overall : "Not rated"),
    "Would Recommend":
      survey.wouldRecommend === true
        ? "Yes"
        : survey.wouldRecommend === false
        ? "No"
        : "Not specified",
    "Feedback/Concerns": survey.concern || "None provided",
    Recommendations: survey.recommendation || "None provided",
  }));
};

/**
 * Format department data for export
 * @param departments - Department data
 * @returns Formatted data for export
 */
export const prepareDepartmentDataForExport = (departments: any[]): any[] => {
  return departments.map((dept) => ({
    "Department Name": dept.name,
    Type: dept.type,
    Responses: dept.visitCount,
    "Overall Satisfaction": dept.satisfaction.toFixed(2),
    "Recommendation Rate": `${dept.recommendRate.toFixed(1)}%`,
    "Reception Rating": dept.ratings?.reception?.toFixed(2) || "N/A",
    "Professionalism Rating":
      dept.ratings?.professionalism?.toFixed(2) || "N/A",
    "Understanding Rating": dept.ratings?.understanding?.toFixed(2) || "N/A",
    "Promptness of Care":
      dept.ratings?.["promptness-care"]?.toFixed(2) || "N/A",
    "Promptness of Feedback":
      dept.ratings?.["promptness-feedback"]?.toFixed(2) || "N/A",
  }));
};

/**
 * Create summary report data for export
 * @param surveyData - Dashboard data
 * @returns Formatted summary for export
 */
export const prepareSummaryDataForExport = (
  surveyData: any,
  visitPurposeData: any,
  patientTypeData: any,
  userTypeData: any
): any[] => {
  const summary = [
    {
      Metric: "Total Responses",
      Value: surveyData.totalResponses,
      Context: "Number of survey responses",
    },
    {
      Metric: "Recommendation Rate",
      Value: `${surveyData.recommendRate}%`,
      Context: "Percentage of respondents who would recommend",
    },
    {
      Metric: "Average Satisfaction",
      Value: `${surveyData.avgSatisfaction.toFixed(2)}/5.0`,
      Context: "Average satisfaction rating across all responses",
    },
  ];

  // Add visit purpose data if available
  if (visitPurposeData) {
    summary.push(
      {
        Metric: "General Practice Satisfaction",
        Value: `${visitPurposeData.generalPractice.satisfaction.toFixed(
          2
        )}/5.0`,
        Context: `Based on ${visitPurposeData.generalPractice.count} responses`,
      },
      {
        Metric: "Occupational Health Satisfaction",
        Value: `${visitPurposeData.occupationalHealth.satisfaction.toFixed(
          2
        )}/5.0`,
        Context: `Based on ${visitPurposeData.occupationalHealth.count} responses`,
      }
    );
  }

  // Add patient type data if available
  if (patientTypeData) {
    summary.push(
      {
        Metric: "New Patient Satisfaction",
        Value: `${patientTypeData.newPatients.satisfaction.toFixed(2)}/5.0`,
        Context: `Based on ${patientTypeData.newPatients.count} responses`,
      },
      {
        Metric: "Returning Patient Satisfaction",
        Value: `${patientTypeData.returningPatients.satisfaction.toFixed(
          2
        )}/5.0`,
        Context: `Based on ${patientTypeData.returningPatients.count} responses`,
      }
    );
  }

  // Add user type data if available
  if (userTypeData && userTypeData.distribution) {
    userTypeData.distribution.forEach((item: any) => {
      summary.push({
        Metric: `${item.name} Users`,
        Value: item.value,
        Context: "Number of users by type",
      });
    });
  }

  return summary;
};

// Tab-specific export formatters for different parts of the dashboard

/**
 * Prepares Overview tab data for export
 */
export const prepareOverviewDataForExport = (overviewData: any): any[] => {
  const result = [];

  // Key metrics
  result.push({
    Section: "Key Metrics",
    Metric: "Total Responses",
    Value: overviewData.surveyData.totalResponses,
  });

  result.push({
    Section: "Key Metrics",
    Metric: "Recommendation Rate",
    Value: `${overviewData.surveyData.recommendRate}%`,
  });

  result.push({
    Section: "Key Metrics",
    Metric: "Average Satisfaction",
    Value: `${overviewData.surveyData.avgSatisfaction.toFixed(1)}/5.0`,
  });

  // Visit purpose data
  if (overviewData.visitPurposeData) {
    const vpd = overviewData.visitPurposeData;

    // General Practice
    result.push({
      Section: "Visit Purpose - General Practice",
      Metric: "Response Count",
      Value: vpd.generalPractice.count,
    });

    result.push({
      Section: "Visit Purpose - General Practice",
      Metric: "Satisfaction",
      Value: `${vpd.generalPractice.satisfaction.toFixed(1)}/5.0`,
    });

    result.push({
      Section: "Visit Purpose - General Practice",
      Metric: "Recommendation Rate",
      Value: `${vpd.generalPractice.recommendRate.toFixed(1)}%`,
    });

    // Occupational Health
    result.push({
      Section: "Visit Purpose - Occupational Health",
      Metric: "Response Count",
      Value: vpd.occupationalHealth.count,
    });

    result.push({
      Section: "Visit Purpose - Occupational Health",
      Metric: "Satisfaction",
      Value: `${vpd.occupationalHealth.satisfaction.toFixed(1)}/5.0`,
    });

    result.push({
      Section: "Visit Purpose - Occupational Health",
      Metric: "Recommendation Rate",
      Value: `${vpd.occupationalHealth.recommendRate.toFixed(1)}%`,
    });
  }

  // Patient type data
  if (overviewData.patientTypeData) {
    const ptd = overviewData.patientTypeData;

    // New patients
    result.push({
      Section: "Patient Type - New Patients",
      Metric: "Response Count",
      Value: ptd.newPatients.count,
    });

    result.push({
      Section: "Patient Type - New Patients",
      Metric: "Satisfaction",
      Value: `${ptd.newPatients.satisfaction.toFixed(1)}/5.0`,
    });

    result.push({
      Section: "Patient Type - New Patients",
      Metric: "Recommendation Rate",
      Value: `${ptd.newPatients.recommendRate.toFixed(1)}%`,
    });

    // Returning patients
    result.push({
      Section: "Patient Type - Returning Patients",
      Metric: "Response Count",
      Value: ptd.returningPatients.count,
    });

    result.push({
      Section: "Patient Type - Returning Patients",
      Metric: "Satisfaction",
      Value: `${ptd.returningPatients.satisfaction.toFixed(1)}/5.0`,
    });

    result.push({
      Section: "Patient Type - Returning Patients",
      Metric: "Recommendation Rate",
      Value: `${ptd.returningPatients.recommendRate.toFixed(1)}%`,
    });
  }

  return result;
};

/**
 * Prepare wards data for export
 */
export const prepareWardsDataForExport = (wards: any[]): any[] => {
  return wards.map((ward, index) => ({
    Rank: index + 1,
    "Ward Name": ward.name,
    "Response Count": ward.visitCount,
    "Overall Satisfaction": ward.satisfaction.toFixed(2),
    "Recommendation Rate": `${ward.recommendRate.toFixed(1)}%`,
    "Reception Rating": ward.ratings?.reception?.toFixed(2) || "N/A",
    "Professionalism Rating":
      ward.ratings?.professionalism?.toFixed(2) || "N/A",
    "Understanding Rating": ward.ratings?.understanding?.toFixed(2) || "N/A",
    "Promptness of Care":
      ward.ratings?.["promptness-care"]?.toFixed(2) || "N/A",
    "Promptness of Feedback":
      ward.ratings?.["promptness-feedback"]?.toFixed(2) || "N/A",
  }));
};

/**
 * Prepare canteen data for export
 */
export const prepareCanteenDataForExport = (canteenData: any): any[] => {
  const result = [];

  // Key metrics
  result.push({
    Section: "Key Metrics",
    Metric: "Total Responses",
    Value: canteenData.visitCount,
  });

  result.push({
    Section: "Key Metrics",
    Metric: "Overall Satisfaction",
    Value: `${canteenData.satisfaction.toFixed(1)}/5.0`,
  });

  result.push({
    Section: "Key Metrics",
    Metric: "Recommendation Rate",
    Value: `${canteenData.recommendRate.toFixed(1)}%`,
  });

  // Detailed ratings
  if (canteenData.ratings) {
    Object.entries(canteenData.ratings).forEach(([key, value]) => {
      const formattedKey = key
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      result.push({
        Section: "Detailed Ratings",
        Metric: formattedKey,
        Value: `${(value as number).toFixed(1)}/5.0`,
      });
    });
  }

  return result;
};

/**
 * Prepare medicals (occupational health) data for export
 */
export const prepareMedicalsDataForExport = (medicalsData: any): any[] => {
  const result = [];

  // Key metrics
  result.push({
    Section: "Key Metrics",
    Metric: "Total Responses",
    Value: medicalsData.visitCount,
  });

  result.push({
    Section: "Key Metrics",
    Metric: "Overall Satisfaction",
    Value: `${medicalsData.satisfaction.toFixed(1)}/5.0`,
  });

  // Detailed ratings
  if (medicalsData.ratings) {
    Object.entries(medicalsData.ratings).forEach(([key, value]) => {
      const formattedKey = key
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      result.push({
        Section: "Detailed Ratings",
        Metric: formattedKey,
        Value: `${(value as number).toFixed(1)}/5.0`,
      });
    });
  }

  // User type distribution
  if (medicalsData.userTypeDistribution) {
    medicalsData.userTypeDistribution.forEach((item: any) => {
      result.push({
        Section: "User Type Distribution",
        Metric: item.name,
        Value: item.value,
      });
    });
  }

  return result;
};

/**
 * Prepare feedback data for export
 */
export const prepareFeedbackDataForExport = (feedbackData: any[]): any[] => {
  return feedbackData.map((item) => ({
    Date: item.submittedAt
      ? new Date(item.submittedAt).toLocaleDateString()
      : "Unknown",
    "User Type": item.userType || "Not specified",
    "Visit Purpose": item.visitPurpose || "Not specified",
    Location: item.locationName || "Not specified",
    "Feedback Type": item.type || "Feedback",
    Content: item.text || item.concern || item.recommendation || "",
  }));
};

/**
 * Create a consistent filename with date and other metadata
 */
export const getExportFilename = (
  tabName: string,
  dataType: string,
  dateRange: string
): string => {
  const timestamp = new Date().toISOString().split("T")[0];
  return `AGA_Health_${tabName}_${dataType}_${dateRange.replace(
    /\s+/g,
    "_"
  )}_${timestamp}`;
};
