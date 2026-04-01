## 1. 项目初始化

- [ ] 1.1 使用 Vite + React + TypeScript 初始化项目（`npm create vite@latest`）
- [ ] 1.2 安装核心依赖：`three`、`three-globe`、`@types/three`
- [ ] 1.3 安装 UI 辅助依赖：`framer-motion`（动画）、`lucide-react`（图标）
- [ ] 1.4 配置 Vite 对 Three.js 的 Tree-shaking 优化（`optimizeDeps`）
- [ ] 1.5 建立项目目录结构：`src/components/`、`src/data/`、`src/hooks/`、`src/types/`

## 2. 花卉数据准备

- [ ] 2.1 定义 TypeScript 类型：`FlowerRecord`（含 id、name、latinName、provinces、coordinates、seasons、imageUrl、description、color）
- [ ] 2.2 定义 `Season` 枚举：`spring | summer | autumn | winter`
- [ ] 2.3 收集并编写初版花卉数据 `src/data/flowers.json`（不少于50条，覆盖主要省份）
- [ ] 2.4 编写数据加载与校验函数 `loadFlowers()`，跳过缺失必填字段的记录并输出警告
- [ ] 2.5 验证每季至少有10条记录，春夏秋冬均覆盖

## 3. 3D 地球组件

- [ ] 3.1 创建 `GlobeViewer` 组件，初始化 `three-globe` 实例并挂载到 Canvas
- [ ] 3.2 加载中国省份 GeoJSON 数据（Natural Earth 数据源），渲染省份轮廓
- [ ] 3.3 设置初始视角自动对准中国区域（经纬度：东经 105°，北纬 35°）
- [ ] 3.4 实现鼠标拖拽旋转交互（`OrbitControls`）
- [ ] 3.5 实现滚轮缩放，限制最大/最小缩放范围
- [ ] 3.6 实现停止操作10秒后自动旋转功能
- [ ] 3.7 实现省份鼠标悬停高亮效果，显示省份名称气泡
- [ ] 3.8 添加 WebGL 支持检测，不支持时显示降级静态地图

## 4. 花卉标注渲染（regional-mapping）

- [ ] 4.1 实现 `FlowerMarker` 渲染逻辑，将花卉坐标映射到地球表面
- [ ] 4.2 标注颜色使用花卉 `color` 字段，大小统一
- [ ] 4.3 实现同省多花标注偏移算法（2-3朵小偏移并排）
- [ ] 4.4 实现超过3朵时的数字气泡聚合标注
- [ ] 4.5 实现点击数字气泡展开省份花卉列表
- [ ] 4.6 绑定标注点击事件，触发详情面板打开

## 5. 季节筛选面板（season-filter）

- [ ] 5.1 创建 `SeasonFilter` 组件，展示春夏秋冬四个按钮，使用对应颜色（春粉、夏绿、秋橙、冬蓝）
- [ ] 5.2 实现单季节选中/取消逻辑
- [ ] 5.3 实现多季节同时选中逻辑（OR 过滤）
- [ ] 5.4 筛选状态变更时，通过 Context/props 更新地球可见标注
- [ ] 5.5 添加"当前展示 X 种花卉"数量统计文字，实时更新
- [ ] 5.6 确保筛选面板在地球旋转时保持固定位置（`position: fixed`）

## 6. 花卉详情面板（flower-detail）

- [ ] 6.1 创建 `FlowerDetail` 组件，布局包含：图片区、名称/学名、花期图标组、分布省份标签、简介文字
- [ ] 6.2 实现面板以动画方式从右侧滑入/滑出（framer-motion）
- [ ] 6.3 实现花卉图片懒加载，加载中显示骨架占位符
- [ ] 6.4 图片加载失败时显示默认占位图
- [ ] 6.5 实现花期视觉化：春夏秋冬四个图标，有花期高亮，无花期置灰
- [ ] 6.6 实现关闭按钮（×）功能
- [ ] 6.7 实现点击地球空白区域关闭面板
- [ ] 6.8 实现切换标注时面板内容直接更新（不关闭再打开）
- [ ] 6.9 面板打开时，联动高亮地球上该花卉分布省份；关闭时恢复

## 7. 集成与联调

- [ ] 7.1 连接全局状态（React Context）：当前季节筛选、当前选中花卉
- [ ] 7.2 验证季节筛选 → 地球标注更新的完整联动流程
- [ ] 7.3 验证标注点击 → 详情面板 → 省份高亮的完整联动流程
- [ ] 7.4 验证聚合气泡 → 列表展开 → 详情面板的流程

## 8. 性能与兼容性

- [ ] 8.1 对 Three.js / three-globe 进行动态 import 懒加载，减少首屏 JS 体积
- [ ] 8.2 测量并优化首次渲染时间（目标：3秒内地球可见）
- [ ] 8.3 花卉图片统一转换为 WebP 格式，添加 CDN 缓存头
- [ ] 8.4 在 Chrome / Firefox / Safari / Edge 主流浏览器测试兼容性

## 9. 部署

- [ ] 9.1 配置 `vite.config.ts` 的 `base` 路径（适配 GitHub Pages 子路径）
- [ ] 9.2 添加 GitHub Actions 工作流，自动构建并部署到 GitHub Pages
- [ ] 9.3 验证生产构建产物在部署环境正常运行
