#!/usr/bin/env bash
# design-sync pre-build setup for openinvest-site (same shape as invest-gui:
# the repo IS the package, not an installed dependency).
#  1. node_modules/openinvest-site → isolated pkgroot (no nested node_modules,
#     so ts-morph's descendant walk can't ELOOP).
#  2. compile Tailwind (reads the repo's own tailwind.config.js, content ./src/**)
#     and prepend the brand Google Fonts @import so previews render in Inter /
#     JetBrains Mono. Emitted as a real file inside pkgroot so cfg.cssEntry stays
#     within PKG_DIR's realpath.
# Wired as cfg.buildCmd so re-syncs reproduce this before the converter.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

mkdir -p .ds-sync/pkgroot
ln -sfn ../../package.json   .ds-sync/pkgroot/package.json
ln -sfn ../../src            .ds-sync/pkgroot/src
ln -sfn ../../tsconfig.json  .ds-sync/pkgroot/tsconfig.json
ln -sfn ../../.design-sync   .ds-sync/pkgroot/.design-sync
ln -sfn "$ROOT/.ds-sync/pkgroot" node_modules/openinvest-site

FONTS='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans:wght@400;500;600;700&display=swap");'
npx --yes tailwindcss -i src/index.css -o .ds-sync/.tw.css --minify
{ printf '%s\n' "$FONTS"; cat .ds-sync/.tw.css; } > .ds-sync/pkgroot/ds-tailwind.css
rm -f .ds-sync/.tw.css
echo "wrote .ds-sync/pkgroot/ds-tailwind.css ($(wc -c < .ds-sync/pkgroot/ds-tailwind.css) bytes)"
