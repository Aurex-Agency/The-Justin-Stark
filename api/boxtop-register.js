// Box Top launch registration: one form, registered everywhere.
//
// POST /api/boxtop-register  (JSON)
//   action: "register" | "profile" | "replay" | "quiz" | "trust-finder"
//
// register → 1) Zoom: add the person as a webinar registrant (personal join_url)
//            2) GoHighLevel: inbound webhook with contact, attribution, join_url
//            3) Meta Conversions API: CompleteRegistration (hashed identifiers,
//               same event_id the browser pixel uses, so Meta dedupes the pair)
// profile  → GHL only (the one-question survey on the thank-you page)
// replay   → GHL + Meta Lead (sign-ups after the live webinar has ended)
// quiz, trust-finder → GHL + Meta Lead: a results-review request from the Box Top Quiz
//            (/theboxtop/quiz/) or the Legacy Trust Finder (/theboxtop/trust-finder/).
//            GHL gets the answers summary; Meta gets a bare Lead, never the answers.
//
// Nothing here fails closed on the visitor: if Zoom is down the contact still
// reaches GHL and the page hands them the Zoom registration link; if both
// Zoom and GHL fail the page falls back to Zoom's own registration page.
//
// Environment (Vercel → Settings → Environment Variables):
//   ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET   Server-to-Server OAuth app
//   ZOOM_WEBINAR_ID                                       numeric webinar ID (not the WN_ link code)
//   GHL_BOXTOP_WEBHOOK_URL                                "BT · Inbound" workflow webhook URL
//   META_CAPI_TOKEN                                       already used by /api/meta
//   META_TEST_EVENT_CODE                                  optional, while testing in Events Manager
// Missing Zoom vars → Zoom step is skipped and the visitor gets the fallback link.
// Missing GHL var   → GHL step is skipped (logged). Missing Meta token → no CAPI.

const crypto = require('crypto');

const PIXEL_ID = '4533371650216162';
const EVENT_SLUG = 'boxtop-launch-2026-11-09';
const EVENT_NAME = 'The Box Top Method Launch';
// Mon Nov 9, 2026, 12:00 PM CST = 18:00 UTC. Registration into Zoom stays open
// until the webinar is planned to end; after that, sign-ups are replay requests.
const EVENT_START = Date.parse('2026-11-09T18:00:00Z');
const EVENT_END = Date.parse('2026-11-09T19:30:00Z');
// Phases GHL uses to pick the right first email, and the SMS-cap cutoff.
const DAY_START = Date.parse('2026-11-09T06:00:00Z');      // Mon Nov 9, 12:00 AM CT
const LIVE_FROM = Date.parse('2026-11-09T17:55:00Z');      // 11:55 AM CT
const REPLAY_END = Date.parse('2026-11-17T06:00:00Z');     // replay window closes end of Mon Nov 16 CT
// Registrations before Sun Nov 8, 12 PM CT may get a confirmation text; later ones would
// push someone past 3 texts in 24 hours (FL/OK/MD), so GHL skips it for them.
const SMS_CONFIRM_CUTOFF = Date.parse('2026-11-08T18:00:00Z');
// Area codes our CT send windows can't serve between 8 AM and 8 PM local:
// Puerto Rico, USVI, Guam, Northern Marianas, American Samoa, and Canada.
const NO_SMS_AREAS = new Set(['787', '939', '340', '671', '670', '684',
  '204', '226', '236', '249', '250', '257', '263', '289', '306', '343', '354', '365', '367', '368', '382', '387',
  '403', '416', '418', '428', '431', '437', '438', '450', '460', '468', '474', '506', '514', '519', '548', '579',
  '581', '584', '587', '604', '613', '639', '647', '672', '683', '705', '709', '742', '753', '778', '780', '782',
  '807', '819', '825', '867', '873', '879', '902', '905', '942']);
const ZOOM_FALLBACK_URL = 'https://us02web.zoom.us/webinar/register/WN_bjdBGZXbSoOfl3x2_XPqHQ';
const CONSENT_VERSION = 'bt-sms-v2';
// Both must match the checkbox labels on /theboxtop/launch/ word for word (proof of consent).
// Two separate optional consents, as A2P expects: event texts (non-marketing) and marketing.
const CONSENT_TEXT =
  'Yes, text me my confirmation and reminders for The Box Top Method launch from Justin Stark / Pontotoc Insurance Agency. ' +
  'Up to 5 messages. Msg & data rates may apply. Reply STOP to opt out, HELP for help. ' +
  'Consent is not a condition of registration.';
