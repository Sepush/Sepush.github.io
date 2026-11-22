import {
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  Eyebrow,
  Heading,
  Link,
  Menu,
  Paragraph,
  Popover,
  ScrollArea,
  SegmentedControl,
  Separator,
  Switch,
  Tag,
  Text,
  Tooltip,
  type MenuLinkProps,
  type MenuOption,
  type SegmentedControlOption,
} from '@pika-lab/react';
import { lazy, Suspense, useCallback, useMemo, useState, type CSSProperties } from 'react';
import { useLoaderData, useOutletContext, type MetaFunction } from 'react-router';
import { ClientOnly } from '../components/client-only';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Home as HomeIcon,
  Layers,
  LocateFixed,
  MapIcon,
  MapPin,
  Menu as MenuIcon,
  Navigation,
  StickyNote,
  User,
  Users,
  X,
} from '../components/icons';
import { RouterLink } from '../components/router-link';
import { SiteSearch } from '../components/site-search';
import { SocialLinks } from '../components/social-links';
import { ThemeToggle, useTheme } from '../components/theme';
import type { MapThemeOverride } from '../components/travel-map';
import { arteaSocialLinks } from '../config/social';
import { getPostSummaries } from '../lib/content.server';
import { formatDate } from '../lib/format';
import {
  COUNTRY_COUNT,
  PLACE_BY_ID,
  REGION_META_MAP,
  TRAVEL_PLACES,
  TRAVEL_REGIONS,
  TRAVEL_REGION_GROUPS,
  getNearbyPlaces,
  getRegionColor,
  type TravelPlace,
  type TravelRegionId,
} from '../lib/travel';
import type { RootOutletContext } from '../root';

const TravelMap = lazy(() => import('../components/travel-map'));

type PanelTab = 'places' | 'posts';

const navLinks = [
  { name: '文章', href: '/posts', icon: <BookOpen aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '笔记', href: '/notes', icon: <StickyNote aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '友人', href: '/friends', icon: <Users aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '关于', href: '/about', icon: <User aria-hidden='true' size={15} strokeWidth={1.75} /> },
] as const;

