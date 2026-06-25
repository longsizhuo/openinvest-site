# design-sync notes — openinvest-site

openinvest-site is the OpenInvest **marketing landing page** (Vite + React 19 + Tailwind 3 +
motion + recharts), not a published component library. Synced in **package shape, synth-entry
mode** (same pattern as invest-gui): the repo IS the package, the converter synthesizes an entry
from `src/components/` and extracts props from the `.tsx` via ts-morph. Project: `openinvest-site`
(claude.ai/design), id `40903159-414f-46e3-802b-034259b72d54`. Scope = **brand/design-language
subset**: 7 authored previews (InstallTabs, ChartCard, the 4 charts, CommitteeFlow); Background /
TopNav render their real component as floor cards; SnapController is no-UI.

## ⚠️ Named exports (critical)
The site's components were all `export default function X()`. synth-entry's barrel uses
`export * from "<file>"`, which does NOT re-export defaults → nothing landed on
`window.OpenInvestSite` (`[BUNDLE_EXPORT] 10/10 not a component`). Fix applied: added a NAMED
export to every `src/components/**/*.tsx` (`export function X()` + `export default X`). Default
preserved, so the site's own default imports are unaffected. **RE-SYNC RISK: any NEW component
added as default-only won't export — add a named export.**

## Setup (cfg.buildCmd = `bash .design-sync/build-css.sh`)
Mirrors invest-gui: builds `.ds-sync/pkgroot/` (symlinks package.json/src/tsconfig/.design-sync,
no nested node_modules → no ts-morph ELOOP), points `node_modules/openinvest-site` → pkgroot,
compiles Tailwind from `src/index.css` (+ prepends Inter/JetBrains Mono/Noto Sans Google-Fonts
@import) → `.ds-sync/pkgroot/ds-tailwind.css` (cfg.cssEntry).

## Build / validate / re-sync (from repo root)
```
bash .design-sync/build-css.sh
DS_CHROMIUM_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1223/chrome-linux/chrome \
  node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules \
  --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json
```
- playwright@1.60.0 installed in `.ds-sync` (pins chromium build 1223, cached at
  `~/.cache/ms-playwright/chromium-1223`); `DS_CHROMIUM_PATH` points the render check at it.
- Re-sync: first fetch the project `_ds_sync.json` → `.design-sync/.cache/remote-sync.json`
  (DesignSync get_file), then run the driver with `--remote`.

## Dark glassmorphism preview context
Components are **white translucent frosted glass** meant for the dark owl background — on a default
white preview card they vanish. `DSPreviewProvider` (`.design-sync/preview-providers.tsx`, wired via
cfg.extraEntries + cfg.provider) wraps every preview in a `#0E1726` dark surface + `I18nProvider`
(components call `useI18n`; defaults to English without it). Charts (recharts) need a SIZED parent —
authored inside `ChartCard` (which is `h-64`).

## Fixed compiled Tailwind set
Only classes the site already uses are in the compiled CSS — arbitrary color utilities
(`bg-success/10`, etc.) will NOT resolve. `conventions.md` tells the design agent to use **hex +
inline styles** and the two real custom classes `glass-card` / `glass-nav`. Don't add color-class
vocabulary to conventions without confirming it compiles.

## Known render warns (triaged — not new on re-sync)
- `SnapController` — blank/bad: it's a behavior-only component (`return null`, wheel/touch hijack),
  no static UI. Honest floor card, non-blocking.
- `[FONT_REMOTE]` Inter / JetBrains Mono — remote Google-Fonts @import, loads at runtime. Expected.
- `[NO_DIST] no built entry — synthesizing from N src files` — expected: this repo runs **synth-entry**
  mode (no published dist for the DS), the converter synthesizes the bundle from `src/components/`. Not an error.

## Re-sync risks
- `.ds-sync/pkgroot`, the `node_modules/openinvest-site` symlink, `ds-tailwind.css`, and playwright
  in `.ds-sync` are gitignored. Fresh clone: `pnpm i`, reinstall `playwright@1.60.0` into `.ds-sync`,
  then `cfg.buildCmd` recreates pkgroot + CSS.
- Chart preview props are hardcoded sample strings (title/takeaway/caveat) — if a chart's API changes,
  re-grade its preview.
- The named-export edits to `src/components/**` are committed source changes — keep them.
