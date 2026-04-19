import React, { useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import * as topojson from 'topojson-client'
import worldData from '../../data/travel/countries-110m.json'
import placesData from '../../data/travel/places.json'

const worldGeoJson = topojson.feature(
  worldData as any,
  worldData.objects.countries as any
) as any

const VIEWPORT = {
  width: 1600,
  height: 920,
} as const

const ZOOM_DURATION_MS = 3500

// Start zoomed out (world view), end zoomed in (East Asia)
const INITIAL_VIEW = {
  centerLng: 40,
  centerLat: 25,
  scale: 160,
  translateY: 460,
} as const

const FINAL_VIEW = {
  centerLng: 110,
  centerLat: 35,
  scale: 750,
  translateY: 380,
} as const

type TravelMapProps = {
  className?: string
}

function easeInOutQuart(t: number) {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Skip zoom animation on client-side navigation (View Transitions)
let hasAnimatedOnce = false

export default function TravelMap({ className = '' }: TravelMapProps) {
  const skipAnimation = useRef(hasAnimatedOnce)
  const [progress, setProgress] = useState(skipAnimation.current ? 1 : 0)
  const [markersVisible, setMarkersVisible] = useState(skipAnimation.current)

  useEffect(() => {
    if (skipAnimation.current) return

    const startAt = performance.now()
    let frameId = 0

    const animate = (now: number) => {
      const elapsed = now - startAt
      const raw = Math.min(1, elapsed / ZOOM_DURATION_MS)
      const eased = easeInOutQuart(raw)
      setProgress(eased)

      if (raw < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        hasAnimatedOnce = true
        setMarkersVisible(true)
      }
    }

    // Let the user see the world map briefly before zooming
    const timer = setTimeout(() => {
      frameId = requestAnimationFrame(animate)
    }, 600)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frameId)
    }
  }, [])

  const currentView = useMemo(() => ({
    centerLng: lerp(INITIAL_VIEW.centerLng, FINAL_VIEW.centerLng, progress),
    centerLat: lerp(INITIAL_VIEW.centerLat, FINAL_VIEW.centerLat, progress),
    scale: lerp(INITIAL_VIEW.scale, FINAL_VIEW.scale, progress),
    translateY: lerp(INITIAL_VIEW.translateY, FINAL_VIEW.translateY, progress),
  }), [progress])

  const projection = useMemo(() => {
    return geoMercator()
      .center([currentView.centerLng, currentView.centerLat])
      .scale(currentView.scale)
      .translate([VIEWPORT.width / 2, currentView.translateY])
      .clipExtent([
        [0, 0],
        [VIEWPORT.width, VIEWPORT.height],
      ])
  }, [currentView])

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection)
  }, [projection])

  const projectedPlaces = useMemo(() => {
    return placesData
      .map((place) => {
        const coords = projection([place.lng, place.lat])
        if (!coords) return null
        return {
          ...place,
          x: coords[0],
          y: coords[1],
        }
      })
      .filter(Boolean) as Array<
      (typeof placesData)[number] & { x: number; y: number }
    >
  }, [projection])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative isolate h-full w-full overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/[0.01] to-white/8" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(217,249,232,0.06)_0%,rgba(255,255,255,0.02)_34%,rgba(255,255,255,0.14)_78%)]" />

      <div className="absolute inset-0 z-20">
        <svg
          viewBox={`0 0 ${VIEWPORT.width} ${VIEWPORT.height}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="travel-map-point-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--a-color-accent)" stopOpacity="0.46" />
              <stop offset="68%" stopColor="var(--a-color-accent)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--a-color-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g>
            {worldGeoJson.features.map((feature: any, index: number) => {
              const d = pathGenerator(feature)
              if (!d) return null

              return (
                <path
                  key={`country-${index}`}
                  d={d}
                  fill="rgba(148, 163, 184, 0.42)"
                  stroke="rgba(148, 163, 184, 0.94)"
                  strokeWidth="1.18"
                />
              )
            })}
          </g>

          <g
            style={{
              opacity: markersVisible ? 1 : 0,
              transition: 'opacity 600ms ease-out',
            }}
          >
            {projectedPlaces.map((place, index) => {
              return (
                <g key={`place-${index}`} transform={`translate(${place.x}, ${place.y})`}>
                  <circle r={36} fill="url(#travel-map-point-glow)" />
                  <circle
                    r={10}
                    fill="var(--a-color-accent)"
                    fillOpacity="0.34"
                  />
                  <circle
                    r={5.2}
                    fill="var(--a-color-accent)"
                    stroke="rgba(255, 255, 255, 0.92)"
                    strokeWidth="1.8"
                  />
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 z-30 bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0)_28%,rgba(255,255,255,0.005)_74%,rgba(255,255,255,0.03)_100%)]" />
    </div>
  )
}
