# 🎵 NCMusic —— 网易云音乐第三方 Web 客户端

基于 **Vue 3** 开发的网易云音乐第三方 Web 客户端，支持扫码登录、音乐搜索、歌单浏览、在线播放、歌词同步等功能。后端使用 NeteaseCloudMusicApiEnhanced 提供接口服务。

## ✨ 功能特性

- 🔐 **扫码登录**：通过网易云音乐 APP 扫码登录，同步个人数据
- 🏠 **音乐馆**：首页推荐内容展示
- 🔍 **音乐搜索**：支持按关键词搜索歌曲
- 📋 **歌单浏览**：查看歌单列表与详情
- 🎵 **在线播放器**：支持播放控制、进度调整
- 📜 **歌词同步**：播放时实时滚动歌词
- 👤 **我的音乐**：登录后查看个人音乐内容
- 💾 **登录持久化**：使用 localStorage 保存登录状态

## 🛠️ 技术栈

### 前端（NCMusic）

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.32 | 前端框架（Composition API） |
| Vite | ^8.0.8 | 构建工具 |
| Vue Router | ^5.0.4 | 路由管理 |
| Pinia | ^3.0.4 | 状态管理 |
| Axios | ^1.18.1 | HTTP 请求 |

### 后端（api-enhanced）

| 技术 | 用途 |
|------|------|
| Node.js + Express | API 服务 |
| NeteaseCloudMusicApiEnhanced | 网易云音乐接口封装 |

## 📦 项目结构

```
NC-music/
├── NCMusic/                    # 前端项目（Vue3 + Vite）
│   ├── src/
│   │   ├── api/                # axios 请求封装
│   │   │   └── index.js        # 请求实例与拦截器
│   │   ├── assets/             # 静态资源（CSS/图片）
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia 状态管理
│   │   │   └── user.js         # 用户登录状态
│   │   ├── views/              # 页面组件
│   │   │   ├── Login.vue       # 扫码登录页
│   │   │   ├── MusicHall.vue   # 音乐馆首页
│   │   │   ├── MusicList.vue   # 歌单详情页
│   │   │   ├── MyMusic.vue     # 我的音乐页
│   │   │   ├── Player.vue      # 播放器页
│   │   │   └── Search.vue      # 搜索页
│   │   ├── App.vue             # 根组件（顶部导航）
│   │   └── main.js             # 应用入口
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── api-enhanced/               # 后端 API 服务
│   ├── module/                 # 网易云音乐接口模块
│   ├── util/                   # 工具函数
│   ├── app.js                  # 服务入口
│   └── package.json
└── README.md
```

## 🚀 快速开始

需要先启动后端https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced，具体启动方式可以去看看这个项目。

我是部署到本地的，默认3000端口，如果需要修改，可以看配置说明。

### 环境要求

- **Node.js** ≥ 20.19.0
- **pnpm**（推荐）或 npm

### 安装 pnpm

```bash
# Node.js 16.10+ 自带 corepack
corepack enable pnpm
corepack prepare pnpm@latest --activate

# 验证安装
pnpm -v
```

### 1. 启动后端 API 服务（端口 3000）

```bash
cd api-enhanced
pnpm install
pnpm start          # 生产模式
# 或
pnpm dev            # 开发模式（热重载）
```

启动成功后会显示：

```
server running @ http://localhost:3000
```

### 2. 启动前端项目（端口 5173）

> 新开一个终端窗口

```bash
cd NCMusic
pnpm install
pnpm dev
```

浏览器访问：**http://localhost:5173**

## 📖 使用说明

1. **访问首页**：打开 http://localhost:5173，进入音乐馆
2. **登录账号**：点击右上角"登录"，使用网易云音乐 APP 扫码登录
3. **搜索音乐**：在顶部搜索框输入关键词，回车搜索
4. **播放音乐**：在搜索结果或歌单中点击歌曲，进入播放器
5. **查看歌词**：播放器页面自动同步显示歌词
6. **退出登录**：鼠标悬停头像，点击"退出登录"

## ⚙️ 配置说明

### 修改后端地址

前端默认连接 `http://localhost:3000`，如需修改，编辑 `NCMusic/src/api/index.js`：

```javascript
const BASE_URL = 'http://localhost:3000'  // 修改为你的后端地址
```

### 修改后端端口

编辑 `api-enhanced/app.js`，修改监听端口（默认 3000）。

## 🌐 接口说明

项目主要使用以下网易云音乐接口：

| 接口 | 路径 | 说明 |
|------|------|------|
| 获取登录二维码 key | `/login/qr/key` | 生成扫码登录 key |
| 创建二维码 | `/login/qr/create` | 生成二维码图片 |
| 检查登录状态 | `/login/qr/check` | 轮询扫码状态 |
| 获取登录状态 | `/login/status` | 获取当前用户信息 |
| 搜索 | `/search` | 按关键词搜索 |
| 歌曲详情 | `/song/detail` | 获取歌曲信息 |
| 歌曲链接 | `/song/url/v1` | 获取播放地址 |
| 歌词 | `/lyric` | 获取歌词 |

更多接口请参考 `api-enhanced/public/docs/home.md`。

## 📦 构建部署

### 前端构建

```bash
cd NCMusic
pnpm build        # 产物输出到 dist/
pnpm preview      # 本地预览构建结果
```

### 部署建议

- **前端**：可部署到 Vercel / Netlify / GitHub Pages / Nginx
- **后端**：可部署到 Railway / Render / 云服务器（需保持运行）

## 🔧 常见问题

### Q1：启动后端报错"端口被占用"？

修改 `api-enhanced/app.js` 的监听端口，同时修改前端 `BASE_URL`。

### Q2：前端请求后端跨域？

后端已默认开启 CORS。如仍有问题，可在 `NCMusic/vite.config.js` 配置代理：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Q3：扫码登录后二维码不刷新？

检查后端服务是否正常运行，以及 `/login/qr/key` 接口是否返回 `unikey`。

### Q4：歌曲无法播放？

网易云部分歌曲有版权限制，`/song/url/v1` 可能返回空链接，属正常现象。

## 🤝 致谢

- 后端接口基于 NeteaseCloudMusicApiEnhanced 项目 https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced
- 前端灵感来源于网易云音乐官方客户端

## 📄 开源协议

本项目仅供学习交流使用，不得用于商业用途。使用本项目产生的一切法律后果由使用者自行承担。

## 👤 作者

**wu2-creater**

- GitHub：[@wu2-creater](https://github.com/wu2-creater)
- 仓库地址：[https://github.com/wu2-creater/NC-music](https://github.com/wu2-creater/NC-music)

---

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！
