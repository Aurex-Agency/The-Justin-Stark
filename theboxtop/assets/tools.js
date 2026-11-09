/* Shared by the Box Top tools (/theboxtop/quiz/, /theboxtop/trust-finder/).
   Attribution: same first-touch (30 days) / last-touch keys as the launch page (bt.ft, bt.lt).
   btTools.send(action, lead) posts to /api/boxtop-register and resolves to
   { outcome: 'saved' } | { outcome: 'invalid', message } | { outcome: 'manual' }.
   On 'saved' it fires the browser half of the server's Meta Lead (same event_id). */
(function () {
  'use strict';
  var loadedAt = Date.now();
  var qs = new URLSearchParams(location.search);
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'gclid'];
  function store() { try { return window.localStorage; } catch (e) { return null; } }
  var ls = store(), touch = {}, has = false;
  KEYS.forEach(function (k) { var v = qs.get(k); if (v) { touch[k] = v.slice(0, 500); has = true; } });
  touch.landing_page = location.href.slice(0, 1000);
  touch.referrer = (document.referrer || '').slice(0, 500);
  touch.ts = Date.now();
  var ft = null, lt = null;
  try {
    ft = JSON.parse((ls && ls.getItem('bt.ft')) || 'null');
    if (ft && Date.now() - ft.ts > 30 * 864e5) ft = null;
    lt = JSON.parse((ls && ls.getItem('bt.lt')) || 'null');
  } catch (e) { ft = null; lt = null; }
  if (!ft) { ft = touch; try { ls && ls.setItem('bt.ft', JSON.stringify(ft)); } catch (e) {} }
  if (has || !lt) { lt = touch; try { ls && ls.setItem('bt.lt', JSON.stringify(lt)); } catch (e) {} }

  var NAMES = { quiz: 'The Box Top Quiz', 'trust-finder': 'Legacy Trust Finder' };

  function send(action, lead) {
    var body = {
      action: action,
      first_name: lead.first, last_name: lead.last, email: lead.email, phone: lead.phone,
      state: lead.state || '', best_time: lead.time || '', live_class: !!lead.liveClass, notes: lead.notes || '',
      sms_consent: !!lead.smsConsent,
      tool_result: lead.toolResult || '', tool_summary: lead.toolSummary || '', referral_code: lead.referredBy || '',
      company: lead.company || '', elapsed_ms: Date.now() - loadedAt,
      ft_source: ft.utm_source || '', ft_medium: ft.utm_medium || '', ft_campaign: ft.utm_campaign || '', ft_content: ft.utm_content || '', ft_term: ft.utm_term || '',
      lt_source: lt.utm_source || '', lt_medium: lt.utm_medium || '', lt_campaign: lt.utm_campaign || '', lt_content: lt.utm_content || '', lt_term: lt.utm_term || '',
      campaign_id: lt.utm_id || ft.utm_id || '', fbclid: lt.fbclid || ft.fbclid || '', gclid: lt.gclid || ft.gclid || '',
      landing_page: location.href.slice(0, 1000), referrer: ft.referrer || ''
    };
    return fetch('/api/boxtop-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.status === 200 && j.ok) {
            if (window.fbq && j.event_id) {
              fbq('track', 'Lead', { content_name: NAMES[action] || action, content_category: 'boxtop_tool' }, { eventID: j.event_id });
            }
            return { outcome: 'saved' };
          }
          if (r.status === 422 && j.errors) {
            var k = Object.keys(j.errors)[0];
            return { outcome: 'invalid', message: j.errors[k] };
          }
          return { outcome: 'manual' };
        });
      })
      .catch(function () { return { outcome: 'manual' }; });
  }

  window.btTools = { send: send };
})();
