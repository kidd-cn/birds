# 积分系统与头像兑换 设计

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建统一的积分系统，整合现有分散的积分来源（打卡、学堂、游戏），新增鸟类卡通头像商店，用户可消耗积分兑换并永久装备头像。

**Architecture:** 新增两个独立的工具模块 (`points-system.js` + `avatar-system.js`) 处理积分/头像数据；一个头像商店页面用于兑换/装备；一个头像展示组件用于多入口。现有模块通过调用工具模块的 API 上报积分变化，UI 端通过 storage 事件自动刷新。

**Tech Stack:** 微信小程序原生 WXML/WXSS/JS，localStorage (`wx.setStorageSync`)，无后端依赖。

---

## 1. 核心概念

### 1.1 术语

| 术语 | 含义 |
|------|------|
| **总获得积分** | 用户自注册以来通过各种行为累计获得的所有积分（消费不扣减） |
| **当前积分** | 当前可用的积分余额（消费会扣减） |
| **档位** | 头像的稀有度等级（普通/稀有/史诗），受总获得积分门槛限制 |
| **兑换** | 消耗当前积分永久获得一个头像 |
| **装备** | 在已拥有的头像中选择一个作为当前展示头像 |

### 1.2 关键不变量

- 当前积分永远不会为负数（消费前必须检查）
- 已拥有的头像永久保留
- 装备的头像必须先已拥有
- 默认头像"小麻雀"是初始赠送，无需兑换

---

## 2. 积分规则

### 2.1 积分来源与数量

| 行为 | 积分 | 触发点 | 限制 |
|------|------|--------|------|
| 每日打卡 | +10 | `pages/activities/check-in.js` 中的 `checkIn()` | 每天 1 次（基于 `checkInData.checkInDates`） |
| 学堂答对 1 题 | +5 | `school-data.js` 答对判断分支 | 同一关内同一题不重复给分（基于题 id 去重） |
| 学堂完成 1 关 | +20 | `school-data.js` 的 `completeLevel()` | 一次性，每关首次完成时 |
| 识别游戏答对 1 题 | +5 | `pages/activities/identification-game.js` | 同一题不重复 |
| 知识问答答对 1 题 | +5 | `pages/activities/knowledge-quiz.js` | 同一题不重复 |
| 游戏/问答完成（整场） | +15 | 游戏/问答结束时 | 一次性，每场首次完成 |
| 获得 1 枚徽章 | +30 | `school-data.js` 添加徽章时 | 一次性 |
| 称号升级 | +50 | `achievements.js` 计算称号后判定 | 每次升级一次性 |

### 2.2 存储位置

**Storage key:** `points-system`

```javascript
{
  totalEarned: 0,      // 总获得积分（消费不扣减）
  currentPoints: 0,    // 当前可用积分
  // 用于去重，避免重复给分
  earnedKeys: {        // 字符串 Set 序列化
    "check-in:2026-06-01": true,
    "level:eq-1": true,
    "question:eq-1-q1": true,
    "badge:equipment-master": true,
    "title:观鸟学者": true
  }
}
```

### 2.3 API

```javascript
// utils/points-system.js

// 核心：增加积分（自动去重）
// key 用于去重（如 "check-in:2026-06-01"、"question:eq-1-q1"）
// amount: 正数
// returns: { awarded: boolean, currentPoints, totalEarned }
addPoints(key, amount)

// 查询
getCurrentPoints()   // number
getTotalEarned()     // number
getState()           // 完整状态对象

// 消费（兑换头像时调用）
// returns: { success: boolean, currentPoints } | { success: false, reason }
spendPoints(amount, reason)

// 监听积分变化（用于 UI 自动刷新）
onChange(callback)   // 注册监听器，返回 unsubscribe 函数

// 重置（仅测试用）
reset()
```

### 2.4 去重策略

`addPoints(key, amount)`：
1. 若 `earnedKeys[key]` 已存在 → 静默返回 `{ awarded: false, ... }`
2. 否则：累加 `totalEarned` 和 `currentPoints`，写入 `earnedKeys[key]`，持久化，触发 change 事件

