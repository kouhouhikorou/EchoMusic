<p align="center">
  <img src="public/favicon.svg" alt="EchoMusic Logo" width="80" height="80" />
</p>

<h1 align="center">🎵 EchoMusic</h1>

<p align="center">
  <strong>开源跨平台聚合音乐播放器</strong><br/>
  网易云 · QQ音乐 · 酷狗 · Bilibili 多音源搜索 | PWA 后台播放 | 歌词滚动 | 独立账号体系
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-brightgreen?logo=vue.js" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript" alt="TS" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

---

## ✨ 功能特性

### 🎧 核心播放
- ✅ 播放/暂停、上下曲、进度拖拽、音量控制
- ✅ **快进/快退** (±5s / ±15s)
- ✅ 三种播放模式：列表循环 / 单曲循环 / 随机播放
- ✅ **后台播放** (PWA Media Session API，锁屏/通知栏控制)
- ✅ **睡眠定时器** (15/30/45/60 min)
- ✅ **淡入淡出 (Crossfade)** 平滑切歌
- ✅ 全局快捷键 (桌面端)

### 🔍 多音源聚合搜索
- ✅ **网易云音乐** · **QQ音乐** · **酷狗音乐** · **Bilibili** 四大音源
- ✅ 统一搜索入口，一键切换音源
- ✅ **音源故障自动切换** — 当前源失败时 Toast 提示 + 自动尝试其他源
- ✅ **灰色歌曲换源播放** — 搜索替代音源

### 🎨 完整音乐体验
- ✅ **歌词滚动** (LRC 标准格式 + 逐字高亮)
- ✅ **封面展示** + 可开关的唱片旋转动画
- ✅ 明/暗主题切换
- ✅ 毛玻璃效果 + 响应式布局

### 📂 本地音乐
- ✅ 拖拽导入 MP3/FLAC/AAC/OGG/WAV
- ✅ ID3 标签自动解析 (标题/歌手/专辑/封面)
- ✅ 本地文件独立播放

### ❤️ 收藏 & 歌单
- ✅ 红心标记 (收藏歌曲)
- ✅ 创建/编辑/删除歌单
- ✅ 最近播放记录
- ✅ **独立账号体系** — 不依赖任何音乐平台，零封号风险

### 📱 跨平台
- ✅ **Web** — 任意浏览器访问
- ✅ **PWA** — 添加到桌面，独立窗口运行，离线使用
- ✅ **移动端** — 响应式适配，底部导航，手势友好
- ⏳ APK/IPA (Capacitor 封装) — 按需后续支持

---

## 🖼️ 预览

> 📸 截图将在 MVP 完成运行后添加

| 首页 | 搜索 | 全屏播放器 | 歌单 |
|------|------|-----------|------|
| *(截图)* | *(截图)* | *(截图)* | *(截图)* |

---

## 🚀 快速开始

### 前置要求
- **Node.js** >= 18
- **npm** >= 9

### 安装 & 运行

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/echomusic.git
cd echomusic

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果 (含 PWA)
npm run preview
```

### PWA 安装

1. 用 Chrome/Edge 访问部署后的网址
2. 地址栏右侧出现安装图标 📥
3. 点击「安装」即可添加到桌面/主屏幕
4. iOS Safari: 点击分享按钮 → 添加到主屏幕

---

## 🔧 API 部署

EchoMusic 需要后端 API 来获取音乐数据。你可以选择：

### 方案 A：使用公共 API (开箱即用)

项目默认连接公共 API（部署在 Vercel），适合快速体验。

### 方案 B：自行部署 (推荐重度用户)

```bash
# 以 NeteaseCloudMusicApi 为例
git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
cd NeteaseCloudMusicApi
npm install
npm start

# 在 EchoMusic 设置页中填入你的 API 地址:
# http://localhost:3000
```

> 📖 更详细的 API 部署指南见 [API_DEPLOY.md](./API_DEPLOY.md)

---

## 🏗️ 技术栈

| 层 | 技术 |
|------|------|
| 框架 | Vue 3 + Composition API |
| 语言 | TypeScript |
| 构建 | Vite 6 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| UI | Tailwind CSS 4 + Naive UI |
| 音频 | Howler.js + Media Session API |
| 本地存储 | IndexedDB (Dexie.js) + localStorage |
| PWA | vite-plugin-pwa (Workbox) |
| 图标 | @vicons/ionicons5 |
| ID3 解析 | music-metadata-browser |

---

## 📁 项目结构

```
echomusic/
├── public/
│   ├── favicon.svg
│   └── icons/              # PWA 图标
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css           # Tailwind + 全局样式
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态
│   │   ├── playerStore.ts  # 播放器状态
│   │   └── userStore.ts    # 用户数据/设置
│   ├── api/                # API 封装
│   │   ├── musicApi.ts     # 多音源音乐 API
│   │   └── authApi.ts      # 账号认证 API
│   ├── utils/              # 工具函数
│   │   ├── lrcParser.ts    # LRC 歌词解析
│   │   ├── id3Parser.ts    # ID3 标签解析
│   │   └── disclaimer.ts   # 免责声明
│   ├── composables/        # Vue composables
│   │   └── useMediaSession.ts
│   ├── components/         # 通用组件
│   │   ├── AppLayout.vue
│   │   ├── MiniPlayer.vue
│   │   ├── Sidebar.vue
│   │   ├── BottomNav.vue
│   │   ├── DisclaimerModal.vue
│   │   ├── SongList.vue
│   │   ├── LyricDisplay.vue
│   │   ├── CoverArt.vue
│   │   └── SourceSwitchToast.vue
│   └── pages/              # 页面
│       ├── HomePage.vue
│       ├── SearchPage.vue
│       ├── PlayerPage.vue
│       ├── PlaylistPage.vue
│       ├── LocalPage.vue
│       ├── FavoritesPage.vue
│       ├── RecentPage.vue
│       ├── SettingsPage.vue
│       ├── LoginPage.vue
│       └── DownloadPage.vue
├── index.html
├── vite.config.ts          # Vite + PWA 配置
├── tsconfig.json
├── package.json
├── README.md               # 本文件
└── PM.md                   # 产品需求文档
```

---

## 📋 路线图

参见 [PM.md](./PM.md) §7 开发路线图。

| Phase | 内容 | 状态 |
|-------|------|:--:|
| Phase 1 | MVP — 核心播放 + 搜索 + 歌词 + 界面 | 🚧 进行中 |
| Phase 2 | PWA + 移动端适配 + 后台播放 | ⏳ 计划中 |
| Phase 3 | 账号体系 + 收藏同步 + 桌面歌词 | ⏳ 计划中 |
| Phase 4 | 下载管理 + EQ + 灰色歌曲换源 | ⏳ 计划中 |
| Phase 5 | 打包发布 + 国际化 | ⏳ 计划中 |

---

## ⚠️ 免责声明

1. 本项目为**开源学习项目**，仅供学习和交流使用。
2. 所有音乐数据来源于第三方公开 API，本项目**不存储、不提供任何音乐文件**，不对音频内容的版权合法性负责。
3. 公共 API 仅供测试体验，**不保证可用性和稳定性**。
4. 因使用本软件产生的版权问题，由用户**自行承担**。请支持正版音乐。
5. EchoMusic 账号为**独立体系**，与任何音乐平台无关，不存在封号风险。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

```bash
# 开发流程
git checkout -b feature/your-feature
npm run dev
# ... 开发 ...
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📄 开源协议

[MIT License](LICENSE) © 2026 EchoMusic Contributors

---

<p align="center">
  Made with ❤️ and Vue
</p>
