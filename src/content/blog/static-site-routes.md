---
title: 静态博客的三条路线
publishDate: 2026-09-03
description: 'Hugo、Hexo、Astro——三大静态站点生成器各适合什么人？一次面向选择困难症者的横评。'
tags:
  - 建站
  - Cloudflare
language: 中文
---

想搭博客的人几乎都会在同一个岔路口停留：**选哪个生成器？** 横评之后，我的结论是按"你最看重什么"来选。

## Hugo：速度至上

Go 编写的单二进制文件，构建几千篇文章也只要几秒。主题生态里 PaperMod 一枝独秀，Terminal、Coder 等暗色主题很有极客味。适合**不想折腾 Node 依赖、追求极简部署**的人。

## Hexo：中文社区最大

老牌 Node.js 生成器，中文主题生态最豪华：Butterfly、AnZhiYu、Fluid，想要的功能几乎都有人写好了插件。缺点是构建偏慢、依赖树较老。适合**喜欢开箱全功能**的人。

## Astro：现代派

"默认零 JS"的岛屿架构，性能天花板高，主题颜值普遍在线（Fuwari、Astro Theme Pure——知名博客 arthals.ink 就是 Pure 模板改的）。组件化写法对前端开发者最友好。适合**在意设计感与现代工具链**的人。

## 部署端殊途同归

三家产出的都是纯静态文件，丢到 Cloudflare Pages / GitHub Pages / Vercel 都免费托管，国内大陆访问 Cloudflare 的 `*.pages.dev` 相对最稳。所以真正的问题只有一个：**你想把时间花在折腾上，还是写作上？**
