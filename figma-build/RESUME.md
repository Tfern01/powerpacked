# Powerpacked Figma rebuild — resume notes

File: **Powerpacked Website**, fileKey `0BfmmJEZ2IHL0Np1xeG72b`
https://www.figma.com/design/0BfmmJEZ2IHL0Np1xeG72b

## Blocker (2026-11-10 ~20:15 UTC)
Figma MCP monthly allowance on Tyler's **Starter plan is used up**. Every MCP call
(incl. `use_figma` and `get_screenshot`) now returns: "You've reached the Figma MCP
tool call limit on the Starter plan." Verified with a trivial probe call.
Per Figma docs, Starter = 20 MCP calls/month for View/Collab seats; Full/Dev seats
on Starter get no MCP allowance. Fix options (Tyler's call):
- Wait for the monthly reset, or
- Upgrade the team to Professional with a Full/Dev seat (200 calls/day).

Do NOT keep retrying — it is a hard stop, not a transient error.

## Built + screenshot-verified in Figma
- 01/02 Landing (Desktop 1440x2709, Mobile 390x2737)
- 03/04 About (Desktop 1440x1320, Mobile 390x1782)
- 05/06 Events (Desktop 1440x1308, Mobile 390x1722) — description-wrap fix verified
- 07/08 Gallery (Desktop 1440x1221, Mobile 390x1151) — heart-icon fix verified

## Built, NOT screenshot-verified (built just before the limit hit)
- 09/10 Shop (36:2, 36:49) — Desktop 1440x982, Mobile 390x966

## Scripts ready to run when the limit resets (all in this folder)
Run each with: `python3 run_screen.py <file> "<label>"`, then screenshot-verify.
- `signup.js` — 11/12 Signup (already written, never ran: rate limit hit first)
- `login.js` — 13/14 Login (already written, never ran)
- `account.js` — 15/16 Account / garage
- `member.js` — 17/18 Member profile
- `vehicle.js` — 19/20 Vehicle detail (likes, comments)
- `forum.js` — 21/22 Forum index, 23/24 Category, 25/26 Thread
- `contact.js` — 27/28 Contact
- `lock.js` — 29/30 Coming Soon lock page (no topbar/footer; card 3vh above center)
- `admin.js` — 31/32 Admin dashboard
- `search.js` — 33/34 Search results for "C10"
- `shop.js` — 09/10 Shop (already ran; re-run is idempotent if a rebuild is needed)
- `events.js`, `gallery.js` — already ran; re-run only if changes are made

All screen scripts are marked UNTESTED in their headers except signup/login/shop,
which follow the exact verified pattern (common.js + About/Events/Gallery).
All 14 scripts (12 screens + wire + shop) passed Node syntax validation
(wrapped as the Figma sandbox wraps them) on 2026-11-10 — but none of the new
ones has run against Figma yet, so expect possible runtime fixes on first run.
Known fix already applied in these scripts: `heart()` in common.js now uses a plain
frame (auto-layout was stacking its circles/square); back links use
`headWrap.insertChild(0, back)` so they sit above the kicker.

## Still to do after screens exist
1. `wire.js` — arrange frames in flow order + wire prototype reactions + menu overlays
   + set starting frame to Coming Soon. Run via run_use_figma.py (it is a plain
   use_figma script, not a run_screen.py screen). It returns a report of linked
   nodes, warnings (missing nodes), and errors. Defensive: each reaction is
   try/catch, so one bad node won't kill the pass. Overlay action shape
   (`OVERLAY` + overlaySettings) and `prototypeStartNode` are best-effort —
   check the returned report; if either fails, do it manually in Figma.
2. Image-fill pass: `upload_assets` logo.png / hero.jpg / placeholder-1/2/3.jpg
   onto the "IMG / ..." placeholder rects (collect nodeIds via an inspect script).
3. Sanity-walk the flows: Coming Soon → Landing → Signup → Account → Member →
   Vehicle; Landing → Gallery → Vehicle; Landing → Forum → Category → Thread.
4. Screenshot-verify every screen after building.

## Intentionally unwired (no destination screen exists)
- Login "Resend it" (no resend-verification screen built)
- Account "Save Profile" / "Add Ride" / "Log out" (form actions)
- Contact "Send Message" (form submit)
- Admin link cards (Manage Events/Products/Inbox pages not built)
- Forum Category "Start a Thread" (no new-thread form)
- Events-page event cards (no event-detail page)
- Shop is a dead end by design (coming soon).

## Builder notes (from common.js / run_screen.py)
- `run_screen.py <screen>.js "<label>"` concatenates common.js + screen, runs it.
- `use_figma` code max 50000 chars; skills `resource:figma-use,resource:figma-generate-design`
  must be in every mutating call. No sessionId exists in this CLI.
- Node naming: topbar "Nav / Logo|Menu|Search|Account", footer "Footer / <label>",
  buttons "Button / <label>", links "Link / <label>", cards "Event card / <title>",
  "Vehicle card / <ride>", "Wall item / <user>", "Forum cat / <name>",
  "Thread row / <title>", images "IMG / <key>".
