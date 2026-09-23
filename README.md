# Crowlook App

Crowlook 品牌的跨端用户应用，用于浏览摄影作品、品牌内容、定制案例和门店服务。

## 项目简介

本仓库使用 Vue 3 与 UniApp 实现 Crowlook 用户端，可构建为 H5 和微信小程序。应用包含首页、作品分类、品牌内容、文章/图集详情、搜索、收藏、评论、客服服务和门店地图等 12 个页面路由；启动后优先从 `crowlook-backend` 读取管理后台已发布内容，本地数据快照用于首屏与离线兜底。

点赞、搜索历史及顾客追加的案例照片仍保存在用户设备。评论会提交到 Crowlook 后端并进入管理后台审核，通过后显示在作品详情页；失败时草稿保留在本地。H5 开发与预览脚本包含 Crowlook API 与视频代理，微信小程序构建使用 UniApp 对应平台适配器。

## 技术栈

- Vue 3、JavaScript
- UniApp 3
- Vite 5、`@dcloudio/vite-plugin-uni`
- H5
- 微信小程序（`mp-weixin`）
- UniApp 本地存储与原生页面生命周期
- Node.js 代理/预览脚本

## 关联仓库

| 项目 | 说明 | GitHub |
| --- | --- | --- |
| crowlook-backend | 后端服务 | [crowlook-backend](https://github.com/jiangyi3265/crowlook-backend) |
| crowlook-admin | 管理后台 | [crowlook-admin](https://github.com/jiangyi3265/crowlook-admin) |
| crowlook-app | 用户端 | [crowlook-app](https://github.com/jiangyi3265/crowlook-app) |

## 快速启动

需要 Node.js 18 或更高版本。安装依赖并启动 H5 开发服务器：

```bash
npm install
npm run dev:h5
```

浏览器访问 `http://127.0.0.1:5174/preview.html` 可查看手机尺寸预览。

H5 本地开发默认把 `/content-api/` 代理到 `http://127.0.0.1:8080/api/`。微信开发者工具或真机调试时，请复制 `.env.example` 并通过 `VITE_APP_API_BASE` 配置局域网或线上后端地址。

构建 H5、启动构建产物预览或构建微信小程序：

```bash
npm run build:h5
npm run preview:h5
npm run build:mp-weixin
```

微信开发者工具导入 `dist/build/mp-weixin`。正式发布前需在 `manifest.json` 配置自己的微信小程序 AppID，并为实际使用的 API、图片和视频域名设置合法域名。H5 正式部署需要把 `/content-api/` 转发到 Crowlook 后端，并保留 `/reference-video` 媒体代理。

## 项目结构

```text
pages/             12 个业务页面及页面级样式
components/        页头、内容模块、评论、底部品牌信息等组件
lib/               内容请求、媒体地址和本地状态逻辑
data/              公开内容快照与离线兜底数据
static/            图像、图标、字体等运行时资源
scripts/           UniApp 启动、构建、预览与内容同步脚本
docs/              参考截图、原始媒体与实现核对资料
manifest.json      UniApp 平台和微信小程序配置
pages.json         页面路由、TabBar 与窗口配置
```

## 简历描述示例

参与 Crowlook 品牌用户端开发，使用 Vue 3 与 UniApp 构建兼容 H5、微信小程序的作品展示应用，完成作品分类、图集详情、搜索收藏与评论发布，并实现后端内容优先、快照离线兜底的三端数据链路。
