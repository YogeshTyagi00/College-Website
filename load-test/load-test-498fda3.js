/**
 * COMMIT 498fda3 LOAD TEST
 * ─────────────────────────
 * Simulates the app as it was at commit 498fda3 ("containerized"):
 *
 * Key differences from current:
 *   ✅ verifyToken was SYNCHRONOUS — no DB lookup, just JWT decode
 *   ✅ No authorizeRole() RBAC middleware on any route
 *   ✅ POST /news and POST /events were UNPROTECTED (no auth at all)
 *   ✅ No bcrypt on login — just rollNo lookup in DB
 *   ✅ No search/filter on GET routes (plain find().sort())
 *   ✅ No adminRequest routes
 *
 * This CANNOT be run against the current server (login/routes differ).
 * Instead, we simulate the equivalent performance by:
 *   - Using the /health endpoint for verifyToken-equivalent (pure JWT, no DB)
 *   - Using unprotected POSTs to measure old write throughput
 *   - Documenting what the old middleware stack cost
 *
 * For accurate old-build testing, we stash current code, checkout 498fda3,
 * run the backend on port 3001, and hit it in parallel.
 *
 * Run: node load-test/load-test-498fda3.js
 */

import autocannon from 'autocannon';
import http from 'http';

// ─── This script expects the 498fda3 backend running on port 3001 ────────────
// See instructions in the README or run:
//   git stash && git checkout 498fda3
//   PORT=3001 npm run dev   (in a separate terminal)
//   Then run this script.
const OLD_URL  = 'http://localhost:3001';
const NEW_URL  = 'http://localhost:3000';

const TEST_USERNAME = 'tyagii_anmol';
const TEST_PASSWORD = '123456';
// Old build used rollNo, not password. Use a rollNo that exists in your test DB.
// If you don't have one, the login test will return non-2xx (still measures throughput).
const TEST_ROLLNO = '2K22/CO/001';

