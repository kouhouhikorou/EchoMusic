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

- 🎧 播放/暂停、上下曲、进度拖拽、快进快退、三种播放模式
- 🔍 网易云 / QQ / 酷狗 / Bilibili 多音源聚合搜索，音源故障自动切换
- 📝 LRC 歌词滚动 + 全屏封面 + 唱片旋转动画
- 📂 拖拽导入本地音乐，ID3 标签自动解析 (MP3/FLAC/AAC/OGG/WAV)
- ❤️ 红心收藏、歌单管理、最近播放
- 📱 PWA 离线使用、后台播放、锁屏控制
- 🌙 暗色主题 + 响应式布局

---

## 🚀 安装 & 使用

**前置要求**：Node.js >= 18

```bash
# 克隆仓库
git clone https://github.com/kouhouhikorou/EchoMusic.git
cd EchoMusic

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本 (含 PWA)
npm run build
npm run preview
```

### PWA 安装到桌面

1. Chrome/Edge 访问网址 → 地址栏右侧 📥 点击安装
2. iOS Safari → 分享按钮 → 添加到主屏幕

---

## 🔧 API 配置

EchoMusic 依赖后端 API 获取音乐数据：

- **公共 API**：开箱即用，默认连接公共 API（部署在 Vercel，适合体验）
- **自部署**：设置页可填入自己的 API 地址（推荐重度用户）

```bash
# 以 NeteaseCloudMusicApi 为例
git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
cd NeteaseCloudMusicApi
npm install && npm start
# 在 EchoMusic 设置页填入 http://localhost:3000
```

---

## 🏗️ 技术栈

Vue 3 · TypeScript · Vite · Tailwind CSS · Naive UI · Pinia · Howler.js · PWA

---

## ⚠️ 免责声明

1. 本项目为**开源学习项目**，仅供学习和交流使用。
2. 所有音乐数据来源于第三方公开 API，本项目**不存储、不提供任何音乐文件**，不对音频内容的版权合法性负责。
3. 公共 API 仅供测试体验，**不保证可用性和稳定性**。
4. 因使用本软件产生的版权问题，由用户**自行承担**。请支持正版音乐。
5. EchoMusic 账号为**独立体系**，与任何音乐平台无关，不存在封号风险。

---

## 📄 开源协议

[MIT License](LICENSE) © 2026 EchoMusic Contributors
