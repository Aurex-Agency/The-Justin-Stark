// Run: node --test tests/*.test.js
// Exercises /api/boxtop-register with Zoom, GHL and Meta mocked at fetch().

const test = require('node:test');
const assert = require('node:assert');
const path = require('path');

const MOD = path.join(__dirname, '..', 'api', 'boxtop-register.js');

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
  assert.equal(ghl.consent_version, 'bt-sms-v1');
  assert.equal(ghl.zoom_status, 'registered');
  assert.equal(ghl.zoom_join_url, r.json.join_url);
  assert.equal(ghl.source_bucket, 'paid-meta');
  assert.equal(ghl.lt_content, 'Puzzle 15s');

  const meta = calls.find((c) => c.url.includes('graph.facebook.com')).body.data[0];
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

test('no phone → no SMS consent even if the box was somehow sent checked', async () => {
  const h = load(FULL_ENV);
  const calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
  await run(h, Object.assign({}, PERSON, { phone: '', sms_consent: true }));
  const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.equal(ghl.sms_consent, 'no');
  assert.equal(ghl.consent_text, '');
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

test('consent text sent to GHL matches the checkbox label word for word', async () => {
  const fs = require('fs');
  const html = fs.readFileSync(path.join(__dirname, '..', 'theboxtop', 'launch', 'index.html'), 'utf8')
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ');
  const h = load(FULL_ENV);
  const calls = mockFetch([...ZOOM_OK, ...GHL_OK, ...META_OK]);
  await run(h, PERSON);
  const ghl = calls.find((c) => c.url.includes('leadconnectorhq')).body;
  assert.ok(html.includes(ghl.consent_text), 'label must contain: ' + ghl.consent_text);
});
