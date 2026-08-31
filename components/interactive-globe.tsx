"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface InteractiveGlobeProps {
  className?: string
  size?: number
  autoRotateSpeed?: number
  enableZoom?: boolean
  showMarkers?: boolean
  showInstructions?: boolean
}

export function InteractiveGlobe({
  className = "",
  size = 500,
  autoRotateSpeed = 0.002,
  enableZoom = true,
  showInstructions = true,
}: InteractiveGlobeProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || size
    const height = mount.clientHeight || size

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 2.8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.display = "block"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.touchAction = "none"

    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load("/earth-texture.jpg")
    earthTexture.colorSpace = THREE.SRGBColorSpace
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const globeGeometry = new THREE.SphereGeometry(1, 96, 96)
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthTexture,
      bumpScale: 0.03,
      shininess: 8,
      specular: new THREE.Color(0x334155),
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      }),
    )
    scene.add(atmosphere)

    const createStars = (
      count: number,
      radiusMin: number,
      radiusMax: number,
      pointSize: number,
      opacity: number,
    ) => {
      const starsGeometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const palette = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xdbeafe),
        new THREE.Color(0xfef3c7),
      ]

      for (let i = 0; i < count; i += 1) {
        const radius = radiusMin + Math.random() * (radiusMax - radiusMin)
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const color = palette[Math.floor(Math.random() * palette.length)]

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = radius * Math.cos(phi)

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b
      }

      starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      return new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({
          size: pointSize,
          vertexColors: true,
          transparent: true,
          opacity,
          sizeAttenuation: true,
        }),
      )
    }

    const starField = createStars(6000, 3, 15, 0.012, 0.8)
    const starGroup = new THREE.Group()
    starGroup.add(starField)
    scene.add(starGroup)

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfbbf24, 1.45)
    keyLight.position.set(5, 3, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x6366f1, 1.1, 10)
    fillLight.position.set(-3, -2, -3)
    scene.add(fillLight)

    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / rect.width
      const ny = (event.clientY - rect.top) / rect.height
      mouseX = (nx - 0.5) * 2
      mouseY = -(ny - 0.5) * 2
    }
    mount.addEventListener("mousemove", handleMouseMove)

    let targetZoom = camera.position.z
    const minZoom = 2.3
    const maxZoom = 4.5
    const handleWheel = (event: WheelEvent) => {
      if (!enableZoom) return
      event.preventDefault()
      const delta = Math.sign(event.deltaY) * 0.25
      targetZoom = Math.min(maxZoom, Math.max(minZoom, targetZoom + delta))
    }
    mount.addEventListener("wheel", handleWheel, { passive: false })

    let frameId = 0
    const animate = () => {
      frameId = window.requestAnimationFrame(animate)

      if (enableZoom) {
        camera.position.z += (targetZoom - camera.position.z) * 0.08
      }

      globe.rotation.y += autoRotateSpeed + mouseX * 0.0008
      globe.rotation.x = THREE.MathUtils.lerp(globe.rotation.x, mouseY * 0.18, 0.04)
      atmosphere.rotation.copy(globe.rotation)

      starGroup.rotation.y += 0.00018
      starGroup.rotation.x += 0.00008

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const nextWidth = mount.clientWidth || size
      const nextHeight = mount.clientHeight || size
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(mount)
    window.addEventListener("resize", handleResize)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      mount.removeEventListener("mousemove", handleMouseMove)
      mount.removeEventListener("wheel", handleWheel)
      window.removeEventListener("resize", handleResize)

      scene.remove(globe, atmosphere, starGroup, ambient, keyLight, fillLight)
      globeGeometry.dispose()
      globeMaterial.dispose()
      earthTexture.dispose()
      ;(atmosphere.geometry as THREE.SphereGeometry).dispose()
      ;(atmosphere.material as THREE.MeshBasicMaterial).dispose()
      ;(starField.geometry as THREE.BufferGeometry).dispose()
      ;(starField.material as THREE.PointsMaterial).dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [size, autoRotateSpeed, enableZoom])

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="h-full w-full" />
      {showInstructions && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] text-white/70 shadow-lg backdrop-blur-md">
          Move mouse to tilt{enableZoom ? " · Scroll to zoom" : ""}
        </div>
      )}
    </div>
  )
}

export default InteractiveGlobe
