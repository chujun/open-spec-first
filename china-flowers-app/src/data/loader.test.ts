import { describe, it, expect } from 'vitest'
import { loadFlowers, filterBySeason } from './loader'
import type { FlowerRecord, Season } from '../types/flower'

// ─── Test fixtures ────────────────────────────────────────────────────────────

const validFlower: FlowerRecord = {
  id: 'test-rose',
  name: '月季',
  latinName: 'Rosa chinensis',
  provinces: ['北京市'],
  coordinates: [116.4, 39.9],
  seasons: ['spring', 'summer'],
  imageUrl: 'https://example.com/rose.jpg',
  description: '测试花卉',
  color: '#e8365d',
}

function makeFlower(overrides: Partial<FlowerRecord> = {}): FlowerRecord {
  return { ...validFlower, ...overrides }
}

// ─── loadFlowers ──────────────────────────────────────────────────────────────

describe('loadFlowers', () => {
  describe('happy path', () => {
    it('returns valid records unchanged', () => {
      const result = loadFlowers([validFlower])
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(validFlower)
    })

    it('handles multiple valid records', () => {
      const flowers = [
        makeFlower({ id: 'f1', name: '花1' }),
        makeFlower({ id: 'f2', name: '花2' }),
        makeFlower({ id: 'f3', name: '花3' }),
      ]
      expect(loadFlowers(flowers)).toHaveLength(3)
    })

    it('returns empty array for empty input', () => {
      expect(loadFlowers([])).toEqual([])
    })
  })

  describe('missing required fields', () => {
    const requiredFields: (keyof FlowerRecord)[] = [
      'id', 'name', 'latinName', 'provinces', 'coordinates',
      'seasons', 'imageUrl', 'description', 'color',
    ]

    for (const field of requiredFields) {
      it(`skips record with null ${field}`, () => {
        const bad = { ...validFlower, [field]: null }
        expect(loadFlowers([bad])).toHaveLength(0)
      })

      it(`skips record with undefined ${field}`, () => {
        const bad = { ...validFlower }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (bad as any)[field]
        expect(loadFlowers([bad])).toHaveLength(0)
      })
    }
  })

  describe('provinces validation', () => {
    it('skips record with empty provinces array', () => {
      const bad = makeFlower({ provinces: [] })
      expect(loadFlowers([bad])).toHaveLength(0)
    })

    it('skips record where provinces is not an array', () => {
      const bad = { ...validFlower, provinces: '北京市' }
      expect(loadFlowers([bad])).toHaveLength(0)
    })
  })

  describe('coordinates validation', () => {
    it('skips record with empty coordinates array', () => {
      const bad = { ...validFlower, coordinates: [] as unknown as [number, number] }
      expect(loadFlowers([bad])).toHaveLength(0)
    })

    it('skips record with only one coordinate', () => {
      const bad = { ...validFlower, coordinates: [116.4] as unknown as [number, number] }
      expect(loadFlowers([bad])).toHaveLength(0)
    })

    it('skips record where coordinates is not an array', () => {
      const bad = { ...validFlower, coordinates: '116.4,39.9' }
      expect(loadFlowers([bad])).toHaveLength(0)
    })
  })

  describe('seasons validation', () => {
    it('skips record with empty seasons array', () => {
      const bad = makeFlower({ seasons: [] })
      expect(loadFlowers([bad])).toHaveLength(0)
    })

    it('skips record with invalid season value', () => {
      const bad = { ...validFlower, seasons: ['rainy'] as unknown as Season[] }
      expect(loadFlowers([bad])).toHaveLength(0)
    })

    it('skips record with mixed valid and invalid seasons', () => {
      const bad = { ...validFlower, seasons: ['spring', 'monsoon'] as unknown as Season[] }
      expect(loadFlowers([bad])).toHaveLength(0)
    })

    it('accepts all four valid seasons', () => {
      const allSeasons: Season[] = ['spring', 'summer', 'autumn', 'winter']
      const flower = makeFlower({ seasons: allSeasons })
      expect(loadFlowers([flower])).toHaveLength(1)
    })
  })

  describe('non-object inputs', () => {
    it('skips null entries', () => {
      expect(loadFlowers([null])).toHaveLength(0)
    })

    it('skips string entries', () => {
      expect(loadFlowers(['not-a-flower'])).toHaveLength(0)
    })

    it('skips number entries', () => {
      expect(loadFlowers([42])).toHaveLength(0)
    })

    it('filters invalid mixed with valid', () => {
      const result = loadFlowers([validFlower, null, 'bad', makeFlower({ id: 'f2', name: '花2' })])
      expect(result).toHaveLength(2)
    })
  })
})