const MARKETING_CONSENT_TEXT =
  'Yes, text me occasional updates, invitations and offers from Justin Stark / Pontotoc Insurance Agency, like new Box Top classes and events. ' +
  'Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. ' +
  'Consent is not a condition of registration.';
const SEGMENTS = ['retired', 'red-zone', 'planning', 'business-owner', 'pro'];

// The Box Top tools. Their lead forms ask for a call back; texts need the optional checkbox.
const TOOLS = {
  quiz: { name: 'The Box Top Quiz', page: 'https://thejustinstark.com/theboxtop/quiz/' },
  'trust-finder': { name: 'Legacy Trust Finder', page: 'https://thejustinstark.com/theboxtop/trust-finder/' },
};
const TOOL_EVENT_SLUG = 'boxtop-tools';
const TOOL_CONSENT_VERSION = 'bt-tool-sms-v1';
// Must match the checkbox label on both tool pages word for word (proof of consent).
const TOOL_CONSENT_TEXT =
  'Yes, text me about my results from Justin Stark / Pontotoc Insurance Agency. ' +
  'Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. ' +
  'Consent is not a condition of purchase.';
const BEST_TIMES = ['Morning', 'Afternoon', 'Evening'];

function phoneAreaFlag(e164) {
  if (!e164) return '';
  const area = e164.slice(2, 5);
  if (area === '808') return 'hawaii';
  return NO_SMS_AREAS.has(area) ? 'no-sms' : '';
}

function eventPhase(t) {
  if (t < DAY_START) return 'pre';
  if (t < LIVE_FROM) return 'today';
  if (t < EVENT_END) return 'live';
  if (t < REPLAY_END) return 'post';
  return 'closed';
}
const TIMEOUT_MS = 5000;
const GRAPH_VERSION = 'v25.0';

// ---------- small helpers ----------

function str(v, max) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max || 200);
}

// Like str(), but keeps line breaks (results summaries and notes read better in GHL).
function text(v, max) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max || 2000);
}

function sha256(v) {
  return crypto.createHash('sha256').update(v).digest('hex');
}

function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

// US numbers only: 10 digits, or 11 starting with 1. Returns E.164 or ''.
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  return '';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || TIMEOUT_MS);
  try {
    return await fetch(url, Object.assign({}, opts, { signal: ctrl.signal }));
  } finally {
    clearTimeout(t);
  }
}

// Which channel brought them, for one GHL tag per bucket.
function sourceBucket(source, medium) {
  const s = (source || '').toLowerCase();
  const m = (medium || '').toLowerCase();
  if (s === 'vanity') return 'vanity';
  if (s === 'referral' || m === 'share') return 'referral';
  if (m === 'email' || s === 'ghl' || s === 'email') return 'email';
  if (/paid|cpc|ppc|cpm/.test(m)) return /^(fb|ig|facebook|instagram|meta|an|msg|messenger|audience_network)$/.test(s) ? 'paid-meta' : 'paid-other';
  if (m === 'social' || /^(fb|ig|facebook|instagram|tiktok|youtube|linkedin|x|twitter)$/.test(s)) return 'organic-social';
  if (!s && !m) return 'direct';
  return 'other';
}

// ---------- Zoom ----------

let zoomToken = null; // { token, exp } cached across warm invocations

