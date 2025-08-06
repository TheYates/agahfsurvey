#!/usr/bin/env node

/**
 * Keep-alive script for Supabase database
 * This script can be run manually or scheduled with cron
 * 
 * Usage:
 * node scripts/keep-alive.js
 * 
 * Or add to crontab:
 * 0 2 */3 * * /usr/bin/node /path/to/your/project/scripts/keep-alive.js
 */

const https = require('https');
const http = require('http');

// Configuration
const APP_URL = process.env.APP_URL || 'https://your-app-domain.vercel.app';
const PING_ENDPOINT = '/api/ping';
const TIMEOUT = 30000; // 30 seconds

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

async function keepAlive() {
  const url = `${APP_URL}${PING_ENDPOINT}`;
  const timestamp = new Date().toISOString();
  
  console.log(`🔄 Starting keep-alive check at ${timestamp}`);
  console.log(`📡 Pinging: ${url}`);
  
  try {
    const result = await makeRequest(url);
    
    if (result.statusCode === 200) {
      console.log('✅ Keep-alive successful!');
      console.log('📊 Response:', JSON.stringify(result.data, null, 2));
    } else {
      console.log(`❌ Keep-alive failed with status ${result.statusCode}`);
      console.log('📊 Response:', result.data);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Keep-alive error:', error.message);
    process.exit(1);
  }
}

// Run the keep-alive check
keepAlive();
