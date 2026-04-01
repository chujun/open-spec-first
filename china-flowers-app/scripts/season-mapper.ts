import type { Season } from '../src/types/flower.js'

// 月份到季节映射：3-5月→spring，6-8月→summer，9-11月→autumn，12-2月→winter
const MONTH_TO_SEASON: Record<number, Season> = {
  1: 'winter',
  2: 'winter',
  3: 'spring',
  4: 'spring',
  5: 'spring',
  6: 'summer',
  7: 'summer',
  8: 'summer',
  9: 'autumn',
  10: 'autumn',
  11: 'autumn',
  12: 'winter',
}

export function monthsToSeasons(months: number[]): Season[] {
  const seasonSet = new Set<Season>()
  for (const month of months) {
    const season = MONTH_TO_SEASON[month]
    if (season) seasonSet.add(season)
  }
  return Array.from(seasonSet)
}
