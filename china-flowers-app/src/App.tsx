import { useMemo } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import GlobeViewer from './components/GlobeViewer'
import SeasonFilter from './components/SeasonFilter'
import FlowerDetail from './components/FlowerDetail'
import { loadFlowers, filterBySeason } from './data/loader'
import type { FlowerRecord } from './types/flower'
import rawFlowers from './data/flowers.json'

const ALL_FLOWERS = loadFlowers(rawFlowers as unknown[])

function AppContent() {
  const { selectedSeasons, selectedFlower, toggleSeason, selectFlower } = useApp()

  const visibleFlowers = useMemo(
    () => filterBySeason(ALL_FLOWERS, selectedSeasons),
    [selectedSeasons]
  )

  function handleFlowerClick(flower: FlowerRecord) {
    selectFlower(flower)
  }

  function handleBgClick() {
    selectFlower(null)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000011', position: 'relative' }}>
      {/* 标题 */}
      <div style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, textAlign: 'center', pointerEvents: 'none',
      }}>
        <h1 style={{
          margin: 0, fontSize: 22, fontWeight: 700,
          color: 'rgba(255,255,255,0.85)', letterSpacing: 6,
          textShadow: '0 0 20px rgba(233,30,140,0.4)',
        }}>
          🌸 中国花卉地图
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>
          CHINA FLOWERS ATLAS
        </p>
      </div>

      {/* 3D 地球 */}
      <GlobeViewer
        flowers={visibleFlowers}
        selectedFlower={selectedFlower}
        onFlowerClick={handleFlowerClick}
        onBgClick={handleBgClick}
      />

      {/* 季节筛选面板 */}
      <SeasonFilter
        selectedSeasons={selectedSeasons}
        onToggle={toggleSeason}
        totalCount={visibleFlowers.length}
      />

      {/* 花卉详情面板 */}
      <FlowerDetail
        flower={selectedFlower}
        onClose={() => selectFlower(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
