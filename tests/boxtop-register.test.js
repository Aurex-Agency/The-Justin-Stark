// Run: node --test tests/*.test.js
// Exercises /api/boxtop-register with Zoom, GHL and Meta mocked at fetch().

const test = require('node:test');
const assert = require('node:assert');
const path = require('path');

const MOD = path.join(__dirname, '..', 'api', 'boxtop-register.js');

// Pin the clock: the function's behavior depends on the date (registration turns into
// replay after the event), so tests must not depend on when they run.
const REAL_NOW = Date.now;
let FIXED_NOW = Date.parse('2026-11-03T15:00:00Z'); // Tue Nov 3, 9 AM CT
Date.now = () => FIXED_NOW;
function at(iso) { FIXED_NOW = Date.parse(iso); }
test.afterEach(() => at('2026-11-03T15:00:00Z'));
test.after(() => { Date.now = REAL_NOW; });

function load(env) {
  delete require.cache[require.resolve(MOD)];
  for (const k of ['ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID', 'ZOOM_CLIENT_SECRET', 'ZOOM_WEBINAR_ID', 'GHL_BOXTOP_WEBHOOK_URL', 'META_CAPI_TOKEN', 'META_TEST_EVENT_CODE']) delete process.env[k];
  Object.assign(process.env, env || {});
  return require(MOD);
}

const FULL_ENV = {
  ZOOM_ACCOUNT_ID: 'acct', ZOOM_CLIENT_ID: 'cid', ZOOM_CLIENT_SECRET: 'sec', ZOOM_WEBINAR_ID: '81234567890',
  GHL_BOXTOP_WEBHOOK_URL: 'https://services.leadconnectorhq.com/hooks/x/webhook-trigger/y',
  META_CAPI_TOKEN: 'tok',
};

function mockFetch(routes) {
  const calls = [];
  global.fetch = async (url, opts) => {
    calls.push({ url, opts, body: opts && opts.body ? (() => { try { return JSON.parse(opts.body); } catch (e) { return opts.body; } })() : null });
    for (const [match, fn] of routes) {
      if (url.includes(match)) return fn(url, opts);
    }
    throw new Error('unexpected fetch ' + url);
  };
  return calls;
}

const ok = (obj, status) => ({ ok: (status || 200) < 300, status: status || 200, json: async () => obj });

const ZOOM_OK = [
  ['zoom.us/oauth/token', () => ok({ access_token: 'zt', expires_in: 3600 })],
  ['/registrants', () => ok({ registrant_id: 'r1', join_url: 'https://us02web.zoom.us/w/81234567890?tk=abc', id: 81234567890 }, 201)],
];
const GHL_OK = [['leadconnectorhq.com', () => ok({}, 200)]];
const META_OK = [['graph.facebook.com', () => ok({ events_received: 1 })]];

function run(handler, body, headers) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 0, headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      end(s) { resolve({ status: this.statusCode, json: JSON.parse(s) }); },
    };
    handler({ method: 'POST', body, headers: Object.assign({ 'user-agent': 'test', 'x-forwarded-for': '1.2.3.4', cookie: '_fbp=fb.1.1.2' }, headers || {}) }, res);
  });
}

const PERSON = {
  action: 'register', first_name: 'Jane', last_name: 'Doe', email: 'Jane@Example.com', phone: '(662) 555-0123',
  sms_consent: true, elapsed_ms: 9000, event_id: 'bt-test-123456',
  lt_source: 'facebook', lt_medium: 'paid_social', lt_campaign: 'BT Launch', lt_content: 'Puzzle 15s', fbclid: 'IwAR123',
  landing_page: 'https://thejustinstark.com/theboxtop/launch/?utm_source=facebook',
};

