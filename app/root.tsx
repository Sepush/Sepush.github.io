import { ConfigProvider, Layout as PikaLayout, LayoutContent, zhCN, type ComponentOptions } from '@pika-lab/react';
import '@pika-lab/react/pika.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { RouterLink } from './components/router-link';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { THEME_BOOTSTRAP_SCRIPT, ThemeProvider } from './components/theme';
import { getSearchIndex } from './lib/content.server';
import { highlighter } from './lib/highlighter';
import './styles/site.css';

const componentOptions: ComponentOptions = {
  Link: { as: RouterLink },
};

export function loader() {
  return { searchEntries: getSearchIndex() };
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' type='image/svg+xml' href='/avatar.svg' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&family=Inter:wght@400;500;600;700&display=swap'
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function ConfiguredApp() {
  const { searchEntries } = useLoaderData<typeof loader>();

  return (
    <ConfigProvider abstract locale={zhCN} highlighter={highlighter} katex={katex} componentOptions={componentOptions}>
      <PikaLayout className='blog-shell'>
        <SiteHeader searchEntries={searchEntries} />
        <LayoutContent as='main' nativeScrollbar className='blog-main'>
          <Outlet />
        </LayoutContent>
        <SiteFooter />
      </PikaLayout>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ConfiguredApp />
    </ThemeProvider>
  );
}
