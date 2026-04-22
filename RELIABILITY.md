# Reliability Runbook -- PrimeShine Ops

Every failure mode hit during development goes here. No code ships without a known recovery path.

## Architecture decisions

### RLS on every table
- All 7 Supabase tables have Row Level Security enabled before any data touches them.
- Portal users see only their own data via `auth.uid() = customer_id`.
- Admin users see all data via a role check on the profiles table.
- If RLS is missing on a new table, the app returns empty arrays, not leaked data. Fail closed.

### Demo mode fallback
- Every API function checks `if (!supabase)` before making a call.
- Without env vars, the app falls back to hardcoded mock data. No crashes, no blank screens.
- This means: local dev works without a Supabase project. CI builds pass without secrets.

### Stripe integration
- Stripe Elements only load when `VITE_STRIPE_PUBLISHABLE_KEY` is set.
- Without the key, the booking flow renders a demo card form. The flow still completes.
- No real charges happen until a backend PaymentIntent endpoint is wired up. Pre-auth only.

### Auth flow
- `AuthContext` wraps the entire app. Session persistence via Supabase `onAuthStateChange`.
- If Supabase is not configured, `useAuth()` returns `{ user: null, loading: false }`.
- Header falls back to a demo "Sign in" button that sets local state. No broken routes.

## Failure modes encountered

### 1. React.Fragment without React import
- **What happened:** Vite's automatic JSX transform does not put `React` in scope. Using `<React.Fragment>` caused a runtime error.
- **Fix:** Added explicit `import React` in BookingFlow.jsx.
- **Prevention:** Use `<>...</>` shorthand or always import React when using `React.*`.

### 2. Public asset imports via ES modules
- **What happened:** `import logo from '/assets/logo.png'` does not work for files in `public/` with Vite. Vite's import system is for `src/` assets.
- **Fix:** Changed to string path constants (`export const LOGO_FULL = '/assets/logo.png'`).
- **Prevention:** Files in `public/` are referenced by string path, never imported.

### 3. Port conflict on dev server
- **What happened:** Port 5173 was already in use from a previous session.
- **Fix:** Vite auto-increments to 5174. No manual intervention needed.
- **Prevention:** Non-issue. Vite handles it.

### 4. GitHub CLI auth token expiry
- **What happened:** `gh` token expired between sessions. Push failed with "invalid token."
- **Fix:** Ran `gh auth setup-git` to re-configure the credential helper.
- **Prevention:** Use `gh auth setup-git` after every `gh auth login` to persist the credential helper.

### AI follow-up endpoint
- Uses Anthropic API (Claude Haiku 4.5) to generate personalized follow-up texts.
- Grounded: the model only sees the current customer's data. No cross-customer leakage.
- Falls back to a static demo message when VITE_ANTHROPIC_API_KEY is not set.
- Uses `anthropic-dangerous-direct-browser-access` header for client-side calls. In production, this should move to a server-side API route.
- Follow-up text and timestamp saved to the booking record for audit trail.

### Auth flow (magic link + password)
- Portal customers use magic link (email OTP) by default. No password to remember.
- Admin users sign in with email + password (admin role set in profiles table).
- Auth page at /login with tab toggle between sign-in and sign-up.
- If Supabase is not configured, Header falls back to demo sign-in flow.

## Handoff checklist

Before handing this codebase to another developer:
- [ ] They can run `npm install && npm run dev` and see the full app with mock data
- [ ] They can run `npm run build` with zero errors
- [ ] RELIABILITY.md is up to date with any new failure modes
- [ ] Every Supabase table has RLS enabled
- [ ] No secrets in the repo (check: `git log --all -p | grep -i "secret\|password\|key=" | head`)
- [ ] Commit messages describe the "why," not just the "what"
