# Commits and PRs

This repository uses lightweight guardrails to keep commits and pull requests easy to review.

## Commit format

Use Conventional Commits with a required scope:

```text
<type>(<scope>): <description>
```

Valid examples:

```text
feat(booking): create booking types
fix(auth): handle expired token
refactor(payment): extract payment mapper
test(user): add user service tests
chore(deps): update dependencies
ci(github): add review guard workflow
```

Allowed types:

- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `style`
- `chore`
- `ci`
- `perf`
- `build`
- `revert`

Avoid vague commits:

```text
feat: ajustes
fix: correção
update files
changes
wip
```

## Splitting PRs

Prefer one main responsibility per PR.

Good:

- PR 1: `refactor(payment): extract payment mapper`
- PR 2: `feat(payment): add payment retry flow`
- PR 3: `test(payment): add payment retry tests`

Avoid a single PR that mixes refactor, feature work, tests, dependency updates, and unrelated cleanup.

## Expected flow

```text
Develop
↓
Stage related files
↓
Run pre-commit checks
↓
Commit using Conventional Commits
↓
Push
↓
Open PR using template
↓
CI runs PR Guard
↓
Reviewer receives a smaller and clearer PR
```

## Local commands

```bash
npm run review:staged
npm run lint:staged
npm run commitlint -- --from HEAD~1 --to HEAD --verbose
```

The `commit-msg` hook validates commit messages. The `pre-commit` hook runs Review Guard and lint-staged against staged files only.

## AI and coding agents

Agents must follow the same flow as humans:

- Always create commits with Conventional Commits.
- Always use a scope.
- Never create generic commits such as `update files`, `changes`, `fix stuff`, or `wip`.
- Prefer small, logical commits.
- Do not mix refactor and feature work in the same commit when they can be separated.
- Do not mix mobile, backend, frontend, and Next.js changes in the same commit unless the change is necessarily transversal.
- Before committing, run the configured local checks.
- If Review Guard emits warnings, decide whether the commit should be split.
- If a warning is intentionally accepted, explain it in the PR description.
- Do not bypass hooks.
- Do not use `--no-verify` except in documented emergencies.
