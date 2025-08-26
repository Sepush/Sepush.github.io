---
title: "Markdown 样式测试文章"
description: "这是一个用于测试各种 Markdown 语法渲染效果的示例文章"
pubDate: 2025-08-26
tags: ["Markdown", "样式测试", "草稿"]
draft: true
author: "Artea"
---

# 一级标题 - Markdown 样式测试

这是一篇用于测试各种 Markdown 语法渲染效果的示例文章。通过这篇文章，我们可以检查 `.prose` 样式类对各种 Markdown 元素的渲染效果。

## 二级标题 - 文本样式

### 三级标题 - 基础文本格式

这是一个普通段落。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

这里有一些**粗体文本**和*斜体文本*，还有***粗斜体文本***。你也可以使用__下划线粗体__和_下划线斜体_。

#### 四级标题 - 链接和删除线

这里有一个[内联链接](https://github.com/Sepush/Sepush.github.io)和一个[带标题的链接](https://astro.build "Astro 官网")。

~~这是删除线文本~~，用于表示被删除或不再适用的内容。

##### 五级标题 - 行内代码

使用 `npm install` 命令安装依赖，或者运行 `pnpm dev` 启动开发服务器。JavaScript 中的 `console.log()` 函数用于输出调试信息。

###### 六级标题 - 最小标题

这是最小的标题级别，通常用于非常细致的分类。

## 列表示例

### 无序列表

- 第一个列表项
- 第二个列表项
  - 嵌套列表项 1
  - 嵌套列表项 2
    - 更深层的嵌套
    - 另一个深层项目
- 第三个列表项

### 有序列表

1. 首先做这件事
2. 然后做那件事
3. 接下来的步骤
   1. 子步骤 A
   2. 子步骤 B
      1. 详细步骤 i
      2. 详细步骤 ii
4. 最后的步骤

### 任务列表

- [x] 已完成的任务
- [x] 另一个已完成的任务
- [ ] 待完成的任务
- [ ] 另一个待完成的任务
  - [x] 子任务已完成
  - [ ] 子任务待完成

## 引用块

> 这是一个简单的引用块。引用块通常用于引用他人的话语或者突出重要的信息。

> 这是一个多行的引用块。
> 
> 它可以包含多个段落，每一行都以 `>` 开头。
> 
> > 这是嵌套的引用块，用于引用中的引用。

## 代码块

### 内联代码
在 React 中，你可以使用 `useState` 钩子来管理组件状态：`const [count, setCount] = useState(0)`。

### 代码块示例

#### JavaScript 代码块
```javascript
// 这是一个 JavaScript 函数示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 使用箭头函数的现代写法
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};

// 异步函数示例
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

#### CSS 代码块
```css
/* CSS 样式示例 */
.prose {
  color: var(--a-color-text-primary);
  line-height: var(--a-leading-normal);
  font-size: var(--a-text-base);
}

.prose h1 {
  font-size: var(--a-text-4xl);
  margin-top: 0;
  color: var(--a-color-heading-dark);
}

@media (max-width: 768px) {
  .prose {
    font-size: var(--a-text-base);
  }
}
```

#### Python 代码块
```python
# Python 示例代码
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# 类定义示例
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
    
    def make_sound(self):
        print(f"{self.name} makes a sound")
```

#### 无语言标识的代码块
```
这是一个没有语言标识的代码块
可以用于显示纯文本内容
或者是伪代码
```

## 表格

### 简单表格

| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25 | 工程师 |
| 李四 | 30 | 设计师 |
| 王五 | 28 | 产品经理 |

### 对齐表格

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 这列是左对齐的 | 这列是居中的 | 这列是右对齐的 |
| 短文本 | 中等长度的文本 | 这是一个比较长的文本内容 |
| A | B | C |

### 复杂表格

| 功能 | 描述 | 支持情况 | 优先级 |
|------|------|----------|--------|
| **基础功能** | 核心的 Markdown 渲染 | ✅ 已支持 | 🔴 高 |
| *扩展功能* | 高级的排版特性 | 🚧 开发中 | 🟡 中 |
| ~~废弃功能~~ | 不再维护的特性 | ❌ 不支持 | 🔵 低 |
| `代码功能` | 代码高亮和格式化 | ✅ 已支持 | 🔴 高 |

## 分隔线

这是分隔线上方的内容。

---

这是分隔线下方的内容。

***

另一种分隔线样式。

## 图片

### 普通图片
![这是图片的替代文本](https://via.placeholder.com/600x300/67A3C1/FFFFFF?text=测试图片)

### 带链接的图片
[![点击图片访问链接](https://via.placeholder.com/400x200/A3D977/FFFFFF?text=可点击图片)](https://github.com)

## 特殊字符和转义

这里有一些特殊字符需要转义：

- 反斜杠: \\
- 星号: \*
- 下划线: \_
- 花括号: \{ \}
- 方括号: \[ \]
- 圆括号: \( \)
- 井号: \#
- 加号: \+
- 减号: \-
- 点号: \.
- 感叹号: \!

## HTML 混合内容

有时候我们需要在 Markdown 中使用 HTML：

<div style="background: #f0f0f0; padding: 1rem; border-radius: 0.5rem;">
  这是一个 HTML div 元素，包含一些 <strong>HTML 标签</strong> 和 <em>样式</em>。
</div>

<details>
<summary>点击展开详细信息</summary>

这是一个可折叠的详细信息块。你可以在这里放置一些额外的内容，用户需要点击才能看到。

```javascript
// 这里甚至可以包含代码块
console.log('Hello from collapsible content!');
```

</details>

## 数学公式测试

### 简单的内联公式
这是一个简单的内联公式：$x = 1$

这是质能方程：$E = mc^2$

欧拉恒等式：$e^{i\pi} + 1 = 0$

量子力学中的薛定谔方程：$i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi$

正态分布概率密度函数：$f(x) = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$

### 简单的块级公式
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

$$f(x) = ax^2 + bx + c$$

### 复杂的数学公式

#### 微积分公式
泰勒级数展开：
$$f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f'''(a)}{3!}(x-a)^3 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n + R_n(x)$$

傅里叶变换：
$$\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} \, dx$$

分部积分：
$$\int u \, dv = uv - \int v \, du$$

多重积分（球坐标系）：
$$\iiint_V f(x,y,z) \, dV = \int_0^{2\pi} \int_0^{\pi} \int_0^R f(r\sin\phi\cos\theta, r\sin\phi\sin\theta, r\cos\phi) \cdot r^2 \sin\phi \, dr \, d\phi \, d\theta$$

#### 线性代数
矩阵特征值分解：
$$A = PDP^{-1}$$

其中 $P$ 是特征向量矩阵，$D$ 是特征值对角矩阵。

矩阵的奇异值分解（SVD）：
$$A = U\Sigma V^T$$

大型矩阵方程组：
$$
\mathbf{A}\mathbf{x} = \mathbf{b}
$$

其中：
$$
\mathbf{A} = \begin{pmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{n1} & a_{n2} & \cdots & a_{nn}
\end{pmatrix}, \quad
\mathbf{x} = \begin{pmatrix}
x_1 \\ x_2 \\ \vdots \\ x_n
\end{pmatrix}, \quad
\mathbf{b} = \begin{pmatrix}
b_1 \\ b_2 \\ \vdots \\ b_n
\end{pmatrix}
$$

#### 物理公式

麦克斯韦方程组：
$$
\begin{aligned}
\nabla \cdot \vec{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \vec{B} &= 0 \\
\nabla \times \vec{E} &= -\frac{\partial \vec{B}}{\partial t} \\
\nabla \times \vec{B} &= \mu_0 \vec{J} + \mu_0 \epsilon_0 \frac{\partial \vec{E}}{\partial t}
\end{aligned}
$$

薛定谔方程（含时）：
$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \left[-\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t)\right]\Psi(\mathbf{r},t)
$$

洛伦兹变换：

$$
\begin{aligned}
x' &= \gamma(x - vt) \\
t' &= \gamma\left(t - \frac{vx}{c^2}\right)
\end{aligned}
$$

其中 $\gamma = \frac{1}{\sqrt{1-v^2/c^2}}$

爱因斯坦场方程：

$$
G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}
$$

#### 概率统计

贝叶斯定理：
$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)} = \frac{P(A \cap B)}{P(B)}
$$

中心极限定理：
$$
\lim_{n \to \infty} P\left(\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \leq z\right) = \Phi(z) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^{z} e^{-t^2/2} \, dt
$$

卡方分布：
$$
f(x; k) = \frac{1}{2^{k/2}\Gamma(k/2)} x^{k/2-1} e^{-x/2}, \quad x \geq 0
$$

#### 复分析

柯西积分公式：
$$f(z_0) = \frac{1}{2\pi i} \oint_C \frac{f(z)}{z - z_0} dz$$

留数定理：
$$\oint_C f(z) \, dz = 2\pi i \sum_{k=1}^n \text{Res}(f, z_k)$$

复数的指数形式：
$$z = re^{i\theta} = r(\cos\theta + i\sin\theta)$$

#### 偏微分方程

热传导方程：
$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u = \alpha \left(\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
$$

波动方程：
$$
\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u
$$

拉普拉斯方程：
$$\nabla^2 u = \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2} = 0$$

#### 数值分析
牛顿-拉夫逊迭代法：
$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

辛普森积分公式：
$$\int_a^b f(x) \, dx \approx \frac{h}{3}\left[f(x_0) + 4\sum_{i=1,3,5,...}^{n-1}f(x_i) + 2\sum_{i=2,4,6,...}^{n-2}f(x_i) + f(x_n)\right]$$

#### 组合数学与数论

二项式定理：
$$(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k = \sum_{k=0}^{n} \frac{n!}{k!(n-k)!} x^{n-k} y^k$$

斯特林公式：
$$n! \approx \sqrt{2\pi n} \left(\frac{n}{e}\right)^n \left(1 + \frac{1}{12n} + O\left(\frac{1}{n^2}\right)\right)$$

欧拉函数：
$$\phi(n) = n \prod_{p|n} \left(1 - \frac{1}{p}\right)$$

费马小定理：
$$
a^{p-1} \equiv 1 \pmod{p} \quad \text{当 } p \text{ 为质数且 } \gcd(a,p) = 1
$$

#### 优化理论
拉格朗日乘数法：
$$
\mathcal{L}(x, \lambda, \mu) = f(x) + \sum_{i=1}^m \lambda_i g_i(x) + \sum_{j=1}^l \mu_j h_j(x)
$$

KKT 条件：
$$
\begin{aligned}
\nabla f(x^*) + \sum_{i=1}^m \lambda_i^* \nabla g_i(x^*) + \sum_{j=1}^l \mu_j^* \nabla h_j(x^*) &= 0 \\
g_i(x^*) &\leq 0, \quad i = 1, \ldots, m \\
h_j(x^*) &= 0, \quad j = 1, \ldots, l \\
\lambda_i^* &\geq 0, \quad i = 1, \ldots, m \\
\lambda_i^* g_i(x^*) &= 0, \quad i = 1, \ldots, m
\end{aligned}
$$

#### 特殊函数

伽马函数：
$$\Gamma(z) = \int_0^{\infty} t^{z-1} e^{-t} \, dt$$

贝塞尔函数：
$$J_n(x) = \frac{1}{\pi} \int_0^{\pi} \cos(n\tau - x\sin\tau) \, d\tau$$

勒让德多项式：
$$P_n(x) = \frac{1}{2^n n!} \frac{d^n}{dx^n}(x^2 - 1)^n$$
