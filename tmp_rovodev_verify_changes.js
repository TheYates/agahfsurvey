#!/usr/bin/env node

/**
 * Verification script to confirm cache fix implementation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Cache Fix Implementation...\n');

const checks = [];

// Check 1: Service Worker version updated
try {
  const swContent = fs.readFileSync('public/sw.js', 'utf8');
  const hasV3 = swContent.includes("CACHE_NAME = 'agahf-survey-v3'");
  const hasNoCaching = swContent.includes("Don't cache API responses or report pages");
  const hasReports = swContent.includes("event.request.url.includes('/reports')");
  
  checks.push({
    name: 'Service Worker Updated',
    passed: hasV3 && hasNoCaching && hasReports,
    details: hasV3 ? '✅ Cache name: v3' : '❌ Cache name not updated'
  });
} catch (e) {
  checks.push({ name: 'Service Worker Updated', passed: false, details: `❌ Error: ${e.message}` });
}

// Check 2: Cache TTLs reduced
try {
  const cacheContent = fs.readFileSync('lib/cache/survey-cache.ts', 'utf8');
  const hasShort30s = cacheContent.includes('SHORT: 30 * 1000');
  const hasMedium1m = cacheContent.includes('MEDIUM: 60 * 1000');
  const hasLong2m = cacheContent.includes('LONG: 2 * 60 * 1000');
  
  checks.push({
    name: 'Cache TTLs Reduced',
    passed: hasShort30s && hasMedium1m && hasLong2m,
    details: (hasShort30s && hasMedium1m && hasLong2m) ? 
      '✅ All TTLs reduced (30s, 1m, 2m)' : 
      '❌ TTLs not properly reduced'
  });
} catch (e) {
  checks.push({ name: 'Cache TTLs Reduced', passed: false, details: `❌ Error: ${e.message}` });
}

// Check 3: Middleware no-cache headers
try {
  const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
  const hasNoCache = middlewareContent.includes('no-cache, no-store, must-revalidate');
  const hasPragma = middlewareContent.includes('Pragma');
  
  checks.push({
    name: 'Middleware No-Cache Headers',
    passed: hasNoCache && hasPragma,
    details: hasNoCache ? '✅ No-cache headers set' : '❌ Cache headers still permissive'
  });
} catch (e) {
  checks.push({ name: 'Middleware No-Cache Headers', passed: false, details: `❌ Error: ${e.message}` });
}

// Check 4: Location actions cache invalidation
try {
  const locationContent = fs.readFileSync('app/actions/location-actions.ts', 'utf8');
  const hasImport = locationContent.includes('import { surveyCache }');
  const hasClearInCreate = locationContent.match(/createLocation[\s\S]*surveyCache\.clear\(\)/);
  const hasClearInUpdate = locationContent.match(/updateLocation[\s\S]*surveyCache\.clear\(\)/);
  const hasClearInDelete = locationContent.match(/deleteLocation[\s\S]*surveyCache\.clear\(\)/);
  
  checks.push({
    name: 'Location Actions Cache Invalidation',
    passed: hasImport && hasClearInCreate && hasClearInUpdate && hasClearInDelete,
    details: (hasImport && hasClearInCreate && hasClearInUpdate && hasClearInDelete) ?
      '✅ Cache cleared on create/update/delete' :
      '❌ Missing cache invalidation'
  });
} catch (e) {
  checks.push({ name: 'Location Actions Cache Invalidation', passed: false, details: `❌ Error: ${e.message}` });
}

// Check 5: Survey actions cache invalidation
try {
  const surveyContent = fs.readFileSync('app/actions/survey-actions.ts', 'utf8');
  const hasImport = surveyContent.includes('import { surveyCache }');
  const hasClear = surveyContent.includes('surveyCache.clear()');
  
  checks.push({
    name: 'Survey Actions Cache Invalidation',
    passed: hasImport && hasClear,
    details: (hasImport && hasClear) ? '✅ Cache cleared on submit' : '❌ Missing cache invalidation'
  });
} catch (e) {
  checks.push({ name: 'Survey Actions Cache Invalidation', passed: false, details: `❌ Error: ${e.message}` });
}

// Check 6: Submission actions cache invalidation
try {
  const submissionContent = fs.readFileSync('app/actions/submission-actions.ts', 'utf8');
  const hasImport = submissionContent.includes('import { surveyCache }');
  const hasClear = submissionContent.includes('surveyCache.clear()');
  
  checks.push({
    name: 'Submission Actions Cache Invalidation',
    passed: hasImport && hasClear,
    details: (hasImport && hasClear) ? '✅ Cache cleared on delete' : '❌ Missing cache invalidation'
  });
} catch (e) {
  checks.push({ name: 'Submission Actions Cache Invalidation', passed: false, details: `❌ Error: ${e.message}` });
}

// Print results
console.log('═══════════════════════════════════════════════════\n');
checks.forEach((check, index) => {
  console.log(`${index + 1}. ${check.name}`);
  console.log(`   ${check.details}\n`);
});

const passedCount = checks.filter(c => c.passed).length;
const totalCount = checks.length;

console.log('═══════════════════════════════════════════════════');
console.log(`\n📊 Results: ${passedCount}/${totalCount} checks passed\n`);

if (passedCount === totalCount) {
  console.log('✅ All cache fixes have been successfully implemented!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Commit and push changes to production');
  console.log('   2. Monitor for stale data complaints (should be zero)');
  console.log('   3. Test with tmp_rovodev_cache_test.html');
  console.log('   4. After 24-48 hours, clean up temp files');
  console.log('\n🎉 Cache issues should now be resolved!\n');
} else {
  console.log('⚠️  Some checks failed. Please review the output above.');
  process.exit(1);
}
