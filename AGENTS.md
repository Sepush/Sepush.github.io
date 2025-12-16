# Artea Blog

这是 Artea 的个人博客，记录一些技术文章/生活随笔/读书笔记/杂思等内容
主要是用 Astro 框架搭建，必要时会用到 React 和 Vue，使用 GitHub Pages 进行部署。

## 项目架构

- 博客使用 **Astro** **React** **Vue** 混合框架
- 使用 **pnpm** 作为包管理工具
- **oxlint** 作为代码检查工具
- **dprint** 作为代码格式化工具
- 组件代码都放在 `src/components` 文件下, 且为每一个组件建立一个文件夹，文件夹的名字使用 kebab-case (context-menu)
  组件名使用 CamelCase (TagGroup) 尽量保证是一个单词
- 页面代码都放在 `src/pages` 文件下
- Vue 代码都放在 `src/components/vue`
- React 代码都放在 `src/components/react`
- 博客的内容都放在 `src/content` 文件夹下，文章使用 markdown 格式编写
- 在 `/uno.config.ts` 中配置 unocss
- 在 `/tsconfig.json` 中配置 TypeScript

### 关键目录

```text
├── src
│   ├── components
│   │   ├── react
│   │   │   └── Counter.tsx
│   │   ├── social
│   │   ├── tag
│   │   └── vue
│   │       └── Counter.vue
│   ├── config
│   │   └── social.ts
│   ├── content
│   │   ├── about.md
│   │   ├── config.ts
│   │   ├── notes
│   │   │   └── 
│   │   └── posts
│   │       ├── astro-get-static-paths.md
│   ├── layouts
│   │   └── Layout.astro
│   ├── pages
│   │  
│   ├── styles
│   │   
│   └── utils
│       
├── tsconfig.json
├── uno.config.ts
└── vue.tsconfig.json
```

## 编码风格

- 代码必须使用 TypeScript 严格定义类型，除非我明确要求否者禁止使用 `as any` `as unknown` `as any as unknown`
- 除非我明确要求否则禁止使用 `// @ts-ignore` `// @ts-nocheck` 和 在`.d.ts`文件中定义类型来解决类型问题
- 模块必须使用 esm 格式，所有的导出都必须是命名导出 `export const a = 1`
- CSS 使用 unocss 和 CSS 3 特性 对于重复的部分要考虑 css var 复用
- 样式风格要简洁美观禁止生产彩色渐变，悬浮放大等花哨效果
- 组件要做到高内聚低耦合，单一职责原则
- Don't Repeat Yourself (DRY)原则，避免代码重复

## 构建与开发

- 对于格式问题 优先使用 `pnpm fmt` 来格式化代码, 而不是一个个文件去慢慢调整
- 对于 `lint` 问题 优先使用 `pnpm lint:fix` 来自动修复代码检查问题

```bash
pnpm dev # 启动开发服务器
pnpm build # 构建生产环境代码
pnpm fmt # 格式化代码
pnpm lint # 代码检查
pnpm lint:fix # 自动修复代码检查问题
```

### 工具

- 可使用 `chrome-devtool-mcp` 来进行页面的查看和验证
- 使用 `context7-mcp` 来查询文档
- 可以优先使用 ast-grep 来进行重构 可以使用命令行也可以使用 `ast-grep-mcp` 可使用 `sg -h` 来查看使用指南
