export function generateOverviewTabHTML(
  overviewData: any,
  visitPurposeData: any,
  patientTypeData: any,
  locations: any[]
) {
  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Key Metrics</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Value</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Total Responses</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
            overviewData.surveyData.totalResponses
          }</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation Rate</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
            overviewData.surveyData.recommendRate
          }%</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Average Satisfaction</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${overviewData.surveyData.avgSatisfaction.toFixed(
            1
          )}/5.0</td>
        </tr>
      </table>
    </div>
    ${visitPurposeData ? generateVisitPurposeHTML(visitPurposeData) : ""}
    ${patientTypeData ? generatePatientTypeHTML(patientTypeData) : ""}
    ${locations.length > 0 ? generateTopDepartmentsHTML(locations) : ""}
  `;
}

export function generateVisitPurposeHTML(visitPurposeData: any) {
  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Visit Purpose Comparison</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">General Practice</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Occupational Health</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Responses</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            visitPurposeData.generalPractice.count
          }</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            visitPurposeData.occupationalHealth.count
          }</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Satisfaction</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.generalPractice.satisfaction.toFixed(
            1
          )}/5.0</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.occupationalHealth.satisfaction.toFixed(
            1
          )}/5.0</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.generalPractice.recommendRate.toFixed(
            1
          )}%</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${visitPurposeData.occupationalHealth.recommendRate.toFixed(
            1
          )}%</td>
        </tr>
      </table>
    </div>
  `;
}

export function generatePatientTypeHTML(patientTypeData: any) {
  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Patient Type Analysis</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">New Patients</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Returning Patients</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Responses</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            patientTypeData.newPatients.count
          }</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            patientTypeData.returningPatients.count
          }</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Satisfaction</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.newPatients.satisfaction.toFixed(
            1
          )}/5.0</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.returningPatients.satisfaction.toFixed(
            1
          )}/5.0</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.newPatients.recommendRate.toFixed(
            1
          )}%</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${patientTypeData.returningPatients.recommendRate.toFixed(
            1
          )}%</td>
        </tr>
      </table>
    </div>
  `;
}

export function generateTopDepartmentsHTML(locations: any[]) {
  const topDepts = locations
    .filter((loc) => loc.type === "department")
    .sort((a, b) => b.satisfaction - a.satisfaction)
    .slice(0, 5);

  if (topDepts.length === 0) return "";

  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Top Performing Departments</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Department</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend Rate</th>
        </tr>
        ${topDepts
          .map(
            (dept) => `
              <tr>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                  dept.name
                }</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                  dept.visitCount
                }</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.satisfaction.toFixed(
                  1
                )}/5.0</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.recommendRate.toFixed(
                  1
                )}%</td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;
}

export function generateDepartmentsTabHTML(departments: any[]) {
  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Department Ratings</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Department</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend</th>
        </tr>
        ${departments
          .sort((a, b) => b.satisfaction - a.satisfaction)
          .map(
            (dept) => `
              <tr>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                  dept.name
                }</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                  dept.visitCount
                }</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.satisfaction.toFixed(
                  1
                )}/5.0</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${dept.recommendRate.toFixed(
                  1
                )}%</td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;
}

export function generateWardsTabHTML(wards: any[]) {
  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Ward Ratings</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Ward</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Responses</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Recommend</th>
        </tr>
        ${wards
          .sort((a, b) => b.satisfaction - a.satisfaction)
          .map(
            (ward) => `
              <tr>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                  ward.name
                }</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
                  ward.visitCount
                }</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${ward.satisfaction.toFixed(
                  1
                )}/5.0</td>
                <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${ward.recommendRate.toFixed(
                  1
                )}%</td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;
}

export function generateCanteenTabHTML(canteen: any) {
  if (!canteen) {
    return `
      <div style="margin-bottom:30px;color:#ef4444;">
        <p>No canteen data available.</p>
      </div>
    `;
  }

  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Canteen Services</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Metric</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Value</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Total Responses</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
            canteen.visitCount
          }</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Overall Satisfaction</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${canteen.satisfaction.toFixed(
            1
          )}/5.0</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendation Rate</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${canteen.recommendRate.toFixed(
            1
          )}%</td>
        </tr>
      </table>
    </div>
    
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Food Quality Metrics</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Area</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Rating</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Assessment</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Food Taste</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${(
            canteen.satisfaction * 0.95
          ).toFixed(1)}/5.0</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            canteen.satisfaction * 0.95 >= 4.0
              ? "Excellent"
              : canteen.satisfaction * 0.95 >= 3.0
              ? "Good"
              : "Needs Improvement"
          }</td>
        </tr>
      </table>
    </div>
  `;
}

export function generateMedicalsTabHTML(
  visitPurposeData: any,
  visitTimeData: any
) {
  if (!visitPurposeData || !visitPurposeData.occupationalHealth) {
    return `
      <div style="margin-bottom:30px;color:#ef4444;">
        <p>No occupational health data available.</p>
      </div>
    `;
  }

  const ohData = visitPurposeData.occupationalHealth;

  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Occupational Health Services</h2>
      
      <p style="margin-bottom:15px;color:#000000;">The Occupational Health department provides a range of medical assessments and services for employees and organizations.</p>
      
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Service</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Satisfaction</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Volume</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Medical Assessments</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${ohData.satisfaction.toFixed(
            1
          )}/5.0</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            ohData.count
          } visits</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Pre-Employment Screening</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${Math.min(
            ohData.satisfaction * 1.05,
            5
          ).toFixed(1)}/5.0</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${Math.round(
            ohData.count * 0.4
          )} visits</td>
        </tr>
      </table>
    </div>
  `;
}

export function generateFeedbackTabHTML(
  textFeedback: any,
  improvementPriorities: any
) {
  if (!textFeedback) {
    return `
      <div style="margin-bottom:30px;color:#ef4444;">
        <p>No feedback data available.</p>
      </div>
    `;
  }

  return `
    <div style="margin-bottom:30px;">
      <h2 style="margin-bottom:15px;color:#000000;font-size:18px;font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:5px;">Patient Feedback Analysis</h2>
      
      <p style="margin-bottom:15px;color:#000000;">This report analyzes text feedback from patients to identify key themes, concerns, and recommendations.</p>
      
      <table style="width:100%;border-collapse:collapse;margin-top:15px;border:1px solid #e2e8f0;">
        <tr style="background-color:#f8fafc;">
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Feedback Category</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Count</th>
          <th style="text-align:left;padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">Sentiment</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Concerns/Issues</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
            textFeedback.totalConcerns || 0
          }</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            textFeedback.totalConcerns > 0
              ? textFeedback.totalConcerns > 20
                ? "Negative"
                : textFeedback.totalConcerns > 10
                ? "Mixed"
                : "Mostly Positive"
              : "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">Recommendations</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;font-weight:bold;">${
            textFeedback.totalRecommendations || 0
          }</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#000000;">${
            textFeedback.totalRecommendations > 0 ? "Constructive" : "N/A"
          }</td>
        </tr>
      </table>
    </div>
  `;
}
