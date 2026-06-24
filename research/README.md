# OpenInvest 实验笔记 — 配图 / 表格 / 发帖素材（可复现）

围绕《LLM 多智能体投资系统的架构选择与校准优先评估》整理的全部图表与可发帖素材。

## 你大概率只需要这两样

1. **`LLM多智能体投资系统_增订版_配图.docx`** — 小红书长文版（9 页）。开头口语化自述 + 大白话「结论速览」，
   正文 1–9 节保持准确；7 幅图 + 3 张表全部以 PNG 形式嵌入（导成图片不丢表）。**正文文字约 6.5k 字（去空白），
   在 1 万字上限内**；删了完整参考文献（缩成一行精选），但所有实验数字与结论都保留。
2. **`xiaohongshu_png/`** — 10 张统一 1080×1350（4:5）白底图，已编好发帖顺序（01–10），可直接做轮播。

> 生成脚本：`build_doc_lite.py` 出小红书长文版（控字数）；`build_doc.py` 出完整学术版（含完整参考文献，约 14k 字，会超 1 万字限制）。

## 目录

| 路径 | 内容 |
|---|---|
| `figures/figure1..7_*.png` | 7 幅图（原始尺寸，白底，200 dpi） |
| `figures/table1..3_*.png` | 3 张表渲染成的 PNG（标题已烤进图内） |
| `xiaohongshu_png/01..10_*.png` | 上面 10 张图统一成 4:5 白底，发帖用 |
| `figures/_figure_stats.json` | 各图统计量 |
| `make_figures.py` | 生成 7 幅图（英文标签） |
| `make_tables.py` | 把 docx 里的 3 张表渲染成 PNG（中文，自动换行） |
| `build_doc.py` | 装配增订版 docx（口语化开头 + 图 + 表 PNG + 扩写） |
| `normalize_posts.py` | 把图/表统一成 4:5 白底发帖图 |

## 图清单与数据来源

- **图 1** 三机制分解（示意）　**图 2** 可验证性解析（t=SR·√T、Lo 2002 闭式，第 4.3 节）
- **图 3–7** 重算自 `../openinvest-research-archive/`：
  时代×regime 覆盖率热图、小样本伪精确、条件 vs 无条件 Brier、各窗口校准前后覆盖率、CONFIDENCE 分布
- **表 1–3** 逐字取自原 docx（框架对比 / 校准验收 / 五阶段实验）

## 一键复现

```bash
python make_figures.py --archive ../openinvest-research-archive --out ./figures   # 7 图
python make_tables.py  --src <原始.docx> --out ./figures                           # 3 表 PNG
python normalize_posts.py --figs ./figures --out ./xiaohongshu_png                 # 发帖图
python build_doc.py                                                                # 装配 docx
```

## 数值自校（均与正文/表 1–表 3 互校一致）

覆盖率 76/72/69% → 80/76/74%(γ=1.1)；downtrend-90d 54%；GC=F 2007–09 downtrend-90d 7%(n=14)；
金熊 Brier 条件 0.356 / 无条件 0.333；effective_n=1 覆盖率 42%；CONFIDENCE 中位 0.60(n=2100)；
regime-lock A/B：ACCUMULATE 348 vs 234、命中 57.2% vs 55.7%(各 n=912)；
TA 门：fundamental/news/sentiment 30d 命中 50.3/57.4/64.7%，CI 下界均 < 基率(71–73%)，全 FAIL。

> 口径说明：图 6 为**全历史诊断**口径（仅带宽扩张）；表 2 为**拟合 2007–2017 / 样本外 2018–2026** 验收口径
> （叠加小样本收缩 k=80），故样本外 81/80/76% 略高。二者不冲突，见正文 5.3 节。
