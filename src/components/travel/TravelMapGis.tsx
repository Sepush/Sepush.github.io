import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import placesData from '../../data/travel/places.json';

const INITIAL_VIEW = {
  longitude: 40,
  latitude: 25,
  zoom: 1.4,
} as const;

const FLY_DURATION_MS = 3500;
const FLY_DELAY_MS = 600;

const PLACE_BOUNDS = placesData.reduce(
  (acc, place) => ({
    minLng: Math.min(acc.minLng, place.lng),
    maxLng: Math.max(acc.maxLng, place.lng),
    minLat: Math.min(acc.minLat, place.lat),
    maxLat: Math.max(acc.maxLat, place.lat),
  }),
  { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity },
);

const FIT_BOUNDS = [
  [PLACE_BOUNDS.minLng, PLACE_BOUNDS.minLat],
  [PLACE_BOUNDS.maxLng, PLACE_BOUNDS.maxLat],
] as const;

type TravelMapGisProps = {
  className?: string;
  replayKey?: number;
};

export default function TravelMapGis({ className = '', replayKey = 0 }: TravelMapGisProps) {
  const mapRef = useRef<MapRef>(null);
  const [markersVisible, setMarkersVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const runAnimation = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    setMarkersVisible(false);

    // Reset to world view first (useful for replay)
    map.jumpTo({
      center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
      zoom: INITIAL_VIEW.zoom,
    });

    const timer = setTimeout(() => {
      map.fitBounds(FIT_BOUNDS, {
        padding: { top: 80, bottom: 80, left: 80, right: 80 },
        duration: FLY_DURATION_MS,
        essential: true,
      });
    }, FLY_DELAY_MS);

    const onMoveEnd = () => {
      setMarkersVisible(true);
    };
    void map.once('moveend', onMoveEnd);

    return () => {
      clearTimeout(timer);
      map.off('moveend', onMoveEnd);
    };
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return undefined;
    return runAnimation();
  }, [isLoaded, replayKey, runAnimation]);

  return (
    <div aria-hidden='true' className={`group relative isolate h-full w-full overflow-hidden ${className}`}>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        attributionControl={false}
        dragPan
        scrollZoom
        doubleClickZoom
        touchZoomRotate
        cooperativeGestures
        onLoad={handleLoad}
      >
        <Markers visible={markersVisible} />
      </Map>

      {/* Subtle overlay to match the original aesthetic */}
      <div className='pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(217,249,232,0.04)_0%,rgba(255,255,255,0.02)_34%,rgba(255,255,255,0.10)_78%)]' />
      <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0)_28%,rgba(255,255,255,0.005)_74%,rgba(255,255,255,0.03)_100%)]' />

      {/* Interaction hint */}
      <div className='pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-xs text-gray-600 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100'>
        Ctrl / ⌘ + 滚轮缩放 · 拖拽平移
      </div>
    </div>
  );
}

function Markers({ visible }: { visible: boolean }) {
  return (
    <>
      {placesData.map((place, index) => (
        <Marker key={`${place.name}-${index}`} longitude={place.lng} latitude={place.lat} anchor='center'>
          <div
            className='relative flex items-center justify-center transition-opacity duration-500 ease-out'
            style={{ opacity: visible ? 1 : 0 }}
          >
            <div
              className='absolute rounded-full'
              style={{
                width: '2.25rem',
                height: '2.25rem',
                backgroundColor: 'var(--a-color-accent)',
                opacity: 0.18,
                filter: 'blur(6px)',
              }}
            />
            <div
              className='relative rounded-full border-2 border-white/90'
              style={{
                width: '0.55rem',
                height: '0.55rem',
                backgroundColor: 'var(--a-color-accent)',
              }}
            />
          </div>
        </Marker>
      ))}
    </>
  );
}