---

## 3. 头像库

### 3.1 头像定义

**Storage key:** `avatar-system`

```javascript
{
  ownedAvatars: ['sparrow'],     // 已拥有的头像 id 列表
  equippedAvatar: 'sparrow'      // 当前装备的头像 id
}
```

**头像资源文件位置：** `miniprogram/images/avatars/`
- 格式：PNG 或 SVG
- 尺寸：200×200 透明背景
- 命名：`<id>.png`（如 `sparrow.png`）

### 3.2 头像列表

| ID | 名称 | 档位 | 价格 | 鸟种 | 路径 |
|----|------|------|------|------|------|
| sparrow | 小麻雀 | 普通 | 0（默认） | 麻雀 | /images/avatars/sparrow.png |
| pigeon | 城市鸽 | 普通 | 50 | 家鸽 | /images/avatars/pigeon.png |
| swallow | 小燕子 | 普通 | 50 | 家燕 | /images/avatars/swallow.png |
| kingfisher | 蓝翠鸟 | 普通 | 50 | 普通翠鸟 | /images/avatars/kingfisher.png |
| egret | 白鹭仙子 | 普通 | 50 | 白鹭 | /images/avatars/egret.png |
| hoopoe | 戴胜 | 稀有 | 200 | 戴胜 | /images/avatars/hoopoe.png |
| magpie | 蓝鹊 | 稀有 | 200 | 红嘴蓝鹊 | /images/avatars/magpie.png |
| lapwing | 凤头麦鸡 | 稀有 | 200 | 凤头麦鸡 | /images/avatars/lapwing.png |
| goose | 斑头雁 | 稀有 | 200 | 斑头雁 | /images/avatars/goose.png |
| redstart | 红尾鸲 | 稀有 | 200 | 北红尾鸲 | /images/avatars/redstart.png |
| spoonbill | 黑脸琵鹭 | 史诗 | 500 | 黑脸琵鹭 | /images/avatars/spoonbill.png |
| crested_ibis | 朱鹮 | 史诗 | 500 | 朱鹮 | /images/avatars/crested_ibis.png |
| oriental_stork | 东方白鹳 | 史诗 | 500 | 东方白鹳 | /images/avatars/oriental_stork.png |

### 3.3 档位解锁

| 档位 | 解锁条件 | 颜色 |
|------|----------|------|
| 普通 | 默认全部可见 | 绿色 #4CAF50 |
| 稀有 | 总获得积分 ≥ 100 | 蓝色 #2196F3 |
| 史诗 | 总获得积分 ≥ 400 | 紫色 #9C27B0 |

未解锁的档位卡片显示锁标 + 提示文字"再获得 X 积分可解锁"。

### 3.4 头像 API

```javascript
// utils/avatar-system.js

// 获取所有头像（含档位、价格、是否解锁、是否已拥有、是否已装备）
getAllAvatars()

// 获取当前装备的头像完整信息
getEquippedAvatar()

// 获取头像图片路径
getAvatarImage(avatarId)

// 兑换头像
// returns: { success, reason? }
purchaseAvatar(avatarId)

// 装备头像（必须已拥有）
// returns: { success, reason? }
equipAvatar(avatarId)

// 初始化（首次启动时调用，确保默认头像已拥有）
init()
```

---

## 4. UI 设计

### 4.1 头像商店页面

**路径：** `pages/avatar-shop/avatar-shop`

**布局：**
```
┌─────────────────────────────────────┐
│  ← 返回  我的头像  [积分：350]      │ 顶部栏
├─────────────────────────────────────┤
│  [当前装备头像大图 120x120]          │
│  名称：蓝翠鸟                        │
│  [更换头像]                          │
├─────────────────────────────────────┤
│  Tabs：[普通] [稀有 🔒] [史诗 🔒]     │
├─────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  │头像│ │头像│ │头像│ │头像│  网格  │
│  │    │ │    │ │    │ │    │  3列   │
│  │50积│ │已拥│ │50积│ │🔒  │        │
│  │兑换│ │有  │ │兑换│ │100 │        │
│  └────┘ └────┘ └────┘ └────┘        │
│  ...                                 │
└─────────────────────────────────────┘
```

