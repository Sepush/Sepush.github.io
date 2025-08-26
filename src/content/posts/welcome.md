---
title: "最终还是决定写博客"
pubDate: 2024-08-24
tags: ["介绍", "杂文"]
draft: true
---

## 起因

最终还是决定写博客，用文字记录一下自己的学习和生活。

我日常会用 Notion 写一些文字，整理自己的思路和灵感，但几乎不会发在公开的空间，技术方面很多想写的东西感觉都是前人之叙备矣。

但最终我还是决定搭建一个博客把自己写的一些文章整理一下慢慢发出来。

## 技术选型

这个网站主要使用 **Astro** 构建，几个月前帮朋友解决一些问题开始接触的 Astro,踩了一些坑， 探索和学习了一些特性和用法，用来写写博客感觉是极好的选择。

站点的这个版本是使用 GitHub Copilot Vibe Coding 的

```typescript
const techStack = {
  framework: ["Astro", "React", "Vue"],
  styling: "UnoCSS",
  language: "TypeScript",
  icons: "UnoCSS preset icons",
  deployment: "GitHub Pages",
};
```

## 内容结构

网站主要包含以下几个部分：

- Posts 会发一些长一点的文章（当然也不会有多长），可能有技术，生活，读书笔记，思考
- Notes 会记录一些短一点的不足以写成文章的可能就几句话
- Friends 会放一些关系不错的朋友博客友链

博客没有实现评论功能，也没有打算实现。如果想找我聊天在主页能找到我的各种联系方式，欢迎找我聊天。
