# 深圳市鸟类分布地图小程序

## 项目结构

```
birds/
├── miniprogram/                  # 小程序源码
│   ├── app.js                    # 小程序入口逻辑
│   ├── app.json                  # 全局配置(页面路由、窗口、权限)
│   ├── app.wxss                  # 全局样式
│   ├── sitemap.json              # 站点地图配置
│   ├── pages/                    # 页面(地图主页、观鸟点、积分活动、观鸟学堂等)
│   ├── components/               # 公共组件(头像、星级、quiz 题型等)
│   ├── images/                   # 图片资源(鸟类、图标、地图 marker)
│   └── utils/                    # 工具模块(birdData、积分、头像、徽章、学堂数据)
│
├── tests/                        # Jest 测试
│   ├── bird-knowledge-quiz.test.js
│   └── utils/                    # 针对 miniprogram/utils/ 的单元测试与一次性验证脚本
│
├── cloudfunctions/               # 微信云开发云函数
│   ├── initBirdDatabase/
│   ├── getBirdData/  addBirdData/
│   ├── getRealBirdData/  addRealBirdData/
│   ├── getBirdDataByLocation/  getBirdDataBySpot/
│   └── getFeaturedBirdingSpots/
│
├── docs/
│   ├── decisions/                # 已采纳的技术/产品决议(权威)
│   ├── archive/                  # 历史方案、救火记录(只读,git 仍可查)
│   └── superpowers/              # 旧 brainstorming/plans 流程产物
│
├── openspec/                     # OpenSpec 变更管理(proposal/design/specs/tasks)
│   ├── config.yaml
│   └── changes/                  # 进行中 / 已归档的 change
│
├── project.config.json           # 微信开发者工具项目配置
├── project.private.config.json   # 私有配置(本地)
├── package.json                  # devDependencies + jest 配置 + npm 脚本
├── .gitignore                    # node_modules / *.bak / .DS_Store 等
├── init.sh                       # 一键检查项目结构的 bash 脚本
└── README.md                     # 本文件
```

## 约定

- **源码**:`miniprogram/` 下文件都是产品代码,不放测试、不放脚本。
- **测试**:`tests/` 下走 Jest;`tests/utils/` 是针对 `miniprogram/utils/` 的测试与一次性验证脚本。
- **文档**:
  - 现行 / 权威文档放根目录或 `docs/decisions/`
  - 历史 / 一次性救火记录放 `docs/archive/<slug>/`,目录里加 `README.md` 指向对应的 `docs/decisions/` 决议
  - 旧的 brainstorming 流程产物保留在 `docs/superpowers/`
- **变更管理**:跨多模块或新功能走 OpenSpec(`openspec/changes/<name>/`)。
- **云函数**:在微信开发者工具里右键 `cloudfunctions/<name>` → 上传并部署。

## 功能说明

这是一个展示深圳市鸟类分布的微信小程序 MVP 版本,主要功能包括:

1. 交互式地图展示深圳市真实鸟类分布
2. 基于实际观察数据的标记展示
3. 点击地图标记查看鸟类详细信息和观察详情
4. 支持按位置检索附近的鸟类观察记录
5. 积分 / 头像 / 观鸟学堂 / 鸟类识别游戏 / 知识答题 / 每日打卡 / 徽章 等游戏化能力

## 开发说明

1. 使用原生微信小程序框架开发
2. 集成了地图组件展示鸟类分布
3. 实现了从云端获取真实鸟类观察数据的功能(未部署云函数时回退到本地真实数据)
4. 支持按地理位置检索鸟类数据
5. 包含数据验证和位置校验机制

## 使用方法

1. 在微信开发者工具中打开此项目
2. 首次使用前请 `npm install` 安装 devDependencies(jest / chai / sinon)
3. 开通云开发环境并部署 `cloudfunctions/` 下的云函数(详见 `CLOUD_DEPLOY_GUIDE.md`)
4. 编译并预览小程序

## 测试

```bash
npm test
```

Jest 会运行 `tests/**/*.test.js`,目前包含 1 套根目录测试 + 6 套从 `miniprogram/utils/` 迁出的单元测试。已知有 3 个 pre-existing 失败用例(不阻塞本仓库使用,见 `openspec/changes/housekeeping-cleanup/tasks.md` 的基线说明)。

## 云函数部署

本项目包含多个云函数,需要在微信开发者工具中部署后才能正常使用。请参考 `CLOUD_DEPLOY_GUIDE.md` 文档了解详细部署步骤。