# AaloPro internal dashboard

Local founding-team Overview prototype. All records and partner labels are synthetic and do not represent verified traction. No backend, authentication, telemetry, payment processing or cloud AI is connected. Not deployed.

## Local development

Use Node.js 20.9+ and pnpm. In this Codex environment, expose the bundled Node runtime before running commands:

```sh
export PATH="/Users/mehedi895/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
pnpm install
pnpm dev
```

Open http://127.0.0.1:3000. The development server binds to localhost. A conventional Node installation can replace the bundled runtime path. No secrets or environment variables are needed. pnpm-lock.yaml fixes resolved dependency versions.

```sh
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

## Structure and definitions

- `src/data/demo.ts`: synthetic IDs, completed-question events, paid subscription records, fictional pilots and metric definitions.
- `src/lib/metrics.ts`: country filtering, inclusive UTC date ranges, unique counts and daily chart aggregation.
- `src/components/overview.tsx`: Overview display and local filter state.
- `src/app`: page, layout and responsive styles.

Activated students count first completed questions cumulatively through the selected end date. Weekly active students count distinct students completing questions in the seven days ending on that date. Completed questions use the inclusive selected range. Paying parents count distinct accounts with active paid student subscriptions at the end date; subscription end dates are exclusive. Signed partners count distinct signed organizations through that date.

Sample coverage is 1 Sep–11 Oct 2026, with a fixed reporting cutoff of 11 Oct 2026. Presets end at the cutoff. Out-of-coverage selections show unavailable values, not zero. Weekly active values are unavailable if their full seven-day window lacks coverage. Pilot report timestamps describe the fixed snapshot, independently of the historical metric end date. These data are a fixed reporting snapshot, not live or complete offline activity.

Pilot targets are planned student counts. Partner reach is an estimated audience, never an activation total; reach across partners may overlap and should not be presented as unique students. Paying parents remain separate from paid student subscriptions. Future navigation sections are marked Coming later.

AaloPro uses a text placeholder because no logo was supplied. Replace it with an approved logo asset without redesigning the logo. This local milestone has no team authentication; shared hosting and access control require a separately approved scope. Do not publish or deploy.

## Pilots and partners

`/pilots` is the read-only second milestone. Country, partnership stage, partner-name search and reporting date filter the directory and summaries. Expand a partner with a mouse or keyboard to inspect its pilots, agreement dates, aggregate usage, planned dates and milestones. No contact details or student-level records appear in the UI.

`src/data/partners.ts` separates fictional organizations from pilot records, with dated status history, sample report dates and planned milestones. The original two pilots and all Overview totals are preserved. A planned follow-on cohort belongs to the same Bangladesh organization and does not add a signed partner. Two additional fictional prospects have no attributed usage.

Pilot assignments use explicit synthetic student IDs. Pilot usage counts through the latest available report on or before the selected UTC reporting date; no report gives unavailable values, while lagged reports show the lag. Targets are planning figures and reach stays at organization level. Reach is never summed into a unique audience. Summary counts respect every filter. Status history supports planned, active, paused and completed; fixture data currently illustrates active and planned pilots. Planned milestone completion is always unverified.

No dependencies were added. Overview and Pilots and partners share navigation. No backend, production connection, edit controls or deployment were added.
