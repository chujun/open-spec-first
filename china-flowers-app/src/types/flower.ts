export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface FlowerRecord {
  id: string
  name: string
  latinName: string
  provinces: string[]
  coordinates: [number, number] // [lng, lat]
  seasons: Season[]
  imageUrl: string
  description: string
  color: string
}
