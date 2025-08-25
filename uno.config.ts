import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      'src/**/*.{astro,vue,tsx,ts,js}',
    ],
  },
  safelist: [
    'i-tabler-brand-github',
    'i-tabler-brand-x', 
    'i-tabler-brand-telegram',
    'i-tabler-mail',
    'i-tabler-rss',
  ],
  theme: {
    colors: {
      primary: {
        50: 'oklch(0.98 0.015 145)',
        100: 'oklch(0.95 0.03 145)',
        200: 'oklch(0.88 0.06 145)',
        300: 'oklch(0.81 0.09 145)',
        400: 'oklch(0.74 0.12 145)',
        500: 'oklch(0.67 0.15 145)',
        600: 'oklch(0.60 0.18 145)',
        700: 'oklch(0.53 0.21 145)',
        800: 'oklch(0.46 0.24 145)',
        900: 'oklch(0.39 0.27 145)',
        950: 'oklch(0.25 0.30 145)',
      },
      accent: {
        50: 'oklch(0.97 0.02 160)',
        100: 'oklch(0.94 0.04 160)',
        200: 'oklch(0.86 0.08 160)',
        300: 'oklch(0.78 0.12 160)',
        400: 'oklch(0.70 0.16 160)',
        500: 'oklch(0.62 0.20 160)',
        600: 'oklch(0.54 0.24 160)',
        700: 'oklch(0.46 0.28 160)',
        800: 'oklch(0.38 0.32 160)',
        900: 'oklch(0.30 0.36 160)',
      },
      surface: {
        50: 'oklch(0.99 0.005 145)',
        100: 'oklch(0.97 0.01 145)',
        200: 'oklch(0.94 0.02 145)',
        300: 'oklch(0.91 0.03 145)',
        400: 'oklch(0.88 0.04 145)',
        500: 'oklch(0.85 0.05 145)',
      },
    },
    fontFamily: {
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    borderRadius: {
      'xl': '1rem',
      '2xl': '1.5rem', 
      '3xl': '2rem',
    },
    boxShadow: {
      'elegant': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
      'float': '0 8px 30px -6px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
      'glow': '0 0 20px -4px oklch(0.67 0.15 145 / 0.3)',
    },
  },
  shortcuts: [
    { 'btn-primary': 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-elegant hover:shadow-float transform hover:-translate-y-0.5' },
    { 'btn-secondary': 'bg-white/80 backdrop-blur-sm border border-primary-200 hover:border-primary-300 text-primary-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-elegant hover:shadow-float transform hover:-translate-y-0.5' },
    
    { 'card-modern': 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-elegant hover:shadow-float transition-all duration-500 border border-white/20' },
    { 'card-glass': 'bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-elegant' },
    { 'card-float': 'bg-white rounded-2xl shadow-float hover:shadow-glow transition-all duration-500 transform hover:-translate-y-1' },
    
    { 'bg-gradient-primary': 'bg-gradient-to-br from-primary-50 via-surface-50 to-accent-50' },
    { 'bg-gradient-hero': 'bg-gradient-to-br from-primary-100 via-surface-100 to-accent-100' },
    
    { 'text-gradient': 'bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent' },
    
    { 'icon-modern': 'p-3 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 shadow-elegant' },
    
    // 添加 prose 相关的类
    { 'prose': 'max-w-none leading-7 text-gray-700' },
    { 'prose-lg': 'text-lg leading-8' },
    { 'prose-xl': 'text-xl leading-9' },
  ],
  transformers: [
    transformerDirectives(),
    transformerAttributifyJsx(),
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default as any),
      },
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
