# Artea Blog

这是 Artea 的个人博客，记录一些技术文章/生活随笔/读书笔记/杂思等内容
主要是用 Astro 框架搭建，必要时会用到 React 和 Vue，使用 GitHub Pages 进行部署。

## 项目概述

这是一个现代化的个人博客网站，采用 Astro 作为核心框架，支持多框架混合开发（Astro + React + Vue），使用 UnoCSS 进行样式管理，并部署在 GitHub Pages 上。

## 技术栈

- **核心框架**: Astro 5.10.1
- **前端框架**: React 19.1.0 + Vue 3.5.17
- **样式系统**: UnoCSS 66.5.0
- **包管理器**: pnpm 10.12.4
- **代码检查**: oxlint 1.33.0
- **代码格式化**: dprint
- **数学公式**: KaTeX (通过 remark-math 和 rehype-katex)
- **Markdown 扩展**: GitHub Flavored Markdown (GFM)

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
└── dist/                  # 构建输出
```

### 关键配置

- **astro.config.ts**: Astro 主配置文件，集成 React、Vue、MDX、UnoCSS
- **uno.config.ts**: UnoCSS 配置，定义主题色彩、字体、阴影等设计系统
- **tsconfig.json**: TypeScript 严格模式配置
- **package.json**: 依赖管理和脚本定义
- **dprint.json**: 代码格式化配置
- **.oxlintrc.json**: 代码检查规则配置

## 内容管理

### 内容集合 (Content Collections)

项目使用 Astro 的内容集合功能管理三种内容类型：

1. **Posts (文章)**: 技术博客文章
   - 字段: title, description, pubDate, updatedDate, tags, draft, author
   - 路径: `src/content/posts/`

2. **Notes (笔记)**: 生活随笔/读书笔记
   - 字段: title, content, pubDate, mood, location, tags, draft
   - 路径: `src/content/notes/`

3. **About (关于)**: 个人介绍页面
   - 路径: `src/content/about/`

### 草稿功能

内容支持草稿模式，通过 `draft: true` 字段控制：

- 开发环境 (`pnpm dev`): 显示所有内容，包括草稿
- 生产环境 (`pnpm build`): 只显示非草稿内容

## 开发规范

### 组件规范

- **文件夹命名**: 使用 kebab-case (如 `social-links`)
- **组件命名**: 使用 CamelCase (如 `SocialLinks`)
- **目录结构**: 每个组件一个文件夹，包含相关文件
- **框架分离**: React 组件在 `src/components/react/`，Vue 组件在 `src/components/vue/`

### 代码风格

- **TypeScript**: 严格类型定义，禁止使用 `as any` 等类型断言
- **模块格式**: 使用 ESM，所有导出必须是命名导出
- **CSS**: 使用 UnoCSS 和 CSS 3 特性，避免重复代码
- **样式原则**: 简洁美观，禁止花哨效果（彩色渐变、悬浮放大等）
- **设计原则**: 高内聚低耦合，单一职责，DRY 原则

### 开发工具

- **格式化**: `pnpm fmt` - 使用 dprint 格式化所有代码
- **检查**: `pnpm lint` - 使用 oxlint 检查代码质量
- **自动修复**: `pnpm lint:fix` - 自动修复可修复的 lint 问题
- **Git/GitHub**: 使用 Git 进行版本控制，所有和 GitHub 交互通过 `gh cli` 完成
- **Grepper**: 使用 `sg` (ast-grep) 进行代码搜索/重构，可以使用 `sg -h` 查看帮助
- **文档**: 使用 `context7-mcp` 进行文档查询
- **页面验证**: 使用 `chrome-devtools-mcp` 进行页面调试和验证

## 构建与部署

### 开发命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:4321)
pnpm build        # 构建生产环境代码
pnpm preview      # 预览构建结果
pnpm fmt          # 格式化代码
pnpm lint         # 代码检查
pnpm lint:fix     # 自动修复代码检查问题
```
