## Context

本应用是一个纯前端的交互式数据可视化项目，目标用户为对中国花卉文化感兴趣的普通用户及自然爱好者。没有现有代码库，从零开始构建。核心挑战在于：3D地球渲染的性能、花卉地理数据的组织方式，以及季节筛选与视觉联动的流畅体验。

## Goals / Non-Goals

**Goals:**
- 提供可旋转、缩放的3D地球，清晰展示中国省份轮廓
- 在地球上以标注（Marker）形式定位各省代表性花卉
- 支持按春/夏/秋/冬四季筛选，动态显示/隐藏对应花卉标注
- 点击标注展示花卉详情（图片、描述、花期、分布省份）
- 初版数据覆盖中国34个省级行政区各1-3种代表花卉

**Non-Goals:**
- 后端服务、用户账号、收藏功能（初版不涉及）
- 全球花卉数据（仅限中国）
- 移动端原生 App（仅 Web，响应式适配可后续迭代）
- 实时花期预测（基于静态花期数据，非实时天气联动）

## Decisions

### D1: 3D地球渲染引擎 —— 选用 Three.js + 自定义地球

**选 Three.js 而非 Cesium.js 的理由：**
- Cesium 为 GIS 专业级框架，Bundle 体积大（>2MB），初始化复杂
- Three.js 轻量可控，社区生态丰富，适合以视觉展示为主的场景
- 通过 `three-globe` 库（基于 Three.js 封装）可快速实现带标注的3D地球

**替代方案考虑：**
- `echarts-gl`：适合数据密集型地图，但定制3D交互成本高
- `Mapbox GL`：2D/2.5D为主，真3D地球支持有限

### D2: 数据层 —— 静态 JSON 文件

花卉数据量有限（约100-200条），采用静态 JSON 文件内嵌在前端项目中：
- 无需后端，部署简单（可托管 GitHub Pages / Vercel）
- 数据结构：`flowers.json` 包含花卉列表，每条记录含 id、name、province、coordinates、seasons[]、imageUrl、description

**替代方案：** SQLite via WASM —— 过度设计，初版不采用

### D3: 前端框架 —— React + Vite

- React 生态成熟，组件化便于分离 Globe / Panel / Detail 模块
- Vite 构建速度快，Tree-shaking 支持良好，适合 Three.js 这类大依赖的项目

### D4: 季节筛选策略 —— 客户端状态过滤

季节选择保存在 React 全局状态（useState/Context），每次筛选变更时重新计算可见标注集合，通过 `three-globe` 的 `pointsData` 属性更新，无需重新渲染地球本身。

### D5: 标注聚合策略

同一省份多朵花时，使用省份质心坐标 + 微小偏移量展示多个标注，避免重叠。超过3个时聚合为数字气泡，点击展开列表。

## Risks / Trade-offs

- **WebGL 兼容性** → Mitigation: 检测 WebGL 支持，不支持时显示静态地图降级页面
- **Three.js Bundle 体积** → Mitigation: 动态 import，延迟加载地球模块；使用 CDN 分离大依赖
- **花卉图片加载性能** → Mitigation: 图片懒加载，详情弹窗打开时才加载原图；使用 WebP 格式
- **省份坐标数据准确性** → Mitigation: 使用公开的 GeoJSON 数据（Natural Earth）提取省份质心
- **数据维护成本** → Trade-off: 静态 JSON 简单但更新需重新部署；初版接受此限制

## Migration Plan

初版为全新项目，无迁移需求。部署流程：
1. `npm run build` 生成静态产物
2. 推送至 GitHub，启用 GitHub Pages 或部署至 Vercel

## Open Questions

- 花卉数据的权威来源？（建议参考《中国植物志》或各省市花名录）
- 是否需要支持中英文双语？（初版中文，国际化可后续迭代）
- 地球底图风格：写实卫星图 vs 扁平化艺术风格？（建议扁平风，视觉更统一）
