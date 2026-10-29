# 2048 — 软件工程实验（UML 建模）

汕头大学 CST9301 软件工程课程的八个 UML 建模实验，围绕自选项目 **2048 滑块合并游戏** 展开。
本项目只交付建模与分析文档，不包含游戏实现代码 —— 依据实验指导书，八个实验的要求全部是
“使用 StarUML 绘制 …图”与“提交实验报告”，未涉及编码、测试与部署。

## 目录

```
docs/
  00-规范.md          # 唯一口径：功能、用例、类、图文件清单、写作与报告规范
  01-选题与功能.md     # 实验一
  02-用例与用例叙述.md  # 实验二
  03-类图.md          # 实验三
  04-活动图.md         # 实验四
  05-状态图.md         # 实验五
  06-时序图.md         # 实验六
  07-MDA总报告.md      # 实验七（CIM1-3 + PIM1-4）
  08-版本控制实验.md    # 实验八（Git）
  materials/          # 课程原始材料（指导书、样例报告、UML 手册、课件）
  reports/            # 八份实验报告（Markdown 源 + 导出的 PDF）
models/
  drafts/             # Mermaid 草稿（.mmd）
  exports/            # 渲染/导出的图（.png），报告按文件名引用
  2048.mdj            # StarUML 工程（交付用，由组员用 StarUML 7 生成）
tools/
  render.sh           # 把 drafts 批量渲染为 exports
```

## 实验进度

| 实验 | 主题 | 文档 | 报告 | 主要图 |
|---|---|---|---|---|
| 一 | UML 概念与工具安装、选题与功能 | `docs/01-选题与功能.md` | `reports/lab01.md` | 安装截图 |
| 二 | 用例图与用例叙述 | `docs/02-用例与用例叙述.md` | `reports/lab02.md` | `uc-01` |
| 三 | 类图 | `docs/03-类图.md` | `reports/lab03.md` | `cd-01` |
| 四 | 活动图 | `docs/04-活动图.md` | `reports/lab04.md` | `ad-01`~`ad-03` |
| 五 | 状态图 | `docs/05-状态图.md` | `reports/lab05.md` | `st-01`、`st-02` |
| 六 | 时序图 | `docs/06-时序图.md` | `reports/lab06.md` | `sq-01`~`sq-06` |
| 七 | MDA 建模项目实例 | `docs/07-MDA总报告.md` | `reports/lab07.md` | `bc-01` + 复用 |
| 八 | 版本控制 | `docs/08-版本控制实验.md` | `reports/lab08.md` | Git 记录（含冲突演示） |

## 图的生成流程

1. 在 `models/drafts/` 写 Mermaid 草稿，`bash tools/render.sh` 渲染到 `models/exports/`。
2. 交付版用 StarUML 7 打开对应 Mermaid 代码（Tools ▸ Generate Diagram by Mermaid），
   排版微调后**导出同名 PNG 覆盖** `models/exports/` 中的文件，报告无需改动。
3. 用例图 `uc-01` 与业务用例图 `bc-01` 无 Mermaid 对应类型，直接在 StarUML 中绘制。

## 已知取舍

- 本项目参与者唯一（玩家），用例之间不存在父子关系，故不使用泛化关系。
- 活动图不使用泳道：不存在需要区分实施者的多个参与者。
- 版本管理实验以 Git 完成，并在报告中给出与 SVN 的操作对照。
