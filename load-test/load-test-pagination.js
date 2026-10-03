/**
 * PAGINATION COMPARISON TEST
 * ──────────────────────────
 * Compares:
 *   OLD (port 3001): UserNews.find().sort()  — dumps ALL documents, no limit
 *   NEW (port 3000): paginated find().skip().limit() + countDocuments()
 *
 * Run: node load-test/load-test-pagination.js
 */

import autocannon from 'autocannon';
import http from 'http';

const OLD_URL = 'http://localhost:3001';  // b477590 — no pagination
const NEW_URL = 'http://localhost:3000';  // current  — paginated + search/filter

const TEST_USERNAME = 'tyagii_anmol';
const TEST_PASSWORD = '123456';
const OLD_ROLLNO    = '2K22/LT/001'; // created via old build signup

// ─── Login helpers ─────────────────────────────────────────────────────────
function loginToServer(host, port, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = http.request({
      hostname: host, port, path: '/route/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) },
    }, (res) => {
      const cookie = (res.headers['set-cookie'] || []).find(c => c.startsWith('token='));
      if (!cookie) {
        console.warn(`  ⚠️  Login to port ${port} failed (${res.statusCode}) — will test without auth cookie`);
        return resolve(null);
      }
      resolve(cookie.split(';')[0]);
    });
    req.on('error', reject);
    req.write(bodyStr); req.end();
  });
}