test('register: Zoom + GHL + Meta all succeed', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
  const r = await run(h, PERSON);
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
  assert.equal(r.json.zoom, 'registered');
  assert.match(r.json.join_url, /zoom\.us\/w\//);
  assert.equal(r.json.event_id, 'bt-test-123456');

  const zoomCall = calls.find((c) => c.url.includes('/registrants'));
  assert.deepEqual(zoomCall.body, { email: 'jane@example.com', first_name: 'Jane', last_name: 'Doe' });
  assert.match(zoomCall.url, /webinars\/81234567890\/registrants/);

  const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.equal(ghl.action, 'register');
  assert.equal(ghl.phone, '+16625550123');
  assert.equal(ghl.sms_consent, 'yes');
  assert.equal(ghl.consent_version, 'bt-sms-v2');
  assert.equal(ghl.zoom_status, 'registered');
  assert.equal(ghl.zoom_join_url, r.json.join_url);
  assert.equal(ghl.source_bucket, 'paid-meta');
  assert.equal(ghl.lt_content, 'Puzzle 15s');

  const meta = calls.find((c) => new URL(c.url).hostname === 'graph.facebook.com').body.data[0];
  assert.equal(meta.event_name, 'CompleteRegistration');
  assert.equal(meta.event_id, 'bt-test-123456');
  assert.match(meta.user_data.em[0], /^[a-f0-9]{64}$/);
  assert.match(meta.user_data.ph[0], /^[a-f0-9]{64}$/);
  assert.match(meta.user_data.fbc, /^fb\.1\.\d+\.IwAR123$/);
  assert.equal(meta.user_data.fbp, 'fb.1.1.2');
});

test('register: Zoom fails → GHL still gets the contact, visitor gets fallback link', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([
    ['zoom.us/oauth/token', () => ok({ access_token: 'zt', expires_in: 3600 })],
    ['/registrants', () => ok({ code: 3001, message: 'Webinar does not exist' }, 404)],
    ...GHL_OK, ...META_OK,
  ]);
  const r = await run(h, PERSON);
  assert.equal(r.status, 200);
  assert.equal(r.json.zoom, 'failed');
  assert.match(r.json.fallback_url, /WN_bjdBGZXbSoOfl3x2_XPqHQ/);
  const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.equal(ghl.zoom_status, 'failed');
  assert.match(ghl.zoom_fallback_url, /WN_/);
});

test('register: Zoom and GHL both fail → 502 with fallback', async () => {
  const h = load(FULL_ENV);
  mockFetch([
    ['zoom.us/oauth/token', () => ok({ reason: 'Invalid client' }, 401)],
    ['leadconnectorhq.com', () => ok({}, 500)],
    ...META_OK,
  ]);
  const r = await run(h, PERSON);
  assert.equal(r.status, 502);
  assert.equal(r.json.ok, false);
  assert.match(r.json.fallback_url, /WN_/);
});

test('register: no Zoom credentials yet → skipped, GHL captures, fallback shown', async () => {
  const h = load({ GHL_BOXTOP_WEBHOOK_URL: FULL_ENV.GHL_BOXTOP_WEBHOOK_URL });
  const calls = mockFetch([...GHL_OK]);
  const r = await run(h, PERSON);
  assert.equal(r.status, 200);
  assert.equal(r.json.zoom, 'failed');
  assert.ok(r.json.fallback_url);
  assert.equal(calls.length, 1);
  // GHL hears "skipped", not "failed", so Plan B doesn't fire a manual-fix alert per registrant
  assert.equal(calls[0].body.zoom_status, 'skipped');
  assert.match(calls[0].body.zoom_fallback_url, /WN_/);
});

test('register: expired Zoom token is refreshed once', async () => {
  const h = load(FULL_ENV);
  let n = 0;
  mockFetch([
    ['zoom.us/oauth/token', () => ok({ access_token: 'zt' + (++n), expires_in: 3600 })],
    ['/registrants', (url, opts) => opts.headers.Authorization === 'Bearer zt1' ? ok({ code: 124 }, 401) : ok({ registrant_id: 'r2', join_url: 'https://us02web.zoom.us/w/1?tk=z' }, 201)],
    ...GHL_OK, ...META_OK,
  ]);
  const r = await run(h, PERSON);
  assert.equal(r.json.zoom, 'registered');
  assert.equal(n, 2);
});

