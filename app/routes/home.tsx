import { Avatar, Button, Card, Eyebrow, Heading, Link, Paragraph, Tag, Text } from '@pika-lab/react';
import { lazy, Suspense, useCallback, useState } from 'react';
import { useLoaderData, type MetaFunction } from 'react-router';
import placesData from '../../src/data/travel/places.json';
import { ClientOnly } from '../components/client-only';
import { ArrowRight, MapPin, RotateCcw } from '../components/icons';
import { RouterLink } from '../components/router-link';
import { SocialLinks } from '../components/social-links';
import { TagGroup } from '../components/tag-group';
import { arteaSocialLinks } from '../config/social';
import { getPostSummaries } from '../lib/content.server';
import { formatDate } from '../lib/format';

const TravelMap = lazy(() => import('../components/travel-map'));

const COUNTRY_COUNT = new Set(placesData.map(place => place.country)).size;

export const meta: MetaFunction = () => [{ title: 'Artea' }, { name: 'description', content: "Artea's blog" }];

export function loader() {
  const allPosts = getPostSummaries();
  return {
    recentPosts: allPosts.slice(0, 5),
    totalPosts: allPosts.length,
  };
}

export default function Home() {
  const { recentPosts, totalPosts } = useLoaderData<typeof loader>();
  const [replayKey, setReplayKey] = useState(0);

  const replayMap = useCallback(() => {
    setReplayKey(value => value + 1);
  }, []);

  return (
    <div className='blog-container blog-home'>
      <section className='blog-home__hero' aria-label='个人简介'>
        <div className='blog-home__identity'>
          <Avatar src='/avatar.svg' alt='Artea' size={72} round bordered />
          <div className='blog-home__intro'>
            <Heading level={1} className='blog-home__title'>
              Hi, I&apos;m Artea
            </Heading>
            <Paragraph depth={2} className='blog-home__bio'>
              前端开发者，关注 UI 编程、编程语言与软件分析。喜欢开源，偶尔拍照，用文字记录折腾与生活。
            </Paragraph>
          </div>
        </div>

        <div className='blog-home__actions'>
          <div className='blog-home__cta'>
            <Button tag={RouterLink} href='/posts' type='primary' size='medium'>
              阅读文章
            </Button>
            <Button tag={RouterLink} href='/about' size='medium'>
              关于我
            </Button>
          </div>
          <SocialLinks links={arteaSocialLinks} />
        </div>
      </section>

      <section className='blog-home__section' aria-label='足迹地图'>
        <Card
          className='blog-map-card'
          contentClassName='blog-map-card__content'
          segmented={{ content: true }}
          size='small'
          title={
            <span className='blog-map-card__title'>
              <MapPin aria-hidden='true' size={15} strokeWidth={1.75} className='blog-map-card__icon' />
              <span>足迹地图</span>
              <Tag size='tiny' round type='primary'>
                {placesData.length} 座城市 · {COUNTRY_COUNT} 个国家
              </Tag>
            </span>
          }
          headerExtra={
            <Button
              attrType='button'
              quaternary
              size='tiny'
              onClick={replayMap}
              icon={<RotateCcw aria-hidden='true' size={13} strokeWidth={1.75} />}
            >
              重置视角
            </Button>
          }
        >
          <div className='blog-map-frame'>
            <ClientOnly fallback={<div className='blog-map-placeholder' />}>
              <Suspense fallback={<div className='blog-map-placeholder' />}>
                <TravelMap replayKey={replayKey} />
              </Suspense>
            </ClientOnly>
          </div>
        </Card>
      </section>

      {recentPosts.length > 0 ? (
        <section className='blog-home__section' aria-label='近期文章'>
          <div className='blog-section-head'>
            <div>
              <Eyebrow>RECENT WRITING</Eyebrow>
              <Heading level={2} className='blog-section-head__title'>
                近期文章
              </Heading>
            </div>
            <Link href='/posts' underline='none' className='blog-section-head__more'>
              <span>全部 {totalPosts} 篇</span>
              <ArrowRight aria-hidden='true' size={14} strokeWidth={1.75} />
            </Link>
          </div>

          <Card className='blog-post-feed' contentClassName='blog-post-feed__content' size='small'>
            <ul className='blog-post-feed__list'>
              {recentPosts.map(post => (
                <li key={post.slug} className='blog-post-feed__item'>
                  <div className='blog-post-feed__main'>
                    <div className='blog-post-feed__title-row'>
                      <Link
                        href={`/posts/${post.slug}`}
                        type='neutral'
                        underline='none'
                        className='blog-post-feed__link'
                      >
                        {post.title}
                      </Link>
                      {import.meta.env.DEV && post.draft ? (
                        <Tag size='tiny' type='warning'>
                          草稿
                        </Tag>
                      ) : null}
                    </div>
                    <TagGroup tags={post.tags} />
                  </div>
                  <div className='blog-post-feed__meta'>
                    <Text as='time' depth={3} className='blog-tabular-num'>
                      {formatDate(post.pubDate)}
                    </Text>
                    <Text depth={3} className='blog-post-feed__readtime blog-tabular-num'>
                      {post.readingMinutes} 分钟
                    </Text>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
