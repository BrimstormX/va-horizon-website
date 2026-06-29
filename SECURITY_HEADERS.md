# Security Headers

The site embeds a CSP fallback with `<meta http-equiv="Content-Security-Policy">` for hosts that cannot send custom HTTP headers. The fallback is intentionally stricter for executable script sources while still allowing the site's current inline CSS:

```text
default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: https:; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; media-src 'self'; worker-src 'self'; connect-src 'self' https://formsubmit.co https://plausible.io; form-action 'self' https://formsubmit.co;
```

The enforcing HTTP response headers are now served directly by Vercel via the `headers` block in [`vercel.json`](vercel.json) (the site is deployed on Vercel, not GitHub Pages). The reference values are recorded in [`security-headers.conf`](security-headers.conf):

```text
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https:; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; media-src 'self'; worker-src 'self'; connect-src 'self' https://formsubmit.co https://plausible.io; form-action 'self' https://formsubmit.co;
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
```

## Enabling Headers On Vercel

The site deploys on Vercel, which serves these headers from the `headers` array in `vercel.json` (applied to `/(.*)`). To change them, edit `vercel.json` and redeploy.

1. Headers live in `vercel.json` under `"headers"`; redirects for legacy `.html` URLs live under `"redirects"`.
2. After deploy, re-run SecurityHeaders.com against `https://www.vahorizon.site/`.
3. CSP `frame-ancestors 'none'` only enforces via the HTTP header (not the meta fallback), which is why the Vercel header matters.

The CSP keeps `style-src 'unsafe-inline'` because the static site uses many inline style attributes. Executable inline JavaScript is not used (and is blocked by this policy).
