# Personal instructions (not committed)

These add to the team CLAUDE.md for my sessions. The team file wins on code style; this file wins on how we work together.

## Don't ask a million questions

I'd rather correct a wrong assumption than answer ten questions.

- Find the closest existing pattern in the repo and follow it. Don't ask anything the code can answer.
- If something's ambiguous, pick the sensible option, keep going, and list your assumptions at the end.
- If you truly must ask, ask once, everything at the same time, with a recommended answer for each so I can say "yes".
- Only stop and ask for: deleting files, git history, pushing, dependency changes, or production config the ticket
  doesn't spell out.
- Never ask permission to read, search, or run tests / lint / prettier / type-check. Just run them and tell me the
  results. Don't end with "want me to test it?"
- When I say "make the change if needed," that's a yes. Make it.

## Check before you claim

- Don't say when something started or what it "used to do" from reading the current code. Check `git log` / `git log -L`
  first and name the commit and ticket. (A session once said "since 2022" without looking. It was an August refactor.)
- When I say "this wasn't an issue before," take that seriously: find what changed (code, data, or environment)
  before proposing a fix.
- For data bugs, look at the live API response before guessing. Rule out the obvious data theories (like the
  October fiscal-year rollover) with evidence, not opinion.
- When an environment behaves differently (prod vs. UAT vs. STG vs. temp), compare each environment's API responses
  before touching frontend code, and tell me plainly whether it's a frontend or backend problem. I don't know which
  API the temp site uses. Say so and suggest checking the Network tab instead of assuming.

## When I doubt a fix

- If I say a fix "isn't great," show me how the same problem is handled elsewhere in the repo (for example, the
  dataset details pages) and explain why with file references.
- If my existing solution is actually right, say so. Don't change things just because I questioned them. A comment
  explaining why it's there is often the right change.

## How I like fixes done

1. Reproduce the bug in a test using the real data shape (e.g., the API's literal `"null"` string), and confirm it fails.
2. Make the smallest fix that matches the surrounding code.
3. Run the tests for that folder, then ESLint and Prettier on the touched files.
4. If Prettier reformats lines I didn't change, undo those parts. The diff should show only the fix.
5. Check whether the same bug pattern exists in sibling components (e.g., revenue and spending charts from the same
   refactor), and fix or flag them.

For data-driven fixes, tell me if the fix still holds when the data changes back or changes again. A short
"if the table does X → what happens" table is perfect.

Think about behavior over time: what happens next month, at the fiscal-year rollover (Oct 1), or when a new file
drop replaces an old one. Call out anything that would lose history.

## How I like answers

- Short and direct. Recommend one option instead of listing every possibility.
- Lead with the answer ("It's not the rollover, it's one bad row"), then the evidence.
- I also write for business and product folks. When I ask for a business version, give exactly what I asked for
  (if I say one sentence, it's one sentence) with no code, library names, or jargon.
- When summarizing a ticket, give two versions: plain-language (what changed, why it matters to users) and technical
  (files, approach, risks).
- End-of-task report: what changed (file + one line each), assumptions, test/lint results with real counts, and what
  still needs a human (visual check, cross-browser, Axe).

## Research / spike tickets

1. Compare the options in a short table, with a recommendation.
2. Find the real blocker (often a data or mapping gap, not the library choice).
3. Small POC with about 5 representative cases, including an awkward edge case.
4. Notes in two parts: business-facing and technical.

## Environment

- Windows 11, VS Code extension, PowerShell and Git Bash. The repo is in OneDrive, so quote paths with spaces. Odd
  file locks or slow watching are probably OneDrive sync.
- Python is not installed (the `python` command opens the Microsoft Store). Use Node for scratch scripts.
- Ripgrep globs can't nest braces: use `*.{js,jsx,ts,tsx}`, not `{a,src/**/*.{js,ts}}`.
- Scratch scripts and output go in the session scratchpad, not the repo root. Don't add more `*.log` files there.

## Git

- Never commit, push, or open a PR unless I ask in that conversation.
- When I do: branch `FDG-#####` off `master`, and start the commit message with the ticket number.

## Lessons learned

- Fresh install or build failures: suspect dependency drift before code. Compare the lockfile with what's on disk
  (`npm ls <pkg>`). The May 2026 "sharp" failure was really two problems: a network block plus lockfile churn.
- Prefer direct dependencies over `overrides`. Overrides cascade into nested packages and break legacy chains.
- Machine-generated security findings (Mythos): the parent Jira story holds the verdicts. Implement the intent in our
  style, not the generated diff, and check whether an earlier ticket already fixed it.
