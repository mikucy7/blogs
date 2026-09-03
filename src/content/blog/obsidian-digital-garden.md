---
title: 把 Obsidian 变成一座数字花园
publishDate: 2026-09-02
description: '笔记不该锁在本地。聊聊用 Quartz / Astro Spaceship 把 Obsidian 仓库发布成网站的几种方案。'
tags:
  - 工具
  - Obsidian
language: 中文
---

用了几年 Obsidian 之后，vault 里积攒了几百篇笔记：双链纵横，标签蔓延，像一座只属于自己的花园。但花园的意义在于生长与分享，而不是锁在园子里。

## 三条常见的发布路线

1. **Quartz 4**：把整个 Obsidian 仓库变成网站，原生支持双链、反向链接和关系图谱。写完笔记推送到 GitHub，托管平台自动构建——"写即发布"。
2. **Astro Spaceship 等主题**：把 Obsidian 风格的链接和嵌入搬进传统博客的骨架里，更像"博客"而不像"笔记库"。
3. **Obsidian Publish**：官方方案，零配置，但按月付费。

## 我的选择标准

- 是否保留 `[[双链]]` 与反向链接面板
- 构建速度（几百篇笔记时差距明显）
- 托管成本：GitHub Pages / Cloudflare Pages 都能免费挂载
- 隐私粒度：能否只发布指定文件夹，而不是整个 vault

数字花园的核心哲学是"公开学习"（learn in public）：笔记不再是从"草稿"到"完成"的流水线，而是一株株持续修剪、随时生长的植物。工具只是花盆，重要的还是种东西。
