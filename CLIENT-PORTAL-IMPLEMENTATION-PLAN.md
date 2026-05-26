# VA Horizon Client Portal Implementation Plan

This document is the master build plan for turning the VA Horizon client portal prototype into a production app. The marketing site remains static. The portal is implemented as a separate secure application at:

`https://portal.vahorizon.site/`

## 1. Product Goal

Build a client dashboard where every VA Horizon client can log in and see the operating status of their account:

- VA team roster and activity.
- Qualified lead pipeline from HighLevel (GHL).
- Readymode dialing performance.
- SMS campaign performance.
- Billing status, invoices, and payment method management through Stripe.
- Onboarding milestones.
- Direct support messages with VA Horizon.

The portal must be multi-tenant. A client can only see their own organization, leads, invoices, messages, and metrics.

## 2. Architecture

### Recommended Stack

- Frontend and API: Next.js App Router with TypeScript.
- Hosting: Vercel.
- Domain: `portal.vahorizon.site`.
- Auth and database: Supabase Auth + Postgres + Row Level Security.
- Billing: Stripe Billing + Stripe Customer Portal.
- CRM source of truth: HighLevel (GHL).
- Dialer metrics source: Readymode report export or supported integration.
- Styling: Montserrat, VA Horizon navy/gold/warm palette, quiet dashboard UI.

### Application Boundary

Do not place the production portal inside the static marketing site as a public HTML page. The existing prototype can be used as visual direction, but the real portal needs server-side authentication, secrets, webhooks, tenant checks, and backend integration logic.

Use a separate project:

```text
c:\Users\yousef\Desktop\Files\va-horizon-client-portal
```

The marketing website can link to the portal after deployment, but it should not contain portal credentials, API keys, or protected data.

## 3. Required Screens

### `/login`

Purpose: secure client login.

Requirements:

- Email/password login through Supabase Auth.
- Password reset flow.
- Redirect authenticated users to `/dashboard`.
- Redirect unauthenticated users away from protected routes.

### `/dashboard`

Purpose: account overview.

Show:

- Month-to-date dials.
- Qualified leads versus monthly guarantee.
- Contact/connect rate.
- Active VA count.
- Recent qualified leads.
- Recent support messages.
- Sync health for GHL, Stripe, and Readymode.

### `/team`

Purpose: client-visible VA roster.

Show:

- VA name, role, status, shift, quality score, dials today, dials month-to-date, leads submitted.
- Role types: cold caller, acquisition manager, disposition manager, lead manager.
- Admin-only edit controls in `/admin`, not in the client view.

### `/leads`

Purpose: GHL lead pipeline snapshot.

Show:

- Lead address or masked address, seller name, VA owner, stage, motivation, ARV, submitted date.
- Filters by stage and VA.
- Link or identifier back to GHL for internal users.

Do not expose unnecessary seller PII. Only show fields that are useful for client oversight.

### `/metrics`

Purpose: Readymode performance reporting.

Show:

- Daily dials chart.
- Connects, talk time, contact rate, qualified leads.
- Agent-level and team-level rollups.
- Import timestamp and source file/status.

### `/sms`

Purpose: SMS Blast campaign reporting.

Show:

- Campaign name, status, list source, sent count, replies, leads, spend, start date.
- Note that all routed leads are tagged and pushed to GHL.

### `/billing`

Purpose: Stripe-backed billing view.

Show:

- Current plan.
- Subscription status.
- Last invoice summary.
- Invoice history.
- Button to open Stripe Customer Portal.

Never store or render card numbers. Use Stripe-hosted Customer Portal for payment method changes, invoices, and subscription management.

### `/onboarding`

Purpose: onboarding timeline.

Show:

- Intake completed.
- GHL buildout.
- Readymode provisioned.
- VA team assigned.
- VA onboarding call.
- First dials live.
- First qualified lead submitted.
- SMS Blast add-on, if applicable.
- Future scale review, if applicable.

### `/support`

Purpose: client-to-VA-Horizon messaging.

Show:

- Support thread list.
- Message composer.
- Internal notifications to VA Horizon when a client sends a new message.

### `/admin`

Purpose: VA Horizon internal operations.

Admin capabilities:

- Invite client users.
- Create and update organizations.
- Assign users to organizations.
- Map Stripe customer IDs.
- Map GHL location IDs.
- Upload Readymode CSV reports.
- Review sync runs and failures.
- Manage onboarding milestones.

