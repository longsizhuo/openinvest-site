// Single source of truth for outward-facing links + install commands.
// Per-tab notes are translated in src/i18n.tsx (keyed by tab id).
export const REPO = 'https://github.com/longsizhuo/openInvest'
export const WIKI = 'https://github.com/longsizhuo/openInvest/tree/main/docs/wiki'
export const LICENSE_URL = 'https://github.com/longsizhuo/openInvest/blob/main/LICENSE'

export type InstallTab = {
  id: string
  label: string
  /** each entry is one runnable command; copy joins them with newlines */
  commands: string[]
}

export const INSTALL_TABS: InstallTab[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    commands: ['/plugin marketplace add longsizhuo/openInvest', '/plugin install invest@openinvest'],
  },
  {
    id: 'codex',
    label: 'Codex',
    commands: ['codex plugin marketplace add longsizhuo/openInvest'],
  },
  {
    id: 'github',
    label: 'GitHub',
    commands: ['git clone https://github.com/longsizhuo/openInvest.git ~/openInvest && cd ~/openInvest && bash skills/install.sh'],
  },
]
