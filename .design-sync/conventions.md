# openinvest-site — how to build with this design system

A **dark, glassmorphism** brand kit for OpenInvest (a self-hosted AI investment
committee). The signature look: white **translucent frosted-glass panels with
SHARP corners** floating over a dark surface — deliberately "serious / scientific,"
never soft. Do not round corners on panels.

## 1. Always build on a dark surface
Components are frosted-glass / light-on-dark and only read correctly on a dark
background. Paint it first (the site uses a fixed photo + dark overlay; a flat dark
fill is fine too):

```jsx
<div style={{ minHeight: "100vh", background: "#0E1726", color: "#fff", fontFamily: "Inter, sans-serif" }}>
  {/* compose components here */}
</div>
```

The `Background` component is the site's fixed owl photo + dark gradient; drop it once
at the root for the real backdrop. Wrap the app in the `I18nProvider` export if you want
the en/zh language switch (components call `useI18n` and default to English without it).

## 2. The frosted-glass panel is the core idiom
Use the `glass-card` class for any content panel and `glass-nav` for a top bar — both are
**white translucent + backdrop-blur + sharp corners** (defined in the shipped stylesheet):

```jsx
<div className="glass-card p-6 text-ink"> … </div>
```

`glass-card` already sets dark `text-ink`, so text inside is dark-on-frosted. These are the
ONLY two custom classes — everything else is Tailwind utilities from the compiled set
(only classes the site already uses are present; a new name like `bg-surface-2` won't resolve).

## 3. Palette — fixed values (the compiled Tailwind set is frozen)
The shipped stylesheet contains ONLY the utility classes the site already uses — a new class
name like `bg-success/10` will NOT resolve. For your own color/layout glue, use **inline
styles with these hex values** (or the `glass-card`/`glass-nav` classes). A handful of base
utilities (`text-ink`, `text-muted`, `text-white`, `bg-brand`) are compiled and safe; when in
doubt, inline the hex.

- **Surfaces/text**: hero/dark base `#0E1726`, light `#F8F9FB`, titles `#1F2937` (ink),
  secondary `#949CA8` (muted).
- **Semantic accents** (color carries meaning, never decoration): brand/primary `#2E6FF2`,
  win/up `#16A062`, loss/failure `#D64545`, caution `#BE781E`, structural `#8468E0`.
- **Fonts**: Inter (body), JetBrains Mono (all figures, commands, code).

Example glue: `style={{ color: "#16A062" }}` for a win, `style={{ color: "#D64545" }}` for a loss.

## 4. Components (window.OpenInvestSite)
- `InstallTabs` — brew-style tabbed copy-paste install box (Claude / Codex / GitHub).
- `ChartCard` — the evidence card wrapper: `title` + `takeaway` + chart `children` + `caveat` + `source`.
- `BearCagrChart` / `RegimeSharpeChart` / `AnalystGateChart` — recharts bar charts (give them a sized
  parent, e.g. inside `ChartCard`, which is `h-64`).
- `CrossModelHeatmap` — a pass/fail grid (plain CSS, no sizing needed).
- `CommitteeFlow` — the flat-diagram of the 4-role committee (full-width SVG).
- `TopNav` — fixed translucent nav bar; `Background` — fixed owl backdrop; `SnapController` — behavior-only
  (renders nothing).

## Where the truth lives
- Tokens + the two glass classes: `styles.css` → `_ds_bundle.css` (read before styling).
- Per-component API: each `<Name>.d.ts` and `<Name>.prompt.md`.

## One idiomatic snippet
```jsx
import { ChartCard, BearCagrChart } from "<this design system>";

<div style={{ background: "#0E1726", padding: 28 }}>
  <ChartCard title="2022 bear market" takeaway="Committee +1.95% vs buy-and-hold −0.43%."
             caveat="GC=F walk-forward, n=251." source="gold_fourth_arm_result.json">
    <BearCagrChart />
  </ChartCard>
</div>
```
