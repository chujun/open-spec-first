import type { ProcessedFlowerData } from './provincial-flowers.js'

const WIKIMEDIA_API = 'https://en.wikipedia.org/w/api.php'

interface WikiPageImage {
  source: string
  width: number
  height: number
}

interface WikiPage {
  pageid: number
  title: string
  thumbnail?: WikiPageImage
  original?: WikiPageImage
}

interface WikiResponse {
  query?: {
    pages: Record<string, WikiPage>
  }
}

async function fetchFlowerImage(latinName: string): Promise<string> {
  const params = new URLSearchParams({
    action: 'query',
    titles: latinName,
    prop: 'pageimages',
    pithumbsize: '600',
    format: 'json',
    origin: '*',
  })

  try {
    const res = await fetch(`${WIKIMEDIA_API}?${params}`)
    if (!res.ok) return ''

    const data = (await res.json()) as WikiResponse
    const pages = data.query?.pages
    if (!pages) return ''

    const page = Object.values(pages)[0]
    if (!page || page.pageid === -1) return ''

    return page.original?.source ?? page.thumbnail?.source ?? ''
  } catch {
    return ''
  }
}

export async function enrichWithImages(
  flowers: ProcessedFlowerData[]
): Promise<ProcessedFlowerData[]> {
  const enriched: ProcessedFlowerData[] = []

  for (const flower of flowers) {
    process.stdout.write(`  获取图片 ${flower.name}...`)
    const imageUrl = await fetchFlowerImage(flower.latinName)

    if (imageUrl) {
      process.stdout.write(' ✓\n')
    } else {
      process.stdout.write(' (无图片)\n')
    }

    enriched.push({ ...flower, imageUrl })
  }

  return enriched
}
