# kyriecai-me

All about kyriecai. Personal website of Kyrie Cai — [kyriecai.me](https://kyriecai.me)

Minimal by design: a name, and a line — *make something people want*.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- Deployed on Render, auto-deploy from `main`

## Branch & deploy flow

- `main` — production. Every push auto-deploys to Render.
- `dev` — main development branch. All work starts here (directly or via short-lived feature branches).
- GitHub Actions runs lint + build on push/PR to `main` and `dev`.

Workflow:

```
dev (work) → PR → main (merge) → Render auto-deploy
```

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Render setup (first time only)

1. Render dashboard → New → Blueprint → connect this GitHub repo.
2. Set branch to `main`, auto-deploy on.
3. Service settings → Custom Domains → add `kyriecai.me`, then point DNS at the value Render gives you.
