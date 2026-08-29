# kyriecai.me

Personal site. Five rooms and a year-long scoreboard.

| Route       | What it is                                                          |
| ----------- | ------------------------------------------------------------------- |
| `/`         | The name, and where to find me.                              |
| `/focus`    | The 2026–27 run: three goals on an interactive growth chart. |
| `/timeline` | The record, newest first, as nodes on a vertical rail.       |
| `/build`    | Trio, and everything public on GitHub.                       |
| `/explore`  | Shell — content to come.                                     |
| `/admin`    | Sign in to edit the weekly numbers. Hidden from the tab bar. |

## The run

Starts **27 Aug 2026**, 48 compounding weeks, finishing **29 Jul 2027**.

| Goal        | From  | Weekly | Target        |
| ----------- | ----- | ------ | ------------- |
| Trio        | 10    | ×1.3   | 2,946,326 users |
| Audience    | 1,000 | ×1.2   | 6,319,748 followers |
| Open source | 0     | linear | 100 PRs       |

Each target is exactly `floor(start × rate⁴⁸)`, so the wall and the chart agree.
The chart defaults to a linear axis — the real hockey stick — with a **Log**
toggle that straightens the plan into a line you can be above or below, which is
the readable view in the months where linear is pinned to the floor.

## Editing the numbers

`ADMIN_PASSWORD` in the environment turns `/admin` on; leave it unset and the
site is read-only for everyone, which is the right default in production until
you want it. Signed in, the `actual` field on `/focus` is editable and commits
on blur.

Seed values live in `lib/progress.ts`. Edits land in `data/progress.json`, which
is gitignored — and **ephemeral on Render**, so anything typed there is lost on
redeploy. Move the store to a disk or a KV before relying on it. Trio's series is
the one meant to be swapped for the admin API; the seam is `readProgress()`.

## Stack

Next.js 16 (App Router) · Tailwind v4 · TypeScript. The glass tab bar is
[GlassSurface](https://reactbits.dev) from the react-bits registry; the liquid
pill that trails it is [liquid-gooey](https://gooey.jakubantalik.com).

```bash
npm install
npm run dev
```

## Content

Everything readable lives in `lib/`: `site.ts`, `projects.ts`, `timeline.ts`,
`goals.ts`. Add an entry, the page redraws itself.

Drop `avatar.jpg` (or `.png` / `.webp`) into `public/` and the round portrait
appears on the home page; with no such file there, nothing renders.