function runTest(config) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(65)}`);
    console.log(`🚀 ${config.title}`);
    console.log(`   ${config.url}`);
    console.log(`   Connections: ${config.connections} | Duration: ${config.duration}s`);
    console.log('─'.repeat(65));

    const { title, ...acConfig } = config;
    const instance = autocannon(acConfig, (err, result) => {
      if (err) { console.error('❌', err); return resolve(null); }
      printSummary(result);
      resolve(result);
    });
    autocannon.track(instance, { renderProgressBar: true });
  });
}

function printSummary(r) {
  console.log('\n📊 RESULTS:');
  console.log(`   Total Requests  : ${r.requests.total.toLocaleString()}`);
  console.log(`   Req/sec (avg)   : ${r.requests.average} rps`);
  console.log(`   Req/sec (max)   : ${r.requests.max} rps`);
  console.log(`   Errors/Timeouts : ${r.errors} / ${r.timeouts}`);
  console.log(`   Non-2xx         : ${r.non2xx}`);
  console.log(`   Latency p50     : ${r.latency.p50} ms`);
  console.log(`   Latency p90     : ${r.latency.p90} ms`);
  console.log(`   Latency p99     : ${r.latency.p99} ms`);
  console.log(`   Latency max     : ${r.latency.max} ms`);
  console.log(`   Throughput avg  : ${(r.throughput.average / 1024).toFixed(1)} KB/s`);
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║      PAGINATION COMPARISON: b477590 (no page) vs CURRENT     ║');
  console.log('║  OLD → find().sort() dumps ALL docs                          ║');
  console.log('║  NEW → paginated find().skip().limit() + countDocuments()    ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // ── Login to both ────────────────────────────────────────────────────────
  console.log('🔐 Logging into old build (port 3001)...');
  const oldCookie = await loginToServer('localhost', 3001, { rollNo: OLD_ROLLNO });

  console.log('🔐 Logging into current build (port 3000)...');
  const newCookie = await loginToServer('localhost', 3000, { userName: TEST_USERNAME, password: TEST_PASSWORD });
  if (!newCookie) { console.error('❌ Cannot login to current build'); process.exit(1); }

  const oldAuth = oldCookie
    ? { 'Cookie': oldCookie }
    : {}; // old build might not need auth on GET
  const newAuth = { 'Cookie': newCookie };

  const results = {};

  // ════════════════════════════════════════════════════════════════════════
  //  TEST 1: GET /news — no pagination vs paginated (page 1)
  // ════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════ TEST 1: GET /news (20 connections) ══════════');

  results.oldNews = await runTest({
    title:       '📰 OLD (b477590) — GET /news: find().sort() → ALL docs, no limit',
    url:         `${OLD_URL}/route/news`,
    connections: 20, duration: 20, headers: oldAuth,
  });

  results.newNews = await runTest({
    title:       '📰 CURRENT — GET /news?page=1 → paginated (9 docs) + countDocuments',
    url:         `${NEW_URL}/route/news?page=1&limit=9`,
    connections: 20, duration: 20, headers: newAuth,
  });

  // ════════════════════════════════════════════════════════════════════════
  //  TEST 2: GET /news page 2+ — old repeats full scan, new is cheaper
  // ════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════ TEST 2: GET /news page 2 (20 connections) ══════════');

  results.oldNewsP2 = await runTest({
    title:       '📰 OLD — GET /news (page 2 equiv): same full find() every time',
    url:         `${OLD_URL}/route/news`,
    connections: 20, duration: 20, headers: oldAuth,
  });

  results.newNewsP2 = await runTest({
    title:       '📰 CURRENT — GET /news?page=2 → skip(9).limit(9) + countDocuments',
    url:         `${NEW_URL}/route/news?page=2&limit=9`,
    connections: 20, duration: 20, headers: newAuth,
  });

  // ════════════════════════════════════════════════════════════════════════
  //  TEST 3: Heavy load — 50 connections
  // ════════════════════════════════════════════════════════════════════════
  console.log('\n\n══════════ TEST 3: GET /news heavy load (50 connections) ══════════');

  results.oldNewsHeavy = await runTest({
    title:       '📰 OLD — 50 conns: full collection dump per request',
    url:         `${OLD_URL}/route/news`,
    connections: 50, duration: 20, headers: oldAuth,
  });

  results.newNewsHeavy = await runTest({
    title:       '📰 CURRENT — 50 conns: paginated (9 docs per request)',
    url:         `${NEW_URL}/route/news?page=1&limit=9`,
    connections: 50, duration: 20, headers: newAuth,
  });

  // ════════════════════════════════════════════════════════════════════════
  //  FINAL TABLE
  // ════════════════════════════════════════════════════════════════════════
  function fmt(r) {
    if (!r) return 'N/A'.padEnd(38);
    return `${String(r.requests.average + ' rps').padEnd(9)} p50:${String(r.latency.p50+'ms').padEnd(8)} p99:${r.latency.p99}ms`;
  }

  console.log('\n\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║              PAGINATION: b477590 (no page) vs CURRENT                   ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════╣');
  console.log('║ Test                   │  OLD (no pagination)       │  NEW (paginated)  ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════╣');

  const rows = [
    ['GET /news  (20 conns)', results.oldNews,      results.newNews],
    ['GET /news p2 (20 c)',   results.oldNewsP2,    results.newNewsP2],
    ['GET /news  (50 conns)', results.oldNewsHeavy, results.newNewsHeavy],
  ];

  for (const [label, oldR, newR] of rows) {
    const lbl = label.padEnd(22);
    const o   = oldR ? `${String(oldR.requests.average+'rps').padEnd(8)} p50:${oldR.latency.p50}ms` : 'N/A            ';
    const n   = newR ? `${String(newR.requests.average+'rps').padEnd(8)} p50:${newR.latency.p50}ms` : 'N/A';
    console.log(`║ ${lbl} │ ${o.padEnd(26)} │ ${n} ║`);
  }

  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
  console.log('\n💡 KEY INSIGHT:');
  console.log('   OLD: each request transfers ALL news documents over the wire.');
  console.log('   NEW: each request transfers only 9 documents — much less bandwidth.');
  console.log('   At high concurrency, the old approach overwhelms MongoDB + network.');
  console.log('   The new approach is slower per-request (countDocuments cost)');
  console.log('   but far more scalable under load.\n');
}

main().catch(console.error);