Admin routes must require a membership role of `owner` or `admin`.

## 4. Required API Routes

### `/api/admin/invite-client`

Creates a Supabase Auth invite and a membership record.

Inputs:

- `email`
- `fullName`
- `organizationId`
- `role`, default `client`

Rules:

- Admin-only.
- Log all invites to `audit_logs`.
- Do not create duplicate memberships.

### `/api/stripe/webhook`

Receives Stripe events.

Handle:

- `customer.created`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.created`
- `invoice.finalized`
- `invoice.paid`
- `invoice.payment_failed`

Rules:

- Verify Stripe webhook signature.
- Make processing idempotent.
- Mirror subscription and invoice state into Supabase.
- Do not grant access solely from client-side Stripe redirects.

### `/api/stripe/portal-session`

Creates an on-demand Stripe Customer Portal session.

Rules:

- Authenticated client only.
- Use the signed-in user's active organization.
- Look up the mapped Stripe customer ID.
- Return a short-lived portal URL.

### `/api/ghl/oauth/callback`

Completes HighLevel OAuth.

Rules:

- Admin-only setup path.
- Store encrypted OAuth tokens or store through Supabase vault/secure server-only fields.
- Associate the token with a specific organization and GHL location.

### `/api/ghl/sync`

Syncs GHL contacts, opportunities, stages, assigned users, tags, notes, and selected custom fields.

Rules:

- Admin-only manual trigger plus scheduled Vercel cron later.
- Support GHL Private Integration Token only as a temporary fallback.
- Store only portal-needed fields.
- Log `sync_runs` with status, counts, and errors.

### `/api/readymode/import`

Imports Readymode daily reports.

Rules:

- Admin-only.
- Accept CSV upload in v1.
- Normalize fields into `daily_dial_metrics`.
- Validate required columns before import.
- Log rejected rows.
- Do not reverse-engineer private Readymode endpoints.

### `/api/support/messages`

Creates or reads support messages.

Rules:

- Authenticated users can only read/write messages in their organization.
- Admins can read all messages.
- Notify VA Horizon via email or internal alert after a client message.

## 5. Database Model

Use UUID primary keys and `created_at` / `updated_at` timestamps on every table.

Core tables:

- `organizations`
- `profiles`
- `memberships`
- `client_accounts`
- `va_agents`
- `daily_dial_metrics`
- `leads`
- `sms_campaigns`
- `onboarding_milestones`
- `support_threads`
- `support_messages`
- `stripe_customers`
- `stripe_invoices`
- `subscriptions`
- `integration_accounts`
- `sync_runs`
- `audit_logs`

### Tenant Access

Every client-owned record must include `organization_id`.

Supabase Row Level Security policies:

- A user can read organization records only when a row exists in `memberships` for `auth.uid()`.
- A user can insert support messages only for organizations where they are a member.
- Admin/owner users can access admin-only workflows.
- Service-role API routes can bypass RLS only on the server.

## 6. Integration Details

### HighLevel

Production preference: OAuth app.

Temporary fallback: Private Integration Token for one sub-account at a time.

Sync target fields:

- Contact ID.
- Opportunity ID.
- Pipeline stage.
- Assigned user.
- Tags.
- Lead source.
- Seller name.
- Property address.
- City/state.
- Motivation score.
- ARV.
- Date submitted.
- Last updated.

Webhook target:

- Contact created/updated/deleted.
- Opportunity created/updated/stage changed/status changed.

### Stripe

Use Stripe for all billing-sensitive workflows.

Implementation:

- Create products/prices for VA Horizon plans.
- Map `organizations` to Stripe customers.
- Store subscription status and invoice summary only.
- Use Customer Portal sessions for client billing actions.
- Use webhook state as the source of truth for access and subscription status.

### Readymode

V1 implementation:

- Export reports from Readymode.
- Upload CSV in `/admin`.
- Parse and normalize the file.
- Show daily and monthly metrics in `/metrics`.

Fields needed:

- Report date.
- Agent name or agent ID.
- Campaign/list name.
- Dials.
- Connects.
- Talk time.
- Qualified leads.
- Dispositions.

Vendor-access task:

- Contact Readymode support and request the supported export/API/App Garage method for daily agent and campaign reporting.

## 7. Environment Variables

Required in `.env.local` and Vercel:

```text
NEXT_PUBLIC_APP_URL=https://portal.vahorizon.site
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PORTAL_RETURN_URL=https://portal.vahorizon.site/billing
GHL_CLIENT_ID=
GHL_CLIENT_SECRET=
GHL_REDIRECT_URI=https://portal.vahorizon.site/api/ghl/oauth/callback
GHL_PRIVATE_INTEGRATION_TOKEN=
READMODE_IMPORT_SECRET=
SUPPORT_NOTIFY_EMAIL=
```

Never expose server-only variables with `NEXT_PUBLIC_`.

## 8. Build Phases

### Phase 1: Secure Shell

- Create Next.js app.
- Add Supabase Auth.
- Add protected dashboard layout.
- Add tenant membership lookup.
- Add `/admin` guard.

### Phase 2: Portal UI

- Convert the prototype into route-based dashboard pages.
- Use real data loaders with seeded fallback data in local development.
- Add empty/loading/error states.

### Phase 3: Database And RLS

- Add migrations.
- Add seed data.
- Add RLS policies.
- Add typed data access helpers.

### Phase 4: Stripe

- Add webhook route.
- Add portal-session route.
- Add billing page.
- Test with Stripe CLI and test-mode products.

### Phase 5: GHL

- Add OAuth callback.
- Add manual sync route.
- Add mapping functions and tests.
- Add webhook route when the OAuth app is ready.

### Phase 6: Readymode

- Add CSV upload parser.
- Add admin import UI.
- Add metric rollups and chart data.
- Replace CSV path with vendor-supported API/export automation after approval.

### Phase 7: Deployment

- Deploy to Vercel.
- Add `portal.vahorizon.site`.
- Configure DNS.
- Configure Vercel env vars.
- Configure Stripe webhook endpoint.
- Configure GHL OAuth redirect URI.
- Add portal link to the marketing site after the portal is live.

## 9. Work Youssef Needs To Do

Accounts and credentials:

- Create or confirm Vercel access.
- Create or confirm Supabase project.
- Create Stripe live/test products and prices.
- Enable Stripe Customer Portal.
- Create Stripe webhook signing secret.
- Create HighLevel developer app or private integration token.
- Confirm Readymode admin/client portal access.

Readymode support request:

```text
Hi Readymode Support,