**卡片状态：**
| 状态 | 显示 | 按钮文字 | 点击行为 |
|------|------|----------|----------|
| 档位未解锁 | 灰色蒙版 + 🔒 | 再获 X 积分 | toast 提示 |
| 未拥有 + 积分够 | 正常显示 + 价格 | 兑换 | 调 purchaseAvatar |
| 未拥有 + 积分不够 | 正常显示 + 价格 + 灰色 | 还差 X 积分 | toast 提示 |
| 已拥有 + 未装备 | 正常显示 + "已拥有"标签 | 装备 | 调 equipAvatar |
| 已装备 | 正常显示 + "使用中"标签 + 边框高亮 | 当前使用中 | 无操作 |

### 4.2 头像展示组件

**路径：** `components/avatar-display/avatar-display`

**属性：**
- `size`：small(40) / medium(64) / large(120) / xlarge(160)
- `showName`：是否显示头像名称
- `showBorder`：是否显示档位颜色边框

**用途：** 在个人中心、首页、排行榜等地方显示当前装备头像。

### 4.3 入口位置

| 位置 | 入口形式 |
|------|----------|
| 首页 (`pages/index/index`) | 右上角小头像（40×40），点击进入头像商店 |
| 成就页 (`pages/achievements/achievements`) | "我的头像"模块 + 积分余额 + "去兑换"按钮 |
| 活动中心 (`pages/activities/activity-center`) | 新增"头像商店"卡片 |
| 学堂页 (`pages/birding-school/school-home/school-home`) | 顶部显示积分余额 |

---

## 5. 与现有模块的集成

### 5.1 `school-data.js` 改动

```javascript
// 在 calculateScore 答对判断分支中
if (isCorrect) {
  correctCount++;
  // 新增：单题答对 +5 积分
  require('../utils/points-system').addPoints(`question:${question.id}`, 5);
}

// 在 completeLevel() 函数末尾（保存进度前）
if (!progress.completedLevels.includes(levelId)) {
  require('../utils/points-system').addPoints(`level:${levelId}`, 20);
}

// 在授予徽章时
if (!progress.badges.includes(badgeKey)) {
  progress.badges.push(badgeKey);
  require('../utils/points-system').addPoints(`badge:${badgeKey}`, 30);
}
```

### 5.2 `check-in.js` 改动

```javascript
// 替换原本的 schoolProgress.scores['check-in'] += 10 逻辑
const today = new Date().toISOString().split('T')[0];
require('../../utils/points-system').addPoints(`check-in:${today}`, 10);
// 删除 schoolProgress.scores['check-in'] 相关代码
```

### 5.3 `identification-game.js` 和 `knowledge-quiz.js` 改动

```javascript
// 答对判断
if (isCorrect) {
  require('../../utils/points-system').addPoints(`game-q:${questionId}`, 5);
}

// 游戏完成时
require('../../utils/points-system').addPoints(`game-finish:${gameId}:${date}`, 15);
```

### 5.4 `achievements.js` 改动

```javascript
// 加载时
const points = require('../../utils/points-system').getState();
this.setData({
  totalPoints: points.currentPoints,
  totalEarned: points.totalEarned
});

// 计算称号后检测升级
const previousTitle = wx.getStorageSync('previous-title');
if (previousTitle !== title) {
  require('../../utils/points-system').addPoints(`title:${title}`, 50);
  wx.setStorageSync('previous-title', title);
}
```

---

## 6. 数据流示例

**用户点击兑换按钮：**
```
avatar-shop.wxml
  ↓ bindtap="onPurchase"
avatar-shop.js
  ↓ avatarSystem.purchaseAvatar(avatarId)
  ↓ 检查档位解锁 → 积分充足 → 头像未拥有
  ↓ pointsSystem.spendPoints(amount, `avatar:${avatarId}`)
  ↓ 更新 ownedAvatars
  ↓ 触发 onChange
  ↓ toast 提示 + 弹窗"是否立即装备？"
```

