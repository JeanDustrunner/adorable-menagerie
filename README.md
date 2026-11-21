# Adorable Menagerie

A storefront and administration platform for a fictional crocheting and knitting studio, built in the open as an engineering portfolio. All content is synthetic; nothing can be bought.

## Current state

Repository foundation (phase 0): an Nx monorepo with a placeholder Next.js storefront. CI (GitHub Actions) and a pre-commit hook are in place. The placeholder page is deployed on Vercel: https://adorable-menagerie.vercel.app.

## Requirements

- Node.js 24 (see `.nvmrc`), npm 11

## Commands

Verified locally and by the GitHub Actions workflow.

| Task | Command |
|---|---|
| Install | `npm ci` |
| Run the storefront (http://localhost:3000) | `npx nx dev storefront` |
| Lint | `npx nx run-many -t lint` |
| Type check | `npx nx run-many -t typecheck` |
| Unit tests | `npx nx run-many -t test` |
| Build | `npx nx run-many -t build` |
| End-to-end tests | `npx playwright install --with-deps` once, then `npx nx e2e storefront-e2e` |
| Format check | `npx nx format:check --all` |

## Pre-commit hook

`npm ci` installs a hook (`.githooks/pre-commit`) that checks formatting and fails on lint warnings in the changed projects. CI reports lint warnings but does not fail on them.

## License

All rights reserved (`UNLICENSED`).
