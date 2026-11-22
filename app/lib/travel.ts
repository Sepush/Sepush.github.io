import rawPlaces from '../../src/data/travel/places.json';

export interface RouteLineFeature {
  type: 'Feature';
  properties: RouteLineProperties;
  geometry: {
    type: 'LineString';
    coordinates: Array<[number, number]>;
  };
}

export interface RouteLineCollection {
  type: 'FeatureCollection';
  features: RouteLineFeature[];
}

export type TravelRegionId = 'east' | 'central' | 'xinjiang' | 'southwest' | 'japan';

export interface TravelRegionMeta {
  id: TravelRegionId;
  label: string;
  description: string;
  color: string;
  darkColor: string;
}

export interface TravelPlace {
  id: string;
  name: string;
  country: string;
  countryLabel: string;
  region: TravelRegionId;
  lat: number;
  lng: number;
}

export interface RouteLineProperties {
  region: TravelRegionId;
  kind: 'regional' | 'hub';
  color: string;
  darkColor: string;
}

export const TRAVEL_REGIONS: readonly TravelRegionMeta[] = [
  {
    id: 'east',
    label: '华东',
    description: '长三角与皖南的日常往返',
    color: '#18a058',
    darkColor: '#63e2b7',
  },
  {
    id: 'central',
    label: '华中',
    description: '江汉平原到赣西山水的沿线',
    color: '#2080f0',
    darkColor: '#70c0e8',
  },
  {
    id: 'xinjiang',
    label: '新疆',
    description: '北疆草原、山谷与公路',
    color: '#e68a00',
    darkColor: '#f2c97d',
  },
  {
    id: 'southwest',
    label: '西南',
    description: '川渝盆地的烟火与山城',
    color: '#7c5ce6',
    darkColor: '#a78bfa',
  },
  {
    id: 'japan',
    label: '日本',
    description: '关西古都与街巷漫步',
    color: '#d97757',
    darkColor: '#e89574',
  },
] as const;

export const REGION_META_MAP: Record<TravelRegionId, TravelRegionMeta> = Object.fromEntries(
  TRAVEL_REGIONS.map(region => [region.id, region]),
) as Record<TravelRegionId, TravelRegionMeta>;

const CENTRAL_CITIES = new Set(['武汉', '随州', '黄冈', '南昌', '上饶', '新余', '宜春']);
const XINJIANG_CITIES = new Set(['乌鲁木齐', '伊犁', '博尔塔拉', '塔城']);
const SOUTHWEST_CITIES = new Set(['成都', '重庆']);

function classifyRegion(name: string, country: string): TravelRegionId {
  if (country === 'JP') return 'japan';
  if (XINJIANG_CITIES.has(name)) return 'xinjiang';
  if (SOUTHWEST_CITIES.has(name)) return 'southwest';
  if (CENTRAL_CITIES.has(name)) return 'central';
  return 'east';
}

function countryLabel(country: string): string {
  switch (country) {
    case 'CN':
      return '中国';
    case 'JP':
      return '日本';
    default:
      return country;
  }
}

export const TRAVEL_PLACES: readonly TravelPlace[] = rawPlaces.map(place => ({
  id: `${place.country.toLowerCase()}-${place.name}`,
  name: place.name,
  country: place.country,
  countryLabel: countryLabel(place.country),
  region: classifyRegion(place.name, place.country),
  lat: place.lat,
  lng: place.lng,
}));

export const PLACE_BY_ID = new Map<string, TravelPlace>(TRAVEL_PLACES.map(place => [place.id, place]));

export const COUNTRY_COUNT = new Set(TRAVEL_PLACES.map(place => place.country)).size;

const PLACE_ORDER_BY_REGION: Record<TravelRegionId, readonly string[]> = {
  east: ['杭州', '上海', '苏州', '无锡', '湖州', '绍兴', '嘉兴', '台州', '黄山', '滁州', '六安'],
  central: ['武汉', '随州', '黄冈', '南昌', '上饶', '新余', '宜春'],
  xinjiang: ['乌鲁木齐', '伊犁', '博尔塔拉', '塔城'],
  southwest: ['成都', '重庆'],
  japan: ['京都', '大阪'],
};

