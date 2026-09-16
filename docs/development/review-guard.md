# Review Guard

Review Guard is a lightweight script that analyzes staged files locally and pull request diffs in CI.

It is educational by default: local warnings do not block commits. Strict mode can fail the process in CI for extreme cases.

## Commands

```bash
npm run review:staged
npm run review:pr
REVIEW_GUARD_STRICT=true npm run review:pr
```

## Local warnings

Review Guard warns about:

- commits with more than 15 relevant files
- files over 800 lines
- files over 1200 lines, with stronger messaging
- files with many local types or interfaces
- files with many helper functions outside utils/helpers locations
- changes touching many domains at once
- dependency or lock files changed together with several feature files

Generated and irrelevant paths such as `dist`, `build`, `coverage`, `.next`, `.turbo`, `.expo`, `node_modules`, `android/build`, and `ios/Pods` are ignored.

## Strict mode

Set `REVIEW_GUARD_STRICT=true` to turn selected extreme cases into failures:

- PRs over the configured critical file limit
- PRs over the configured critical changed-line limit
- new or heavily changed files above the critical line limit

The default thresholds live in `review-guard.config.json`.

## PR exceptions

CI accepts the `review-guard:exception` or `large-pr-approved` PR label for configured large-PR exceptions.

Use exceptions sparingly and explain the reason in the PR description.
