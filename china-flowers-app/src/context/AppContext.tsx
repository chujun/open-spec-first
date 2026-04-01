import { createContext, useContext, useState, type ReactNode } from 'react'
import type { FlowerRecord, Season } from '../types/flower'

interface AppState {
  selectedSeasons: Season[]
  selectedFlower: FlowerRecord | null
  toggleSeason: (season: Season) => void
  selectFlower: (flower: FlowerRecord | null) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([])
  const [selectedFlower, setSelectedFlower] = useState<FlowerRecord | null>(null)

  function toggleSeason(season: Season) {
    setSelectedSeasons(prev =>
      prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
    )
  }

  function selectFlower(flower: FlowerRecord | null) {
    setSelectedFlower(flower)
  }

  return (
    <AppContext.Provider value={{ selectedSeasons, selectedFlower, toggleSeason, selectFlower }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
