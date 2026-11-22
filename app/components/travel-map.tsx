import 'maplibre-gl/dist/maplibre-gl.css';
import type { LayerSpecification, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import MapView, { Layer, Marker, Source, type MapRef } from 'react-map-gl/maplibre';
import {
  ALL_PLACES_BOUNDS,
  PLACE_BY_ID,
  REGION_META_MAP,
  TRAVEL_PLACES,
  TRAVEL_ROUTES_GEOJSON,
  getPlacesBounds,
  getRegionColor,
  type TravelPlace,
  type TravelRegionId,
} from '../lib/travel';
import { MapPin } from './icons';
import { useTheme } from './theme';

const INITIAL_VIEW = {
  longitude: 108,
  latitude: 34.5,
  zoom: 3.2,
} as const;

const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const CLUSTER_RADIUS_PX = 54;
const UNCLUSTER_ZOOM = 6.8;
const CJK_FONT_FAMILY = "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

const CHINESE_TEXT_FIELD = [
  'coalesce',
  ['get', 'name:zh-Hans'],
  ['get', 'name:zh'],
  ['get', 'name'],
  ['get', 'name:en'],
];

export type MapThemeOverride = 'auto' | 'light' | 'dark';

export interface TravelMapProps {
  selectedRegion: TravelRegionId | null;
  selectedPlaceId: string | null;
  hoveredPlaceId: string | null;
  showRoutes: boolean;
  showLabels: boolean;
  mapThemeOverride: MapThemeOverride;
  panelOpen: boolean;
  fitTrigger: number;
  onSelectPlace: (place: TravelPlace | null) => void;
  onHoverPlace: (placeId: string | null) => void;
}

interface SingleMarkerNode {
  kind: 'single';
  id: string;
  place: TravelPlace;
}

interface ClusterMarkerNode {
  kind: 'cluster';
  id: string;
  places: TravelPlace[];
  lng: number;
  lat: number;
  region: TravelRegionId;
  label: string;
}

type MarkerNode = SingleMarkerNode | ClusterMarkerNode;

function isSymbolLayerWithText(layer: LayerSpecification): boolean {
  return layer.type === 'symbol' && Boolean(layer.layout && 'text-field' in layer.layout);
}

function applyChineseLabels(map: MapLibreMap): void {
  const style: StyleSpecification | undefined = map.getStyle();
  if (!style?.layers) return;
  for (const layer of style.layers) {
    if (!isSymbolLayerWithText(layer)) continue;
    try {
      map.setLayoutProperty(layer.id, 'text-field', CHINESE_TEXT_FIELD);
    } catch {
      // Ignore layers whose expression cannot be overridden.
    }
  }
}

function getCameraPadding(panelOpen: boolean): { top: number; bottom: number; left: number; right: number } {
  const mobile = window.innerWidth < 768;
  if (mobile) {
    return {
      top: 72,
      left: 28,
      right: 28,
      bottom: panelOpen ? Math.min(320, Math.round(window.innerHeight * 0.44) + 32) : 88,
    };
  }
  return {
    top: 78,
    bottom: 88,
    left: 48,
    right: panelOpen ? 420 : 56,
  };
}

function dominantRegion(places: readonly TravelPlace[]): TravelRegionId {
  const counts = new Map<TravelRegionId, number>();
  for (const place of places) {
    counts.set(place.region, (counts.get(place.region) ?? 0) + 1);
  }
  let best: TravelRegionId = places[0]!.region;
  let bestCount = -1;
  for (const [region, count] of counts) {
    if (count > bestCount) {
      best = region;
      bestCount = count;
    }
  }
  return best;
}

function formatClusterLabel(places: readonly TravelPlace[]): string {
  if (places.length === 2) {
    return `${places[0]!.name} · ${places[1]!.name}`;
  }
  const anchor = places.find(p => p.name === '杭州' || p.name === '武汉' || p.name === '乌鲁木齐') ?? places[0]!;
  return `${anchor.name}等 ${places.length} 城`;
}

function computeMarkerNodes(
  map: MapLibreMap | null,
  places: readonly TravelPlace[],
  selectedPlaceId: string | null,
): MarkerNode[] {
  if (!map || map.getZoom() >= UNCLUSTER_ZOOM) {
    return places.map(place => ({ kind: 'single', id: place.id, place }));
  }

  const projected = places.map(place => ({
    place,
    pt: map.project([place.lng, place.lat]),
  }));

  const visited = new Set<number>();
  const nodes: MarkerNode[] = [];

  for (let i = 0; i < projected.length; i += 1) {
    if (visited.has(i)) continue;
    visited.add(i);
    const seed = projected[i]!;
    if (seed.place.id === selectedPlaceId) {
      nodes.push({ kind: 'single', id: seed.place.id, place: seed.place });
      continue;
    }

    const group: TravelPlace[] = [seed.place];
    for (let j = i + 1; j < projected.length; j += 1) {
      if (visited.has(j)) continue;
      const candidate = projected[j]!;
      if (candidate.place.id === selectedPlaceId) continue;
      const dist = Math.hypot(candidate.pt.x - seed.pt.x, candidate.pt.y - seed.pt.y);
      if (dist <= CLUSTER_RADIUS_PX) {
        visited.add(j);
        group.push(candidate.place);
      }
    }

    if (group.length === 1) {
      nodes.push({ kind: 'single', id: seed.place.id, place: seed.place });
    } else {
      const avgLng = group.reduce((sum, item) => sum + item.lng, 0) / group.length;
      const avgLat = group.reduce((sum, item) => sum + item.lat, 0) / group.length;
      nodes.push({
        kind: 'cluster',
        id: `cluster-${group.map(item => item.id).join('_')}`,
        places: group,
        lng: avgLng,
        lat: avgLat,
        region: dominantRegion(group),
        label: formatClusterLabel(group),
      });
    }
  }

  return nodes;
}

export default function TravelMap({
  selectedRegion,
  selectedPlaceId,
  hoveredPlaceId,
  showRoutes,
  showLabels,
  mapThemeOverride,
  panelOpen,
  fitTrigger,
  onSelectPlace,
  onHoverPlace,
}: TravelMapProps) {
  const { resolved, hydrated } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const hasInitializedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraTick, setCameraTick] = useState(0);

  const isDark = mapThemeOverride === 'auto' ? resolved === 'dark' : mapThemeOverride === 'dark';

  const getMotionDuration = useCallback(
    (ms: number) => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms),
    [],
  );

  const fitBoundsSmooth = useCallback(
    (bounds: [[number, number], [number, number]], duration: number, maxZoom = 7.2) => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      map.fitBounds(bounds, {
        padding: getCameraPadding(panelOpen),
        maxZoom,
        duration: getMotionDuration(duration),
        essential: true,
      });
    },
    [getMotionDuration, panelOpen],
  );

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map) {
      applyChineseLabels(map);
      map.on('style.load', () => applyChineseLabels(map));
    }
    setIsLoaded(true);
    setCameraTick(value => value + 1);
  }, []);

  const handleCameraChange = useCallback(() => {
    setCameraTick(value => value + 1);
  }, []);

  // Initial overview fit once map is ready
  useEffect(() => {
    if (!isLoaded || hasInitializedRef.current) return undefined;
    hasInitializedRef.current = true;
    const timer = window.setTimeout(() => {
      fitBoundsSmooth(ALL_PLACES_BOUNDS, 900, 5.4);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [fitBoundsSmooth, isLoaded]);

  // Explicit recenter trigger
  useEffect(() => {
    if (!isLoaded || fitTrigger === 0) return;
    fitBoundsSmooth(ALL_PLACES_BOUNDS, 850, 5.4);
  }, [fitBoundsSmooth, fitTrigger, isLoaded]);

  // Fly to selected city
  useEffect(() => {
    if (!isLoaded || !selectedPlaceId) return;
    const place = PLACE_BY_ID.get(selectedPlaceId);
    const map = mapRef.current?.getMap();
    if (!place || !map) return;
    map.flyTo({
      center: [place.lng, place.lat],
      zoom: Math.max(map.getZoom(), 8),
      padding: getCameraPadding(panelOpen),
      duration: getMotionDuration(900),
      essential: true,
    });
  }, [getMotionDuration, isLoaded, panelOpen, selectedPlaceId]);

  // Fit to selected region when no single city is picked
  useEffect(() => {
    if (!isLoaded || selectedPlaceId) return;
    if (!selectedRegion) {
      if (hasInitializedRef.current) {
        fitBoundsSmooth(ALL_PLACES_BOUNDS, 800, 5.4);
      }
      return;
    }
    const regionPlaces = TRAVEL_PLACES.filter(place => place.region === selectedRegion);
    if (regionPlaces.length === 0) return;
    if (regionPlaces.length === 1) {
      const only = regionPlaces[0]!;
      mapRef.current?.getMap().flyTo({
        center: [only.lng, only.lat],
        zoom: 7.5,
        padding: getCameraPadding(panelOpen),
        duration: getMotionDuration(850),
        essential: true,
      });
      return;
    }
    fitBoundsSmooth(getPlacesBounds(regionPlaces), 850, 7.6);
  }, [fitBoundsSmooth, getMotionDuration, isLoaded, panelOpen, selectedPlaceId, selectedRegion]);

  // Recompute clusters whenever map camera moves or selection changes
  const markerNodes = useMemo<MarkerNode[]>(() => {
    void cameraTick;
    const map = isLoaded ? (mapRef.current?.getMap() ?? null) : null;
    return computeMarkerNodes(map, TRAVEL_PLACES, selectedPlaceId);
  }, [cameraTick, isLoaded, selectedPlaceId]);

  const handleClusterClick = useCallback(
    (cluster: ClusterMarkerNode) => {
      fitBoundsSmooth(getPlacesBounds(cluster.places), 750, 8.6);
    },
    [fitBoundsSmooth],
  );

  const regionalOpacityExpr = useMemo(() => {
    if (!selectedRegion) return isDark ? 0.72 : 0.76;
    return ['case', ['==', ['get', 'region'], selectedRegion], 0.9, 0.16];
  }, [isDark, selectedRegion]);

  const hubOpacityExpr = useMemo(() => {
    if (!selectedRegion) return isDark ? 0.34 : 0.4;
    return ['case', ['==', ['get', 'region'], selectedRegion], 0.72, 0.1];
  }, [isDark, selectedRegion]);

  const lineColorExpr = useMemo(() => ['get', isDark ? 'darkColor' : 'color'], [isDark]);

  if (!hydrated) {
    return <div className='trip-map-skeleton' />;
  }

  return (
    <div className='trip-map-canvas'>
      <MapView
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
        localIdeographFontFamily={CJK_FONT_FAMILY}
        attributionControl={false}
        dragPan
        scrollZoom
        doubleClickZoom
        touchZoomRotate
        onLoad={handleLoad}
        onMove={handleCameraChange}
        onZoom={handleCameraChange}
        onResize={handleCameraChange}
        onClick={() => {
          if (selectedPlaceId) onSelectPlace(null);
        }}
      >
        {showRoutes ? (
          <Source id='travel-routes' type='geojson' data={TRAVEL_ROUTES_GEOJSON}>
            <Layer
              id='travel-routes-hub'
              type='line'
              filter={['==', ['get', 'kind'], 'hub']}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': lineColorExpr as never,
                'line-width': 1.6,
                'line-dasharray': [2, 3],
                'line-opacity': hubOpacityExpr as never,
              }}
            />
            <Layer
              id='travel-routes-regional'
              type='line'
              filter={['==', ['get', 'kind'], 'regional']}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': lineColorExpr as never,
                'line-width': 2.25,
                'line-opacity': regionalOpacityExpr as never,
              }}
            />
          </Source>
        ) : null}

        {isLoaded
          ? markerNodes.map(node => {
              if (node.kind === 'cluster') {
                const color = getRegionColor(node.region, isDark);
                const containsHovered = hoveredPlaceId !== null && node.places.some(p => p.id === hoveredPlaceId);
                const dimmed = selectedRegion !== null && !node.places.some(p => p.region === selectedRegion);
                const style = { '--trip-pin-color': color } as CSSProperties;
                return (
                  <Marker key={node.id} longitude={node.lng} latitude={node.lat} anchor='center'>
                    <button
                      type='button'
                      className={`trip-pin-cluster${containsHovered ? ' trip-pin-cluster--lifted' : ''}${dimmed ? ' trip-pin--dimmed' : ''}`}
                      style={style}
                      aria-label={`${node.label}，点击展开查看 ${node.places.length} 座城市`}
                      onClick={event => {
                        event.stopPropagation();
                        handleClusterClick(node);
                      }}
                    >
                      <span className='trip-pin-stack' aria-hidden='true'>
                        <span className='trip-pin-stack__back' />
                        <span className='trip-pin-stack__front'>
                          <MapPin size={14} strokeWidth={2.2} />
                        </span>
                        <span className='trip-pin-count'>{node.places.length}</span>
                      </span>
                      {showLabels ? <span className='trip-pin-label'>{node.label}</span> : null}
                    </button>
                  </Marker>
                );
              }

              const { place } = node;
              const color = getRegionColor(place.region, isDark);
              const selected = selectedPlaceId === place.id;
              const lifted = hoveredPlaceId === place.id || selected;
              const dimmed =
                (selectedRegion !== null && place.region !== selectedRegion && !selected) ||
                (selectedPlaceId !== null && !selected);
              const style = { '--trip-pin-color': color } as CSSProperties;

              return (
                <Marker key={place.id} longitude={place.lng} latitude={place.lat} anchor='center'>
                  <button
                    type='button'
                    className={`trip-pin-marker${lifted ? ' trip-pin-marker--lifted' : ''}${selected ? ' trip-pin-marker--selected' : ''}${dimmed ? ' trip-pin--dimmed' : ''}`}
                    style={style}
                    aria-label={`${place.name}（${REGION_META_MAP[place.region].label}）`}
                    aria-pressed={selected}
                    onMouseEnter={() => onHoverPlace(place.id)}
                    onMouseLeave={() => onHoverPlace(null)}
                    onClick={event => {
                      event.stopPropagation();
                      onSelectPlace(selected ? null : place);
                    }}
                  >
                    <span className='trip-pin-balloon' aria-hidden='true'>
                      <span className='trip-pin-balloon__core' />
                    </span>
                    {showLabels || lifted ? <span className='trip-pin-label'>{place.name}</span> : null}
                  </button>
                </Marker>
              );
            })
          : null}
      </MapView>
    </div>
  );
}
