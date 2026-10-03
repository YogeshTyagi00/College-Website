/**
 * CURRENT LOAD TEST
 * -----------------
 * Simulates the CURRENT version of the app with all features:
 *   - JWT auth middleware on every protected route
 *   - Per-request DB lookup for role (verifyToken hits MongoDB)
 *   - authorizeRole() RBAC checks
 *   - News/Events/Society GET endpoints with search/filter
 *   - Admin-request endpoints
 *
 * This script:
 *  1. First does a real login to grab the auth cookie
 *  2. Then hammers authenticated endpoints
 *
 * Run: node load-test/load-test-current.js
 *
 * ⚠️  IMPORTANT: Make sure your backend is running on port 3000
 *     and you have a valid test user in your DB.
 *     Update TEST_EMAIL / TEST_PASSWORD below if needed.
 */

import autocannon from 'autocannon';
import http from 'http';

const BASE_URL = 'http://localhost:3000';

// ─── Update these with a valid user in your DB ─────────────────────────────
const TEST_EMAIL    = 'tyagii_anmol';
const TEST_PASSWORD = '123456';
// ──────────────────────────────────────────────────────────────────────────

/**
 * Step 1: Login and capture the auth cookie
 */
function doLogin() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ userName: TEST_EMAIL, password: TEST_PASSWORD });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/route/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      const rawCookies = res.headers['set-cookie'] || [];
      // Extract the 'token=...' cookie
      const tokenCookie = rawCookies.find(c => c.startsWith('token='));
      if (!tokenCookie) {
        return reject(new Error(`Login failed (status ${res.statusCode}) — no token cookie returned.\n` +
          `Check TEST_EMAIL / TEST_PASSWORD in load-test/load-test-current.js\n` +
          `Make sure a user with those credentials exists in your MongoDB.\n`));
      }
      // Keep only the 'token=VALUE' part (strip flags like HttpOnly, Path, etc.)
      const cookie = tokenCookie.split(';')[0];
      resolve(cookie);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function runTest(config) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🚀 Starting: ${config.title}`);
    console.log(`   URL: ${config.url}  |  Connections: ${config.connections}  |  Duration: ${config.duration}s`);
    console.log('─'.repeat(60));

    const { title, ...acConfig } = config;
    const instance = autocannon(acConfig, (err, result) => {
      if (err) {
        console.error('❌ Test error:', err);
        return resolve(null);
      }
      printSummary(result);
      resolve(result);
    });

    autocannon.track(instance, { renderProgressBar: true });
  });
}

function printSummary(result) {
  const r   = result.requests;
  const lat = result.latency;
  const thr = result.throughput;

  console.log('\n📊 RESULTS:');
  console.log(`   Total Requests  : ${r.total.toLocaleString()}`);
  console.log(`   Req/sec (avg)   : ${r.average.toLocaleString()} rps`);
  console.log(`   Req/sec (max)   : ${r.max.toLocaleString()} rps`);
  console.log(`   Errors          : ${result.errors}`);
  console.log(`   Timeouts        : ${result.timeouts}`);
  console.log(`   Non-2xx         : ${result.non2xx}`);
  console.log(`   Latency p50     : ${lat.p50} ms`);
  console.log(`   Latency p90     : ${lat.p90} ms`);
  console.log(`   Latency p99     : ${lat.p99} ms`);
  console.log(`   Latency max     : ${lat.max} ms`);
  console.log(`   Throughput avg  : ${(thr.average / 1024).toFixed(2)} KB/s`);
  console.log('─'.repeat(60));
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       COLLEGE WEBSITE — CURRENT BUILD LOAD TEST          ║');
  console.log('║  JWT auth + role DB lookup + RBAC + search/filter        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ── Login first ──────────────────────────────────────────────────────────
  let authCookie;
  try {
    console.log(`🔐 Logging in as: ${TEST_EMAIL} ...`);
    authCookie = await doLogin();
    console.log(`✅ Got auth cookie: ${authCookie.substring(0, 30)}...`);
  } catch (err) {
    console.error('\n❌ LOGIN FAILED:', err.message);
    process.exit(1);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Cookie': authCookie,
  };

  // ── Test definitions ──────────────────────────────────────────────────────

  // 1. Health (baseline comparison point)
  const healthTest = {
    title:       '⚡ CURRENT — /health (no auth)',
    url:         `${BASE_URL}/health`,
    connections: 50,
    duration:    20,
  };

  // 2. GET /news — verifyToken (JWT verify + DB role lookup) + Mongoose query
  const newsTest = {
    title:       '📰 CURRENT — GET /route/news (auth + DB role lookup + Mongoose)',
    url:         `${BASE_URL}/route/news`,
    connections: 50,
    duration:    20,
    headers:     authHeaders,
  };

  // 3. GET /events — same middleware stack
  const eventsTest = {
    title:       '📅 CURRENT — GET /route/events (auth + DB role lookup + Mongoose)',
    url:         `${BASE_URL}/route/events`,
    connections: 30,
    duration:    20,
    headers:     authHeaders,
  };

  // 4. GET /society
  const societyTest = {
    title:       '🏛️  CURRENT — GET /route/society (auth + DB role lookup + Mongoose)',
    url:         `${BASE_URL}/route/society`,
    connections: 30,
    duration:    20,
    headers:     authHeaders,
  };

  // 5. GET /route/news with search query param (tests filter path)
  const newsSearchTest = {
    title:       '🔍 CURRENT — GET /route/news?search=... (auth + search/filter)',
    url:         `${BASE_URL}/route/news?search=dtu&category=general`,
    connections: 30,
    duration:    20,
    headers:     authHeaders,
  };

  // 6. Login route stress (simulates concurrent login spikes)
  const loginStressTest = {
    title:       '🔑 CURRENT — POST /route/login (bcrypt + DB + JWT sign)',
    url:         `${BASE_URL}/route/login`,
    method:      'POST',
    connections: 10,   // deliberately low — bcrypt is CPU-bound
    duration:    20,
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ userName: TEST_EMAIL, password: TEST_PASSWORD }),
  };

  // ── Run all tests sequentially ────────────────────────────────────────────
  const results = {};

  results.health      = await runTest(healthTest);
  results.news        = await runTest(newsTest);
  results.events      = await runTest(eventsTest);
  results.society     = await runTest(societyTest);
  results.newsSearch  = await runTest(newsSearchTest);
  results.loginStress = await runTest(loginStressTest);

  // ── Final comparison table ────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                     CURRENT BUILD — FINAL SUMMARY                           ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════════╣');
  console.log('║ Endpoint               │ Avg RPS  │ p50 lat │ p99 lat │ Errors             ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════════╣');

  const rows = [
    ['  /health (no auth)',  results.health],
    ['  GET /news',          results.news],
    ['  GET /events',        results.events],
    ['  GET /society',       results.society],
    ['  GET /news?search=',  results.newsSearch],
    ['  POST /login',        results.loginStress],
  ];

  for (const [label, r] of rows) {
    if (!r) continue;
    const rps    = String(r.requests.average).padEnd(8);
    const p50    = String(r.latency.p50 + 'ms').padEnd(7);
    const p99    = String(r.latency.p99 + 'ms').padEnd(7);
    const errors = String(r.errors + r.non2xx).padEnd(18);
    const lbl    = label.padEnd(23);
    console.log(`║ ${lbl} │ ${rps} │ ${p50}  │ ${p99}  │ ${errors} ║`);
  }

  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n💡 TIP: Compare these numbers against the baseline test results.');
  console.log('   The difference shows the cost of: JWT verify + DB role lookup +');
  console.log('   authorizeRole() RBAC + search/filter queries added to the current build.\n');
}

main().catch(console.error);
