---
title: "Astro getStaticPaths"
pubDate: 2024-08-27
tags: ["Astro"]
---

## 前置知识

`getStaticPaths` 是在写 Astro 时经常需要用到的一个 API。

`getStaticPaths` 是 Astro 中用来在构建阶段根据动态路由和参数生成多个页面的 API。

- 当 `output: 'static'` 或显式 `export const prerender = true` 时，`getStaticPaths` 会在构建阶段执行以确定静态路径。
- 当 `output: 'server'` 且 `prerender: false` 时，不会调用 `getStaticPaths`（动态按需渲染）。

## 情景

来看这样一个情节：

我们在构建一个 Blog 有一个文章列表页，然后每一篇文章有一个文章详情页。
然后我们就可能会很自然的写出下面这样的代码：

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";

const posts = await getCollection("posts");

export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

## 问题

你会得到一个错误 `[ERROR] posts is not defined`。

这个写法乍一看是合法的 JavaScript，但是 `getStaticPaths()` 函数会在任何页面加载前，在其独立的隔离作用域中执行一次。因此，除了文件导入之外，无法引用其父作用域中的任何内容。如果违反此要求，编译器会发出警告。（这个问题现在文档上已经明确这么解释了）所以我们遇到了这条报错。

## 解决方案

- 在 `getStaticPaths()` 函数内部重新构造 `posts` 数据
- 获取 `posts` 数据后 export 出来在 `getStaticPaths()` 中使用

### 方案一

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("posts");

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

### 方案二

```ts
// some other file
import { getCollection } from "astro:content";
export const posts = await getCollection("posts");
```

```astro
---
// [slug].astro
// 从其他文件导入时，该文件的顶层代码也必须是在构建时可执行的
// 这个文件不能包含运行时才能获取的数据
import { posts } from "./test";

export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

## 多唠一点 三个为什么

`getStaticPaths()` 函数会在任何页面加载前，在其独立的隔离作用域中执行一次。除了文件导入之外，无法引用其父作用域中的任何内容。

虽然我们知道怎么解决报错了，但在第一眼看前文里的这句话可能很容易会问出下面的问题：

- 为什么要在页面加载前执行
- 为什么是独立的隔离作用域
- 为什么无法引用父作用域中的内容

### 加载前执行

回想一下在文章最开头提到的 `getStaticPaths` 的作用，其实我们就可以理解了。

因为 `getStaticPaths` 需要在页面加载之前就确定好所有可能的路径，所以它必须在构建时执行。

假如我们有一份这样的 Astro 代码：

```astro
---
export async function getStaticPaths() {
  return [
    {
      params: { name: "tacos" },
    },
    {
      params: { name: "potatoes" },
    },
    {
      params: { name: "spaghetti" },
    },
  ];
}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Food</title>
  </head>
  <body>
    <p id="url">{Astro.url.pathname}</p>
  </body>
</html>
```

对于一个动态路由的页面来说就是页面路由 `base + params` 数量是 `N = Counter(params)`。

最终 build 产物中 `food/[name].astro` 其实根据 `getStaticPaths` 和 `params` 的这三个值动态生成了三个页面：

```
.
├── potatoes
│   └── index.html
├── spaghetti
│   └── index.html
└── tacos
    └── index.html
```

### 实现路径

我再多bb两句 Astro 是怎么实现的：

- 通过模块加载系统动态导入页面组件文件，
- 得到 `ComponentInstance` 对象，
- 然后检查该对象是否包含 `getStaticPaths`
- 根据各种限制条件决定最后是不是真的 call 这个方法

Astro 里有这么一个函数叫 `callGetStaticPaths`，我这里删除一些逻辑给大家看一下，源码里还会做一些 cache 优化。
想看源代码的移步 `https://github.com/withastro/astro/blob/main/packages/astro/src/core/render/route-cache.ts`

```ts
export async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr,
  base,
}: CallGetStaticPathsOptions): Promise<GetStaticPathsResultKeyed> {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error(
      "This is an error caused by Astro and not your code. Please file an issue.",
    );
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }

  validateDynamicRouteModule(mod, { ssr, route });

  // No static paths in SSR mode. Return an empty RouteCacheEntry.
  if (ssr && !route.prerender) {}

  let staticPaths: GetStaticPathsResult = [];
  // Add a check here to make TypeScript happy.
  // This is already checked in validateDynamicRouteModule().
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }

  // 这里就是我们关心的逻辑
  // Calculate your static paths.
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route, base) as PaginateFunction,
  });

  validateGetStaticPathsResult(staticPaths, logger, route);
  // 删掉了一些逻辑做简化
  return staticPaths;
}
```

### 独立隔离作用域

要理解这个问题我们需要看一眼它被编译后的样子。

它会被编译成一个 js module `.mjs`，大概长下面这个样子：

```js
import {
  a as createAstro,
  b as renderTemplate,
  c as createComponent,
  r as renderHead,
} from "../../chunks/astro/server_cKRqlGeV.mjs";
import "kleur/colors";
import "html-escaper";
import "clsx";
export { renderers } from "../../renderers.mjs";

const $$Astro = createAstro();
async function getStaticPaths() {
  return [
    {
      params: { name: "tacos" },
    },
    {
      params: { name: "potatoes" },
    },
    {
      params: { name: "spaghetti" },
    },
  ];
}
const $$name = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
    Astro2.self = $$name;
    return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Food</title>${renderHead()}</head> <body> <p id="url">${Astro2.url.pathname}</p> </body></html>`;
  },
  "filepathto/src/pages/food/[name].astro",
  void 0,
);

const $$file = "filepathto/src/pages/food/[name].astro";
const $$url = "/food/[name]";

const _page = /*#__PURE__*/ Object.freeze(/*#__PURE__*/ Object.defineProperty(
  {
    __proto__: null,
    default: $$name,
    file: $$file,
    getStaticPaths,
    url: $$url,
  },
  Symbol.toStringTag,
  { value: "Module" },
));

const page = () => _page;

export { page };
```

简化一下一个 astro page 是如下结构：

```js
export page = {
  default: $$name,
	file: $$file,
	getStaticPaths,
	url: $$url
}
```

你看到在这个代码中我们能清晰的发现 Astro 编译时会把 `.astro` 文件分为两部分：组件渲染函数（default export）和路由元信息（包含 `getStaticPaths`）。

这两个部分在不同的执行上下文中运行，因此 `getStaticPaths` 只能访问模块导入的内容，而不能访问渲染逻辑作用域。

### 为什么无法引用非 import 值

前面两个问题的就是答案。

## 结语

相信读到这里大家就彻底理解前文中所说的

「`getStaticPaths()` 函数会在任何页面加载前，在其独立的隔离作用域中执行一次，除了文件导入之外，无法引用其父作用域中的任何内容」。
