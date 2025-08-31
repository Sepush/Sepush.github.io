---
title: "聊聊 Vue 3 的泛型"
pubDate: 2025-08-29
tags: [Vue, TypeScript, Generics]
draft: true
---

## Vue 3 泛型支持

Vue 3 在 TypeScript 支持方面有了显著的改进[^1]，特别是在泛型组件的实现上。

### 泛型组件定义

在 Vue 3 中，我们可以使用 `defineComponent` 来创建泛型组件[^2]：

```vue
<script setup lang="ts" generic="T">
interface Props<T> {
  items: T[];
  modelValue: T;
}

const props = defineProps<Props<T>>();
const emit = defineEmits<{
  "update:modelValue": [value: T];
}>();
</script>
```

这种方式比 Vue 2 的实现更加简洁和类型安全[^3]。

### 实际应用场景

泛型组件在以下场景中特别有用：

1. 数据列表组件
2. 表单控件组件
3. 通用的容器组件

通过泛型，我们可以确保类型安全，同时保持组件的复用性[^4]。

[^1]: Vue 3 的 TypeScript 支持相比 Vue 2 有了质的飞跃，详见[官方文档](https://vuejs.org/guide/typescript/overview.html)

[^2]: `defineComponent` 是 Vue 3 Composition API 的核心函数之一

[^3]: Vue 2 需要使用复杂的类型断言和接口继承来实现类似功能

[^4]: 这是现代前端框架设计的重要原则：类型安全 + 可复用性
