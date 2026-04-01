import type { Season } from '../types/flower'

interface SeasonConfig {
  key: Season
  label: string
  emoji: string
  activeColor: string
  bgColor: string
}

const SEASONS: SeasonConfig[] = [
  { key: 'spring', label: '春', emoji: '🌸', activeColor: '#e91e8c', bgColor: 'rgba(233,30,140,0.15)' },
  { key: 'summer', label: '夏', emoji: '🌿', activeColor: '#4caf50', bgColor: 'rgba(76,175,80,0.15)' },
  { key: 'autumn', label: '秋', emoji: '🍂', activeColor: '#ff9800', bgColor: 'rgba(255,152,0,0.15)' },
  { key: 'winter', label: '冬', emoji: '❄️', activeColor: '#2196f3', bgColor: 'rgba(33,150,243,0.15)' },
]

interface SeasonFilterProps {
  selectedSeasons: Season[]
  onToggle: (season: Season) => void
  totalCount: number
}

export default function SeasonFilter({ selectedSeasons, onToggle, totalCount }: SeasonFilterProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        gap: 12,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: 50,
        padding: '10px 20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {SEASONS.map(s => {
          const active = selectedSeasons.includes(s.key)
          return (
            <button
              key={s.key}
              onClick={() => onToggle(s.key)}
              aria-pressed={active}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 50,
                border: active ? `1.5px solid ${s.activeColor}` : '1.5px solid transparent',
                background: active ? s.bgColor : 'transparent',
                color: active ? s.activeColor : 'rgba(255,255,255,0.6)',
                fontSize: 15,
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: 2,
              }}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          )
        })}
      </div>

      <div style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        letterSpacing: 1,
      }}>
        当前展示 <span style={{ color: '#fff', fontWeight: 700 }}>{totalCount}</span> 种花卉
      </div>
    </div>
  )
}
