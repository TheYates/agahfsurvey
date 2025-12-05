const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Rating text to number conversion
function ratingToValue(rating) {
  switch (rating) {
    case 'Excellent': return 5;
    case 'Very Good': return 4;
    case 'Good': return 3;
    case 'Fair': return 2;
    case 'Poor': return 1;
    default: return 0;
  }
}

// Bayesian weighted average calculation
function calculateWeightedAverage(visitCount, rawSatisfaction, globalAverage, minimumThreshold = 5) {
  if (visitCount === 0) return 0;
  const v = visitCount;
  const m = minimumThreshold;
  const R = rawSatisfaction;
  const C = globalAverage;
  return Number(((v / (v + m)) * R + (m / (v + m)) * C).toFixed(2));
}

async function calculateRankings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching data from database...\n');

  // Fetch all locations
  const { data: locations, error: locError } = await supabase
    .from('Location')
    .select('id, name, locationType');

  if (locError) {
    console.error('Error fetching locations:', locError);
    process.exit(1);
  }

  // Fetch all ratings
  const { data: ratings, error: ratingsError } = await supabase
    .from('Rating')
    .select('*');

  if (ratingsError) {
    console.error('Error fetching ratings:', ratingsError);
    process.exit(1);
  }

  // Group ratings by locationId
  const ratingsByLocation = {};
  ratings.forEach(rating => {
    const locId = rating.locationId;
    if (!ratingsByLocation[locId]) {
      ratingsByLocation[locId] = [];
    }
    ratingsByLocation[locId].push(rating);
  });

  // Process departments
  const departments = locations.filter(loc => loc.locationType === 'department');
  const departmentData = [];

  for (const dept of departments) {
    const deptRatings = ratingsByLocation[dept.id] || [];
    const visitCount = deptRatings.length;

    if (visitCount === 0) continue;

    // Calculate category averages
    const categories = {
      reception: { sum: 0, count: 0 },
      professionalism: { sum: 0, count: 0 },
      understanding: { sum: 0, count: 0 },
      promptnessCare: { sum: 0, count: 0 },
      promptnessFeedback: { sum: 0, count: 0 },
      overall: { sum: 0, count: 0 }
    };

    let recommendCount = 0;

    deptRatings.forEach(rating => {
      if (rating.wouldRecommend === true) recommendCount++;

      if (rating.reception) {
        categories.reception.sum += ratingToValue(rating.reception);
        categories.reception.count++;
      }
      if (rating.professionalism) {
        categories.professionalism.sum += ratingToValue(rating.professionalism);
        categories.professionalism.count++;
      }
      if (rating.understanding) {
        categories.understanding.sum += ratingToValue(rating.understanding);
        categories.understanding.count++;
      }
      if (rating.promptnessCare) {
        categories.promptnessCare.sum += ratingToValue(rating.promptnessCare);
        categories.promptnessCare.count++;
      }
      if (rating.promptnessFeedback) {
        categories.promptnessFeedback.sum += ratingToValue(rating.promptnessFeedback);
        categories.promptnessFeedback.count++;
      }
      if (rating.overall) {
        categories.overall.sum += ratingToValue(rating.overall);
        categories.overall.count++;
      }
    });

    // Calculate average for each category
    const avgRatings = {};
    for (const [key, val] of Object.entries(categories)) {
      avgRatings[key] = val.count > 0 ? Number((val.sum / val.count).toFixed(2)) : 0;
    }

    // Calculate raw satisfaction (average of all category averages)
    const ratingValues = Object.values(avgRatings).filter(v => v > 0);
    const rawSatisfaction = ratingValues.length > 0
      ? Number((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(2))
      : 0;

    const recommendRate = visitCount > 0 ? Math.round((recommendCount / visitCount) * 100) : 0;

    departmentData.push({
      id: dept.id,
      name: dept.name,
      visitCount,
      rawSatisfaction,
      recommendCount,
      recommendRate,
      avgRatings
    });
  }

  // Calculate global average for departments
  const deptGlobalAvg = departmentData.length > 0
    ? departmentData.reduce((sum, d) => sum + d.rawSatisfaction, 0) / departmentData.length
    : 3.0;

  // Apply weighted average to departments
  departmentData.forEach(dept => {
    dept.weightedSatisfaction = calculateWeightedAverage(dept.visitCount, dept.rawSatisfaction, deptGlobalAvg);
  });

  // Sort by weighted satisfaction
  departmentData.sort((a, b) => b.weightedSatisfaction - a.weightedSatisfaction);

  // Process wards
  const wards = locations.filter(loc => loc.locationType === 'ward');
  const wardData = [];

  for (const ward of wards) {
    const wardRatings = ratingsByLocation[ward.id] || [];
    const visitCount = wardRatings.length;

    if (visitCount === 0) continue;

    // Calculate category averages (ward-specific categories)
    const categories = {
      admission: { sum: 0, count: 0 },
      nurseProfessionalism: { sum: 0, count: 0 },
      doctorProfessionalism: { sum: 0, count: 0 },
      foodQuality: { sum: 0, count: 0 },
      understanding: { sum: 0, count: 0 },
      promptnessCare: { sum: 0, count: 0 },
      promptnessFeedback: { sum: 0, count: 0 },
      discharge: { sum: 0, count: 0 },
      overall: { sum: 0, count: 0 }
    };

    let recommendCount = 0;

    wardRatings.forEach(rating => {
      if (rating.wouldRecommend === true) recommendCount++;

      if (rating.admission) {
        categories.admission.sum += ratingToValue(rating.admission);
        categories.admission.count++;
      }
      if (rating.nurseProfessionalism) {
        categories.nurseProfessionalism.sum += ratingToValue(rating.nurseProfessionalism);
        categories.nurseProfessionalism.count++;
      }
      if (rating.doctorProfessionalism) {
        categories.doctorProfessionalism.sum += ratingToValue(rating.doctorProfessionalism);
        categories.doctorProfessionalism.count++;
      }
      if (rating.foodQuality) {
        categories.foodQuality.sum += ratingToValue(rating.foodQuality);
        categories.foodQuality.count++;
      }
      if (rating.understanding) {
        categories.understanding.sum += ratingToValue(rating.understanding);
        categories.understanding.count++;
      }
      if (rating.promptnessCare) {
        categories.promptnessCare.sum += ratingToValue(rating.promptnessCare);
        categories.promptnessCare.count++;
      }
      if (rating.promptnessFeedback) {
        categories.promptnessFeedback.sum += ratingToValue(rating.promptnessFeedback);
        categories.promptnessFeedback.count++;
      }
      if (rating.discharge) {
        categories.discharge.sum += ratingToValue(rating.discharge);
        categories.discharge.count++;
      }
      if (rating.overall) {
        categories.overall.sum += ratingToValue(rating.overall);
        categories.overall.count++;
      }
    });

    // Calculate average for each category
    const avgRatings = {};
    for (const [key, val] of Object.entries(categories)) {
      avgRatings[key] = val.count > 0 ? Number((val.sum / val.count).toFixed(2)) : 0;
    }

    // Calculate raw satisfaction
    const ratingValues = Object.values(avgRatings).filter(v => v > 0);
    const rawSatisfaction = ratingValues.length > 0
      ? Number((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(2))
      : 0;

    const recommendRate = visitCount > 0 ? Math.round((recommendCount / visitCount) * 100) : 0;

    wardData.push({
      id: ward.id,
      name: ward.name,
      visitCount,
      rawSatisfaction,
      recommendCount,
      recommendRate,
      avgRatings
    });
  }

  // Calculate global average for wards
  const wardGlobalAvg = wardData.length > 0
    ? wardData.reduce((sum, w) => sum + w.rawSatisfaction, 0) / wardData.length
    : 3.0;

  // Apply weighted average to wards
  wardData.forEach(ward => {
    ward.weightedSatisfaction = calculateWeightedAverage(ward.visitCount, ward.rawSatisfaction, wardGlobalAvg);
  });

  // Sort by weighted satisfaction
  wardData.sort((a, b) => b.weightedSatisfaction - a.weightedSatisfaction);

  // Print results
  console.log('='.repeat(80));
  console.log('TOP 5 DEPARTMENTS');
  console.log('='.repeat(80));
  console.log(`Global Average (for weighting): ${deptGlobalAvg.toFixed(2)}\n`);

  departmentData.slice(0, 5).forEach((dept, i) => {
    console.log(`${i + 1}. ${dept.name}`);
    console.log(`   Visit Count: ${dept.visitCount}`);
    console.log(`   Raw Satisfaction: ${dept.rawSatisfaction}/5`);
    console.log(`   Weighted Satisfaction: ${dept.weightedSatisfaction}/5`);
    console.log(`   Recommend Rate: ${dept.recommendRate}% (${dept.recommendCount}/${dept.visitCount})`);
    console.log(`   Category Ratings: ${JSON.stringify(dept.avgRatings)}`);
    console.log('');
  });

  console.log('='.repeat(80));
  console.log('TOP 5 WARDS');
  console.log('='.repeat(80));
  console.log(`Global Average (for weighting): ${wardGlobalAvg.toFixed(2)}\n`);

  wardData.slice(0, 5).forEach((ward, i) => {
    console.log(`${i + 1}. ${ward.name}`);
    console.log(`   Visit Count: ${ward.visitCount}`);
    console.log(`   Raw Satisfaction: ${ward.rawSatisfaction}/5`);
    console.log(`   Weighted Satisfaction: ${ward.weightedSatisfaction}/5`);
    console.log(`   Recommend Rate: ${ward.recommendRate}% (${ward.recommendCount}/${ward.visitCount})`);
    console.log(`   Category Ratings: ${JSON.stringify(ward.avgRatings)}`);
    console.log('');
  });

  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Departments with data: ${departmentData.length}`);
  console.log(`Total Wards with data: ${wardData.length}`);
  console.log(`Total Ratings in database: ${ratings.length}`);
}

calculateRankings().catch(console.error);
