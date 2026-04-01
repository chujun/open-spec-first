import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { FlowerRecord, Season } from '../types/flower'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1490750967868-88df5691cc2b?w=600&q=80'

interface SeasonBadge {
  key: Season
  label: string
  emoji: string
  color: string
}

const SEASON_BADGES: SeasonBadge[] = [
  { key: 'spring', label: '春', emoji: '🌸', color: '#e91e8c' },
  { key: 'summer', label: '夏', emoji: '🌿', color: '#4caf50' },
  { key: 'autumn', label: '秋', emoji: '🍂', color: '#ff9800' },
  { key: 'winter', label: '冬', emoji: '❄️', color: '#2196f3' },
]

interface FlowerDetailProps {
  flower: FlowerRecord | null
  onClose: () => void
}

export default function FlowerDetail({ flower, onClose }: FlowerDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  // 切换花卉时重置图片状态
  useEffect(() => {
    setImgLoaded(false)
    setImgError(false)
  }, [flower?.id])

  const imgSrc = !flower?.imageUrl || imgError ? DEFAULT_IMAGE : flower.imageUrl

  return (
    <AnimatePresence>
      {flower && (
        <motion.div
          key={flower.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 360,
            height: '100vh',
            background: 'rgba(10,10,20,0.92)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 200,
            overflowY: 'auto',
          }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            aria-label="关闭"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              zIndex: 10,
            }}
          >
            <X size={18} />
          </button>

          {/* 图片区 */}
          <div style={{ position: 'relative', width: '100%', height: 260, flexShrink: 0, overflow: 'hidden' }}>
            {!imgLoaded && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: flower.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            )}
            <img
              key={flower.id}
              src={imgSrc}
              alt={flower.name}
              onLoad={() => { setImgLoaded(true); setImgError(false) }}
              onError={() => { setImgError(true); setImgLoaded(true) }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
            {/* 渐变遮罩 */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: 'linear-gradient(transparent, rgba(10,10,20,0.92))',
            }} />
          </div>

          {/* 内容区 */}
          <div style={{ padding: '0 24px 32px', flex: 1 }}>
            {/* 名称 */}
            <div style={{ marginTop: 8, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 2 }}>
                {flower.name}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                {flower.latinName}
              </p>
            </div>

            {/* 花期 */}
            <div style={{ marginTop: 20, marginBottom: 8 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>花&nbsp;&nbsp;&nbsp;期</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {SEASON_BADGES.map(s => {
                  const active = flower.seasons.includes(s.key)
                  return (
                    <div key={s.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '5px 12px',
                      borderRadius: 50,
                      background: active ? `${s.color}22` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? s.color : 'transparent'}`,
                      color: active ? s.color : 'rgba(255,255,255,0.2)',
                      fontSize: 13,
                      fontWeight: active ? 700 : 400,
                    }}>
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 分布省份 */}
            <div style={{ marginTop: 20 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>分布省份</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {flower.provinces.slice(0, 12).map(p => (
                  <span key={p} style={{
                    padding: '3px 10px',
                    borderRadius: 50,
                    background: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                  }}>{p}</span>
                ))}
                {flower.provinces.length > 12 && (
                  <span style={{ padding: '3px 10px', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                    +{flower.provinces.length - 12}个
                  </span>
                )}
              </div>
            </div>

            {/* 简介 */}
            <div style={{ marginTop: 20 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>简&nbsp;&nbsp;&nbsp;介</p>
              <p style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.7)',
              }}>
                {flower.description}
              </p>
            </div>

            {/* 代表色 */}
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: flower.color,
                boxShadow: `0 0 10px ${flower.color}`,
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>代表色 {flower.color}</span>
            </div>
          </div>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
