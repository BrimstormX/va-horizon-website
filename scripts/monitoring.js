import * as Sentry from "https://browser.sentry-cdn.com/7.120.1/bundle.tracing.min.js";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.1,
});