test('validation: bad email and bad phone return field errors', async () => {
  const h = load(FULL_ENV);
  mockFetch([]);
  const r = await run(h, Object.assign({}, PERSON, { email: 'nope', phone: '12345' }));
  assert.equal(r.status, 422);
  assert.ok(r.json.errors.email);
  assert.ok(r.json.errors.phone);
});

test('register: phone is required; replay requests are not', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([...GHL_OK, ...META_OK]);
  const r = await run(h, Object.assign({}, PERSON, { phone: '' }));
  assert.equal(r.status, 422);
  assert.match(r.json.errors.phone, /mobile number/);
  assert.equal(calls.length, 0);
  const rp = await run(h, Object.assign({}, PERSON, { action: 'replay', phone: '' }));
  assert.equal(rp.status, 200);
  assert.equal(rp.json.action, 'replay');
});

test('SMS consents are separate: reminders only, marketing only, neither', async () => {
  const h = load(FULL_ENV);
  const cases = [
    [{ sms_consent: true, sms_marketing_consent: false }, 'yes', 'no'],
    [{ sms_consent: false, sms_marketing_consent: true }, 'no', 'yes'],
    [{ sms_consent: false, sms_marketing_consent: false }, 'no', 'no'],
  ];
  for (const [flags, rem, mkt] of cases) {
    const calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
    await run(h, Object.assign({}, PERSON, flags));
    const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
    assert.equal(ghl.sms_consent, rem);
    assert.equal(ghl.sms_marketing_consent, mkt);
    assert.equal(!!ghl.consent_text, rem === 'yes');
    assert.equal(!!ghl.marketing_consent_text, mkt === 'yes');
    assert.equal(ghl.consent_version, rem === 'yes' || mkt === 'yes' ? 'bt-sms-v2' : '');
  }
});

test('bots: honeypot or instant submit → quiet success, no outbound calls', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([]);
  const a = await run(h, Object.assign({}, PERSON, { company: 'Spam LLC' }));
  const b = await run(h, Object.assign({}, PERSON, { elapsed_ms: 300 }));
  assert.equal(a.json.ok, true);
  assert.equal(b.json.ok, true);
  assert.equal(calls.length, 0);
});

test('profile: GHL only, segment allowlisted', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([...GHL_OK]);
  const r = await run(h, { action: 'profile', email: 'jane@example.com', segment: 'red-zone' });
  assert.equal(r.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.segment, 'red-zone');
  const bad = await run(h, { action: 'profile', email: 'jane@example.com', segment: 'whatever' });
  assert.equal(bad.status, 422);
});

test('source buckets', () => {
  const { sourceBucket } = load()._internals;
  assert.equal(sourceBucket('fb', 'paid_social'), 'paid-meta');
  assert.equal(sourceBucket('ig', 'paid_social'), 'paid-meta');
  assert.equal(sourceBucket('instagram', 'social'), 'organic-social');
  assert.equal(sourceBucket('vanity', 'offline'), 'vanity');
  assert.equal(sourceBucket('referral', 'share'), 'referral');
  assert.equal(sourceBucket('', ''), 'direct');
  assert.equal(sourceBucket('google', 'cpc'), 'paid-other');
});

test('phone normalization', () => {
  const { normalizePhone } = load()._internals;
  assert.equal(normalizePhone('662-555-0123'), '+16625550123');
  assert.equal(normalizePhone('+1 (662) 555 0123'), '+16625550123');
  assert.equal(normalizePhone('555-0123'), '');
});

test('register: Zoom 429 (already registered today) → ok, no fallback, GHL told "already"', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([
    ['zoom.us/oauth/token', () => ok({ access_token: 'zt', expires_in: 3600 })],
    ['/registrants', () => ok({ code: 429, message: 'You have reached the maximum limit' }, 429)],
    ...GHL_OK, ...META_OK,
  ]);
  const r = await run(h, PERSON);
  assert.equal(r.status, 200);
  assert.equal(r.json.zoom, 'already');
  assert.equal(r.json.fallback_url, '');
  const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.equal(ghl.zoom_status, 'already');
  assert.equal(ghl.zoom_fallback_url, '');
  assert.ok(calls.find((c) => c.url.includes('graph.facebook.com/v25.0/')));
});