function runTest(config) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🚀 ${config.title}`);
    console.log(`   ${config.url}  |  ${config.connections} conns  |  ${config.duration}s`);
    console.log('─'.repeat(60));

    const { title, ...acConfig } = config;
    const instance = autocannon(acConfig, (err, result) => {
      if (err) { console.error('❌', err); return resolve(null); }
      printSummary(result);
      resolve(result);
    });

    autocannon.track(instance, { renderProgressBar: true });
  });
}

function printSummary(result) {
  const r = result.requests, lat = result.latency, thr = result.throughput;
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

// ─── Login to current build ──────────────────────────────────────────────────
function loginCurrent() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ userName: TEST_USERNAME, password: TEST_PASSWORD });
    const req = http.request({
      hostname: 'localhost', port: 3000, path: '/route/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      const cookie = (res.headers['set-cookie'] || []).find(c => c.startsWith('token='));
      if (!cookie) return reject(new Error(`Current login failed (${res.statusCode})`));
      resolve(cookie.split(';')[0]);
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// ─── Login to OLD build (rollNo, no password) ────────────────────────────────
function loginOld() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ rollNo: TEST_ROLLNO });
    const req = http.request({
      hostname: 'localhost', port: 3001, path: '/route/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      const cookie = (res.headers['set-cookie'] || []).find(c => c.startsWith('token='));
      if (!cookie) {
        console.warn(`  ⚠️  Old login returned ${res.statusCode} — rollNo may not exist. Proceeding without auth cookie.`);
        return resolve(null);
      }
      resolve(cookie.split(';')[0]);
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   SIDE-BY-SIDE: commit 498fda3  vs  CURRENT BUILD        ║');
  console.log('║   Old: port 3001  │  Current: port 3000                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ── Check both servers are reachable ────────────────────────────────────
  let oldReachable = true;
  try {
    // Old build has no /health — use /route/login (proves server is alive)
    await new Promise((res, rej) => {
      const r = http.get(`${OLD_URL}/route/login`, res);
      r.on('error', rej);
      setTimeout(() => rej(new Error('timeout')), 3000);
    });
    console.log('✅ Old build (port 3001): reachable');
  } catch {
    oldReachable = false;
    console.warn('⚠️  Old build (port 3001): NOT reachable');
    console.warn('   Run the old backend first:');
    console.warn('     git stash');
    console.warn('     git checkout 498fda3');
    console.warn('     $env:PORT=3001; npm run dev');
    console.warn('   (keep current backend on port 3000 in another terminal)\n');
  }

  // ── Login to current ──────────────────────────────────────────────────────
  let currentCookie;
  try {
    console.log(`🔐 Logging in to current build as: ${TEST_USERNAME}`);
    currentCookie = await loginCurrent();
    console.log('✅ Got current auth cookie');
  } catch (err) {
    console.error('❌ Current login failed:', err.message);
    process.exit(1);
  }

  // ── Login to old build ────────────────────────────────────────────────────
  let oldCookie = null;
  if (oldReachable) {
    console.log(`🔐 Logging in to old build with rollNo: ${TEST_ROLLNO}`);
    oldCookie = await loginOld();
    if (oldCookie) console.log('✅ Got old build auth cookie');
  }

  const currentAuth = { 'Content-Type': 'application/json', 'Cookie': currentCookie };
  const oldAuth     = oldCookie ? { 'Content-Type': 'application/json', 'Cookie': oldCookie } : { 'Content-Type': 'application/json' };

  const results = { old: {}, current: {} };

  // ════════════════════════════════════════════════════════════════════════════
  //  1. Express overhead — old uses /route/logout (GET 404 = pure express), current uses /health
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════════════ TEST 1: Pure Express throughput ══════════════════');
  if (oldReachable) {
    results.old.health = await runTest({
      title: '498fda3 → GET /route/login (no /health — measuring raw Express)',
      url: `${OLD_URL}/route/login`, connections: 50, duration: 20,
    });
  }
  results.current.health = await runTest({
    title: 'CURRENT → GET /health (no auth)',
    url: `${NEW_URL}/health`, connections: 50, duration: 20,
  });

  // ════════════════════════════════════════════════════════════════════════════
  //  2. GET /news — old: verifyToken (JWT only, no DB) | new: JWT + DB role lookup
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════════════ TEST 2: GET /news ══════════════════');
  if (oldReachable) {
    results.old.news = await runTest({
      title: '498fda3 → GET /news (JWT-only verifyToken, no DB role lookup)',
      url: `${OLD_URL}/route/news`, connections: 50, duration: 20, headers: oldAuth,
    });
  }
  results.current.news = await runTest({
    title: 'CURRENT → GET /news (JWT + DB role lookup + Mongoose query)',
    url: `${NEW_URL}/route/news`, connections: 50, duration: 20, headers: currentAuth,
  });

  // ════════════════════════════════════════════════════════════════════════════
  //  3. GET /events
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════════════ TEST 3: GET /events ══════════════════');
  if (oldReachable) {
    results.old.events = await runTest({
      title: '498fda3 → GET /events',
      url: `${OLD_URL}/route/events`, connections: 30, duration: 20, headers: oldAuth,
    });
  }
  results.current.events = await runTest({
    title: 'CURRENT → GET /events',
    url: `${NEW_URL}/route/events`, connections: 30, duration: 20, headers: currentAuth,
  });

  // ════════════════════════════════════════════════════════════════════════════
  //  4. POST /login — old: rollNo lookup only | new: rollNo + bcrypt + JWT sign
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════════════ TEST 4: POST /login ══════════════════');
  if (oldReachable) {
    results.old.login = await runTest({
      title: '498fda3 → POST /login (no bcrypt, rollNo DB lookup only)',
      url: `${OLD_URL}/route/login`, method: 'POST', connections: 20, duration: 20,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: TEST_ROLLNO }),
    });
  }
  results.current.login = await runTest({
    title: 'CURRENT → POST /login (bcrypt.compare + DB lookup + JWT sign)',
    url: `${NEW_URL}/route/login`, method: 'POST', connections: 10, duration: 20,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: TEST_USERNAME, password: TEST_PASSWORD }),
  });

  // ════════════════════════════════════════════════════════════════════════════
  //  FINAL COMPARISON TABLE
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║              SIDE-BY-SIDE COMPARISON: 498fda3  vs  CURRENT                   ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════════╣');
  console.log('║ Endpoint         │   498fda3 (old)         │   CURRENT                       ║');
  console.log('║                  │  RPS   │ p50   │ p99    │  RPS   │ p50    │ p99            ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════════╣');

  function row(label, oldR, curR) {
    const o = oldR ? `${String(oldR.requests.average).padEnd(6)} │ ${String(oldR.latency.p50+'ms').padEnd(5)} │ ${String(oldR.latency.p99+'ms').padEnd(6)}` : 'N/A (server not running)      ';
    const c = curR ? `${String(curR.requests.average).padEnd(6)} │ ${String(curR.latency.p50+'ms').padEnd(6)} │ ${curR.latency.p99}ms` : 'N/A                          ';
    console.log(`║ ${label.padEnd(16)} │ ${o} │ ${c} ║`);
  }

  row('GET /health',  results.old.health,  results.current.health);
  row('GET /news',    results.old.news,    results.current.news);
  row('GET /events',  results.old.events,  results.current.events);
  row('POST /login',  results.old.login,   results.current.login);
  console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');
}

main().catch(console.error);
