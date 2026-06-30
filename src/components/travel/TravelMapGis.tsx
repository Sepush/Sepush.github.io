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

const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const FLY_DURATION_MS = 3500;
const FLY_DELAY_MS = 600;

function isDocumentDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

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
  const [isDark, setIsDark] = useState(isDocumentDark);

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

  useEffect(() => {
    setIsDark(isDocumentDark());

    const onThemeChange = (): void => {
      setIsDark(isDocumentDark());
    };

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', onThemeChange);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          onThemeChange();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    document.addEventListener('artea-theme-change', onThemeChange);

    return () => {
      mq.removeEventListener('change', onThemeChange);
      observer.disconnect();
      document.removeEventListener('artea-theme-change', onThemeChange);
    };
  }, []);

  return (
    <div aria-hidden='true' className={`group relative isolate h-full w-full overflow-hidden ${className}`}>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
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
      <div
        className='pointer-events-none absolute inset-0 z-10'
        style={{
          background:
            'radial-gradient(circle at 50% 48%, var(--a-color-map-overlay-inner) 0%, var(--a-color-map-overlay-mid) 34%, var(--a-color-map-overlay-outer) 78%)',
        }}
      />
      <div
        className='pointer-events-none absolute inset-0 z-20'
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0) 28%, rgba(255, 255, 255, 0.005) 74%, rgba(255, 255, 255, 0.03) 100%)',
        }}
      />

      {/* Interaction hint */}
      <div
        className='pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full px-3 py-1 text-xs opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100'
        style={{
          backgroundColor: 'var(--a-color-map-hint-bg)',
          color: 'var(--a-color-map-hint-text)',
        }}
      >
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