async function getZoomToken(force) {
  if (!force && zoomToken && zoomToken.exp > Date.now() + 60000) return zoomToken.token;
  const id = process.env.ZOOM_CLIENT_ID;
  const secret = process.env.ZOOM_CLIENT_SECRET;
  const account = process.env.ZOOM_ACCOUNT_ID;
  const r = await fetchWithTimeout(
    'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + encodeURIComponent(account),
    { method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64') } },
    4000
  );
  const out = await r.json().catch(() => ({}));
  if (!r.ok || !out.access_token) throw new Error('zoom token ' + r.status + ' ' + (out.reason || out.error || ''));
  zoomToken = { token: out.access_token, exp: Date.now() + (out.expires_in || 3600) * 1000 };
  return zoomToken.token;
}

async function zoomRegister(p) {
  const env = process.env;
  if (!env.ZOOM_ACCOUNT_ID || !env.ZOOM_CLIENT_ID || !env.ZOOM_CLIENT_SECRET || !env.ZOOM_WEBINAR_ID) {
    return { status: 'skipped' };
  }
  const url = 'https://api.zoom.us/v2/webinars/' + encodeURIComponent(env.ZOOM_WEBINAR_ID) + '/registrants';
  const body = JSON.stringify({ email: p.email, first_name: p.first_name, last_name: p.last_name });
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await getZoomToken(attempt > 0);
    const r = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body,
    });
    const out = await r.json().catch(() => ({}));
    if (r.status === 401 && attempt === 0) continue; // token revoked/expired early: refresh once
    if (r.ok && out.join_url) {
      return { status: 'registered', join_url: out.join_url, registrant_id: String(out.registrant_id || out.id || '') };
    }
    // Zoom allows 3 add-registrant calls per person per webinar per day. A 429 here
    // means this email already registered today (double submit, second device):
    // their join link is already in their inbox and in GHL from the first time.
    if (r.status === 429) return { status: 'already' };
    throw new Error('zoom registrant ' + r.status + ' ' + (out.code || '') + ' ' + (out.message || ''));
  }
  throw new Error('zoom registrant: unauthorized after refresh');
}

// ---------- GoHighLevel ----------

async function sendToGhl(payload) {
  const url = process.env.GHL_BOXTOP_WEBHOOK_URL;
  if (!url) return { status: 'skipped' };
  const r = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('ghl ' + r.status);
  return { status: 'sent' };
}

// ---------- Meta Conversions API ----------

async function sendToMeta(eventName, p, req, eventId, custom) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return { status: 'skipped' };
  const cookies = parseCookies(req.headers.cookie);
  let fbc = cookies._fbc || '';
  if (!fbc && p.fbclid) fbc = 'fb.1.' + Date.now() + '.' + p.fbclid;
  const userData = {
    em: [sha256(p.email.toLowerCase())],
    external_id: [sha256(p.email.toLowerCase())],
    client_ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: req.headers['user-agent'] || undefined,
    fbp: cookies._fbp || undefined,
    fbc: fbc || undefined,
  };
  if (p.first_name) userData.fn = [sha256(p.first_name.toLowerCase().replace(/[^\p{L}]/gu, ''))];
  if (p.last_name) userData.ln = [sha256(p.last_name.toLowerCase().replace(/[^\p{L}]/gu, ''))];
  if (p.phone) {
    userData.ph = [sha256(p.phone.replace(/\D/g, ''))];
    userData.country = [sha256('us')];
  }
  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: p.landing_page || (custom && custom.page) || 'https://thejustinstark.com/theboxtop/launch/',
      user_data: userData,
      custom_data: custom
        ? { content_name: custom.name, content_category: 'boxtop_tool' }
        : { content_name: EVENT_NAME, content_category: 'webinar' },
    }],
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  const r = await fetchWithTimeout(
    'https://graph.facebook.com/' + GRAPH_VERSION + '/' + PIXEL_ID + '/events?access_token=' + encodeURIComponent(token),
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
  );
  if (!r.ok) {
    const out = await r.json().catch(() => ({}));
    throw new Error('capi ' + r.status + ' ' + ((out.error && out.error.message) || ''));
  }
  return { status: 'sent' };
}

// ---------- handler ----------

