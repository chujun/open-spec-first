import { useEffect, useRef, useCallback } from 'react'
import type { Object3D } from 'three'
import type { FlowerRecord } from '../types/flower'

interface GlobeViewerProps {
  flowers: FlowerRecord[]
  selectedFlower: FlowerRecord | null
  onFlowerClick: (flower: FlowerRecord) => void
  onBgClick: () => void
}

interface GlobePoint {
  lat: number
  lng: number
  color: string
  size: number
  flower: FlowerRecord
}

function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function GlobeViewer({ flowers, selectedFlower, onFlowerClick, onBgClick }: GlobeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const autoRotateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetAutoRotate = useCallback(() => {
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe = globeRef.current as any
    if (globe?.controls?.()) globe.controls().autoRotate = false
    autoRotateTimerRef.current = setTimeout(() => {
      if (globe?.controls?.()) globe.controls().autoRotate = true
    }, 10_000)
  }, [])

  useEffect(() => {
    if (!mountRef.current || !isWebGLSupported()) return

    let animFrameId: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any = null

    import('three-globe').then(({ default: ThreeGlobe }) => {
      import('three').then(({
        Scene, PerspectiveCamera, WebGLRenderer,
        AmbientLight, DirectionalLight, Vector2, Raycaster,
      }) => {
        if (!mountRef.current) return

        const width = mountRef.current.clientWidth
        const height = mountRef.current.clientHeight

        const scene = new Scene()
        const camera = new PerspectiveCamera(45, width / height, 0.1, 1000)

        renderer = new WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        mountRef.current.appendChild(renderer.domElement)

        scene.add(new AmbientLight(0xffffff, 0.8))
        const dirLight = new DirectionalLight(0xffffff, 0.6)
        dirLight.position.set(5, 3, 5)
        scene.add(dirLight)

        const globeInstance = new ThreeGlobe()
          .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .atmosphereColor('#3a228a')
          .atmosphereAltitude(0.15)

        scene.add(globeInstance as unknown as Object3D)
        globeRef.current = globeInstance

        // 初始视角对准中国（东经105°，北纬35°）
        const phi = (90 - 35) * (Math.PI / 180)
        const theta = (105 - 180) * (Math.PI / 180)
        camera.position.setFromSphericalCoords(280, phi, theta)
        camera.lookAt(scene.position)

        import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
          const controls = new OrbitControls(camera, renderer.domElement)
          controls.enableDamping = true
          controls.dampingFactor = 0.1
          controls.minDistance = 150
          controls.maxDistance = 500
          controls.autoRotate = false
          controls.autoRotateSpeed = 0.5

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(globeInstance as any).controls = () => controls

          controls.addEventListener('start', resetAutoRotate)
          controls.addEventListener('change', resetAutoRotate)

          function animate() {
            animFrameId = requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
          }
          animate()
          resetAutoRotate()

          function onResize() {
            if (!mountRef.current) return
            const w = mountRef.current.clientWidth
            const h = mountRef.current.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
          }
          window.addEventListener('resize', onResize)

          renderer.domElement.addEventListener('click', (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            const mouse = new Vector2(
              ((e.clientX - rect.left) / rect.width) * 2 - 1,
              -((e.clientY - rect.top) / rect.height) * 2 + 1
            )
            const raycaster = new Raycaster()
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)
            if (intersects.length === 0) onBgClick()
          })

          return () => {
            window.removeEventListener('resize', onResize)
            controls.dispose()
          }
        })
      })
    })

    return () => {
      cancelAnimationFrame(animFrameId)
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current)
      if (renderer && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 更新标注点
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    const points: GlobePoint[] = flowers.map(f => ({
      lat: f.coordinates[1],
      lng: f.coordinates[0],
      color: selectedFlower
        ? (f.id === selectedFlower.id ? f.color : '#aaaaaa44')
        : f.color,
      size: f.id === selectedFlower?.id ? 0.8 : 0.5,
      flower: f,
    }))

    globe
      .pointsData(points)
      .pointColor((p: GlobePoint) => p.color)
      .pointAltitude(0.01)
      .pointRadius((p: GlobePoint) => p.size)
      .onPointClick((p: GlobePoint) => onFlowerClick(p.flower))
  }, [flowers, selectedFlower, onFlowerClick])

  if (!isWebGLSupported()) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#fff', fontSize: 14 }}>您的浏览器不支持3D视图，请升级浏览器</p>
      </div>
    )
  }

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: '#000011' }}
      aria-label="3D中国花卉地球"
    />
  )
}
