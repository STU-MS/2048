# 2048 — 软件工程实验（UML 建模）

汕头大学 CST9301 软件工程课程的八个 UML 建模实验，围绕自选项目 **2048 滑块合并游戏** 展开。
本项目只交付建模与分析文档，不包含游戏实现代码 —— 依据实验指导书，八个实验的要求全部是
“使用 StarUML 绘制 …图”与“提交实验报告”，未涉及编码、测试与部署。

## 目录

```
docs/
  00-规范.md           # 唯一口径：功能、用例、类、图名、写作与报告规范
  materials/          # 课程原始材料（指导书、样例报告、UML 手册、课件）
  reports/
    lab01.md          # 实验一  UML 概念与工具安装、选题与功能
    lab02.md          # 实验二  用例图与用例叙述
    lab03.md          # 实验三  类图
    lab04.md          # 实验四  活动图
    lab05.md          # 实验五  状态图
    lab06.md          # 实验六  时序图
    lab07.md          # 实验七  MDA 建模项目实例（CIM1-3 + PIM1-4）
    lab08.md          # 实验八  版本控制
    pdf/              # 交付用 PDF（按学校封面模板导出后放这里）
```

八份报告各自自包含：正文、表格、图全部在一份文件里，图用 ```mermaid 代码块内联，
不依赖任何外部图片文件。

## 实验进度

| 实验 | 主题 | 报告 | 主要图 |
|---|---|---|---|
| 一 | UML 概念与工具安装、选题与功能 | `docs/reports/lab01.md` | StarUML 安装截图 |
| 二 | 用例图与用例叙述 | `docs/reports/lab02.md` | `uc-01` |
| 三 | 类图 | `docs/reports/lab03.md` | `cd-01` |
| 四 | 活动图 | `docs/reports/lab04.md` | `ad-01`~`ad-03` |
| 五 | 状态图 | `docs/reports/lab05.md` | `st-01`、`st-02` |
| 六 | 时序图 | `docs/reports/lab06.md` | `sq-01`~`sq-06` |
| 七 | MDA 建模项目实例 | `docs/reports/lab07.md` | `bc-01` + 复用上列 |
| 八 | 版本控制 | `docs/reports/lab08.md` | Git 提交记录 |

## 图的处理

- 报告内的图以 ```mermaid 代码块内联，GitHub / VS Code / Typora 都能直接渲染。
- 需要交付 StarUML 版本时，把对应代码块贴进 StarUML 7 的 Tools ▸ Generate Diagram by Mermaid，
  排版微调后截图替换代码块即可；用例图 `uc-01`、`bc-01` 需在 StarUML 中手绘。
- 仓库不保存 PNG、`.mmd` 源文件与渲染脚本，避免中间产物堆积。

## 已知取舍

- 本项目参与者唯一（玩家），用例之间不存在父子关系，故不使用泛化关系。
- 活动图不使用泳道：不存在需要区分实施者的多个参与者。
- 版本管理实验以 Git 完成，并在报告中给出与 SVN 的操作对照。
