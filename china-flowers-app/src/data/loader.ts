import type { FlowerRecord, Season } from '../types/flower'

const REQUIRED_FIELDS: (keyof FlowerRecord)[] = [
  'id', 'name', 'latinName', 'provinces', 'coordinates', 'seasons', 'imageUrl', 'description', 'color',
]

const VALID_SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

function isValidRecord(record: unknown): record is FlowerRecord {
  if (typeof record !== 'object' || record === null) return false
  const r = record as Record<string, unknown>

  for (const field of REQUIRED_FIELDS) {
    if (r[field] === undefined || r[field] === null) {
      console.warn(`[loadFlowers] 跳过记录，缺失必填字段 "${field}":`, r['id'] ?? '未知ID')
      return false
    }
  }

  if (!Array.isArray(r['provinces']) || r['provinces'].length === 0) {
    console.warn('[loadFlowers] 跳过记录，provinces 为空:', r['id'])
    return false
  }

  if (!Array.isArray(r['coordinates']) || r['coordinates'].length !== 2) {
    console.warn('[loadFlowers] 跳过记录，coordinates 格式错误:', r['id'])
    return false
  }

  if (!Array.isArray(r['seasons']) || r['seasons'].length === 0) {
    console.warn('[loadFlowers] 跳过记录，seasons 为空:', r['id'])
    return false
  }

  const invalidSeasons = (r['seasons'] as unknown[]).filter(s => !VALID_SEASONS.includes(s as Season))
  if (invalidSeasons.length > 0) {
    console.warn('[loadFlowers] 跳过记录，包含无效季节值:', r['id'], invalidSeasons)
    return false
  }

  return true
}

export function loadFlowers(raw: unknown[]): FlowerRecord[] {
  return raw.filter(isValidRecord)
}

export function filterBySeason(flowers: FlowerRecord[], seasons: Season[]): FlowerRecord[] {
  if (seasons.length === 0) return flowers
  return flowers.filter(f => f.seasons.some(s => seasons.includes(s)))
}
