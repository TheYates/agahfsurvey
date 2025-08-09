#!/usr/bin/env node

/**
 * Test script for the /api/ping endpoint
 * This helps verify that the keep-alive functionality works correctly
 */

const https = require('https');
const http = require('http');

async function testPing(url) {
  console.log('🚀 Testing ping endpoint...');
  console.log(`📡 URL: ${url}`);
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('');

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📊 Status Code: ${res.statusCode}`);
        console.log(`⚡ Response Time: ${responseTime}ms`);
        console.log('📄 Response Headers:');
        Object.entries(res.headers).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
        console.log('');
        console.log('📄 Response Body:');
        
        try {
          const jsonData = JSON.parse(data);
          console.log(JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(data);
        }
        
        console.log('');
        
        if (res.statusCode === 200) {
          console.log('✅ Ping test successful!');
          resolve({ success: true, statusCode: res.statusCode, responseTime, data });
        } else {
          console.log(`❌ Ping test failed with status ${res.statusCode}`);
          resolve({ success: false, statusCode: res.statusCode, responseTime, data });
        }
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Request failed after ${responseTime}ms`);
      console.log(`🔥 Error: ${error.message}`);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.log('⏰ Request timed out after 10 seconds');
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function main() {
  console.log('🔍 AGA Health Foundation Survey - Ping Test');
  console.log('==========================================');
  console.log('');

  // Get URL from command line argument or use localhost
  const url = process.argv[2] || 'http://localhost:3000/api/ping';
  
  try {
    const result = await testPing(url);
    
    if (result.success) {
      console.log('🎉 Test completed successfully!');
      console.log('💡 The keep-alive workflow should work correctly.');
      process.exit(0);
    } else {
      console.log('⚠️  Test completed with issues.');
      console.log('🔧 Check the response above for details.');
      process.exit(1);
    }
  } catch (error) {
    console.log('💥 Test failed with error:');
    console.log(error.message);
    console.log('');
    console.log('🔧 Possible issues:');
    console.log('   - Application is not running');
    console.log('   - Wrong URL provided');
    console.log('   - Network connectivity issues');
    console.log('   - Database connection problems');
    process.exit(1);
  }
}

// Show usage if --help is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/test-ping.js [URL]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/test-ping.js                           # Test localhost:3000');
  console.log('  node scripts/test-ping.js http://localhost:3000/api/ping');
  console.log('  node scripts/test-ping.js https://yourapp.vercel.app/api/ping');
  console.log('');
  process.exit(0);
}

main();
