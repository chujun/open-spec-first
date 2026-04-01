## ADDED Requirements

### Requirement: 省市花数据整理
系统 SHALL 提供一份覆盖中国34个省级行政区的省花/市花基础数据，数据来源为各省政府公告或权威百科，每条记录 MUST 包含：花卉名称、拉丁学名、所属省份、代表坐标、花期月份。

#### Scenario: 省花数据完整性
- **WHEN** 数据采集脚本运行完成
- **THEN** 输出中 34个省级行政区均至少有1条省花/市花记录

#### Scenario: 花期字段映射
- **WHEN** 原始数据中花期为月份范围（如"3-5月"）
- **THEN** 脚本自动将月份映射到季节枚举：3-5月→spring，6-8月→summer，9-11月→autumn，12-2月→winter，跨季节花期可同时属于多个季节

### Requirement: GBIF API 数据查询
系统 SHALL 提供一个脚本，通过 GBIF Occurrence API 查询中国境内指定花卉的真实分布记录，并提取省份与坐标信息。

#### Scenario: 成功查询物种分布
- **WHEN** 脚本以拉丁学名（如 `Prunus mume`）和国家码 `CN` 调用 GBIF API
- **THEN** 返回带有经纬度的观测记录，脚本提取唯一省份列表和代表坐标（取观测点质心）

#### Scenario: API 限流处理
- **WHEN** GBIF API 返回 429 Too Many Requests
- **THEN** 脚本等待1秒后重试，最多重试3次，超过后跳过该物种并记录警告日志

#### Scenario: 无记录物种处理
- **WHEN** GBIF 对某物种在中国无观测记录
- **THEN** 脚本跳过该物种，不生成该条记录，输出警告提示人工补充

### Requirement: 数据清洗与格式转换
系统 SHALL 提供数据清洗脚本，将原始采集数据标准化为应用 `FlowerRecord` JSON 格式，并执行完整性校验。

#### Scenario: 输出标准 JSON
- **WHEN** 清洗脚本执行完成
- **THEN** 生成 `src/data/flowers.json`，数组中每条记录均符合 `FlowerRecord` 类型，所有必填字段非空

#### Scenario: 去重处理
- **WHEN** 同一花卉（相同拉丁学名）来自多个数据源
- **THEN** 脚本合并为一条记录，`provinces` 字段取并集，坐标取各省质心

#### Scenario: 最低数量校验
- **WHEN** 清洗完成后记录总数不足50条
- **THEN** 脚本输出错误并列出缺少数据的省份清单，不覆盖已有的 `flowers.json`

### Requirement: 图片资源关联
系统 SHALL 为每条花卉记录关联可用的图片 URL，优先使用 Wikimedia Commons 的免费授权图片。

#### Scenario: Wikimedia 图片查询
- **WHEN** 数据脚本处理某花卉记录
- **THEN** 脚本通过 Wikimedia API 以拉丁学名查询图片，将第一张可用图片 URL 写入 `imageUrl` 字段

#### Scenario: 图片查询失败回退
- **WHEN** Wikimedia API 无法找到对应图片
- **THEN** `imageUrl` 字段设置为空字符串，由前端使用默认占位图处理

### Requirement: 数据采集脚本可独立运行
数据采集脚本 SHALL 独立于前端应用，作为 `scripts/` 目录下的 Node.js 脚本，可通过 `npm run fetch-data` 单独执行，不依赖前端构建流程。

#### Scenario: 独立执行
- **WHEN** 开发者在项目根目录运行 `npm run fetch-data`
- **THEN** 脚本依次执行：查询省花数据 → GBIF 补充查询 → 数据合并清洗 → 写出 `src/data/flowers.json`，全程在终端输出进度日志

#### Scenario: 增量更新
- **WHEN** `src/data/flowers.json` 已存在且脚本以 `--incremental` 参数运行
- **THEN** 脚本仅追加新记录，不覆盖已有记录（按 id 去重）