test('both consent texts sent to GHL match their checkbox labels word for word', async () => {
  const fs = require('fs');
  const html = fs.readFileSync(path.join(__dirname, '..', 'theboxtop', 'launch', 'index.html'), 'utf8')
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ');
  const h = load(FULL_ENV);
  const calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
  await run(h, Object.assign({}, PERSON, { sms_consent: true, sms_marketing_consent: true }));
  const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.ok(ghl.consent_text && html.includes(ghl.consent_text), 'label must contain: ' + ghl.consent_text);
  assert.ok(ghl.marketing_consent_text && html.includes(ghl.marketing_consent_text), 'label must contain: ' + ghl.marketing_consent_text);
  assert.ok(!/\(optional\)/.test(html.split('id="phone"')[0].slice(-200)), 'phone label must not say optional');
});

test('event_phase and sms_confirm_ok follow the clock', async () => {
  const h = load(FULL_ENV);
  const cases = [
    ['2026-11-03T15:00:00Z', 'pre', 'yes'],    // Tue Nov 3
    ['2026-11-08T17:59:00Z', 'pre', 'yes'],    // Sun Nov 8, 11:59 AM CT: last minute for a confirmation text
    ['2026-11-08T18:00:00Z', 'pre', 'no'],     // Sun Nov 8, 12:00 PM CT: would break 3-per-24h
    ['2026-11-09T16:30:00Z', 'today', 'no'],   // Mon 10:30 AM CT
    ['2026-11-09T18:20:00Z', 'live', 'no'],    // Mon 12:20 PM CT
  ];
  for (const [iso, phase, confirm] of cases) {
    at(iso);
    const calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
    await run(h, Object.assign({}, PERSON, { sms_consent: true }));
    const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
    assert.equal(ghl.action, 'register', iso);
    assert.equal(ghl.event_phase, phase, iso);
    assert.equal(ghl.sms_confirm_ok, confirm, iso);
  }
  at('2026-11-10T15:00:00Z');
  let calls = mockFetch([...GHL_OK, ...META_OK]);
  await run(h, Object.assign({}, PERSON, { action: 'replay', phone: '' }));
  assert.equal(calls.find((c) => c.url.includes('leadconnectorhq')).body.event_phase, 'post');
  at('2026-11-17T15:00:00Z');
  calls = mockFetch([...GHL_OK, ...META_OK]);
  await run(h, Object.assign({}, PERSON, { action: 'replay', phone: '' }));
  assert.equal(calls.find((c) => c.url.includes('leadconnectorhq')).body.event_phase, 'closed');
});

test('register after the webinar ends becomes a replay request (no Zoom call)', async () => {
  at('2026-11-09T20:00:00Z');
  const h = load(FULL_ENV);
  const calls = mockFetch([...GHL_OK, ...META_OK]);
  const r = await run(h, PERSON);
  assert.equal(r.json.action, 'replay');
  assert.ok(!calls.some((c) => c.url.includes('zoom.us')));
});

test('area codes: Hawaii flagged; PR/USVI/Guam/Canada get no texts even if boxes are checked', async () => {
  const { phoneAreaFlag } = load()._internals;
  assert.equal(phoneAreaFlag('+18085550123'), 'hawaii');
  assert.equal(phoneAreaFlag('+17875550123'), 'no-sms');
  assert.equal(phoneAreaFlag('+14165550123'), 'no-sms');
  assert.equal(phoneAreaFlag('+16625550123'), '');
  const h = load(FULL_ENV);
  let calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
  await run(h, Object.assign({}, PERSON, { phone: '(787) 555-0123', sms_consent: true, sms_marketing_consent: true }));
  let ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.equal(ghl.phone_area_flag, 'no-sms');
  assert.equal(ghl.sms_consent, 'no');
  assert.equal(ghl.sms_marketing_consent, 'no');
  assert.equal(ghl.sms_confirm_ok, 'no');
  calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
  await run(h, Object.assign({}, PERSON, { phone: '808-555-0123', sms_consent: true }));
  ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.equal(ghl.phone_area_flag, 'hawaii');
  assert.equal(ghl.sms_consent, 'yes');
});
