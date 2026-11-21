import { ConfigProvider, zhCN, type ThemeOverrides } from '@pika-lab/react';
import katex from 'katex';
import { lazy, Suspense, type ReactNode } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import 'katex/dist/katex.min.css';
import '../src/styles/global.css';
import '../src/styles/markdown.css';
import { ClientOnly } from './components/client-only';
import { LivingTree } from './components/living-tree';
import { SiteHeader } from './components/site-header';
import { ThemeProvider, useTheme } from './components/theme';
import { highlighter } from './lib/highlighter';

const TravelMap = lazy(() => import('./components/travel-map'));

const themeOverrides: ThemeOverrides = {
  '--p-seed-primary': '#5a936f',
};

const themeScript = `(function(){try{var t=localStorage.getItem('artea-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='zh-CN'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' type='image/svg+xml' href='/avatar.svg' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body className='min-h-screen bg-gradient-primary text-gray-900 dark:text-gray-100 font-sans antialiased'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function SiteShell() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  return (
    <>
      {home ? (
        <div id='travel-map-bg' aria-hidden='true'>
          <div className='travel-map-mask' />
          <div className='travel-map-stage'>
            <ClientOnly>
              <Suspense fallback={null}>
                <TravelMap />
              </Suspense>
            </ClientOnly>
          </div>
        </div>
      ) : (
        <LivingTree />
      )}
      <div className='flex flex-col min-h-screen relative z-10 pointer-events-none'>
        <SiteHeader />
        <main className={`flex-1 relative ${home ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

function ConfiguredApp() {
  const { resolved } = useTheme();
  return (
    <ConfigProvider
      locale={zhCN}
      themeMode={resolved}
      themeOverrides={themeOverrides}
      highlighter={highlighter}
      katex={katex}
      className='min-h-screen'
    >
      <SiteShell />
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
