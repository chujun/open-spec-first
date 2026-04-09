# 🌸 中国花卉地图 (China Flowers Atlas)

交互式 3D 地球花卉地图，展示中国各省代表性花卉，支持按季节筛选与花卉详情查看。

## 功能特性

- **3D 地球可视化** — 基于 Three.js + three-globe，标注全国 50 种代表性花卉
- **季节筛选** — 按春/夏/秋/冬筛选，3D 地球标注实时同步更新
- **花卉详情面板** — 点击标注查看名称、拉丁名、省份、花期、图片与简介
- **自动旋转** — 10 秒无操作后自动缓慢旋转，交互时暂停

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 3D 渲染 | Three.js + three-globe |
| 构建工具 | Vite 8 |
| 单元测试 | Vitest + @vitest/coverage-v8 |
| E2E 测试 | Playwright |

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器访问：`http://localhost:5173`

<!-- AUTO-GENERATED:SCRIPTS -->
## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 5173，监听所有网络接口） |
| `npm run build` | TypeScript 类型检查 + Vite 生产构建，输出至 `dist/` |
| `npm run preview` | 预览生产构建产物 |
| `npm run lint` | ESLint 静态代码检查 |
| `npm test` | 运行单元测试（Vitest） |
| `npm run test:coverage` | 运行单元测试并生成覆盖率报告 |
| `npm run fetch-data` | 从外部数据源拉取花卉数据（需要 tsx） |
<!-- END:AUTO-GENERATED:SCRIPTS -->

## 项目结构

```
china-flowers-app/
├── src/
│   ├── components/
│   │   ├── GlobeViewer.tsx    # 3D 地球渲染（Three.js）
│   │   ├── SeasonFilter.tsx   # 季节筛选面板
│   │   └── FlowerDetail.tsx   # 花卉详情侧栏
│   ├── context/
│   │   └── AppContext.tsx     # 全局状态（selectedSeasons, selectedFlower）
│   ├── data/
│   │   ├── flowers.json       # 50 种花卉数据（名称、坐标、季节、图片 URL）
│   │   └── loader.ts          # 数据加载与季节筛选工具函数
│   └── types/
│       └── flower.ts          # FlowerRecord、Season 类型定义
├── e2e/
│   └── app.spec.ts            # Playwright E2E 测试
├── src/data/loader.test.ts    # Vitest 单元测试（100% 覆盖率）
├── playwright.config.ts
└── vite.config.ts
```

## 数据说明

花卉数据位于 `src/data/flowers.json`，包含 50 条记录，每条字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识，格式 `省份缩写-花名` |
| `name` | string | 中文名 |
| `latinName` | string | 拉丁学名 |
| `provinces` | string[] | 分布省份 |
| `coordinates` | [lng, lat] | 经纬度坐标 |
| `seasons` | Season[] | 花期（spring/summer/autumn/winter） |
| `imageUrl` | string | Wikimedia Commons 图片 URL |
| `description` | string | 花卉简介 |
| `color` | string | 地球标注颜色（hex） |

## 测试

### 单元测试

```bash
npm test              # 运行测试
npm run test:coverage # 生成覆盖率报告
```

覆盖范围：`src/data/loader.ts` 数据加载与季节筛选逻辑，覆盖率 **100%**。

### E2E 测试

```bash
npx playwright test                    # 运行全部 E2E 测试
npx playwright test --headed           # 有界面模式
npx playwright test --grep "季节筛选"   # 按名称过滤
```

E2E 测试覆盖：页面加载、季节筛选、数据完整性、bug 修复回归验证。

## Bug 修复记录

### v1.1.0

| 问题 | 原因 | 修复 |
|------|------|------|
| 季节筛选后 3D 地球标注不更新 | `GlobeViewer` 异步初始化回调使用闭包旧值，初始化完成时覆盖已筛选状态 | 改用 `flowersRef.current` / `selectedFlowerRef.current` 获取最新 props |
| 11 种花卉无图片（空 imageUrl） | 数据录入时未填写图片 URL | 补充 Wikimedia Commons 公共域图片 URL |

受影响的花卉（已补全图片）：菊花、牡丹、兰花、雪莲花、油菜花、桃花、樱花、向日葵、黄山杜鹃、火绒草、宫粉羊蹄甲
