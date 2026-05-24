# Security Headers

The site embeds a CSP fallback with `<meta http-equiv="Content-Security-Policy">` for hosts that cannot send custom HTTP headers. The fallback is intentionally stricter for executable script sources while still allowing the site's current inline CSS:

```text
default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: https:; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; media-src 'self'; worker-src 'self'; connect-src 'self' https://formsubmit.co https://plausible.io; form-action 'self' https://formsubmit.co;
```

The enforcing HTTP response headers are recorded in [`security-headers.conf`](security-headers.conf). Serve them from Cloudflare or another CDN in front of GitHub Pages:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https:; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; media-src 'self'; worker-src 'self'; connect-src 'self' https://formsubmit.co https://plausible.io; form-action 'self' https://formsubmit.co;
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Enabling Headers On GitHub Pages

GitHub Pages does not support custom security headers, so use Cloudflare or another CDN to inject them:

1. Add `vahorizon.site` to Cloudflare and proxy the `www` DNS record.
2. Navigate to **Rules -> Transform Rules -> Modify Response Header** and add the headers above.
3. Re-run SecurityHeaders.com against `https://www.vahorizon.site/` after deployment.

The CSP keeps `style-src 'unsafe-inline'` because the current static site still uses many inline style attributes. Executable inline JavaScript is no longer required.
