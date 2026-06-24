// Single source of truth for outward-facing links + install commands.
export const REPO = 'https://github.com/longsizhuo/openInvest'
export const WIKI = 'https://github.com/longsizhuo/openInvest/tree/main/docs/wiki'
export const LICENSE_URL = 'https://github.com/longsizhuo/openInvest/blob/main/LICENSE'

export type InstallTab = {
  id: string
  label: string
  /** each entry is one runnable command; copy joins them with newlines */
  commands: string[]
  note?: string
}

export const INSTALL_TABS: InstallTab[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    commands: [
      '/plugin marketplace add longsizhuo/openInvest',
      '/plugin install invest@openinvest',
    ],
    note: 'Then say "set up invest" to onboard. No API key needed (Coordinator path).',
  },
  {
    id: 'codex',
    label: 'Codex / agents',
    commands: [
      'CLAUDE_SKILLS_DIR=~/.codex/skills git clone https://github.com/longsizhuo/openInvest.git ~/openInvest && cd ~/openInvest && bash skills/install.sh',
    ],
    note: 'agentskills.io standard — point any agent at the skill dir via CLAUDE_SKILLS_DIR.',
  },
  {
    id: 'github',
    label: 'GitHub',
    commands: [
      'git clone https://github.com/longsizhuo/openInvest.git ~/openInvest && cd ~/openInvest && bash skills/install.sh',
    ],
    note: 'Manual install. The backend self-bootstraps (uv sync) on first run.',
  },
]
