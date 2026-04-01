# OpenSpec 项目文档

## 项目目标

openspec 是一个 **AI 原生的规格驱动开发 CLI 工具**，用于在软件开发流程中以结构化方式管理变更提案、规格说明和实现任务。

核心理念：**先写规格，再写代码**（spec-first）。让 AI 辅助从探索想法、撰写规格，到任务实现的完整开发周期。

工作流程：
```
探索 (explore) → 提案 (propose) → 实现 (apply) → 归档 (archive)
```

---

## 技术栈

- **运行时**: Node.js（通过 nvm 管理，当前使用 v24.14.0）
- **包管理**: npm（全局安装：`npm install -g openspec`）
- **CLI 工具**: openspec v1.2.0
- **安装路径**: `/root/.nvm/versions/node/v24.14.0/bin/openspec`
- **工作目录**:
  - 主目录：`/data/ai/claudecode/openspec/open-spec-first`
  - 辅助目录：`/root/ai/claudecode/openspec/open-spec-first`

---

## 目录结构约定

```
<project-root>/
└── openspec/
    ├── config.yaml              # 项目配置（schema、context、rules）
    ├── specs/                   # 主规格目录（能力级别的持久规格）
    │   └── <capability>/
    │       └── spec.md
    └── changes/                 # 活跃变更目录
        ├── <change-name>/       # 单个变更
        │   ├── .openspec.yaml   # 变更元数据
        │   ├── proposal.md      # 做什么 & 为什么
        │   ├── specs/           # 变更级 delta 规格（与主规格同步时合并）
        │   ├── design.md        # 如何做
        │   └── tasks.md         # 实现步骤（checkbox 列表）
        └── archive/             # 已完成变更的归档
            └── YYYY-MM-DD-<change-name>/
```

---

## 工作流 Schema

当前配置使用 **`spec-driven`**（默认 schema）。

| 阶段 | Artifact | 说明 |
|------|----------|------|
| 1 | `proposal.md` | 变更的动机、目标、非目标 |
| 2 | `specs/` | 能力规格说明（功能需求） |
| 3 | `design.md` | 技术设计、架构决策 |
| 4 | `tasks.md` | 分解后的实现任务列表 |

Artifact 依赖顺序：`proposal → specs → design → tasks`

`applyRequires`（实现前必须完成的 artifact）：`["tasks"]`

---

## CLI 命令参考

```bash
openspec --version                          # 查看版本（当前 1.2.0）
openspec list [--json]                      # 列出活跃变更
openspec new change "<name>"               # 创建新变更目录
openspec status --change "<name>" [--json] # 查看变更的 artifact 完成状态
openspec instructions <artifact-id> \
  --change "<name>" [--json]               # 获取创建某 artifact 的 AI 指令
openspec archive [change-name]             # 归档已完成变更
openspec validate [item-name]              # 验证变更或规格
openspec show [item-name]                  # 显示变更或规格详情
openspec schemas [--json]                  # 列出可用 schema
openspec view                              # 交互式仪表盘
openspec spec                              # 管理规格
openspec change                            # 管理变更提案
openspec config                            # 查看/修改全局配置
```

---

## Claude Code 技能（Skills）

项目集成了以下 Claude Code 技能，位于 `.claude/skills/` 和 `.claude/commands/`：

| 技能 / 命令 | 触发方式 | 作用 |
|------------|---------|------|
| openspec-explore | `/opsx:explore` | 探索模式：思维伙伴，只读不写代码 |
| openspec-propose | `/opsx:propose` | 提案模式：一步创建所有 artifacts |
| openspec-apply-change | `/opsx:apply` | 实现模式：按 tasks.md 逐步实现 |
| openspec-archive-change | `/opsx:archive` | 归档模式：完成后归档变更 |

---

## 配置规范

`openspec/config.yaml` 支持以下字段：

```yaml
schema: spec-driven          # 使用的工作流 schema

context: |                   # 项目背景（AI 生成 artifact 时参考）
  Tech stack: ...
  Conventions: ...
  Domain: ...

rules:                       # 每类 artifact 的自定义规则
  proposal:
    - Keep proposals under 500 words
    - Always include a "Non-goals" section
  tasks:
    - Break tasks into chunks of max 2 hours
```

**当前状态**：`config.yaml` 中 `context` 和 `rules` 字段尚未填写，仅配置了 `schema: spec-driven`。

---

## 命名标准

| 对象 | 命名格式 | 示例 |
|------|---------|------|
| 变更名称 | kebab-case | `add-user-auth`、`fix-login-bug` |
| 归档目录 | `YYYY-MM-DD-<change-name>` | `2026-04-01-add-user-auth` |
| Artifact 文件 | 固定名称（由 schema 定义） | `proposal.md`、`design.md`、`tasks.md` |
| 规格目录 | kebab-case 能力名 | `openspec/specs/authentication/` |

---

## 约束条件

1. **openspec CLI 必须全局安装**：技能文件标注 `Requires openspec CLI`，不可在本地项目中局部安装。
2. **探索模式禁止写代码**：`/opsx:explore` 只能读取文件、创建 OpenSpec artifacts，不得修改应用代码。
3. **Artifact 顺序依赖**：不可跳过依赖，例如在没有 `proposal.md` 的情况下创建 `design.md`。
4. **归档前需确认**：有未完成任务或 artifacts 时，必须人工确认才能归档。
5. **Delta spec 同步**：`changes/<name>/specs/` 中的 delta 规格在归档时需同步到 `openspec/specs/`。

---

## 外部依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| openspec | 1.2.0 | 核心 CLI 工具（npm 全局包） |
| Node.js | v24.14.0 | 运行时（nvm 管理） |

---

## 当前项目状态

- **活跃变更数**：0（`openspec list` 返回空）
- **归档变更**：存在归档目录（`openspec/changes/archive/`）
- **主规格目录**：`openspec/specs/` 目录存在但内容待查
- **配置**：基础配置完成，`context` 和 `rules` 尚未填写