// ─── filterBySeason ───────────────────────────────────────────────────────────

describe('filterBySeason', () => {
  const spring = makeFlower({ id: 'sp', name: '春花', seasons: ['spring'] })
  const summer = makeFlower({ id: 'su', name: '夏花', seasons: ['summer'] })
  const autumn = makeFlower({ id: 'au', name: '秋花', seasons: ['autumn'] })
  const winter = makeFlower({ id: 'wi', name: '冬花', seasons: ['winter'] })
  const allSeasons = makeFlower({ id: 'all', name: '四季花', seasons: ['spring', 'summer', 'autumn', 'winter'] })
  const springAutumn = makeFlower({ id: 'sa', name: '春秋花', seasons: ['spring', 'autumn'] })

  const allFlowers = [spring, summer, autumn, winter, allSeasons, springAutumn]

  describe('empty seasons filter (show all)', () => {
    it('returns all flowers when no season selected', () => {
      expect(filterBySeason(allFlowers, [])).toHaveLength(allFlowers.length)
    })

    it('returns same reference when no season selected', () => {
      const result = filterBySeason(allFlowers, [])
      expect(result).toBe(allFlowers)
    })
  })

  describe('single season filter', () => {
    it('filters to spring only', () => {
      const result = filterBySeason(allFlowers, ['spring'])
      expect(result).toContain(spring)
      expect(result).toContain(allSeasons)
      expect(result).toContain(springAutumn)
      expect(result).not.toContain(summer)
      expect(result).not.toContain(winter)
    })

    it('filters to summer only', () => {
      const result = filterBySeason(allFlowers, ['summer'])
      expect(result).toContain(summer)
      expect(result).toContain(allSeasons)
      expect(result).not.toContain(spring)
      expect(result).not.toContain(autumn)
      expect(result).not.toContain(winter)
    })

    it('filters to autumn only', () => {
      const result = filterBySeason(allFlowers, ['autumn'])
      expect(result).toContain(autumn)
      expect(result).toContain(allSeasons)
      expect(result).toContain(springAutumn)
      expect(result).not.toContain(summer)
      expect(result).not.toContain(winter)
    })

    it('filters to winter only', () => {
      const result = filterBySeason(allFlowers, ['winter'])
      expect(result).toContain(winter)
      expect(result).toContain(allSeasons)
      expect(result).not.toContain(spring)
      expect(result).not.toContain(autumn)
    })
  })

  describe('multi-season filter', () => {
    it('filters spring + summer (union)', () => {
      const result = filterBySeason(allFlowers, ['spring', 'summer'])
      expect(result).toContain(spring)
      expect(result).toContain(summer)
      expect(result).toContain(allSeasons)
      expect(result).toContain(springAutumn)
      expect(result).not.toContain(autumn)
      expect(result).not.toContain(winter)
    })

    it('filters all four seasons returns everything', () => {
      const result = filterBySeason(allFlowers, ['spring', 'summer', 'autumn', 'winter'])
      expect(result).toHaveLength(allFlowers.length)
    })
  })

  describe('edge cases', () => {
    it('returns empty array when input is empty', () => {
      expect(filterBySeason([], ['spring'])).toEqual([])
    })

    it('returns empty array when no flowers match selected season', () => {
      const onlySummer = [summer]
      const result = filterBySeason(onlySummer, ['winter'])
      expect(result).toHaveLength(0)
    })

    it('flower with multiple seasons matches any selected season', () => {
      const result = filterBySeason([springAutumn], ['autumn'])
      expect(result).toContain(springAutumn)
    })
  })
})
