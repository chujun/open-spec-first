/**
 * 本地生成 flowers.json（使用省会坐标，不调用 GBIF）
 * 用于修复 GBIF 质心坐标偏差问题
 */
import { getProvincialFlowers } from './provincial-flowers.js'
import { mergeAndClean, writeOutput } from './data-merger.js'

async function main() {
  console.log('🌸 本地生成 flowers.json（使用省会坐标）...')

  const provincialData = getProvincialFlowers()
  console.log(`  ✓ 加载 ${provincialData.length} 条省市花记录`)

  const result = mergeAndClean(provincialData, false)
  console.log(`  ✓ 合并后 ${result.length} 条记录`)

  await writeOutput(result, false)
  console.log('✅ 完成')
}

main().catch((err: unknown) => {
  console.error('❌ 失败:', err)
  process.exit(1)
})
