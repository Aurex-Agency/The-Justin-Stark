#!/usr/bin/env node
// One-time (re-runnable) backfill: everyone who registered through the raw Zoom
// link (posts, pinned comments, talk-show notes) is in Zoom but not in GHL.
// This pages through the webinar's registrants and posts each one to the GHL
// "BT · Inbound" webhook as action=zoom_direct, with their personal join_url.
//
// GHL handles action=zoom_direct as: create the contact only if it doesn't
// already carry bt-registered; tag bt-src-zoom-direct; never write attribution
// fields (so ad-driven registrants are never overwritten).
//
// Run locally (never deployed; tools/ is in .vercelignore):
//   ZOOM_ACCOUNT_ID=… ZOOM_CLIENT_ID=… ZOOM_CLIENT_SECRET=… ZOOM_WEBINAR_ID=… \
//   GHL_BOXTOP_WEBHOOK_URL=… node tools/zoom-registrants-to-ghl.js --dry-run
// Drop --dry-run to send. Needs Zoom scope webinar:read:list_registrants:admin.

const DRY = process.argv.includes('--dry-run');
const env = process.env;
for (const k of ['ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID', 'ZOOM_CLIENT_SECRET', 'ZOOM_WEBINAR_ID'].concat(DRY ? [] : ['GHL_BOXTOP_WEBHOOK_URL'])) {
  if (!env[k]) { console.error('Missing env var ' + k); process.exit(1); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function token() {
  const r = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + encodeURIComponent(env.ZOOM_ACCOUNT_ID), {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(env.ZOOM_CLIENT_ID + ':' + env.ZOOM_CLIENT_SECRET).toString('base64') },
  });
  const j = await r.json();
  if (!r.ok) throw new Error('token ' + r.status + ' ' + JSON.stringify(j));
  return j.access_token;
}

(async () => {
  const t = await token();
  let next = '', total = 0, sent = 0, failed = 0;
  do {
    const url = 'https://api.zoom.us/v2/webinars/' + encodeURIComponent(env.ZOOM_WEBINAR_ID) +
      '/registrants?status=approved&page_size=300' + (next ? '&next_page_token=' + encodeURIComponent(next) : '');
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + t } });
    const j = await r.json();
    if (!r.ok) throw new Error('registrants ' + r.status + ' ' + JSON.stringify(j));
    for (const reg of j.registrants || []) {
      total++;
      const payload = {
        action: 'zoom_direct',
        event: 'boxtop-launch-2026-11-09',
        first_name: reg.first_name || '',
        last_name: reg.last_name || '',
        email: (reg.email || '').toLowerCase(),
        phone: '',
        zoom_status: 'registered',
        zoom_join_url: reg.join_url || '',
        zoom_registrant_id: reg.id || '',
        registered_at: reg.create_time || '',
        source_bucket: 'zoom-direct',
      };
      if (DRY) { console.log('[dry-run]', payload.email, payload.registered_at); continue; }
      const g = await fetch(env.GHL_BOXTOP_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (g.ok) sent++; else { failed++; console.error('GHL', g.status, payload.email); }
      await sleep(150); // stay well under GHL webhook rate limits
    }
    next = j.next_page_token || '';
  } while (next);
  console.log(`Registrants: ${total} · sent: ${sent} · failed: ${failed}${DRY ? ' (dry run, nothing sent)' : ''}`);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
