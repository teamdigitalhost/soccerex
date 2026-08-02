const CONSENT_KEY = 'sx_cookie_consent'

export function getConsent() {
  try { return localStorage.getItem(CONSENT_KEY) } catch { return null }
}

export function setConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value) } catch {}
}

/* Inject GA4 and LinkedIn Insight Tag once — no-op if no env var or already loaded.
   Never call until the user has accepted analytics cookies. */
export function loadAnalytics() {
  const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID
  const liId  = import.meta.env.VITE_LINKEDIN_PARTNER_ID

  if (ga4Id && !window.__sx_ga4_loaded) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function() { window.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
    window.gtag('js', new Date())
    window.gtag('config', ga4Id)
    window.__sx_ga4_loaded = true
  }

  if (liId && !window.__sx_li_loaded) {
    window._linkedin_partner_id = liId
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    window._linkedin_data_partner_ids.push(liId)
    ;(function(l) {
      if (!l) { window.lintrk = function(a, b) { window.lintrk.q.push([a, b]) }; window.lintrk.q = [] }
      const s = document.createElement('script')
      s.type = 'text/javascript'; s.async = true
      s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
      document.head.appendChild(s)
    })(window.lintrk)
    window.__sx_li_loaded = true
  }
}
