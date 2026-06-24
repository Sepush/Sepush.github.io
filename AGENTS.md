# Artea Blog

这是 Artea 的个人博客，记录一些技术文章、生活随笔、读书笔记和杂思等内容。
博客基于 Astro 搭建，必要时使用 React 和 Vue，通过 GitHub Pages 部署。

## 项目概述

这是一个现代化的个人博客网站，采用 Astro 作为核心框架，支持多框架混合开发（Astro + React + Vue），使用 UnoCSS 进行样式管理，并部署在 GitHub Pages 上。

### 用户偏好

- **交互语言**: 与用户交流时使用中文。
- **代码语言**: 代码、文档及注释必须使用英文。

## 技术栈

- **核心框架**: Astro 7.0.2
- **前端框架**: React 19.2.7 + Vue 3.5.38
- **样式系统**: UnoCSS 66.7.2
- **统一工具链**: Vite+ (`vp` CLI)
- **包管理器**: pnpm 11.9.0（由 `vp install` 代理）
- **代码检查**: `vp lint`（内置 Oxlint）
- **代码格式化**: `vp fmt`（内置 Oxfmt）
- **数学公式**: KaTeX（通过 remark-math 和 rehype-katex）
- **Markdown 扩展**: GitHub Flavored Markdown（GFM）

## 项目架构

### 目录结构

```text
├── src
│   ├── components          # 组件目录
│   │   ├── react/         # React 组件
│   │   ├── vue/           # Vue 组件
│   │   ├── social/        # 社交链接组件
│   │   └── tag/           # 标签组件
│   ├── config/            # 配置文件
│   │   └── social.ts      # 社交链接配置
│   ├── content/           # 内容文件
│   │   ├── posts/         # 博客文章
│   │   ├── notes/         # 笔记
│   │   └── about/         # 关于页面
│   ├── layouts/           # 布局组件
│   │   └── Layout.astro   # 主布局
│   ├── pages/             # 页面路由
│   ├── styles/            # 样式文件
│   │   ├── global.css     # 全局样式
│   │   └── markdown.css   # Markdown 样式
│   └── utils/             # 工具函数
├── public/                # 静态资源
├── .github/workflows/     # GitHub Actions
├── vite.config.ts         # Vite+ 配置（fmt 等）
└── dist/                  # 构建输出
```

### 关键配置

- **astro.config.ts**: Astro 主配置文件，集成 React、Vue、MDX、UnoCSS。
- **vite.config.ts**: Vite+ 配置文件，目前主要配置 `fmt`（格式化规则与忽略模式）。
- **uno.config.ts**: UnoCSS 配置，定义主题色彩、字体、阴影等设计系统。
- **tsconfig.json**: TypeScript 严格模式配置。
- **package.json**: 依赖管理、脚本定义、`devEngines` 指定 Node.js 版本。
- **.oxlintrc.json**: 代码检查规则配置。

## 内容管理

### 内容集合（Content Collections）

项目使用 Astro 的内容集合功能管理三种内容类型：

1. **Posts（文章）**: 技术博客文章
   - 字段: title, description, pubDate, updatedDate, tags, draft, author
   - 路径: `src/content/posts/`

2. **Notes（笔记）**: 生活随笔/读书笔记
   - 字段: title, content, pubDate, mood, location, tags, draft
   - 路径: `src/content/notes/`

3. **About（关于）**: 个人介绍页面
   - 路径: `src/content/about/`

### 草稿功能

内容支持草稿模式，通过 `draft: true` 字段控制：

- 开发环境（`vp run dev`）: 显示所有内容，包括草稿。
- 生产环境（`vp run build`）: 只显示非草稿内容。

## 开发规范

### 组件规范

- **文件夹命名**: 使用 kebab-case（如 `social-links`）。
- **组件命名**: 使用 CamelCase（如 `SocialLinks`）。
- **目录结构**: 每个组件一个文件夹，包含相关文件。
- **框架分离**: React 组件在 `src/components/react/`，Vue 组件在 `src/components/vue/`。

### 代码风格

- **TypeScript**: 严格类型定义，禁止使用 `as any` 等类型断言。
- **模块格式**: 使用 ESM，所有导出必须是命名导出。
- **CSS**: 使用 UnoCSS 和 CSS 3 特性，避免重复代码。
- **样式原则**: 简洁美观，禁止花哨效果（彩色渐变、悬浮放大等）。
- **设计原则**: 高内聚低耦合，单一职责，DRY 原则。

### 开发工具

本项目使用 **Vite+** 作为统一入口工具链，日常命令如下：

```bash
vp run dev        # 启动 Astro 开发服务器（http://localhost:4321）
vp run build      # 构建生产环境代码
vp run preview    # 预览构建结果
vp run fmt        # 使用 Vite+ 内置 Oxfmt 格式化代码
vp run fmt:check  # 检查代码格式
vp run lint       # 使用 Vite+ 内置 Oxlint 检查代码质量
vp run lint:fix   # 自动修复可修复的 lint 问题
vp install        # 安装依赖（代理到 pnpm）
vp env doctor     # 检查 Vite+ 环境配置
```

注意：

- 原生 `vp dev` / `vp build` / `vp check` 是为 Vite 项目设计的，本项目使用 `vp run dev` / `vp run build` 代理到 Astro 脚本。
- Oxfmt 目前不支持 `.astro` 文件，因此 `.astro` 文件只进行 lint，不再自动格式化。如需格式化 `.astro`，需额外配置支持 Astro 的 formatter。

### Git/GitHub

- 使用 Git 进行版本控制。
- 所有和 GitHub 交互通过 `gh cli` 完成。
- 使用 `sg`（ast-grep）进行代码搜索/重构，可以使用 `sg -h` 查看帮助。
- 使用 `context7-mcp` 进行文档查询。
- 使用 `chrome-devtools-mcp` 进行页面调试和验证。

## 构建与部署

### 开发命令

```bash
vp run dev          # 启动开发服务器 (http://localhost:4321)
vp run build        # 构建生产环境代码
vp run preview      # 预览构建结果
vp run fmt          # 格式化代码
vp run fmt:check    # 检查代码格式
vp run lint         # 代码检查
vp run lint:fix     # 自动修复代码检查问题
```

### CI/CD

部署工作流位于 `.github/workflows/deploy.yml`：

- 使用 `voidzero-dev/setup-vp@v1` 安装 Vite+、Node.js 和包管理器。
- CI Node.js 版本跟随 `lts`（最新 LTS）。
- 关键步骤：
  1. `vp install --frozen-lockfile`
  2. `vp run fmt:check && vp run lint`
  3. `vp run build`
- 构建产物通过 GitHub Pages 部署。