We are building a client reporting portal for VA Horizon and need the supported way to export or access daily reporting data by agent and campaign.

Required fields:
- Agent daily dials
- Connects
- Talk time
- Dispositions
- Qualified lead outcomes
- Campaign or lead-file performance
- Call recording links if available and permitted

Can you confirm whether this should be done through App Garage, scheduled exports, API access, or another supported integration path?
```

Compliance:

- Review privacy policy and terms before launch.
- Decide which seller PII fields clients may see.
- Define retention policy for lead records and messages.

## 10. Test Plan

Unit tests:

- GHL contact/opportunity mappers.
- Stripe webhook event handlers.
- Readymode CSV parser.
- Tenant access helpers.

Integration tests:

- Stripe test-mode subscription and webhook flow.
- GHL sandbox OAuth and sync.
- Readymode sample CSV import.

E2E tests:

- Admin invites client.
- Client logs in.
- Client sees only their company.
- Dashboard metrics load.
- Billing opens Stripe-hosted portal.
- Support message sends.

Security tests:

- Cross-client access is blocked.
- API secrets are not in the browser bundle.
- Stripe signatures are required.
- Admin routes reject client users.
- Webhook retries are idempotent.

## 11. Acceptance Criteria

The implementation is production-ready when:

- A client can log in at `portal.vahorizon.site`.
- A client sees only their own dashboard.
- GHL leads sync into the client lead pipeline.
- Readymode report imports update call metrics.
- Stripe billing page reflects subscription and invoice status.
- Stripe Customer Portal opens from `/billing`.
- Admin can invite clients and manage organizations.
- Sync failures are visible to VA Horizon admins.
- No card data or server secrets are stored client-side.
- RLS blocks cross-tenant data access.

## 12. Source References

- HighLevel API: REST API, OAuth, Private Integration Token, contacts, opportunities, and webhooks.
- Stripe docs: Customer Portal, subscription webhooks, billing portal sessions.
- Readymode docs: Client Portal, App Garage, getting started checklist, reporting/export confirmation through support.
- Next.js docs: App Router and route handlers.
- Supabase docs: Auth, server-side rendering, user management, and Row Level Security.
- Vercel docs: Next.js deployment, environment variables, custom domains.
