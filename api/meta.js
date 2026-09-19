// Meta Conversions API relay — first-party event delivery for pixel 4533371650216162.
//
// The browser pixel fires each event with an eventID; the page also beacons the
// same event here, and this function forwards it to Meta's Conversions API with
// that event_id, so Meta deduplicates the pair. Ad blockers and Safari/iOS
// tracking prevention that kill connect.facebook.net cannot block this path —
// it is a same-origin request to thejustinstark.com.
//
// Setup (one time): in Meta Events Manager → your pixel → Settings →
// Conversions API → Generate access token, then add it in Vercel as the
// META_CAPI_TOKEN environment variable and redeploy. Optionally set
// META_TEST_EVENT_CODE while testing (Events Manager → Test Events shows the
// code) and remove it when done. Without META_CAPI_TOKEN this endpoint
// answers 202 and does nothing, and the browser pixel keeps working alone.

const PIXEL_ID = '4533371650216162';
const ALLOWED_EVENTS = ['PageView', 'Lead', 'InitiateCheckout', 'Purchase'];
const ALLOWED_CUSTOM = ['content_name', 'content_category', 'value', 'currency'];

function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  });
  return out;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'POST only' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object' || !ALLOWED_EVENTS.includes(body.event_name)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'bad payload' }));
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    res.statusCode = 202;
    return res.end(JSON.stringify({ skipped: 'META_CAPI_TOKEN not set' }));
  }

  const cookies = parseCookies(req.headers.cookie);
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const customData = {};
  if (body.custom_data && typeof body.custom_data === 'object') {
    for (const k of ALLOWED_CUSTOM) {
      if (body.custom_data[k] !== undefined) customData[k] = body.custom_data[k];
    }
  }

  const event = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: String(body.event_id || '').slice(0, 64) || undefined,
    action_source: 'website',
    event_source_url: String(body.event_source_url || '').slice(0, 512) || undefined,
    user_data: {
      client_ip_address: ip || undefined,
      client_user_agent: req.headers['user-agent'] || undefined,
      fbp: cookies._fbp || undefined,
      fbc: cookies._fbc || undefined,
    },
    custom_data: customData,
  };

  const payload = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const r = await fetch(
      'https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events?access_token=' + encodeURIComponent(token),
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const out = await r.json().catch(() => ({}));
    res.statusCode = r.ok ? 200 : 502;
    return res.end(JSON.stringify(r.ok ? { events_received: out.events_received || 1 } : { error: out.error && out.error.message || 'capi error' }));
  } catch (e) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'relay failed' }));
  }
};