**用户完成一道学堂题：**
```
level.js 答对判断
  ↓ pointsSystem.addPoints(`question:${q.id}`, 5)
  ↓ 检查 earnedKeys[key] 是否存在
  ↓ 不存在：累加积分，持久化
  ↓ 触发 onChange 事件
  ↓ UI 监听器更新积分显示
```

---

## 7. 错误处理

| 场景 | 处理 |
|------|------|
| 兑换时档位未解锁 | toast "再获得 X 积分可解锁此档位" |
| 兑换时积分不足 | toast "积分不足，还差 X 积分" |
| 兑换时已拥有 | 按钮直接显示"装备" |
| 装备时未拥有 | toast "请先兑换该头像" |
| 头像图片加载失败 | 显示 fallback 默认头像（程序内置 base64 简易图） |
| 积分持久化失败 | console.error，不阻塞 UI |
| 存储被损坏 | try-catch，fallback 到默认状态 |

---

## 8. 测试策略

### 8.1 单元测试关注点

`points-system.js`：
- 首次 `addPoints(key, 5)` → awarded=true, currentPoints=5, totalEarned=5
- 重复 `addPoints(sameKey, 5)` → awarded=false，积分不变
- `spendPoints` 充足 → 成功扣减
- `spendPoints` 不足 → 返回失败，不扣减
- `spendPoints` 后 `totalEarned` 不变
- `onChange` 在 addPoints/spendPoints 后触发

`avatar-system.js`：
- 首次启动 `init()` → 默认拥有 sparrow，equipped=sparrow
- `purchaseAvatar(unlocked)` 积分够 → ownedAvatars 增加
- `purchaseAvatar(locked)` → 返回失败
- `purchaseAvatar(owned)` → 返回失败（已拥有）
- `equipAvatar(unowned)` → 返回失败
- `equipAvatar(owned)` → equippedAvatar 更新

### 8.2 集成测试关注点

- 完成一道学堂题：积分 +5，去重 key 写入
- 完成一关：积分 +20（不影响已答对的题积分）
- 重复进入同一关：去重生效，积分不再增加
- 跨页面刷新：积分状态持久化

### 8.3 手动验证清单

- [ ] 首次启动自动装备小麻雀
- [ ] 打卡后积分 +10
- [ ] 学堂答对 3 题 +15
- [ ] 完成一关再 +20
- [ ] 兑换普通头像后变为"已拥有"
- [ ] 装备后头像展示组件显示新头像
- [ ] 总积分达 100 后稀有档位解锁
- [ ] 总积分达 400 后史诗档位解锁
- [ ] 积分不足兑换时正确提示
- [ ] 头像图片加载失败时显示 fallback

---

## 9. 文件清单

**新增文件：**
- `miniprogram/utils/points-system.js`
- `miniprogram/utils/avatar-system.js`
- `miniprogram/pages/avatar-shop/avatar-shop.{js,wxml,wxss,json}`
- `miniprogram/components/avatar-display/avatar-display.{js,wxml,wxss,json}`
- `miniprogram/images/avatars/*.png`（13 个头像图片）

**修改文件：**
- `miniprogram/utils/school-data.js`
- `miniprogram/pages/activities/check-in.js`
- `miniprogram/pages/activities/identification-game.js`
- `miniprogram/pages/activities/knowledge-quiz.js`
- `miniprogram/pages/achievements/achievements.{js,wxml}`
- `miniprogram/pages/activities/activity-center.wxml`
- `miniprogram/pages/index/index.wxml`（加首页头像入口）
- `miniprogram/pages/birding-school/school-home/school-home.wxml`（加积分显示）

---

## 10. 范围之外（YAGNI）

- 不做积分交易、赠送、签到补偿
- 不做头像上传功能（仅使用预设 13 个）
- 不做积分排行榜（可后续扩展）
- 不做云端同步（仅本地存储）
- 不做限时活动头像（后续可扩展）
