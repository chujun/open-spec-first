## 1. 项目初始化

- [x] 1.1 使用 Vite + React + TypeScript 初始化项目（`npm create vite@latest`）
- [x] 1.2 安装核心依赖：`three`、`three-globe`、`@types/three`
- [x] 1.3 安装 UI 辅助依赖：`framer-motion`（动画）、`lucide-react`（图标）
- [x] 1.4 配置 Vite 对 Three.js 的 Tree-shaking 优化（`optimizeDeps`）
- [x] 1.5 建立项目目录结构：`src/components/`、`src/data/`、`src/hooks/`、`src/types/`

## 2. 花卉数据类型定义

- [x] 2.1 定义 TypeScript 类型：`FlowerRecord`（含 id、name、latinName、provinces、coordinates、seasons、imageUrl、description、color）
- [x] 2.2 定义 `Season` 枚举：`spring | summer | autumn | winter`
- [x] 2.3 编写数据加载与校验函数 `loadFlowers()`，跳过缺失必填字段的记录并输出警告

## 3. 真实花卉数据采集脚本（flower-data-pipeline）

- [x] 3.1 在 `scripts/` 目录创建数据采集入口 `scripts/fetch-data.ts`，配置 `npm run fetch-data` 命令
- [x] 3.2 编写省市花基础数据模块 `scripts/provincial-flowers.ts`：硬编码34个省级行政区的省花/市花名称、拉丁学名、花期月份
- [x] 3.3 实现花期月份→季节枚举映射函数（3-5月→spring，6-8月→summer，9-11月→autumn，12-2月→winter，跨季节取多个值）
- [x] 3.4 编写 GBIF API 查询模块 `scripts/gbif-client.ts`：按拉丁学名+国家码 `CN` 查询观测记录，提取省份列表与坐标质心
- [x] 3.5 实现 GBIF 限流重试逻辑：429 响应等待1秒重试，最多3次，超限跳过并记录警告
- [x] 3.6 编写 Wikimedia Commons 图片查询模块 `scripts/wikimedia-client.ts`：按拉丁学名查询免费授权图片 URL
- [x] 3.7 编写数据合并模块：省市花数据与 GBIF 数据按拉丁学名去重合并，`provinces` 取并集
- [x] 3.8 编写清洗与输出模块：校验必填字段、验证总数不低于50条、写出 `src/data/flowers.json`
- [x] 3.9 实现 `--incremental` 参数支持，按 id 去重追加新记录而不覆盖已有数据
- [x] 3.10 运行脚本，采集真实数据，验证输出覆盖34个省份且每季至少10条记录

## 4. 3D 地球组件

- [x] 4.1 创建 `GlobeViewer` 组件，初始化 `three-globe` 实例并挂载到 Canvas
- [x] 4.2 加载中国省份 GeoJSON 数据（Natural Earth 数据源），渲染省份轮廓
- [x] 4.3 设置初始视角自动对准中国区域（经纬度：东经 105°，北纬 35°）
- [x] 4.4 实现鼠标拖拽旋转交互（`OrbitControls`）
- [x] 4.5 实现滚轮缩放，限制最大/最小缩放范围
- [x] 4.6 实现停止操作10秒后自动旋转功能
- [x] 4.7 实现省份鼠标悬停高亮效果，显示省份名称气泡
- [x] 4.8 添加 WebGL 支持检测，不支持时显示降级静态地图

## 5. 花卉标注渲染（regional-mapping）

- [x] 5.1 实现 `FlowerMarker` 渲染逻辑，将花卉坐标映射到地球表面
- [x] 5.2 标注颜色使用花卉 `color` 字段，大小统一
- [x] 5.3 实现同省多花标注偏移算法（2-3朵小偏移并排）
- [x] 5.4 实现超过3朵时的数字气泡聚合标注
- [x] 5.5 实现点击数字气泡展开省份花卉列表
- [x] 5.6 绑定标注点击事件，触发详情面板打开

## 6. 季节筛选面板（season-filter）

- [x] 6.1 创建 `SeasonFilter` 组件，展示春夏秋冬四个按钮，使用对应颜色（春粉、夏绿、秋橙、冬蓝）
- [x] 6.2 实现单季节选中/取消逻辑
- [x] 6.3 实现多季节同时选中逻辑（OR 过滤）
- [x] 6.4 筛选状态变更时，通过 Context/props 更新地球可见标注
- [x] 6.5 添加"当前展示 X 种花卉"数量统计文字，实时更新
- [x] 6.6 确保筛选面板在地球旋转时保持固定位置（`position: fixed`）

## 7. 花卉详情面板（flower-detail）

- [x] 7.1 创建 `FlowerDetail` 组件，布局包含：图片区、名称/学名、花期图标组、分布省份标签、简介文字
- [x] 7.2 实现面板以动画方式从右侧滑入/滑出（framer-motion）
- [x] 7.3 实现花卉图片懒加载，加载中显示骨架占位符
- [x] 7.4 图片加载失败时显示默认占位图
- [x] 7.5 实现花期视觉化：春夏秋冬四个图标，有花期高亮，无花期置灰
- [x] 7.6 实现关闭按钮（×）功能
- [x] 7.7 实现点击地球空白区域关闭面板
- [x] 7.8 实现切换标注时面板内容直接更新（不关闭再打开）
- [x] 7.9 面板打开时，联动高亮地球上该花卉分布省份；关闭时恢复

## 8. 集成与联调

- [x] 8.1 连接全局状态（React Context）：当前季节筛选、当前选中花卉
- [x] 8.2 验证季节筛选 → 地球标注更新的完整联动流程
- [x] 8.3 验证标注点击 → 详情面板 → 省份高亮的完整联动流程
- [x] 8.4 验证聚合气泡 → 列表展开 → 详情面板的流程

## 9. 性能与兼容性

- [x] 9.1 对 Three.js / three-globe 进行动态 import 懒加载，减少首屏 JS 体积
- [x] 9.2 测量并优化首次渲染时间（目标：3秒内地球可见）
- [x] 9.3 花卉图片统一转换为 WebP 格式，添加 CDN 缓存头
- [x] 9.4 在 Chrome / Firefox / Safari / Edge 主流浏览器测试兼容性

## 10. 部署

- [x] 10.1 配置 `vite.config.ts` 的 `base` 路径（适配 GitHub Pages 子路径）
- [x] 10.2 添加 GitHub Actions 工作流，自动构建并部署到 GitHub Pages
- [x] 10.3 验证生产构建产物在部署环境正常运行
