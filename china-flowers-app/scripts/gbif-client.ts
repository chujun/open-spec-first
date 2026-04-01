import type { ProcessedFlowerData } from './provincial-flowers.js'

const GBIF_API = 'https://api.gbif.org/v1'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

interface GBIFOccurrence {
  decimalLongitude?: number
  decimalLatitude?: number
  stateProvince?: string
  countryCode?: string
}

interface GBIFResponse {
  results: GBIFOccurrence[]
  endOfRecords: boolean
  count: number
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  const res = await fetch(url)
  if (res.status === 429 && retries > 0) {
    console.warn(`    GBIF 限流，等待1秒后重试（剩余 ${retries} 次）...`)
    await sleep(RETRY_DELAY_MS)
    return fetchWithRetry(url, retries - 1)
  }
  return res
}

// 通过 GBIF API 查询某物种在中国的分布记录，返回省份列表与坐标质心
async function queryGBIF(latinName: string): Promise<{ provinces: string[]; centroid: [number, number] | null }> {
  const encoded = encodeURIComponent(latinName)
  const url = `${GBIF_API}/occurrence/search?scientificName=${encoded}&country=CN&hasCoordinate=true&limit=100`

  let res: Response
  try {
    res = await fetchWithRetry(url)
  } catch {
    console.warn(`    GBIF 请求失败（网络错误）：${latinName}`)
    return { provinces: [], centroid: null }
  }

  if (!res.ok) {
    if (res.status === 429) {
      console.warn(`    ⚠ GBIF 限流超限，跳过：${latinName}`)
    } else {
      console.warn(`    ⚠ GBIF 返回 ${res.status}，跳过：${latinName}`)
    }
    return { provinces: [], centroid: null }
  }

  const data = (await res.json()) as GBIFResponse

  if (data.count === 0) {
    console.warn(`    ⚠ GBIF 无中国观测记录，跳过：${latinName}（建议人工补充）`)
    return { provinces: [], centroid: null }
  }

  const validOccurrences = data.results.filter(
    r => r.decimalLongitude !== undefined && r.decimalLatitude !== undefined
  )

  const provinceSet = new Set<string>()
  let sumLng = 0
  let sumLat = 0

  for (const occ of validOccurrences) {
    if (occ.stateProvince) provinceSet.add(occ.stateProvince)
    sumLng += occ.decimalLongitude!
    sumLat += occ.decimalLatitude!
  }

  const centroid: [number, number] | null = validOccurrences.length > 0
    ? [
        Math.round((sumLng / validOccurrences.length) * 100) / 100,
        Math.round((sumLat / validOccurrences.length) * 100) / 100,
      ]
    : null

  return {
    provinces: Array.from(provinceSet),
    centroid,
  }
}

export async function enrichWithGBIF(
  flowers: ProcessedFlowerData[]
): Promise<ProcessedFlowerData[]> {
  const enriched: ProcessedFlowerData[] = []

  for (const flower of flowers) {
    process.stdout.write(`  查询 ${flower.name} (${flower.latinName})...`)
    const { provinces, centroid } = await queryGBIF(flower.latinName)

    if (provinces.length > 0) {
      process.stdout.write(` ✓ ${provinces.length} 个省份\n`)
    } else {
      process.stdout.write(' (使用默认数据)\n')
    }

    enriched.push({
      ...flower,
      // GBIF 坐标比硬编码省会坐标更准确，优先使用
      coordinates: centroid ?? flower.coordinates,
    })

    // 避免 GBIF 请求过快
    await sleep(200)
  }

  return enriched
}
