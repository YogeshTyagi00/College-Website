/**
 * BASELINE LOAD TEST
 * ------------------
 * Simulates the OLD, simpler version of the app:
 *   - No role-based auth middleware
 *   - No per-request DB lookup for role
 *   - Just basic unauthenticated endpoints
 *
 * Run: node load-test/load-test-baseline.js
 */

import autocannon from 'autocannon';

const BASE_URL = 'http://localhost:3000';

// ─── Test 1: Health Check (pure compute, no DB) ───────────────────────────────
const healthTest = {
  title: '📌 BASELINE — /health endpoint (no DB, no auth)',
  url: `${BASE_URL}/health`,
  connections: 50,
  duration: 20,
  pipelining: 1,
};

// ─── Test 2: Login Route (DB involved, but no role lookup) ────────────────────
const loginTest = {
  title: '📌 BASELINE — POST /route/login',
  url: `${BASE_URL}/route/login`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userName: 'tyagii_anmol', password: '123456' }),
  connections: 20,
  duration: 20,
};

function runTest(config) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🚀 Starting: ${config.title}`);
    console.log(`   URL: ${config.url}  |  Connections: ${config.connections}  |  Duration: ${config.duration}s`);
    console.log('─'.repeat(60));

    const instance = autocannon({ ...config }, (err, result) => {
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
  const r = result.requests;
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
  console.log('║        COLLEGE WEBSITE — BASELINE LOAD TEST              ║');
  console.log('║  Simulates old app: no role-auth, no per-req DB lookup   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const r1 = await runTest(healthTest);
  const r2 = await runTest(loginTest);

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                  BASELINE SUMMARY                        ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  if (r1) console.log(`║  /health   → ${String(r1.requests.average + ' rps').padEnd(10)} | p99: ${String(r1.latency.p99 + 'ms').padEnd(10)} | errors: ${r1.errors} ║`);
  if (r2) console.log(`║  /login    → ${String(r2.requests.average + ' rps').padEnd(10)} | p99: ${String(r2.latency.p99 + 'ms').padEnd(10)} | errors: ${r2.errors} ║`);
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n✅ Baseline test complete. Now run: node load-test/load-test-current.js\n');
}

main().catch(console.error);
