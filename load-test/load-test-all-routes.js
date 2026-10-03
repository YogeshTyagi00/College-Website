/**
 * COMPREHENSIVE MULTI-ROUTE LOAD TEST: OLD BUILD vs CURRENT BUILD
 * ─────────────────────────────────────────────────────────────
 * Compares OLD (port 3001) vs CURRENT (port 3000) across all major routes:
 * 1. GET /route/check-auth
 * 2. GET /route/news
 * 3. GET /route/events
 * 4. GET /route/society
 * 5. POST /route/login
 * 6. POST /route/logout
 */

import autocannon from 'autocannon';
import http from 'http';

const OLD_URL = 'http://localhost:3001';
const NEW_URL = 'http://localhost:3000';

const CURRENT_USER = 'tyagii_anmol';
const CURRENT_PASS = '123456';
const OLD_ROLLNO   = '2K22/LT/001';

const DURATION = 10; // 10s per test
const CONNECTIONS = 20;

function loginCurrent() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ userName: CURRENT_USER, password: CURRENT_PASS });
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

function loginOld() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ rollNo: OLD_ROLLNO });
    const req = http.request({
      hostname: 'localhost', port: 3001, path: '/route/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      const cookie = (res.headers['set-cookie'] || []).find(c => c.startsWith('token='));
      if (!cookie) return reject(new Error(`Old login failed (${res.statusCode})`));
      resolve(cookie.split(';')[0]);
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

function runTest(config) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🚀 ${config.title}`);
    console.log(`   ${config.url} | ${config.connections} conns | ${config.duration}s`);
    console.log('─'.repeat(60));

    const { title, ...acConfig } = config;
    const instance = autocannon(acConfig, (err, result) => {
      if (err) { console.error('❌', err); return resolve(null); }
      printSummary(result);
      resolve(result);
    });

    autocannon.track(instance, { renderProgressBar: false });
  });
}

function printSummary(result) {
  const r = result.requests, lat = result.latency, thr = result.throughput;
  console.log('📊 RESULTS:');
  console.log(`   Total Requests  : ${r.total.toLocaleString()}`);
  console.log(`   Req/sec (avg)   : ${r.average.toLocaleString()} rps`);
  console.log(`   Req/sec (max)   : ${r.max.toLocaleString()} rps`);
  console.log(`   Errors / Timeouts: ${result.errors} / ${result.timeouts}`);
  console.log(`   Non-2xx         : ${result.non2xx}`);
  console.log(`   Latency p50     : ${lat.p50} ms`);
  console.log(`   Latency p90     : ${lat.p90} ms`);
  console.log(`   Latency p99     : ${lat.p99} ms`);
  console.log(`   Throughput avg  : ${(thr.average / 1024).toFixed(1)} KB/s`);
}

async function main() {
  console.log('🔐 Authenticating on both servers...');
  let oldCookie, newCookie;
  try {
    oldCookie = await loginOld();
    console.log('  ✅ Old build authenticated');
  } catch (err) {
    console.log('  ⚠️ Old build login error:', err.message);
  }

  try {
    newCookie = await loginCurrent();
    console.log('  ✅ Current build authenticated');
  } catch (err) {
    console.log('  ⚠️ Current build login error:', err.message);
  }

  const results = {};

  // ─── 1. /check-auth ─────────────────────────────────────────────
  console.log('\n══════════ 1. GET /route/check-auth ══════════');
  results.checkAuthOld = await runTest({
    title: 'OLD — GET /route/check-auth',
    url: `${OLD_URL}/route/check-auth`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: oldCookie ? { Cookie: oldCookie } : {},
  });

  results.checkAuthNew = await runTest({
    title: 'CURRENT — GET /route/check-auth',
    url: `${NEW_URL}/route/check-auth`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: newCookie ? { Cookie: newCookie } : {},
  });

  // ─── 2. GET /news ───────────────────────────────────────────────
  console.log('\n══════════ 2. GET /route/news ══════════');
  results.newsOld = await runTest({
    title: 'OLD — GET /route/news (Full table dump)',
    url: `${OLD_URL}/route/news`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: oldCookie ? { Cookie: oldCookie } : {},
  });

  results.newsNew = await runTest({
    title: 'CURRENT — GET /route/news?page=1&limit=9 (Paginated)',
    url: `${NEW_URL}/route/news?page=1&limit=9`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: newCookie ? { Cookie: newCookie } : {},
  });

  // ─── 3. GET /events ─────────────────────────────────────────────
  console.log('\n══════════ 3. GET /route/events ══════════');
  results.eventsOld = await runTest({
    title: 'OLD — GET /route/events (Full table dump)',
    url: `${OLD_URL}/route/events`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: oldCookie ? { Cookie: oldCookie } : {},
  });

  results.eventsNew = await runTest({
    title: 'CURRENT — GET /route/events?page=1&limit=9 (Paginated)',
    url: `${NEW_URL}/route/events?page=1&limit=9`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: newCookie ? { Cookie: newCookie } : {},
  });

  // ─── 4. GET /society ────────────────────────────────────────────
  console.log('\n══════════ 4. GET /route/society ══════════');
  results.societyOld = await runTest({
    title: 'OLD — GET /route/society (Full table dump)',
    url: `${OLD_URL}/route/society`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: oldCookie ? { Cookie: oldCookie } : {},
  });

  results.societyNew = await runTest({
    title: 'CURRENT — GET /route/society?page=1&limit=9 (Paginated)',
    url: `${NEW_URL}/route/society?page=1&limit=9`,
    connections: CONNECTIONS,
    duration: DURATION,
    headers: newCookie ? { Cookie: newCookie } : {},
  });

  // ─── 5. POST /login ─────────────────────────────────────────────
  console.log('\n══════════ 5. POST /route/login ══════════');
  results.loginOld = await runTest({
    title: 'OLD — POST /route/login (Plain rollNo lookup)',
    url: `${OLD_URL}/route/login`,
    connections: 10,
    duration: DURATION,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rollNo: OLD_ROLLNO }),
  });

  results.loginNew = await runTest({
    title: 'CURRENT — POST /route/login (Bcrypt compare + JWT sign)',
    url: `${NEW_URL}/route/login`,
    connections: 10,
    duration: DURATION,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: CURRENT_USER, password: CURRENT_PASS }),
  });

  // ─── 6. POST /logout ────────────────────────────────────────────
  console.log('\n══════════ 6. POST /route/logout ══════════');
  results.logoutOld = await runTest({
    title: 'OLD — POST /route/logout',
    url: `${OLD_URL}/route/logout`,
    connections: CONNECTIONS,
    duration: DURATION,
    method: 'POST',
  });

  results.logoutNew = await runTest({
    title: 'CURRENT — POST /route/logout',
    url: `${NEW_URL}/route/logout`,
    connections: CONNECTIONS,
    duration: DURATION,
    method: 'POST',
  });

  // ─── FINAL SUMMARY TABLE ────────────────────────────────────────
  console.log('\n' + '═'.repeat(78));
  console.log('                 🏁 MULTI-ROUTE BENCHMARK COMPARISON 🏁');
  console.log('═'.repeat(78));
  console.log(
    'Route / Test'.padEnd(24) +
    'OLD (rps / p50)'.padEnd(26) +
    'CURRENT (rps / p50)'.padEnd(26)
  );
  console.log('─'.repeat(78));

  const format = (res) => res ? `${res.requests.average} rps | ${res.latency.p50}ms` : 'N/A';

  console.log('GET /check-auth'.padEnd(24) + format(results.checkAuthOld).padEnd(26) + format(results.checkAuthNew));
  console.log('GET /news'.padEnd(24) + format(results.newsOld).padEnd(26) + format(results.newsNew));
  console.log('GET /events'.padEnd(24) + format(results.eventsOld).padEnd(26) + format(results.eventsNew));
  console.log('GET /society'.padEnd(24) + format(results.societyOld).padEnd(26) + format(results.societyNew));
  console.log('POST /login'.padEnd(24) + format(results.loginOld).padEnd(26) + format(results.loginNew));
  console.log('POST /logout'.padEnd(24) + format(results.logoutOld).padEnd(26) + format(results.logoutNew));
  console.log('═'.repeat(78));
}

main();
