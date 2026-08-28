<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

- **提交规范**：commit message 里绝不写 `Co-Authored-By: Claude` 或任何 AI 的 co-author 署名（用户明确要求）。
- **分支流程**：`main` = 生产分支（Render 自动部署），`dev` = 主开发分支。改动提交到 `dev`，经 PR 合入 `main`。
- **设计基调**：极简优先。
- **语言**：与用户用中文沟通。