function reply(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function logError(stage, err, email) {
  const domain = (email || '').split('@')[1] || '?';
  console.error('[boxtop-register]', stage, 'failed for @' + domain + ':', err && err.message ? err.message : err);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'POST only' });

  let body;
  try { body = req.body; } catch (e) { body = null; } // Vercel throws on malformed JSON
  if (typeof body === 'string') {
    if (body.length > 10000) return reply(res, 413, { ok: false, error: 'too large' });
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') return reply(res, 400, { ok: false, error: 'bad payload' });

  let action = str(body.action, 20) || 'register';
  if (!['register', 'profile', 'replay'].includes(action) && !TOOLS[action]) return reply(res, 400, { ok: false, error: 'bad action' });
  const tool = TOOLS[action] || null;

  // Bots: a filled honeypot or an instant submit gets a quiet success and nothing else.
  const filledIn = Number(body.elapsed_ms);
  if (str(body.company) || (action !== 'profile' && Number.isFinite(filledIn) && filledIn < 1500)) {
    return reply(res, 200, { ok: true, action, zoom: 'skipped', event_id: '' });
  }

  const p = {
    first_name: str(body.first_name, 60),
    last_name: str(body.last_name, 60),
    email: str(body.email, 120).toLowerCase(),
    phone: '',
    segment: '',
  };

  const errors = {};
  if (!EMAIL_RE.test(p.email)) errors.email = 'Enter a valid email address.';
  if (action !== 'profile') {
    if (!p.first_name) errors.first_name = 'Enter your first name.';
    if (!p.last_name) errors.last_name = 'Enter your last name.';
    const rawPhone = str(body.phone, 30);
    if (rawPhone) {
      p.phone = normalizePhone(rawPhone);
      if (!p.phone) errors.phone = 'Enter a 10-digit US mobile number.';
    } else if ((action === 'register' && Date.now() <= EVENT_END) || tool) {
      // required for registration and for a tool's call-back request; replay requests don't ask
      errors.phone = tool ? 'Enter a 10-digit phone number so an agent can reach you.' : 'Enter your mobile number.';
    }
  } else {
    p.segment = SEGMENTS.includes(str(body.segment, 30)) ? str(body.segment, 30) : '';
    if (!p.segment) errors.segment = 'Pick one.';
  }
  if (Object.keys(errors).length) return reply(res, 422, { ok: false, errors });

  const now = Date.now();
  if (action === 'register' && now > EVENT_END) action = 'replay';

  const yes = (v) => v === true || v === 'yes';
  const rawSmsConsent = action !== 'profile' && !!p.phone && yes(body.sms_consent);
  const areaFlag = phoneAreaFlag(p.phone);
  // Numbers we can't text inside 8 AM to 8 PM local get no texts at all.
  const smsConsent = rawSmsConsent && areaFlag !== 'no-sms';
  // Tools have one checkbox (texts about their results), no marketing consent.
  const smsMarketing = action !== 'profile' && !tool && !!p.phone && areaFlag !== 'no-sms' && yes(body.sms_marketing_consent);
  const eventId = /^[A-Za-z0-9_.-]{8,64}$/.test(str(body.event_id, 64))
    ? str(body.event_id, 64)
    : 'bt-' + crypto.randomBytes(8).toString('hex');

  Object.assign(p, {
    ft_source: str(body.ft_source), ft_medium: str(body.ft_medium), ft_campaign: str(body.ft_campaign),
    ft_content: str(body.ft_content), ft_term: str(body.ft_term),
    lt_source: str(body.lt_source), lt_medium: str(body.lt_medium), lt_campaign: str(body.lt_campaign),
    lt_content: str(body.lt_content), lt_term: str(body.lt_term),
    campaign_id: str(body.campaign_id, 64), fbclid: str(body.fbclid, 500), gclid: str(body.gclid, 300),
    landing_page: str(body.landing_page, 1000), referrer: str(body.referrer, 500),
  });

  // 1) Zoom (register only)
  let zoom = { status: action === 'register' ? 'pending' : 'n/a' };
  if (action === 'register') {
    try {
      zoom = await zoomRegister(p);
    } catch (err) {
      logError('zoom', err, p.email);
      zoom = { status: 'failed' };
    }
  }

  // 2) GHL + 3) Meta, in parallel
  const nowIso = new Date(now).toISOString();
  const toolFields = tool ? {
    tool: tool.name,
    tool_result: str(body.tool_result, 300),
    tool_summary: text(body.tool_summary, 4000),
    state: str(body.state, 40),
    best_time: BEST_TIMES.includes(str(body.best_time, 20)) ? str(body.best_time, 20) : '',
    live_class: action === 'quiz' ? (yes(body.live_class) ? 'yes' : 'no') : '',
    notes: text(body.notes, 1000),
    referral_code: str(body.referral_code, 40),
    submitted_at: nowIso,
  } : {};
  const ghlPayload = {
    action,
    event: tool ? TOOL_EVENT_SLUG : EVENT_SLUG,
    first_name: p.first_name,
    last_name: p.last_name,
    email: p.email,
    phone: p.phone,
    segment: p.segment,
    sms_consent: action === 'profile' ? '' : (smsConsent ? 'yes' : 'no'),
    sms_consent_at: smsConsent ? nowIso : '',
    sms_marketing_consent: action === 'profile' ? '' : (smsMarketing ? 'yes' : 'no'),
    sms_marketing_consent_at: smsMarketing ? nowIso : '',
    consent_version: smsConsent || smsMarketing ? (tool ? TOOL_CONSENT_VERSION : CONSENT_VERSION) : '',
    consent_text: smsConsent ? (tool ? TOOL_CONSENT_TEXT : CONSENT_TEXT) : '',
    marketing_consent_text: smsMarketing ? MARKETING_CONSENT_TEXT : '',
    // registered | already | skipped (no Zoom credentials yet: Plan B, no alert) | failed (alert)
    zoom_status: action === 'register' ? (['registered', 'already', 'skipped'].includes(zoom.status) ? zoom.status : 'failed') : '',
    zoom_join_url: zoom.join_url || '',
    zoom_registrant_id: zoom.registrant_id || '',
    zoom_fallback_url: action === 'register' && zoom.status !== 'registered' && zoom.status !== 'already' ? ZOOM_FALLBACK_URL : '',
    registered_at: action === 'profile' || tool ? '' : nowIso,
    event_phase: action === 'profile' || tool ? '' : eventPhase(now),
    sms_confirm_ok: !tool && smsConsent && now < SMS_CONFIRM_CUTOFF ? 'yes' : 'no',
    phone_area_flag: areaFlag,
    source_bucket: sourceBucket(p.lt_source || p.ft_source, p.lt_medium || p.ft_medium),
    ft_source: p.ft_source, ft_medium: p.ft_medium, ft_campaign: p.ft_campaign, ft_content: p.ft_content, ft_term: p.ft_term,
    lt_source: p.lt_source, lt_medium: p.lt_medium, lt_campaign: p.lt_campaign, lt_content: p.lt_content, lt_term: p.lt_term,
    campaign_id: p.campaign_id, fbclid: p.fbclid, gclid: p.gclid,
    landing_page: p.landing_page, referrer: p.referrer,
    ...toolFields,
  };

  const metaEvent = action === 'register' ? 'CompleteRegistration' : (action === 'replay' || tool) ? 'Lead' : null;
  const [ghlRes, metaRes] = await Promise.allSettled([
    sendToGhl(ghlPayload),
    metaEvent ? sendToMeta(metaEvent, p, req, eventId, tool) : Promise.resolve({ status: 'n/a' }),
  ]);
  if (ghlRes.status === 'rejected') logError('ghl', ghlRes.reason, p.email);
  if (metaRes.status === 'rejected') logError('capi', metaRes.reason, p.email);

  const ghlOk = ghlRes.status === 'fulfilled' && ghlRes.value.status === 'sent';
  const zoomOk = zoom.status === 'registered' || zoom.status === 'already';

  if (action === 'register' && !zoomOk && !ghlOk) {
    // Nothing captured anywhere: send them to Zoom's own page.
    return reply(res, 502, { ok: false, fallback_url: ZOOM_FALLBACK_URL });
  }
  if (action !== 'register' && !ghlOk) {
    return reply(res, 502, { ok: false });
  }

  return reply(res, 200, {
    ok: true,
    action,
    zoom: action === 'register' ? (zoomOk ? zoom.status : 'failed') : 'n/a',
    join_url: zoom.join_url || '',
    fallback_url: action === 'register' && !zoomOk ? ZOOM_FALLBACK_URL : '',
    event_id: metaEvent ? eventId : '',
    starts_at: new Date(EVENT_START).toISOString(),
  });
};

// Exposed for tests only.
module.exports._internals = { normalizePhone, sourceBucket, phoneAreaFlag, eventPhase, EVENT_START, EVENT_END };
