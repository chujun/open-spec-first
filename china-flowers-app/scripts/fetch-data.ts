/**
 * 花卉数据采集入口脚本
 * 运行方式：npm run fetch-data [-- --incremental]
 *
 * 流程：
 * 1. 读取省市花基础数据
 * 2. GBIF API 补充分布坐标
 * 3. Wikimedia 关联图片
 * 4. 数据合并、清洗、输出 src/data/flowers.json
 */

import { getProvincialFlowers } from './provincial-flowers.js'
import { enrichWithGBIF } from './gbif-client.js'
import { enrichWithImages } from './wikimedia-client.js'
import { mergeAndClean, writeOutput } from './data-merger.js'

const isIncremental = process.argv.includes('--incremental')

async function main() {
  console.log('🌸 花卉数据采集脚本启动...')
  console.log(`模式：${isIncremental ? '增量更新' : '全量重建'}`)

  // Step 1: 省市花基础数据
  console.log('\n[1/4] 读取省市花基础数据...')
  const provincialData = getProvincialFlowers()
  console.log(`  ✓ 加载 ${provincialData.length} 条省市花记录`)

  // Step 2: GBIF 补充坐标与分布
  console.log('\n[2/4] 通过 GBIF API 补充分布数据...')
  const gbifEnriched = await enrichWithGBIF(provincialData)
  console.log(`  ✓ GBIF 数据补充完成`)

  // Step 3: Wikimedia 图片关联
  console.log('\n[3/4] 关联 Wikimedia 图片...')
  const withImages = await enrichWithImages(gbifEnriched)
  console.log(`  ✓ 图片关联完成`)

  // Step 4: 合并清洗输出
  console.log('\n[4/4] 合并清洗，写出 flowers.json...')
  const result = mergeAndClean(withImages, isIncremental)
  await writeOutput(result, isIncremental)

  console.log(`\n✅ 完成！共输出 ${result.length} 条花卉记录`)
}

main().catch((err: unknown) => {
  console.error('❌ 脚本执行失败:', err)
  process.exit(1)
})