const TRAIL_ORDER_BY_REGION: Record<TravelRegionId, readonly string[]> = {
  east: ['台州', '绍兴', '杭州', '湖州', '嘉兴', '上海', '苏州', '无锡', '滁州', '六安', '黄山'],
  central: ['随州', '武汉', '黄冈', '宜春', '新余', '南昌', '上饶'],
  xinjiang: ['乌鲁木齐', '伊犁', '博尔塔拉', '塔城'],
  southwest: ['成都', '重庆'],
  japan: ['大阪', '京都'],
};

export interface TravelRegionGroup {
  meta: TravelRegionMeta;
  places: TravelPlace[];
}

export const TRAVEL_REGION_GROUPS: readonly TravelRegionGroup[] = TRAVEL_REGIONS.map(meta => {
  const order = PLACE_ORDER_BY_REGION[meta.id];
  const places = TRAVEL_PLACES.filter(place => place.region === meta.id).sort((a, b) => {
    const ai = order.indexOf(a.name);
    const bi = order.indexOf(b.name);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  return { meta, places };
});

export function getPlacesBounds(places: readonly TravelPlace[]): [[number, number], [number, number]] {
  const bounds = places.reduce(
    (acc, place) => ({
      minLng: Math.min(acc.minLng, place.lng),
      maxLng: Math.max(acc.maxLng, place.lng),
      minLat: Math.min(acc.minLat, place.lat),
      maxLat: Math.max(acc.maxLat, place.lat),
    }),
    { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity },
  );
  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ];
}

export const ALL_PLACES_BOUNDS = getPlacesBounds(TRAVEL_PLACES);

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: TravelPlace, b: TravelPlace): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * earthRadiusKm * Math.asin(Math.sqrt(h)));
}

export function getNearbyPlaces(place: TravelPlace, limit = 4): Array<{ place: TravelPlace; distanceKm: number }> {
  return TRAVEL_PLACES.filter(item => item.id !== place.id)
    .map(item => ({ place: item, distanceKm: haversineKm(place, item) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

function createCurvedArc(from: [number, number], to: [number, number], steps = 24): Array<[number, number]> {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(4.2, dist * 0.12);
  const midLng = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2 + lift;

  const coords: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const inv = 1 - t;
    const lng = inv * inv * from[0] + 2 * inv * t * midLng + t * t * to[0];
    const lat = inv * inv * from[1] + 2 * inv * t * midLat + t * t * to[1];
    coords.push([lng, lat]);
  }
  return coords;
}

function findPlaceByName(name: string): TravelPlace | undefined {
  return TRAVEL_PLACES.find(place => place.name === name);
}

export function buildTravelRoutesGeoJson(): RouteLineCollection {
  const features: RouteLineFeature[] = [];

  for (const region of TRAVEL_REGIONS) {
    const names = TRAIL_ORDER_BY_REGION[region.id];
    const coords = names
      .map(findPlaceByName)
      .filter((place): place is TravelPlace => place !== undefined)
      .map(place => [place.lng, place.lat] as [number, number]);

    if (coords.length >= 2) {
      features.push({
        type: 'Feature',
        properties: {
          region: region.id,
          kind: 'regional',
          color: region.color,
          darkColor: region.darkColor,
        },
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      });
    }
  }

  const hub = findPlaceByName('杭州');
  const hubTargets: Array<{ name: string; region: TravelRegionId }> = [
    { name: '上饶', region: 'central' },
    { name: '重庆', region: 'southwest' },
    { name: '乌鲁木齐', region: 'xinjiang' },
    { name: '大阪', region: 'japan' },
  ];

  if (hub) {
    for (const target of hubTargets) {
      const dest = findPlaceByName(target.name);
      if (!dest) continue;
      const meta = REGION_META_MAP[target.region];
      features.push({
        type: 'Feature',
        properties: {
          region: target.region,
          kind: 'hub',
          color: meta.color,
          darkColor: meta.darkColor,
        },
        geometry: {
          type: 'LineString',
          coordinates: createCurvedArc([hub.lng, hub.lat], [dest.lng, dest.lat]),
        },
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

export const TRAVEL_ROUTES_GEOJSON = buildTravelRoutesGeoJson();

export function getRegionColor(region: TravelRegionId, isDark: boolean): string {
  const meta = REGION_META_MAP[region];
  return isDark ? meta.darkColor : meta.color;
}
