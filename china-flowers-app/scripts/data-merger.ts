import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { FlowerRecord } from '../src/types/flower.js'
import type { ProcessedFlowerData } from './provincial-flowers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = resolve(__dirname, '../src/data/flowers.json')

// 将同省份的记录按拉丁学名去重合并，provinces 取并集
export function mergeAndClean(
  flowers: ProcessedFlowerData[],
  _incremental: boolean
): FlowerRecord[] {
  const byLatinName = new Map<string, ProcessedFlowerData[]>()

  for (const f of flowers) {
    const existing = byLatinName.get(f.latinName) ?? []
    byLatinName.set(f.latinName, [...existing, f])
  }

  const merged: FlowerRecord[] = []

  for (const [, group] of byLatinName) {
    const base = group[0]
    const allProvinces = [...new Set(group.map(f => f.province))]

    // 校验必填字段
    if (!base.id || !base.name || !base.latinName || !base.coordinates || base.seasons.length === 0) {
      console.warn(`[合并] 跳过不完整记录：${base.name}`)
      continue
    }

    merged.push({
      id: base.id,
      name: base.name,
      latinName: base.latinName,
      provinces: allProvinces,
      coordinates: base.coordinates,
      seasons: base.seasons,
      imageUrl: base.imageUrl,
      description: base.description,
      color: base.color,
    })
  }

  // 最低数量校验
  if (merged.length < 50) {
    const coveredProvinces = new Set(flowers.map(f => f.province))
    const allProvinces = flowers.map(f => f.province)
    const missing = allProvinces.filter(p => !coveredProvinces.has(p))
    console.error(`\n❌ 记录数不足50条（当前 ${merged.length} 条）`)
    if (missing.length > 0) {
      console.error('缺少数据的省份：', missing.join('、'))
    }
  }

  return merged
}

export async function writeOutput(records: FlowerRecord[], incremental: boolean): Promise<void> {
  let final = records

  if (incremental && existsSync(OUTPUT_PATH)) {
    const existing: FlowerRecord[] = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    const existingIds = new Set(existing.map(f => f.id))
    const newRecords = records.filter(f => !existingIds.has(f.id))
    final = [...existing, ...newRecords]
    console.log(`  增量追加 ${newRecords.length} 条新记录（原有 ${existing.length} 条）`)
  }

  if (final.length < 50) {
    console.error('❌ 记录总数不足50条，终止写出以保护已有数据')
    return
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(final, null, 2), 'utf-8')
  console.log(`  ✓ 写出 ${final.length} 条记录到 ${OUTPUT_PATH}`)
}
