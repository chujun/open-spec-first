## ADDED Requirements

### Requirement: 花卉数据结构
系统 SHALL 维护一份结构化的花卉数据集，每条花卉记录 MUST 包含以下字段：id（唯一标识）、name（中文名）、latinName（拉丁学名）、provinces（分布省份列表）、coordinates（代表坐标 [lng, lat]）、seasons（花期季节列表，值域：spring/summer/autumn/winter）、imageUrl（图片地址）、description（简介，不超过200字）、color（代表色，用于地球标注颜色）。

#### Scenario: 数据完整性校验
- **WHEN** 应用启动加载花卉数据
- **THEN** 系统校验每条记录必填字段均存在，缺失字段的记录 SHALL 被跳过并在控制台输出警告

### Requirement: 花卉检索
系统 SHALL 支持按季节过滤花卉列表，返回该季节有花期的所有花卉。

#### Scenario: 按季节检索
- **WHEN** 用户选择"春季"筛选条件
- **THEN** 系统返回 seasons 字段包含 "spring" 的所有花卉记录

#### Scenario: 无筛选条件
- **WHEN** 用户未选择任何季节筛选
- **THEN** 系统返回全部花卉记录

### Requirement: 初版数据覆盖范围
系统 SHALL 在初版包含不少于50条花卉记录，覆盖中国主要省份，每个季节至少有10条记录。

#### Scenario: 数据覆盖验证
- **WHEN** 应用加载完成
- **THEN** 花卉总数不少于50条，且春夏秋冬每季均有可显示数据
