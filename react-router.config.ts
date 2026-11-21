import type { Config } from '@react-router/dev/config';
import { getStaticContentPaths } from './app/lib/content-paths';

export default {
  ssr: true,
  prerender: getStaticContentPaths(),
} satisfies Config;
