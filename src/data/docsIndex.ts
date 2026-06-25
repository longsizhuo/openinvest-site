// Generated index of wiki chapters and ADRs
export interface DocIndexItem {
  slug: string;
  title: string;
  intent: string;
  category: 'wiki' | 'adr';
}

export const DOCS_INDEX: DocIndexItem[] = [
  {
    "slug": "01-architecture",
    "title": "架构总览",
    "intent": "系统分层心智模型",
    "category": "wiki"
  },
  {
    "slug": "02-agents",
    "title": "4 角色委员会",
    "intent": "委员会角色设计与辩论协议",
    "category": "wiki"
  },
  {
    "slug": "03-dreaming",
    "title": "Dreaming 记忆整合",
    "intent": "记忆整合",
    "category": "wiki"
  },
  {
    "slug": "04-execution-paths",
    "title": "双执行路径",
    "intent": "双路径架构说明",
    "category": "wiki"
  },
  {
    "slug": "05-data-model",
    "title": "数据模型",
    "intent": "数据模型",
    "category": "wiki"
  },
  {
    "slug": "06-api",
    "title": "Web API 参考",
    "intent": "API Contract",
    "category": "wiki"
  },
  {
    "slug": "07-extending",
    "title": "扩展指南（cookbook）",
    "intent": "扩展开发指引",
    "category": "wiki"
  },
  {
    "slug": "08-deployment",
    "title": "生产部署",
    "intent": "部署",
    "category": "wiki"
  },
  {
    "slug": "09-troubleshooting",
    "title": "故障排查",
    "intent": "故障排查",
    "category": "wiki"
  },
  {
    "slug": "10-design-system",
    "title": "GUI 设计系统",
    "intent": "GUI 设计规范",
    "category": "wiki"
  },
  {
    "slug": "11-rl-training",
    "title": "11 — RL 训练 / Backtest / 参数搜索",
    "intent": "回测与参数搜索流程",
    "category": "wiki"
  },
  {
    "slug": "12-verification",
    "title": "12 — Verification（实测验证 / \"科学证据\"）",
    "intent": "实验验证",
    "category": "wiki"
  },
  {
    "slug": "13-param-tuning-feasibility",
    "title": "openInvest 参数调优可行性诊断",
    "intent": "决策参数",
    "category": "wiki"
  },
  {
    "slug": "13-param-tuning-feasibility-addendum",
    "title": "参数调优可行性诊断 — 补充文档",
    "intent": "参数耦合分析与调优可行性",
    "category": "wiki"
  },
  {
    "slug": "14-sweep-runner",
    "title": "Sweep Runner",
    "intent": "参数 sweep 工具使用指南",
    "category": "wiki"
  },
  {
    "slug": "15-path-probability",
    "title": "15 — 概率表路径化：多窗分布 + 四类路径形状",
    "intent": "路径形状分布算法与校准",
    "category": "wiki"
  },
  {
    "slug": "16-ta-analysts-experiment",
    "title": "16 — TradingAgents 式分析师实验（test_ta，2026-06-11）",
    "intent": "实验结论（分析师 subagent 预注册 gate 结果）",
    "category": "wiki"
  },
  {
    "slug": "17-asset-feature-sets",
    "title": "17 — 资产类别特征集声明（显式契约）",
    "intent": "资产类别特征集单一可信源",
    "category": "wiki"
  },
  {
    "slug": "18-governance-conventions",
    "title": "18 — 治理章程：口径定义 / 判据 / 脏数据红线 / 否决权（用户签字）",
    "intent": "治理章程",
    "category": "wiki"
  },
  {
    "slug": "001-dual-execution-paths",
    "title": "ADR-001: 委员会保留 Skill + Web/Cron 双执行路径",
    "intent": "双执行路径架构决策",
    "category": "adr"
  },
  {
    "slug": "002-no-claude-agent-sdk",
    "title": "ADR-002: 暂不升级 Web/Cron 到 Claude Agent SDK",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "003-v2-data-model",
    "title": "ADR-003: portfolio.md 升 v2 通用 schema",
    "intent": "数据模型",
    "category": "adr"
  },
  {
    "slug": "004-v1-fallback-retirement",
    "title": "ADR-004: v1 Portfolio Fallback 正式退场",
    "intent": "记录 v1 portfolio 兼容 fallback 正式删除的决策",
    "category": "adr"
  },
  {
    "slug": "005-daily-report-split",
    "title": "ADR-005: daily_report.py 调度/采集/渲染分离",
    "intent": "架构决策",
    "category": "adr"
  },
  {
    "slug": "006-event-layer",
    "title": "ADR-006：事件感知层（第一层）+ 轻量新闻 RAG",
    "intent": "事件驱动架构决策",
    "category": "adr"
  },
  {
    "slug": "007-few-shot-retirement",
    "title": "ADR 007 — few-shot 路线退役，CIO 保持 zero-shot",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "008-caution-insight-deferred",
    "title": "ADR 008 — caution 改用 lift-based 评分；现有数据下正式休眠",
    "intent": "记录 caution insight lift-based 评分决策及休眠理由",
    "category": "adr"
  },
  {
    "slug": "009-no-ta-style-analyst-agents",
    "title": "ADR-009: 否决 TradingAgents 式分析师 subagent 扩展",
    "intent": "架构决策",
    "category": "adr"
  },
  {
    "slug": "010-param-management",
    "title": "ADR-010 — 参数管理纪律",
    "intent": "参数分层纪律",
    "category": "adr"
  },
  {
    "slug": "011-hold-oracle-semantics",
    "title": "ADR-011 — HOLD Oracle 语义：hold_wrong 阈值该设多宽",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "013-trim-concentration-override",
    "title": "ADR-013: SOLVENCY=strong 时集中度不触发 TRIM（确定性后处理）",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "014-logging-convention",
    "title": "ADR-014: 生产代码 logging 规范",
    "intent": "日志规范",
    "category": "adr"
  },
  {
    "slug": "016-ledger-mutation-idempotency",
    "title": "ADR-016: 账本写入幂等性（可重放触发必须有原子幂等闸）",
    "intent": "账本写入幂等性规则",
    "category": "adr"
  },
  {
    "slug": "017-config-via-api",
    "title": "ADR-017 — 配置走 API（config-via-API）",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "018-dca-dip-reserve",
    "title": "ADR-018 — 自动定投与子弹池现金语义（DCA + dip-reserve）",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "019-remove-solvency-concentration-override",
    "title": "ADR-019 — 移除 SOLVENCY 集中度自动兜底（集中度只由 lens 控制）",
    "intent": "决策参数",
    "category": "adr"
  },
  {
    "slug": "020-concentration-lens-default-off",
    "title": "020-concentration-lens-default-off",
    "intent": "",
    "category": "adr"
  },
  {
    "slug": "021-currency-aware-path-profile",
    "title": "021-currency-aware-path-profile",
    "intent": "",
    "category": "adr"
  }
];
