# AaloPro internal dashboard

- This is a private founding-team dashboard for Bangladesh and Pakistan pilots, not the student app or a public investor site.
- Preserve existing work and inspect the stack before changing it. Explain any proposed stack replacement.
- Approved milestones: Overview and the read-only Pilots and partners section. Obtain approval of a plan before implementing further sections.
- Implemented sections: Overview and Pilots and partners. Future sections: Usage and Subscription records.
- Preserve Overview figures and definitions. Keep partner organizations separate from pilots; prospects never count as signed partners. Attribute pilot usage through explicit synthetic IDs.
- Use synthetic sample data only and show a prominent “Demo data” label. Never imply verified AaloPro traction.
- Keep actual usage, pilot targets, and partner network reach distinct. Keep paying parents distinct from paid student subscriptions.
- Do not connect to production, upload real student data, or store student names, phone numbers, voice recordings, or tutoring conversations.
- Do not add payment processing or cloud AI. Do not publish or deploy. Keep initial development local.
- Keep sample data and metric calculations separate from display components so an approved backend can be connected later.
- Overview must include activated students, weekly active students, completed tutoring questions, paying parents, signed pilot partners, country/date filters, an activity chart, pilot summary, and visible data freshness.
- Document metric definitions, date/filter behavior, and offline reporting limitations. Distinguish zero activity from missing or stale data.
- Use black/yellow AaloPro accents with a light, readable content area. Preserve the supplied logo; if absent, use an AaloPro text placeholder.
- Support laptop/mobile layouts, keyboard access, readable charts, and useful empty states.
- Keep dependencies and architecture simple. Check development tools, document missing setup, and verify approved acceptance checks.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