const mapStyleOptions: SegmentedControlOption<MapThemeOverride>[] = [
  { label: '跟随', value: 'auto' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

function renderMenuLink({ href, ...props }: MenuLinkProps) {
  return <RouterLink href={href} {...props} />;
}

function formatCoords(lat: number, lng: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${ns}, ${Math.abs(lng).toFixed(2)}°${ew}`;
}

export const meta: MetaFunction = () => [{ title: 'Artea' }, { name: 'description', content: "Artea's blog" }];

export function loader() {
  const posts = getPostSummaries();
  return {
    recentPosts: posts.slice(0, 8),
    totalPosts: posts.length,
  };
}

export default function Home() {
  const { recentPosts, totalPosts } = useLoaderData<typeof loader>();
  const { searchEntries } = useOutletContext<RootOutletContext>();
  const { resolved } = useTheme();

  const [panelOpen, setPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState<PanelTab>('places');
  const [selectedRegion, setSelectedRegion] = useState<TravelRegionId | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [mapThemeOverride, setMapThemeOverride] = useState<MapThemeOverride>('auto');
  const [fitTrigger, setFitTrigger] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDarkMap = mapThemeOverride === 'auto' ? resolved === 'dark' : mapThemeOverride === 'dark';
  const selectedPlace = selectedPlaceId ? (PLACE_BY_ID.get(selectedPlaceId) ?? null) : null;
  const nearbyPlaces = useMemo(() => (selectedPlace ? getNearbyPlaces(selectedPlace, 4) : []), [selectedPlace]);

  const mobileMenuOptions = useMemo<MenuOption[]>(
    () => [
      { key: '/', label: '首页地图', href: '/', icon: <HomeIcon aria-hidden='true' size={15} strokeWidth={1.75} /> },
      ...navLinks.map(item => ({
        key: item.href,
        label: item.name,
        href: item.href,
        icon: item.icon,
      })),
    ],
    [],
  );

  const handleRecenter = useCallback(() => {
    setSelectedPlaceId(null);
    setSelectedRegion(null);
    setFitTrigger(value => value + 1);
  }, []);

  const handleSelectPlace = useCallback((place: TravelPlace | null) => {
    if (!place) {
      setSelectedPlaceId(null);
      return;
    }
    setSelectedPlaceId(place.id);
    setPanelTab('places');
    setPanelOpen(true);
  }, []);

  const handleToggleRegion = useCallback((region: TravelRegionId) => {
    setSelectedPlaceId(null);
    setSelectedRegion(current => (current === region ? null : region));
  }, []);

  const handleSelectPanelMode = useCallback(
    (tab: PanelTab) => {
      if (panelOpen && panelTab === tab && !selectedPlaceId) {
        setPanelOpen(false);
        return;
      }
      setSelectedPlaceId(null);
      setPanelTab(tab);
      setPanelOpen(true);
    },
    [panelOpen, panelTab, selectedPlaceId],
  );

  const visibleRegionGroups = useMemo(
    () =>
      selectedRegion ? TRAVEL_REGION_GROUPS.filter(group => group.meta.id === selectedRegion) : TRAVEL_REGION_GROUPS,
    [selectedRegion],
  );

  return (
    <div className='trip-page' data-panel-open={panelOpen ? 'true' : undefined}>
      <h1 className='trip-sr-only'>Artea 的足迹地图与博客</h1>

      {/* Full-viewport interactive map */}
      <div className='trip-stage'>
        <ClientOnly fallback={<div className='trip-map-skeleton' />}>
          <Suspense fallback={<div className='trip-map-skeleton' />}>
            <TravelMap
              selectedRegion={selectedRegion}
              selectedPlaceId={selectedPlaceId}
              hoveredPlaceId={hoveredPlaceId}
              showRoutes={showRoutes}
              showLabels={showLabels}
              mapThemeOverride={mapThemeOverride}
              panelOpen={panelOpen}
              fitTrigger={fitTrigger}
              onSelectPlace={handleSelectPlace}
              onHoverPlace={setHoveredPlaceId}
            />
          </Suspense>
        </ClientOnly>
      </div>

      {/* Top-left floating brand + primary navigation pill */}
      <header className='trip-chrome-left'>
        <div className='trip-pill trip-brand-pill'>
          <button
            type='button'
            className='trip-brand-pill__home'
            aria-label='Artea 首页，重置地图视角'
            onClick={handleRecenter}
          >
            <Avatar src='/avatar.svg' alt='Artea' size={24} round bordered />
            <span className='trip-brand-pill__name'>Artea</span>
          </button>

          <span className='trip-pill__divider' aria-hidden='true' />

          <nav aria-label='主导航' className='trip-brand-pill__nav'>
            {navLinks.map(item => (
              <RouterLink key={item.href} href={item.href} className='trip-brand-pill__link'>
                {item.name}
              </RouterLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Top-right floating controls (shift smoothly when right panel is open) */}
      <div className='trip-chrome-right'>
        <Tooltip content='回到全景视角'>
          <button type='button' className='trip-icon-pill' aria-label='回到全景视角' onClick={handleRecenter}>
            <LocateFixed aria-hidden='true' size={16} strokeWidth={1.75} />
          </button>
        </Tooltip>

        <Popover
          trigger='click'
          placement='bottom-end'
          showArrow={false}
          content={
            <div className='trip-layers-popover'>
              <div className='trip-layers-popover__row'>
                <span className='trip-layers-popover__label'>足迹连线</span>
                <Switch size='small' value={showRoutes} onUpdateValue={setShowRoutes} aria-label='显示足迹连线' />
              </div>
              <div className='trip-layers-popover__row'>
                <span className='trip-layers-popover__label'>城市地名</span>
                <Switch size='small' value={showLabels} onUpdateValue={setShowLabels} aria-label='显示城市地名' />
              </div>
              <Separator />
              <div className='trip-layers-popover__theme'>
                <span className='trip-layers-popover__label'>底图风格</span>
                <SegmentedControl
                  size='small'
                  block
                  value={mapThemeOverride}
                  options={mapStyleOptions}
                  onUpdateValue={setMapThemeOverride}
                />
              </div>
            </div>
          }
        >
          <button type='button' className='trip-icon-pill' aria-label='地图图层与底图设置'>
            <Layers aria-hidden='true' size={16} strokeWidth={1.75} />
          </button>
        </Popover>

        <SiteSearch entries={searchEntries} variant='icon' />

        <ThemeToggle variant='pill' />

        <div className='trip-pill trip-mode-switch' role='group' aria-label='侧栏视图切换'>
          <button
            type='button'
            className={`trip-mode-switch__btn${panelOpen && panelTab === 'places' ? ' trip-mode-switch__btn--active' : ''}`}
            aria-pressed={panelOpen && panelTab === 'places'}
            onClick={() => handleSelectPanelMode('places')}
          >
            <MapIcon aria-hidden='true' size={14} strokeWidth={1.75} />
            <span>足迹</span>
          </button>
          <button
            type='button'
            className={`trip-mode-switch__btn${panelOpen && panelTab === 'posts' ? ' trip-mode-switch__btn--active' : ''}`}
            aria-pressed={panelOpen && panelTab === 'posts'}
            onClick={() => handleSelectPanelMode('posts')}
          >
            <BookOpen aria-hidden='true' size={14} strokeWidth={1.75} />
            <span>文章</span>
          </button>
        </div>

        <button
          type='button'
          className='trip-icon-pill trip-mobile-menu-btn'
          aria-label='打开导航菜单'
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon aria-hidden='true' size={16} strokeWidth={1.75} />
        </button>
      </div>

      {/* Bottom-center floating region legend + route toggle pill */}
      <div className='trip-legend-wrap' data-region-picked={selectedRegion ? 'true' : undefined}>
        <div className='trip-pill trip-legend' role='group' aria-label='按片区筛选足迹'>
          {TRAVEL_REGIONS.map(region => {
            const active = selectedRegion === region.id;
            const dotColor = getRegionColor(region.id, isDarkMap);
            return (
              <button
                key={region.id}
                type='button'
                className={`trip-legend__item${active ? ' trip-legend__item--active' : ''}`}
                aria-pressed={active}
                onClick={() => handleToggleRegion(region.id)}
              >
                <span className='trip-legend__dot' style={{ '--trip-dot-color': dotColor } as CSSProperties} />
                <span>{region.label}</span>
              </button>
            );
          })}
          <span className='trip-pill__divider' aria-hidden='true' />
          <button
            type='button'
            className={`trip-legend__item trip-legend__route${showRoutes ? ' trip-legend__item--active' : ''}`}
            aria-pressed={showRoutes}
            onClick={() => setShowRoutes(value => !value)}
          >
            <span className='trip-legend__dash' aria-hidden='true' />
            <span>轨迹</span>
          </button>
        </div>
      </div>

      {/* Floating side panel (desktop) / bottom sheet (mobile) */}
      {panelOpen ? (
        <aside className='trip-side' aria-label={selectedPlace ? `${selectedPlace.name}详情` : 'Artea 足迹与文章'}>
          <header className='trip-side__header'>
            <div className='trip-side__heading'>
              {selectedPlace ? (
                <>
                  <button type='button' className='trip-side__back' onClick={() => setSelectedPlaceId(null)}>
                    <ArrowLeft aria-hidden='true' size={13} strokeWidth={2} />
                    <span>全部足迹</span>
                  </button>
                  <div className='trip-side__title-row'>
                    <Heading level={2} className='trip-side__title'>
                      {selectedPlace.name}
                    </Heading>
                    <Tag size='tiny' round>
                      {REGION_META_MAP[selectedPlace.region].label}
                    </Tag>
                  </div>
                </>
              ) : (
                <>
                  <p className='trip-side__stats blog-tabular-num'>
                    {TRAVEL_PLACES.length} 座城市 · {COUNTRY_COUNT} 个国家 · {totalPosts} 篇文章
                  </p>
                  <Heading level={2} className='trip-side__title'>
                    {panelTab === 'places' ? '足迹' : '近期文章'}
                  </Heading>
                </>
              )}
            </div>
            <button
              type='button'
              className='trip-side__close'
              aria-label='收起侧栏'
              onClick={() => setPanelOpen(false)}
            >
              <X aria-hidden='true' size={16} strokeWidth={1.75} />
            </button>
          </header>

          <ScrollArea
            className='trip-side__scroll'
            contentClassName='trip-side__body'
            orientation='vertical'
            size='small'
          >
            {selectedPlace ? (
              <div className='trip-place-detail'>
                <div className='trip-place-detail__card'>
                  <div className='trip-place-detail__meta'>
                    <span
                      className='trip-legend__dot'
                      style={
                        {
                          '--trip-dot-color': getRegionColor(selectedPlace.region, isDarkMap),
                        } as CSSProperties
                      }
                    />
                    <Text depth={2}>
                      {selectedPlace.countryLabel === REGION_META_MAP[selectedPlace.region].label
                        ? selectedPlace.countryLabel
                        : `${selectedPlace.countryLabel} · ${REGION_META_MAP[selectedPlace.region].label}`}
                    </Text>
                  </div>
                  <Paragraph depth={2} className='trip-place-detail__desc'>
                    {REGION_META_MAP[selectedPlace.region].description}
                  </Paragraph>
                  <div className='trip-place-detail__coords'>
                    <Compass aria-hidden='true' size={14} strokeWidth={1.75} />
                    <Text depth={3} className='blog-tabular-num'>
                      {formatCoords(selectedPlace.lat, selectedPlace.lng)}
                    </Text>
                  </div>
                  <div className='trip-place-detail__actions'>
                    <Button
                      attrType='button'
                      size='small'
                      onClick={() => {
                        setSelectedRegion(selectedPlace.region);
                        setSelectedPlaceId(null);
                      }}
                    >
                      查看{REGION_META_MAP[selectedPlace.region].label}片区
                    </Button>
                    <Button attrType='button' size='small' quaternary onClick={handleRecenter}>
                      回到全景
                    </Button>
                  </div>
                </div>

                {nearbyPlaces.length > 0 ? (
                  <div className='trip-nearby'>
                    <Eyebrow>附近去过</Eyebrow>
                    <ul className='trip-nearby__list'>
                      {nearbyPlaces.map(({ place, distanceKm }) => (
                        <li key={place.id}>
                          <button
                            type='button'
                            className='trip-nearby__item'
                            onMouseEnter={() => setHoveredPlaceId(place.id)}
                            onMouseLeave={() => setHoveredPlaceId(null)}
                            onClick={() => handleSelectPlace(place)}
                          >
                            <span className='trip-nearby__name'>
                              <span
                                className='trip-legend__dot'
                                style={
                                  {
                                    '--trip-dot-color': getRegionColor(place.region, isDarkMap),
                                  } as CSSProperties
                                }
                              />
                              <span>{place.name}</span>
                            </span>
                            <span className='trip-nearby__dist blog-tabular-num'>{distanceKm} km</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : panelTab === 'places' ? (
              <div className='trip-side__places'>
                <section className='trip-profile' aria-label='关于 Artea'>
                  <div className='trip-profile__top'>
                    <Avatar src='/avatar.svg' alt='Artea' size={44} round bordered />
                    <div className='trip-profile__text'>
                      <span className='trip-profile__greeting'>Hi, I&apos;m Artea</span>
                      <Text depth={3} className='trip-profile__bio'>
                        前端开发者，关注 UI 编程、编程语言与软件分析。
                      </Text>
                    </div>
                  </div>
                  <div className='trip-profile__bar'>
                    <SocialLinks links={arteaSocialLinks} size='small' />
                    <Link href='/about' underline='none' className='trip-profile__more'>
                      关于我 →
                    </Link>
                  </div>
                </section>

                <Separator />

                {selectedRegion ? (
                  <div className='trip-filter-banner'>
                    <Text depth={2}>
                      当前筛选：<strong>{REGION_META_MAP[selectedRegion].label}</strong>
                    </Text>
                    <Button attrType='button' size='tiny' quaternary onClick={handleRecenter}>
                      显示全部
                    </Button>
                  </div>
                ) : null}

                <div className='trip-region-list'>
                  {visibleRegionGroups.map(group => {
                    const dotColor = getRegionColor(group.meta.id, isDarkMap);
                    return (
                      <section key={group.meta.id} className='trip-region-group'>
                        <div className='trip-region-group__head'>
                          <button
                            type='button'
                            className='trip-region-group__title'
                            onClick={() => handleToggleRegion(group.meta.id)}
                          >
                            <span
                              className='trip-legend__dot'
                              style={{ '--trip-dot-color': dotColor } as CSSProperties}
                            />
                            <span>{group.meta.label}</span>
                            <span className='trip-region-group__count blog-tabular-num'>{group.places.length}</span>
                          </button>
                          <span className='trip-region-group__desc'>{group.meta.description}</span>
                        </div>
                        <div className='trip-city-grid'>
                          {group.places.map(place => {
                            const active = hoveredPlaceId === place.id;
                            return (
                              <button
                                key={place.id}
                                type='button'
                                className={`trip-city-chip${active ? ' trip-city-chip--active' : ''}`}
                                onMouseEnter={() => setHoveredPlaceId(place.id)}
                                onMouseLeave={() => setHoveredPlaceId(null)}
                                onClick={() => handleSelectPlace(place)}
                              >
                                <MapPin aria-hidden='true' size={12} strokeWidth={2} style={{ color: dotColor }} />
                                <span>{place.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className='trip-side__posts'>
                <ul className='trip-post-list'>
                  {recentPosts.map(post => (
                    <li key={post.slug}>
                      <RouterLink href={`/posts/${post.slug}`} className='trip-post-item'>
                        <span className='trip-post-item__title'>{post.title}</span>
                        <span className='trip-post-item__meta blog-tabular-num'>
                          <span>{formatDate(post.pubDate)}</span>
                          <span>·</span>
                          <span>约 {post.readingMinutes} 分钟</span>
                        </span>
                      </RouterLink>
                    </li>
                  ))}
                </ul>
                <div className='trip-side__posts-footer'>
                  <Button
                    tag={RouterLink}
                    href='/posts'
                    block
                    size='small'
                    icon={<Navigation aria-hidden='true' size={13} strokeWidth={1.75} />}
                  >
                    查看全部 {totalPosts} 篇文章
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </aside>
      ) : null}

      <Drawer placement='right' width={268} show={drawerOpen} onUpdateShow={setDrawerOpen}>
        <DrawerContent closable title='Artea' footer={<SocialLinks links={arteaSocialLinks} size='small' />}>
          <Menu
            aria-label='移动端导航'
            className='blog-drawer-menu'
            options={mobileMenuOptions}
            value='/'
            renderLink={renderMenuLink}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
