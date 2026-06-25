/**
 * Preview-only provider for design-sync.
 *
 * openinvest-site is a DARK, glassmorphism site: components are white
 * translucent frosted-glass panels meant to sit on the fixed owl background
 * (a dark surface). On a default white preview card they'd be white-on-white
 * and vanish — so we wrap every preview in a dark surface, the same visual
 * context a design built with this DS renders in. We also provide the i18n
 * context (components call useI18n; it defaults to English without crashing,
 * but the provider makes the language switch real).
 *
 * NOT part of the shipped app — wired via cfg.extraEntries + cfg.provider.
 */
import type { ReactNode } from "react";
import { I18nProvider } from "../src/i18n";

export function DSPreviewProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <div
        style={{
          background: "#0E1726",
          color: "#ffffff",
          fontFamily: "Inter, 'Noto Sans', system-ui, sans-serif",
          padding: 28,
        }}
      >
        {children}
      </div>
    </I18nProvider>
  );
}
