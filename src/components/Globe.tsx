"use client"

import { useEffect, useRef, useMemo } from "react"
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Color,
  CanvasTexture,
  Vector3,
  CatmullRomCurve3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  AdditiveBlending,
  BackSide,
  MeshBasicMaterial,
  AmbientLight,
  DirectionalLight,
  Points,
  PointsMaterial,
  BufferAttribute,
  Group,
} from "three"

interface ArcData {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

interface GlobeConfig {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: { lat: number; lng: number }
  autoRotate?: boolean
  autoRotateSpeed?: number
}

function generateEarthTexture(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  const ocean = [25, 55, 95]
  const shallow = [35, 85, 130]
  const land = [60, 130, 70]
  const dryLand = [130, 150, 70]
  const sand = [180, 170, 120]
  const ice = [220, 230, 240]
  const forest = [40, 100, 50]

  function noise(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    return n - Math.floor(n)
  }

  function smoothNoise(x: number, y: number): number {
    const ix = Math.floor(x); const iy = Math.floor(y)
    const fx = x - ix; const fy = y - iy
    const sx = fx * fx * (3 - 2 * fx); const sy = fy * fy * (3 - 2 * fy)
    return noise(ix, iy) * (1 - sx) * (1 - sy) + noise(ix + 1, iy) * sx * (1 - sy) + noise(ix, iy + 1) * (1 - sx) * sy + noise(ix + 1, iy + 1) * sx * sy
  }

  function fbm(x: number, y: number, octaves: number): number {
    let value = 0; let amplitude = 1; let frequency = 1; let maxVal = 0
    for (let i = 0; i < octaves; i++) {
      value += amplitude * smoothNoise(x * frequency, y * frequency); maxVal += amplitude
      amplitude *= 0.5; frequency *= 2
    }
    return value / maxVal
  }

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const u = px / width; const v = py / height
      const lon = u * 2 * Math.PI; const lat = (1 - v) * Math.PI
      const x3 = Math.cos(lat) * Math.cos(lon)
      const y3 = Math.cos(lat) * Math.sin(lon)
      const z3 = Math.sin(lat)

      const nx = x3 * 2.5 + 3.7; const ny = y3 * 2.5 + 5.1; const nz = z3 * 2.5 + 2.3
      const continentality = fbm(nx, ny, 6) * 0.6 + fbm(nz * 0.8, nx * 0.7 + 2, 4) * 0.4
      const latAbs = Math.abs(lat)
      const polar = latAbs > 1.2 ? Math.min(1, (latAbs - 1.2) / 0.3) : 0

      const idx = (py * width + px) * 4
      let r: number, g: number, b: number

      if (polar > 0.6 && continentality > 0.3) {
        r = ice[0]; g = ice[1]; b = ice[2]
      } else if (continentality > 0.52) {
        const elevation = (continentality - 0.52) / 0.48
        if (elevation < 0.3) { const t = elevation / 0.3; r = land[0] + (forest[0] - land[0]) * t; g = land[1] + (forest[1] - land[1]) * t; b = land[2] + (forest[2] - land[2]) * t }
        else if (elevation < 0.6) { const t = (elevation - 0.3) / 0.3; r = forest[0] + (dryLand[0] - forest[0]) * t; g = forest[1] + (dryLand[1] - forest[1]) * t; b = forest[2] + (dryLand[2] - forest[2]) * t }
        else if (elevation < 0.8) { const t = (elevation - 0.6) / 0.2; r = dryLand[0] + (sand[0] - dryLand[0]) * t; g = dryLand[1] + (sand[1] - dryLand[1]) * t; b = dryLand[2] + (sand[2] - dryLand[2]) * t }
        else { const t = Math.min(1, (elevation - 0.8) / 0.2); r = sand[0] + (ice[0] - sand[0]) * t * 0.5; g = sand[1] + (ice[1] - sand[1]) * t * 0.5; b = sand[2] + (ice[2] - sand[2]) * t * 0.5 }
      } else if (continentality > 0.4) {
        const t = (continentality - 0.4) / 0.12; r = ocean[0] + (land[0] - ocean[0]) * t; g = ocean[1] + (land[1] - ocean[1]) * t; b = ocean[2] + (land[2] - ocean[2]) * t
      } else if (continentality > 0.35) {
        const t = (continentality - 0.35) / 0.05; r = shallow[0] + (ocean[0] - shallow[0]) * t; g = shallow[1] + (ocean[1] - shallow[1]) * t; b = shallow[2] + (ocean[2] - shallow[2]) * t
      } else {
        const depth = Math.max(0, continentality / 0.35); r = ocean[0] - depth * 15; g = ocean[1] - depth * 25; b = ocean[2] - depth * 10
      }

      data[idx] = Math.max(0, Math.min(255, r))
      data[idx + 1] = Math.max(0, Math.min(255, g))
      data[idx + 2] = Math.max(0, Math.min(255, b))
      data[idx + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

function latLngToVec3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

export function World({ data, globeConfig }: { data: ArcData[]; globeConfig: GlobeConfig }) {
  const mountRef = useRef<HTMLDivElement>(null)

  const config = useMemo(() => ({
    pointSize: globeConfig.pointSize ?? 1,
    globeColor: globeConfig.globeColor ?? "#062056",
    showAtmosphere: globeConfig.showAtmosphere ?? true,
    atmosphereColor: globeConfig.atmosphereColor ?? "#FFFFFF",
    atmosphereAltitude: globeConfig.atmosphereAltitude ?? 0.1,
    emissive: globeConfig.emissive ?? "#062056",
    emissiveIntensity: globeConfig.emissiveIntensity ?? 0.1,
    shininess: globeConfig.shininess ?? 0.9,
    ambientLight: globeConfig.ambientLight ?? "#38bdf8",
    directionalLeftLight: globeConfig.directionalLeftLight ?? "#ffffff",
    directionalTopLight: globeConfig.directionalTopLight ?? "#ffffff",
    autoRotate: globeConfig.autoRotate ?? true,
    autoRotateSpeed: globeConfig.autoRotateSpeed ?? 0.5,
    arcTime: globeConfig.arcTime ?? 1000,
    arcLength: globeConfig.arcLength ?? 0.9,
  }), [globeConfig])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 500
    const height = mount.clientHeight || 500
    const dpr = Math.min(window.devicePixelRatio, 2)

    const scene = new Scene()
    const camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 2.5)

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const ambient = new AmbientLight(config.ambientLight, 0.5)
    scene.add(ambient)
    const leftLight = new DirectionalLight(config.directionalLeftLight, 1.0)
    leftLight.position.set(-5, 0, 5)
    scene.add(leftLight)
    const topLight = new DirectionalLight(config.directionalTopLight, 1.5)
    topLight.position.set(0, 5, 5)
    scene.add(topLight)

    const texCanvas = generateEarthTexture(1024, 512)
    const earthTexture = new CanvasTexture(texCanvas)
    earthTexture.colorSpace = SRGBColorSpace
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const globeGeo = new SphereGeometry(1, 72, 72)
    const globeMat = new MeshPhongMaterial({
      map: earthTexture,
      color: new Color(config.globeColor),
      emissive: new Color(config.emissive),
      emissiveIntensity: config.emissiveIntensity,
      shininess: config.shininess,
      specular: new Color(0x445566),
      transparent: true,
      opacity: 1,
    })
    const globe = new Mesh(globeGeo, globeMat)
    scene.add(globe)

    if (config.showAtmosphere) {
      const atmoGeo = new SphereGeometry(1 + config.atmosphereAltitude, 48, 48)
      const atmoMat = new MeshBasicMaterial({
        color: new Color(config.atmosphereColor),
        transparent: true,
        opacity: 0.1,
        side: BackSide,
      })
      scene.add(new Mesh(atmoGeo, atmoMat))

      const glowGeo = new SphereGeometry(1 + config.atmosphereAltitude * 0.6, 48, 48)
      const glowMat = new MeshBasicMaterial({
        color: new Color(config.atmosphereColor),
        transparent: true,
        opacity: 0.05,
        side: BackSide,
      })
      scene.add(new Mesh(glowGeo, glowMat))
    }

    const sortedArcs = [...data].sort((a, b) => a.order - b.order)
    const arcLines: Line[] = []

    sortedArcs.forEach((arc) => {
      const start = latLngToVec3(arc.startLat, arc.startLng, 1)
      const end = latLngToVec3(arc.endLat, arc.endLng, 1)
      const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5)
      mid.normalize().multiplyScalar(1 + arc.arcAlt)

      const curve = new CatmullRomCurve3([start, mid, end])
      const points = curve.getPoints(50)
      const geo = new BufferGeometry().setFromPoints(points)
      const mat = new LineBasicMaterial({
        color: new Color(arc.color),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
      })
      const line = new Line(geo, mat)
      scene.add(line)
      arcLines.push(line)
    })

    const starsCount = 2000
    const starsGeo = new BufferGeometry()
    const starsPos = new Float32Array(starsCount * 3)
    for (let i = 0; i < starsCount; i++) {
      const r = 3 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starsPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starsPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starsPos[i * 3 + 2] = r * Math.cos(phi)
    }
    starsGeo.setAttribute("position", new BufferAttribute(starsPos, 3))
    const starsMat = new PointsMaterial({
      color: 0xffffff,
      size: 0.015,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
    const stars = new Points(starsGeo, starsMat)
    scene.add(stars)

    const speed = config.autoRotate ? config.autoRotateSpeed * 0.002 : 0
    let arcIndex = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    function scheduleNextArc() {
      const timer = setTimeout(() => {
        const line = arcLines[arcIndex % arcLines.length]
        if (line) {
          const mat = line.material as LineBasicMaterial
          mat.opacity = 1
          const duration = config.arcTime
          const startTime = performance.now()
          const fadeOut = () => {
            const elapsed = performance.now() - startTime
            const t = Math.min(1, elapsed / duration)
            mat.opacity = 1 - t
            if (t < 1) requestAnimationFrame(fadeOut)
            else mat.opacity = 0
          }
          fadeOut()
        }
        arcIndex++
        scheduleNextArc()
      }, config.arcTime * 0.6)
      timers.push(timer)
    }
    if (arcLines.length > 0) scheduleNextArc()

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      globe.rotation.y += speed
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth || 500
      const h = mount.clientHeight || 500
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(frameId)
      timers.forEach(clearTimeout)
      ro.disconnect()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [data, config])

  return <div ref={mountRef} className="h-full w-full" />
}
