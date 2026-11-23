// Static site Worker for the public GWG product demo: every request is served
// from the uploaded build output (SPA fallback is configured by the manifest),
// with a self-only Content-Security-Policy and the baseline hardening headers.
const SECURITY_HEADERS = {
  "content-security-policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; "),
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

// 101/204/205/304 responses must not carry a body.
const NULL_BODY_STATUS = new Set([101, 204, 205, 304]);

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }
    return new Response(NULL_BODY_STATUS.has(response.status) ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
