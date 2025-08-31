# Security Headers

This site now embeds a minimal [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy) via a `<meta http-equiv>` tag so browsers on hosts that don't yet set HTTP headers can still apply a safe default:

```
default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; media-src 'self';
```

The same policy, along with other recommended headers, is recorded in [`security-headers.conf`](security-headers.conf) and should be served as real HTTP response headers:

```
Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; media-src 'self';
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Enabling headers on GitHub Pages via Cloudflare

GitHub Pages does not support custom security headers, so use Cloudflare (or another CDN) in front of the site to inject them:

1. Add the `vahorizon.site` domain to Cloudflare and enable the orange cloud proxy for the `www` DNS record.
2. Navigate to **Rules → Transform Rules → Modify Response Header** and add the headers above. Start the CSP as `Content-Security-Policy-Report-Only` to monitor violations.
3. After confirming the policy is clean, change it to `Content-Security-Policy` (enforcing) and optionally remove the meta tag fallback.
4. Repeat the same steps for any additional subdomains.

## SecurityHeaders.com results

The site currently scores **F** on [SecurityHeaders.com](https://securityheaders.com/?q=www.vahorizon.site&followRedirects=on) because the host does not yet send these headers. After enabling them at the CDN, re-run the scan to verify the grade improves.
