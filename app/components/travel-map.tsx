import { Tooltip } from '@pika-lab/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/maplibre';
import placesData from '../../src/data/travel/places.json';
import { useTheme } from './theme';

const INITIAL_VIEW = {
  longitude: 108,
  latitude: 34,
  zoom: 2.2,
} as const;

const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const INITIAL_FLY_DELAY_MS = 180;
const INITIAL_FLY_DURATION_MS = 1100;
const RESET_FLY_DURATION_MS = 750;

const PLACE_BOUNDS = placesData.reduce(
  (acc, place) => ({
    minLng: Math.min(acc.minLng, place.lng),
    maxLng: Math.max(acc.maxLng, place.lng),
    minLat: Math.min(acc.minLat, place.lat),
    maxLat: Math.max(acc.maxLat, place.lat),
  }),
  { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity },
);

const FIT_BOUNDS: [[number, number], [number, number]] = [
  [PLACE_BOUNDS.minLng, PLACE_BOUNDS.minLat],
  [PLACE_BOUNDS.maxLng, PLACE_BOUNDS.maxLat],
];

function getFitPadding(): number {
  return window.innerWidth < 640 ? 28 : 48;
}

interface TravelMapProps {
  className?: string;
  replayKey?: number;
}

export default function TravelMap({ className = '', replayKey = 0 }: TravelMapProps) {
  const { resolved, hydrated } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const hasFittedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fitPlaces = useCallback((duration: number) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const padding = getFitPadding();
    map.fitBounds(FIT_BOUNDS, {
      padding,
      duration: prefersReducedMotion ? 0 : duration,
      essential: true,
    });
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return undefined;

    if (!hasFittedRef.current) {
      hasFittedRef.current = true;
      const timer = window.setTimeout(() => fitPlaces(INITIAL_FLY_DURATION_MS), INITIAL_FLY_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    fitPlaces(RESET_FLY_DURATION_MS);
    return undefined;
  }, [fitPlaces, isLoaded, replayKey]);

  if (!hydrated) {
    return <div className='blog-map-placeholder' />;
  }

  const isDark = resolved === 'dark';

  return (
    <div className={`blog-travel-map ${className}`.trim()}>
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
        <Markers visible={isLoaded} />
      </Map>
      <div className='blog-travel-map__hint' aria-hidden='true'>
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
          <Tooltip content={place.name} placement='top'>
            <button
              type='button'
              aria-label={`足迹：${place.name}`}
              className={visible ? 'blog-map-pin blog-map-pin--visible' : 'blog-map-pin'}
            >
              <span className='blog-map-pin__halo' aria-hidden='true' />
              <span className='blog-map-pin__dot' aria-hidden='true' />
            </button>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
