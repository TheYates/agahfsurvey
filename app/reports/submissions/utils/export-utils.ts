import type React from "react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

interface Submission {
  id: string;
  submittedAt: string;
  visitPurpose: string;
  patientType: string;
  userType: string;
  visitTime: string;
  locations: string[];
  wouldRecommend: boolean;
  hasConcerns: boolean;
  overallSatisfaction: string;
  departmentRatings?: Record<string, Record<string, string>>;
  departmentConcerns?: Record<string, string>;
  generalObservation?: Record<string, string>;
  recommendation?: string;
  whyNotRecommend?: string;
}

// Excel Export
export const exportToExcel = (submissions: Submission[], filename: string) => {
  // Create main submissions sheet
  const mainData = submissions.map((submission) => ({
    "Submission ID": submission.id,
    "Date Submitted": format(
      new Date(submission.submittedAt),
      "yyyy-MM-dd HH:mm:ss"
    ),
    "Visit Purpose": submission.visitPurpose,
    "Patient Type": submission.patientType,
    "User Type": submission.userType,
    "Visit Time": submission.visitTime,
    "Locations Visited": submission.locations.join(", "),
    "Would Recommend": submission.wouldRecommend ? "Yes" : "No",
    "Has Concerns": submission.hasConcerns ? "Yes" : "No",
    "Overall Satisfaction": submission.overallSatisfaction,
    "General Cleanliness": submission.generalObservation?.cleanliness || "",
    "General Facilities": submission.generalObservation?.facilities || "",
    "General Security": submission.generalObservation?.security || "",
    "General Overall": submission.generalObservation?.overall || "",
    Recommendation: submission.recommendation || "",
    "Why Not Recommend": submission.whyNotRecommend || "",
  }));

  // Create detailed ratings sheet
  const ratingsData: any[] = [];
  submissions.forEach((submission) => {
    if (submission.departmentRatings) {
      Object.entries(submission.departmentRatings).forEach(
        ([location, ratings]) => {
          Object.entries(ratings).forEach(([category, rating]) => {
            ratingsData.push({
              "Submission ID": submission.id,
              Location: location,
              Category: category,
              Rating: rating,
              Concerns: submission.departmentConcerns?.[location] || "",
            });
          });
        }
      );
    }
  });

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add main submissions sheet
  const ws1 = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(wb, ws1, "Submissions");

  // Add detailed ratings sheet
  if (ratingsData.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(ratingsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Detailed Ratings");
  }

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Simple CSV Export (works in all browsers)
export const exportToCSV = (submissions: Submission[], filename: string) => {
  // Create headers
  const headers = [
    "Submission ID",
    "Date Submitted",
    "Visit Purpose",
    "Patient Type",
    "User Type",
    "Visit Time",
    "Locations Visited",
    "Would Recommend",
    "Has Concerns",
    "Overall Satisfaction",
    "General Cleanliness",
    "General Facilities",
    "General Security",
    "General Overall",
    "Recommendation",
    "Why Not Recommend",
  ];

  // Create data rows
  const csvData = submissions.map((submission) => [
    submission.id,
    format(new Date(submission.submittedAt), "yyyy-MM-dd HH:mm:ss"),
    submission.visitPurpose,
    submission.patientType,
    submission.userType,
    submission.visitTime,
    submission.locations.join("; "),
    submission.wouldRecommend ? "Yes" : "No",
    submission.hasConcerns ? "Yes" : "No",
    submission.overallSatisfaction,
    submission.generalObservation?.cleanliness || "",
    submission.generalObservation?.facilities || "",
    submission.generalObservation?.security || "",
    submission.generalObservation?.overall || "",
    submission.recommendation || "",
    submission.whyNotRecommend || "",
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvData]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Simple JSON Export (works in all browsers)
export const exportToJSON = (submissions: Submission[], filename: string) => {
  const jsonContent = JSON.stringify(submissions, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Simple HTML Export (works in all browsers)
export const exportToHTML = (submissions: Submission[], filename: string) => {
  // Create HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Survey Submissions Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1, h2 { color: #333; }
        .submission { margin-bottom: 40px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
        .label { font-weight: bold; }
        .rating-table { margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Survey Submissions Export</h1>
      <p>Generated on: ${format(new Date(), "PPP 'at' p")}</p>
      <p>Total Submissions: ${submissions.length}</p>
  `;

  // Add each submission
  submissions.forEach((submission) => {
    htmlContent += `
      <div class="submission">
        <h2>Submission: ${submission.id}</h2>
        <p><span class="label">Date Submitted:</span> ${format(
          new Date(submission.submittedAt),
          "PPP 'at' p"
        )}</p>
        <p><span class="label">Visit Purpose:</span> ${
          submission.visitPurpose
        }</p>
        <p><span class="label">Patient Type:</span> ${
          submission.patientType
        }</p>
        <p><span class="label">User Type:</span> ${submission.userType}</p>
        <p><span class="label">Visit Time:</span> ${submission.visitTime}</p>
        <p><span class="label">Locations Visited:</span> ${submission.locations.join(
          ", "
        )}</p>
        <p><span class="label">Would Recommend:</span> ${
          submission.wouldRecommend ? "Yes" : "No"
        }</p>
        <p><span class="label">Overall Satisfaction:</span> ${
          submission.overallSatisfaction
        }</p>
        
        <h3>General Observations</h3>
        <table class="rating-table">
          <tr>
            <th>Category</th>
            <th>Rating</th>
          </tr>
          ${
            submission.generalObservation
              ? Object.entries(submission.generalObservation)
                  .map(
                    ([category, rating]) =>
                      `<tr><td>${category}</td><td>${rating}</td></tr>`
                  )
                  .join("")
              : "<tr><td colspan='2'>No general observations</td></tr>"
          }
        </table>
        
        ${
          submission.departmentRatings
            ? `<h3>Department Ratings</h3>
          ${Object.entries(submission.departmentRatings)
            .map(
              ([location, ratings]) => `
            <h4>${location}</h4>
            <table class="rating-table">
              <tr>
                <th>Category</th>
                <th>Rating</th>
              </tr>
              ${Object.entries(ratings)
                .map(
                  ([category, rating]) =>
                    `<tr><td>${category}</td><td>${rating}</td></tr>`
                )
                .join("")}
            </table>
            ${
              submission.departmentConcerns?.[location]
                ? `<p><span class="label">Concerns:</span> ${submission.departmentConcerns[location]}</p>`
                : ""
            }
          `
            )
            .join("")}`
            : ""
        }
        
        ${
          submission.recommendation
            ? `<p><span class="label">Recommendation:</span> ${submission.recommendation}</p>`
            : ""
        }
        
        ${
          submission.whyNotRecommend
            ? `<p><span class="label">Why Not Recommend:</span> ${submission.whyNotRecommend}</p>`
            : ""
        }
      </div>
    `;
  });

  htmlContent += `
    </body>
    </html>
  `;

  // Create and download the file
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Enhanced Print submission with better styling
export const printSubmission = (
  contentRef: React.RefObject<HTMLDivElement>
) => {
  if (!contentRef.current) return;

  // Create a new window
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the submission");
    return;
  }

  // Get the HTML content
  const content = contentRef.current.innerHTML;

  // Write to the new window with enhanced styling
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Submission Details</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px;
          line-height: 1.4;
        }
        
        /* Ensure form elements are visible */
        input[type="radio"], input[type="checkbox"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #333;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          margin-right: 8px;
          vertical-align: middle;
        }
        
        input[type="checkbox"] {
          border-radius: 3px;
        }
        
        input[type="radio"]:checked::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #333;
          position: absolute;
          top: 2px;
          left: 2px;
        }
        
        input[type="checkbox"]:checked::after {
          content: '✓';
          font-size: 12px;
          font-weight: bold;
          color: #333;
          position: absolute;
          top: -2px;
          left: 2px;
        }
        
        /* Table styling */
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        
        /* Card styling */
        .bg-card, .border {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          background-color: #fafafa;
        }
        
        /* Button styling for print */
        button {
          display: none !important;
        }
        
        /* Separator styling */
        hr {
          border: none;
          border-top: 2px solid #e5e5e5;
          margin: 24px 0;
        }
        
        /* Typography */
        h1, h2, h3 {
          color: #333;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 16px; }
        
        /* Form labels */
        label {
          font-weight: 500;
          margin-bottom: 4px;
          display: inline-block;
        }
        
        /* Rating indicators */
        .rating-selected {
          background-color: #e8f5e8;
          border: 2px solid #4caf50;
          border-radius: 4px;
          padding: 4px 8px;
          font-weight: bold;
        }
        
        /* Ensure all content is visible */
        .pointer-events-none {
          pointer-events: auto;
        }
        
        /* Page breaks */
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div>${content}</div>
      <script>
        // Wait for content to load, then print
        window.onload = function() { 
          // Small delay to ensure styles are applied
          setTimeout(function() {
            window.print(); 
          }, 500);
        }
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
};

// Enhanced PDF export with better visual capture
export const exportSubmissionToPDF = async (
  submissionElement: HTMLElement,
  filename: string
) => {
  try {
    // Configure html2canvas for better quality
    const canvas = await html2canvas(submissionElement, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: submissionElement.scrollWidth,
      height: submissionElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: submissionElement.scrollWidth,
      windowHeight: submissionElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10; // 10mm top margin

    // Add first page
    pdf.addImage(
      imgData,
      "PNG",
      10,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );
    heightLeft -= pdfHeight - 20; // Account for margins

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10; // 10mm top margin
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        10,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pdfHeight - 20;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("PDF export failed. Please try the print option instead.");
  }
};
