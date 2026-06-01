# 观鸟学堂模块实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有小程序中新增"观鸟学堂"模块，包含地图式闯关引导、混合题型互动、徽章墙和社交分享功能

**Architecture:** 采用小程序标准架构——页面（3个）+ 组件（6个）+ 数据层。页面间通过 wx.navigateTo 跳转，组件间通过事件通信。数据存储使用 wx.setStorageSync

**Tech Stack:** 微信小程序原生开发（JS/WXML/WXSS），无第三方依赖

---

## 文件结构

```
miniprogram/
├── pages/
│   └── birding-school/
│       ├── school-home/          # 学堂首页（地图视图）
│       ├── topic-detail/         # 主题详情页
│       └── level-detail/         # 关卡互动页
├── components/
│   ├── progress-map/             # 地图组件
│   ├── topic-card/              # 站点卡片组件
│   ├── level-card/              # 关卡卡片组件
│   ├── quiz-choice/             # 选择题组件
│   ├── quiz-sort/               # 排序题组件
│   └── quiz-fill/               # 补全题组件
└── utils/
    └── school-data.js           # 关卡数据
```

---

## 任务总览

| 任务 | 内容 | 复杂度 |
|------|------|--------|
| Task 1 | 目录结构搭建 | 低 |
| Task 2 | 关卡数据层 | 中 |
| Task 3 | 闯关组件（题目类型） | 中 |
| Task 4 | 站点和关卡卡片组件 | 中 |
| Task 5 | 地图组件 | 高 |
| Task 6 | 学堂首页 | 中 |
| Task 7 | 主题详情页 | 中 |
| Task 8 | 关卡互动页 | 高 |
| Task 9 | 首页入口集成 | 低 |
| Task 10 | 成就页面（与签到合并） | 中 |

---

## Task 1: 目录结构搭建

**Files:**
- Create: `miniprogram/pages/birding-school/school-home/school-home.js`
- Create: `miniprogram/pages/birding-school/school-home/school-home.wxml`
- Create: `miniprogram/pages/birding-school/school-home/school-home.wxss`
- Create: `miniprogram/pages/birding-school/school-home/school-home.json`
- Create: `miniprogram/pages/birding-school/topic-detail/topic-detail.js`
- Create: `miniprogram/pages/birding-school/topic-detail/topic-detail.wxml`
- Create: `miniprogram/pages/birding-school/topic-detail/topic-detail.wxss`
- Create: `miniprogram/pages/birding-school/topic-detail/topic-detail.json`
- Create: `miniprogram/pages/birding-school/level-detail/level-detail.js`
- Create: `miniprogram/pages/birding-school/level-detail/level-detail.wxml`
- Create: `miniprogram/pages/birding-school/level-detail/level-detail.wxss`
- Create: `miniprogram/pages/birding-school/level-detail/level-detail.json`
- Create: `miniprogram/components/progress-map/progress-map.js`
- Create: `miniprogram/components/progress-map/progress-map.wxml`
- Create: `miniprogram/components/progress-map/progress-map.wxss`
- Create: `miniprogram/components/topic-card/topic-card.js`
- Create: `miniprogram/components/topic-card/topic-card.wxml`
- Create: `miniprogram/components/topic-card/topic-card.wxss`
- Create: `miniprogram/components/level-card/level-card.js`
- Create: `miniprogram/components/level-card/level-card.wxml`
- Create: `miniprogram/components/level-card/level-card.wxss`
- Create: `miniprogram/components/quiz-choice/quiz-choice.js`
- Create: `miniprogram/components/quiz-choice/quiz-choice.wxml`
- Create: `miniprogram/components/quiz-choice/quiz-choice.wxss`
- Create: `miniprogram/components/quiz-sort/quiz-sort.js`
- Create: `miniprogram/components/quiz-sort/quiz-sort.wxml`
- Create: `miniprogram/components/quiz-sort/quiz-sort.wxss`
- Create: `miniprogram/components/quiz-fill/quiz-fill.js`
- Create: `miniprogram/components/quiz-fill/quiz-fill.wxml`
- Create: `miniprogram/components/quiz-fill/quiz-fill.wxss`
- Create: `miniprogram/utils/school-data.js`

**Steps:**
- [ ] **Step 1: 创建所有目录**

```bash
mkdir -p miniprogram/pages/birding-school/school-home
mkdir -p miniprogram/pages/birding-school/topic-detail
mkdir -p miniprogram/pages/birding-school/level-detail
mkdir -p miniprogram/components/progress-map
mkdir -p miniprogram/components/topic-card
mkdir -p miniprogram/components/level-card
mkdir -p miniprogram/components/quiz-choice
mkdir -p miniprogram/components/quiz-sort
mkdir -p miniprogram/components/quiz-fill
mkdir -p miniprogram/utils/school-data.js
```

- [ ] **Step 2: 创建 school-home 的 4 个基础文件**

`school-home.js`:
```javascript
// miniprogram/pages/birding-school/school-home/school-home.js
Page({
  data: {
    topics: []
  },

  onLoad() {
    this.loadTopics();
  },

  loadTopics() {
    const schoolData = require('../../../utils/school-data');
    this.setData({
      topics: schoolData.getTopics()
    });
  },

  onTopicTap(e) {
    const { topicId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/birding-school/topic-detail/topic-detail?topicId=${topicId}`
    });
  }
});
```

`school-home.wxml`:
```xml
<!-- miniprogram/pages/birding-school/school-home/school-home.wxml -->
<view class="container">
  <view class="header">
    <text class="title">观鸟学堂</text>
    <text class="subtitle">与自然相处的正确价值观</text>
  </view>
  <progress-map topics="{{topics}}" bind:topicTap="onTopicTap" />
</view>
```

`school-home.wxss`:
```css
/* miniprogram/pages/birding-school/school-home/school-home.wxss */
.container {
  padding: 20rpx;
  background: #f0f8f4;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #2e8b57;
  display: block;
}

.subtitle {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
  display: block;
}
```

`school-home.json`:
```json
{
  "usingComponents": {
    "progress-map": "/components/progress-map/progress-map"
  },
  "navigationBarTitleText": "观鸟学堂",
  "navigationBarBackgroundColor": "#2e8b57",
  "navigationBarTextStyle": "white"
}
```

- [ ] **Step 3: 创建 topic-detail 的 4 个基础文件**

`topic-detail.js`:
```javascript
// miniprogram/pages/birding-school/topic-detail/topic-detail.js
Page({
  data: {
    topic: {},
    levels: []
  },

  onLoad(options) {
    const { topicId } = options;
    const schoolData = require('../../../utils/school-data');
    const topic = schoolData.getTopicById(topicId);
    const levels = schoolData.getLevelsByTopicId(topicId);

    this.setData({
      topic,
      levels
    });
  },

  onLevelTap(e) {
    const { levelId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/birding-school/level-detail/level-detail?levelId=${levelId}`
    });
  }
});
```

`topic-detail.wxml`:
```xml
<!-- miniprogram/pages/birding-school/topic-detail/topic-detail.wxml -->
<view class="container">
  <view class="topic-header">
    <text class="topic-name">{{topic.name}}</text>
    <text class="topic-desc">{{topic.description}}</text>
  </view>

  <view class="levels-list">
    <level-card
      wx:for="{{levels}}"
      wx:key="id"
      level="{{item}}"
      bind:levelTap="onLevelTap"
    />
  </view>
</view>
```

`topic-detail.wxss`:
```css
/* miniprogram/pages/birding-school/topic-detail/topic-detail.wxss */
.container {
  padding: 20rpx;
  background: #f0f8f4;
  min-height: 100vh;
}

.topic-header {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.topic-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #2e8b57;
  display: block;
}

.topic-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 10rpx;
  display: block;
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
```

`topic-detail.json`:
```json
{
  "usingComponents": {
    "level-card": "/components/level-card/level-card"
  },
  "navigationBarTitleText": "主题详情"
}
```

- [ ] **Step 4: 创建 level-detail 的 4 个基础文件**

`level-detail.js`:
```javascript
// miniprogram/pages/birding-school/level-detail/level-detail.js
Page({
  data: {
    level: {},
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    completed: false
  },

  onLoad(options) {
    const { levelId } = options;
    const schoolData = require('../../../utils/school-data');
    const level = schoolData.getLevelById(levelId);
    const questions = schoolData.getQuestionsByLevelId(levelId);

    this.setData({
      level,
      questions
    });
  },

  onQuestionAnswer(e) {
    const { answer } = e.detail;
    const { currentQuestionIndex, answers, questions } = this.data;

    answers.push(answer);
    this.setData({ answers });

    if (currentQuestionIndex < questions.length - 1) {
      this.setData({
        currentQuestionIndex: currentQuestionIndex + 1
      });
    } else {
      this.completeLevel();
    }
  },

  completeLevel() {
    const { levelId, answers, questions } = this.data;
    const schoolData = require('../../../utils/school-data');

    // Calculate score
    const correctCount = schoolData.calculateScore(levelId, answers);

    // Update progress
    schoolData.completeLevel(levelId, correctCount);

    this.setData({
      completed: true,
      correctCount
    });
  },

  goToNextLevel() {
    const { level } = this.data;
    const schoolData = require('../../../utils/school-data');
    const nextLevel = schoolData.getNextLevel(level.topicId, level.order);

    if (nextLevel) {
      wx.redirectTo({
        url: `/pages/birding-school/level-detail/level-detail?levelId=${nextLevel.id}`
      });
    } else {
      wx.navigateBack();
    }
  }
});
```

`level-detail.wxml`:
```xml
<!-- miniprogram/pages/birding-school/level-detail/level-detail.wxml -->
<view class="container">
  <view class="level-header">
    <text class="level-name">{{level.name}}</text>
    <text class="progress">{{currentQuestionIndex + 1}} / {{questions.length}}</text>
  </view>

  <view class="question-area" wx:if="{{!completed}}">
    <view class="question-content">
      <text class="question-text">{{questions[currentQuestionIndex].text}}</text>
      <image
        wx:if="{{questions[currentQuestionIndex].image}}"
        class="question-image"
        src="{{questions[currentQuestionIndex].image}}"
        mode="aspectFit"
      />
    </view>

    <quiz-choice
      wx:if="{{questions[currentQuestionIndex].type === 'choice'}}"
      question="{{questions[currentQuestionIndex]}}"
      bind:answer="onQuestionAnswer"
    />

    <quiz-sort
      wx:if="{{questions[currentQuestionIndex].type === 'sort'}}"
      question="{{questions[currentQuestionIndex]}}"
      bind:answer="onQuestionAnswer"
    />

    <quiz-fill
      wx:if="{{questions[currentQuestionIndex].type === 'fill'}}"
      question="{{questions[currentQuestionIndex]}}"
      bind:answer="onQuestionAnswer"
    />
  </view>

  <view class="complete-area" wx:if="{{completed}}">
    <text class="complete-title">关卡完成！</text>
    <text class="score">答对 {{correctCount}} / {{questions.length}} 题</text>
    <button class="next-button" bindtap="goToNextLevel">继续</button>
  </view>
</view>
```

`level-detail.wxss`:
```css
/* miniprogram/pages/birding-school/level-detail/level-detail.wxss */
.container {
  padding: 20rpx;
  background: #f0f8f4;
  min-height: 100vh;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.level-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.progress {
  font-size: 28rpx;
  color: #2e8b57;
}

.question-area {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.question-content {
  margin-bottom: 30rpx;
}

.question-text {
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
  display: block;
}

.question-image {
  width: 100%;
  height: 300rpx;
  margin-top: 20rpx;
  border-radius: 12rpx;
}

.complete-area {
  background: #fff;
  border-radius: 20rpx;
  padding: 60rpx 30rpx;
  text-align: center;
}

.complete-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #2e8b57;
  display: block;
}

.score {
  font-size: 28rpx;
  color: #666;
  margin-top: 20rpx;
  display: block;
}

.next-button {
  margin-top: 40rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 40rpx;
  padding: 20rpx 60rpx;
}
```

`level-detail.json`:
```json
{
  "usingComponents": {
    "quiz-choice": "/components/quiz-choice/quiz-choice",
    "quiz-sort": "/components/quiz-sort/quiz-sort",
    "quiz-fill": "/components/quiz-fill/quiz-fill"
  },
  "navigationBarTitleText": "关卡"
}
```

- [ ] **Step 5: 创建组件基础文件**

组件文件按以下结构创建（以 quiz-choice 为例，其他组件类似）：
- `.js` - 组件逻辑
- `.wxml` - 组件模板
- `.wxss` - 组件样式

```javascript
// miniprogram/components/quiz-choice/quiz-choice.js
Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    selectedOption: null
  },

  methods: {
    onOptionTap(e) {
      const { option } = e.currentTarget.dataset;
      this.setData({ selectedOption: option });
    },

    onConfirm() {
      if (this.data.selectedOption !== null) {
        this.triggerEvent('answer', {
          answer: this.data.selectedOption
        });
      }
    }
  }
});
```

- [ ] **Step 6: 创建 utils/school-data.js（空壳，后续Task填充）**

```javascript
// miniprogram/utils/school-data.js
module.exports = {
  getTopics: () => [],
  getTopicById: (id) => ({}),
  getLevelsByTopicId: (topicId) => [],
  getLevelById: (id) => ({}),
  getQuestionsByLevelId: (levelId) => [],
  getNextLevel: (topicId, order) => null,
  calculateScore: (levelId, answers) => 0,
  completeLevel: (levelId, score) => {}
};
```

- [ ] **Step 7: Commit**

```bash
git add miniprogram/pages/birding-school/ miniprogram/components/ miniprogram/utils/school-data.js
git commit -m "feat: scaffold birding school module structure"
```

---

## Task 2: 关卡数据层（school-data.js）

**Files:**
- Modify: `miniprogram/utils/school-data.js`

**Steps:**
- [ ] **Step 1: 实现完整数据层**

```javascript
// miniprogram/utils/school-data.js

const TOPICS = [
  {
    id: 'equipment',
    name: '装备篇',
    icon: '🔭',
    description: '选择合适的装备，让观鸟更轻松',
    order: 1,
    levels: ['eq-1', 'eq-2', 'eq-3']
  },
  {
    id: 'safety',
    name: '安全篇',
    icon: '🛡️',
    description: '安全第一，享受观鸟乐趣',
    order: 2,
    levels: ['sf-1', 'sf-2', 'sf-3']
  },
  {
    id: 'behavior',
    name: '行为篇',
    icon: '🍃',
    description: '文明观鸟，尊重自然',
    order: 3,
    levels: ['bh-1', 'bh-2', 'bh-3']
  },
  {
    id: 'advanced',
    name: '进阶篇',
    icon: '✈️',
    description: '科学观鸟，记录分享',
    order: 4,
    levels: ['ad-1', 'ad-2', 'ad-3']
  }
];

const LEVELS = [
  // 装备篇
  {
    id: 'eq-1',
    topicId: 'equipment',
    name: '选择合适的望远镜',
    order: 1,
    questions: [
      {
        id: 'eq-1-q1',
        type: 'choice',
        text: '观鸟时，望远镜放大倍率多少合适？',
        image: '/images/binoculars-choice.jpg',
        options: [
          { id: 'A', text: '5-8倍', isCorrect: true },
          { id: 'B', text: '20-30倍', isCorrect: false },
          { id: 'C', text: '50倍以上', isCorrect: false }
        ],
        explanation: '5-8倍最适合观鸟手持使用，视野大且稳定'
      },
      {
        id: 'eq-1-q2',
        type: 'sort',
        text: '将望远镜使用步骤按正确顺序排列',
        options: ['调整眼罩', '调节焦距', '对准目标', '取下镜头盖'],
        correctOrder: ['取下镜头盖', '调整眼罩', '对准目标', '调节焦距']
      },
      {
        id: 'eq-1-q3',
        type: 'fill',
        text: '填空：双筒望远镜最适合观鸟的放大倍率是___倍',
        correctAnswer: '8',
        alternatives: ['6', '7', '8', '10']
      }
    ]
  },
  {
    id: 'eq-2',
    topicId: 'equipment',
    name: '相机与镜头配置',
    order: 2,
    questions: [
      {
        id: 'eq-2-q1',
        type: 'choice',
        text: '观鸟摄影，以下哪种镜头最适合？',
        image: '/images/camera-lens.jpg',
        options: [
          { id: 'A', text: '70-200mm中焦', isCorrect: false },
          { id: 'B', text: '400mm以上超长焦', isCorrect: true },
          { id: 'C', text: '24-70mm标准变焦', isCorrect: false }
        ],
        explanation: '超长焦镜头能让你在安全距离外拍摄鸟类'
      },
      {
        id: 'eq-2-q2',
        type: 'choice',
        text: '拍摄飞鸟时，快门速度至少需要多少？',
        options: [
          { id: 'A', text: '1/125秒', isCorrect: false },
          { id: 'B', text: '1/500秒', isCorrect: true },
          { id: 'C', text: '1/30秒', isCorrect: false }
        ],
        explanation: '快速快门能定格飞鸟的瞬间'
      }
    ]
  },
  {
    id: 'eq-3',
    topicId: 'equipment',
    name: '穿着与随身装备',
    order: 3,
    questions: [
      {
        id: 'eq-3-q1',
        type: 'choice',
        text: '观鸟时，以下哪种穿着最合适？',
        image: '/images/clothing-choice.jpg',
        options: [
          { id: 'A', text: '色彩鲜艳的运动服', isCorrect: false },
          { id: 'B', text: '接近自然的迷彩或大地色系', isCorrect: true },
          { id: 'C', text: '纯白色的衣服', isCorrect: false }
        ],
        explanation: '自然色系服装能更好融入环境，不惊扰鸟类'
      }
    ]
  },
  // 安全篇
  {
    id: 'sf-1',
    topicId: 'safety',
    name: '天气与环境判断',
    order: 1,
    questions: [
      {
        id: 'sf-1-q1',
        type: 'choice',
        text: '以下哪种天气最适合观鸟？',
        options: [
          { id: 'A', text: '晴天正午', isCorrect: false },
          { id: 'B', text: '阴天清晨或傍晚', isCorrect: true },
          { id: 'C', text: '雨天', isCorrect: false }
        ],
        explanation: '阴天光线柔和，清晨傍晚鸟类活跃'
      }
    ]
  },
  {
    id: 'sf-2',
    topicId: 'safety',
    name: '安全出行要点',
    order: 2,
    questions: [
      {
        id: 'sf-2-q1',
        type: 'choice',
        text: '观鸟时，以下哪项是必须注意的？',
        options: [
          { id: 'A', text: '一个人去偏远地点', isCorrect: false },
          { id: 'B', text: '提前告知行程和同伴', isCorrect: true },
          { id: 'C', text: '带零食边吃边观鸟', isCorrect: false }
        ],
        explanation: '告知行程确保安全，万一出事有人知道'
      }
    ]
  },
  {
    id: 'sf-3',
    topicId: 'safety',
    name: '紧急情况应对',
    order: 3,
    questions: [
      {
        id: 'sf-3-q1',
        type: 'fill',
        text: '观鸟时遇到紧急情况拨打的电话是___',
        correctAnswer: '120',
        alternatives: ['120', '110', '119']
      }
    ]
  },
  // 行为篇
  {
    id: 'bh-1',
    topicId: 'behavior',
    name: '保持安静与距离',
    order: 1,
    questions: [
      {
        id: 'bh-1-q1',
        type: 'choice',
        text: '观鸟时与鸟类保持多少距离最合适？',
        options: [
          { id: 'A', text: '越近越好，能看得更清楚', isCorrect: false },
          { id: 'B', text: '保持不干扰鸟类的安全距离', isCorrect: true },
          { id: 'C', text: '50米以外', isCorrect: false }
        ],
        explanation: '保持安全距离，避免干扰鸟类正常行为'
      }
    ]
  },
  {
    id: 'bh-2',
    topicId: 'behavior',
    name: '不干扰鸟类生活',
    order: 2,
    questions: [
      {
        id: 'bh-2-q1',
        type: 'choice',
        text: '发现鸟巢后，正确的做法是？',
        options: [
          { id: 'A', text: '靠近拍摄获得好角度', isCorrect: false },
          { id: 'B', text: '保持距离，不要打扰', isCorrect: true },
          { id: 'C', text: '每天都去观察', isCorrect: false }
        ],
        explanation: '接近鸟巢会惊吓成鸟，可能导致弃巢'
      }
    ]
  },
  {
    id: 'bh-3',
    topicId: 'behavior',
    name: '保护环境与垃圾分类',
    order: 3,
    questions: [
      {
        id: 'bh-3-q1',
        type: 'choice',
        text: '观鸟结束后，以下哪种行为是正确的？',
        options: [
          { id: 'A', text: '留下食物残渣', isCorrect: false },
          { id: 'B', text: '将垃圾带走分类处理', isCorrect: true },
          { id: 'C', text: '随手丢弃空水瓶', isCorrect: false }
        ],
        explanation: '保护环境，不留痕迹'
      }
    ]
  },
  // 进阶篇
  {
    id: 'ad-1',
    topicId: 'advanced',
    name: '科学记录方法',
    order: 1,
    questions: [
      {
        id: 'ad-1-q1',
        type: 'sort',
        text: '将科学观鸟记录步骤按正确顺序排列',
        options: ['拍照记录', '记录时间地点', '观察特征', '记录天气环境'],
        correctOrder: ['记录时间地点', '记录天气环境', '观察特征', '拍照记录']
      }
    ]
  },
  {
    id: 'ad-2',
    topicId: 'advanced',
    name: '知识分享规范',
    order: 2,
    questions: [
      {
        id: 'ad-2-q1',
        type: 'choice',
        text: '在社交平台分享鸟类照片时，最重要的是？',
        options: [
          { id: 'A', text: '炫耀设备', isCorrect: false },
          { id: 'B', text: '标注正确的鸟种名称', isCorrect: true },
          { id: 'C', text: '显示定位吸引更多人', isCorrect: false }
        ],
        explanation: '正确标注鸟种名称有助于知识传播'
      }
    ]
  },
  {
    id: 'ad-3',
    topicId: 'advanced',
    name: '团队协作观鸟',
    order: 3,
    questions: [
      {
        id: 'ad-3-q1',
        type: 'fill',
        text: '团队观鸟时，使用___信号来指示鸟类的方向',
        correctAnswer: '手势',
        alternatives: ['手势', '指', '激光笔']
      }
    ]
  }
];

const STORAGE_KEY = 'birding-school-progress';

// 获取所有主题
function getTopics() {
  return TOPICS.map(topic => {
    const progress = getProgress();
    const levels = getLevelsByTopicId(topic.id);
    const completedCount = levels.filter(l => progress.completedLevels.includes(l.id)).length;
    return {
      ...topic,
      status: getTopicStatus(topic.id, progress),
      completedLevels: completedCount,
      totalLevels: levels.length
    };
  });
}

// 获取主题状态
function getTopicStatus(topicId, progress) {
  const levels = getLevelsByTopicId(topicId);
  const firstLocked = levels.find(l => !progress.completedLevels.includes(l.id) && !progress.unlockedLevels.includes(l.id));

  if (!firstLocked) return 'completed';
  if (progress.unlockedLevels.includes(levels[0].id)) return 'unlocked';
  return 'locked';
}

// 获取主题下的关卡
function getLevelsByTopicId(topicId) {
  return LEVELS.filter(l => l.topicId === topicId).sort((a, b) => a.order - b.order);
}

// 根据ID获取关卡
function getLevelById(levelId) {
  return LEVELS.find(l => l.id === levelId) || {};
}

// 获取主题
function getTopicById(topicId) {
  return TOPICS.find(t => t.id === topicId) || {};
}

// 获取关卡的题目
function getQuestionsByLevelId(levelId) {
  const level = getLevelById(levelId);
  return level.questions || [];
}

// 计算分数
function calculateScore(levelId, answers) {
  const level = getLevelById(levelId);
  let correct = 0;

  level.questions.forEach((q, i) => {
    if (q.type === 'choice') {
      const selected = answers[i];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selected === correctOption.id) correct++;
    } else if (q.type === 'sort') {
      const answerOrder = answers[i];
      if (JSON.stringify(answerOrder) === JSON.stringify(q.correctOrder)) correct++;
    } else if (q.type === 'fill') {
      if (answers[i].toLowerCase() === q.correctAnswer.toLowerCase()) correct++;
    }
  });

  return correct;
}

// 获取下一个关卡
function getNextLevel(topicId, currentOrder) {
  const levels = getLevelsByTopicId(topicId);
  return levels.find(l => l.order === currentOrder + 1) || null;
}

// 完成关卡
function completeLevel(levelId, score) {
  const progress = getProgress();

  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
    progress.totalScore += score * 10;

    // 解锁下一个关卡
    const level = getLevelById(levelId);
    const nextLevel = getNextLevel(level.topicId, level.order);
    if (nextLevel && !progress.unlockedLevels.includes(nextLevel.id)) {
      progress.unlockedLevels.push(nextLevel.id);
    }

    // 解锁主题徽章
    const topic = getTopicById(level.topicId);
    const topicLevels = getLevelsByTopicId(level.topicId);
    const allCompleted = topicLevels.every(l => progress.completedLevels.includes(l.id));
    if (allCompleted && !progress.badges.includes(`${level.topicId}-master`)) {
      progress.badges.push(`${level.topicId}-master`);
    }

    saveProgress(progress);
  }

  return progress;
}

// 获取用户进度
function getProgress() {
  const defaultProgress = {
    completedLevels: [],
    unlockedLevels: ['eq-1'], // 第一关默认解锁
    badges: [],
    titles: [],
    totalScore: 0
  };

  try {
    const stored = wx.getStorageSync(STORAGE_KEY);
    return stored ? { ...defaultProgress, ...stored } : defaultProgress;
  } catch (e) {
    return defaultProgress;
  }
}

// 保存用户进度
function saveProgress(progress) {
  wx.setStorageSync(STORAGE_KEY, progress);
}

module.exports = {
  getTopics,
  getTopicById,
  getLevelsByTopicId,
  getLevelById,
  getQuestionsByLevelId,
  getNextLevel,
  calculateScore,
  completeLevel,
  getProgress,
  TOPICS,
  LEVELS
};
```

- [ ] **Step 2: 测试数据层**

运行小程序，检查数据是否正确加载。

- [ ] **Step 3: Commit**

```bash
git add miniprogram/utils/school-data.js
git commit -m "feat: implement school data layer with 12 levels and questions"
```

---

## Task 3: 闯关组件（题目类型）

**Files:**
- Modify: `miniprogram/components/quiz-choice/quiz-choice.js`
- Modify: `miniprogram/components/quiz-choice/quiz-choice.wxml`
- Modify: `miniprogram/components/quiz-choice/quiz-choice.wxss`
- Modify: `miniprogram/components/quiz-sort/quiz-sort.js`
- Modify: `miniprogram/components/quiz-sort/quiz-sort.wxml`
- Modify: `miniprogram/components/quiz-sort/quiz-sort.wxss`
- Modify: `miniprogram/components/quiz-fill/quiz-fill.js`
- Modify: `miniprogram/components/quiz-fill/quiz-fill.wxml`
- Modify: `miniprogram/components/quiz-fill/quiz-fill.wxss`

**Steps:**
- [ ] **Step 1: 实现选择题组件**

`quiz-choice.js`:
```javascript
// miniprogram/components/quiz-choice/quiz-choice.js
Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    selectedOption: null,
    answered: false,
    showExplanation: false
  },

  methods: {
    onOptionTap(e) {
      if (this.data.answered) return;
      const { option } = e.currentTarget.dataset;
      this.setData({
        selectedOption: option,
        answered: true,
        showExplanation: true
      });
    },

    onNext() {
      this.triggerEvent('answer', {
        answer: this.data.selectedOption
      });
      this.reset();
    },

    reset() {
      this.setData({
        selectedOption: null,
        answered: false,
        showExplanation: false
      });
    }
  }
});
```

`quiz-choice.wxml`:
```xml
<!-- miniprogram/components/quiz-choice/quiz-choice.wxml -->
<view class="quiz-choice">
  <view class="options">
    <view
      wx:for="{{question.options}}"
      wx:key="id"
      class="option {{selectedOption === item.id ? (item.isCorrect ? 'correct' : 'wrong') : ''}} {{answered && item.isCorrect ? 'correct' : ''}}"
      bindtap="onOptionTap"
      data-option="{{item.id}}"
    >
      <text class="option-id">{{item.id}}</text>
      <text class="option-text">{{item.text}}</text>
      <text wx:if="{{answered && item.isCorrect}}" class="result-icon">✓</text>
      <text wx:if="{{answered && selectedOption === item.id && !item.isCorrect}}" class="result-icon">✗</text>
    </view>
  </view>

  <view class="explanation" wx:if="{{showExplanation && question.explanation}}">
    <text class="explanation-text">{{question.explanation}}</text>
  </view>

  <button class="next-btn" wx:if="{{answered}}" bindtap="onNext">下一题</button>
</view>
```

`quiz-choice.wxss`:
```css
/* miniprogram/components/quiz-choice/quiz-choice.wxss */
.quiz-choice {
  margin-top: 30rpx;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.option {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  border: 3rpx solid transparent;
}

.option-id {
  width: 50rpx;
  height: 50rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.result-icon {
  font-size: 32rpx;
  margin-left: 20rpx;
}

.option.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}

.option.wrong {
  background: #ffebee;
  border-color: #f44336;
}

.explanation {
  margin-top: 30rpx;
  padding: 24rpx;
  background: #fff8e1;
  border-radius: 12rpx;
}

.explanation-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.next-btn {
  margin-top: 40rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 40rpx;
  padding: 20rpx 60rpx;
  width: 100%;
}
```

- [ ] **Step 2: 实现排序题组件**

`quiz-sort.js`:
```javascript
// miniprogram/components/quiz-sort/quiz-sort.js
Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    options: [],
    locked: false
  },

  lifetimes: {
    attached() {
      this.initOptions();
    }
  },

  methods: {
    initOptions() {
      const shuffled = [...this.data.question.options].sort(() => Math.random() - 0.5);
      this.setData({
        options: shuffled.map((text, index) => ({ id: index, text, locked: false }))
      });
    },

    onItemTap(e) {
      if (this.data.locked) return;
      const { index } = e.currentTarget.dataset;
      const { options } = this.data;

      // 找到未选中的项目移到末尾
      const item = options[index];
      const newOptions = options.filter((_, i) => i !== index);
      newOptions.push(item);

      this.setData({ options: newOptions });
    },

    onLock() {
      this.setData({ locked: true });
    },

    onConfirm() {
      const { options, question } = this.data;
      const answer = options.map(o => o.text);
      this.triggerEvent('answer', { answer });
      this.initOptions();
      this.setData({ locked: false });
    },

    onNext() {
      const { options, question } = this.data;
      const answer = options.map(o => o.text);
      this.triggerEvent('answer', { answer });
      this.initOptions();
      this.setData({ locked: false });
    }
  }
});
```

`quiz-sort.wxml`:
```xml
<!-- miniprogram/components/quiz-sort/quiz-sort.wxml -->
<view class="quiz-sort">
  <text class="instruction">点击项目调整顺序，确认后点击锁定</text>

  <view class="sort-list">
    <view
      wx:for="{{options}}"
      wx:key="id"
      class="sort-item {{item.locked ? 'locked' : ''}}"
      bindtap="onItemTap"
      data-index="{{index}}"
    >
      <text class="sort-number">{{index + 1}}</text>
      <text class="sort-text">{{item.text}}</text>
      <text class="drag-hint">↑↓</text>
    </view>
  </view>

  <button class="lock-btn" wx:if="{{!locked}}" bindtap="onLock">确认顺序</button>
  <button class="next-btn" wx:if="{{locked}}" bindtap="onNext">下一题</button>
</view>
```

`quiz-sort.wxss`:
```css
/* miniprogram/components/quiz-sort/quiz-sort.wxss */
.quiz-sort {
  margin-top: 30rpx;
}

.instruction {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 20rpx;
  display: block;
}

.sort-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sort-item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  border: 2rpx solid #ddd;
}

.sort-item.locked {
  background: #e8f5e9;
  border-color: #4caf50;
}

.sort-number {
  width: 44rpx;
  height: 44rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.sort-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.drag-hint {
  color: #aaa;
  font-size: 24rpx;
}

.lock-btn, .next-btn {
  margin-top: 30rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 40rpx;
  width: 100%;
}
```

- [ ] **Step 3: 实现补全题组件**

`quiz-fill.js`:
```javascript
// miniprogram/components/quiz-fill/quiz-fill.js
Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    inputValue: '',
    answered: false,
    isCorrect: false
  },

  methods: {
    onInput(e) {
      if (this.data.answered) return;
      this.setData({ inputValue: e.detail.value });
    },

    onConfirm() {
      const { inputValue, question } = this.data;
      if (!inputValue.trim()) return;

      const isCorrect = question.alternatives
        ? question.alternatives.includes(inputValue.trim())
        : inputValue.trim().toLowerCase() === question.correctAnswer.toLowerCase();

      this.setData({
        answered: true,
        isCorrect
      });
    },

    onNext() {
      const answer = this.data.inputValue.trim();
      this.triggerEvent('answer', { answer });
      this.reset();
    },

    reset() {
      this.setData({
        inputValue: '',
        answered: false,
        isCorrect: false
      });
    }
  }
});
```

`quiz-fill.wxml`:
```xml
<!-- miniprogram/components/quiz-fill/quiz-fill.wxml -->
<view class="quiz-fill">
  <view class="input-wrapper {{answered ? (isCorrect ? 'correct' : 'wrong') : ''}}">
    <input
      class="fill-input"
      value="{{inputValue}}"
      placeholder="请输入答案"
      bindinput="onInput"
      disabled="{{answered}}"
    />
    <text wx:if="{{answered && isCorrect}}" class="result-badge correct">✓</text>
    <text wx:if="{{answered && !isCorrect}}" class="result-badge wrong">✗</text>
  </view>

  <view class="feedback" wx:if="{{answered}}">
    <text class="correct-answer" wx:if="{{!isCorrect}}">正确答案：{{question.correctAnswer}}</text>
  </view>

  <button class="confirm-btn" wx:if="{{!answered}}" bindtap="onConfirm">确认</button>
  <button class="next-btn" wx:if="{{answered}}" bindtap="onNext">下一题</button>
</view>
```

`quiz-fill.wxss`:
```css
/* miniprogram/components/quiz-fill/quiz-fill.wxss */
.quiz-fill {
  margin-top: 30rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 0 24rpx;
  border: 3rpx solid transparent;
}

.input-wrapper.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}

.input-wrapper.wrong {
  background: #ffebee;
  border-color: #f44336;
}

.fill-input {
  flex: 1;
  height: 80rpx;
  font-size: 32rpx;
}

.result-badge {
  font-size: 36rpx;
  margin-left: 16rpx;
}

.correct-answer {
  font-size: 26rpx;
  color: #666;
  margin-top: 16rpx;
  display: block;
}

.confirm-btn, .next-btn {
  margin-top: 30rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 40rpx;
  width: 100%;
}
```

- [ ] **Step 4: Commit**

```bash
git add miniprogram/components/quiz-choice/ miniprogram/components/quiz-sort/ miniprogram/components/quiz-fill/
git commit -m "feat: implement quiz components (choice, sort, fill)"
```

---

## Task 4: 站点和关卡卡片组件

**Files:**
- Modify: `miniprogram/components/topic-card/topic-card.js`
- Modify: `miniprogram/components/topic-card/topic-card.wxml`
- Modify: `miniprogram/components/topic-card/topic-card.wxss`
- Modify: `miniprogram/components/level-card/level-card.js`
- Modify: `miniprogram/components/level-card/level-card.wxml`
- Modify: `miniprogram/components/level-card/level-card.wxss`

**Steps:**
- [ ] **Step 1: 实现站点卡片组件**

`topic-card.js`:
```javascript
// miniprogram/components/topic-card/topic-card.js
Component({
  properties: {
    topic: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('topicTap', { topicId: this.data.topic.id });
    }
  }
});
```

`topic-card.wxml`:
```xml
<!-- miniprogram/components/topic-card/topic-card.wxml -->
<view class="topic-card status-{{topic.status}}" bindtap="onTap">
  <view class="topic-icon">{{topic.icon}}</view>
  <view class="topic-info">
    <text class="topic-name">{{topic.name}}</text>
    <text class="topic-progress">{{topic.completedLevels}}/{{topic.totalLevels}} 关卡</text>
  </view>
  <view class="topic-status-icon">
    <text wx:if="{{topic.status === 'locked'}}">🔒</text>
    <text wx:if="{{topic.status === 'unlocked'}}">⭐</text>
    <text wx:if="{{topic.status === 'completed'}}">✓</text>
  </view>
</view>
```

`topic-card.wxss`:
```css
/* miniprogram/components/topic-card/topic-card.wxss */
.topic-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #e0e0e0;
}

.topic-card.locked {
  opacity: 0.6;
}

.topic-card.unlocked {
  border-color: #ffc107;
}

.topic-card.completed {
  border-color: #4caf50;
}

.topic-icon {
  font-size: 60rpx;
  margin-right: 30rpx;
}

.topic-info {
  flex: 1;
}

.topic-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.topic-progress {
  font-size: 24rpx;
  color: #888;
  margin-top: 8rpx;
  display: block;
}

.topic-status-icon {
  font-size: 40rpx;
}
```

- [ ] **Step 2: 实现关卡卡片组件**

`level-card.js`:
```javascript
// miniprogram/components/level-card/level-card.js
Component({
  properties: {
    level: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      if (this.data.level.unlocked) {
        this.triggerEvent('levelTap', { levelId: this.data.level.id });
      }
    }
  }
});
```

`level-card.wxml`:
```xml
<!-- miniprogram/components/level-card/level-card.wxml -->
<view class="level-card {{level.unlocked ? 'unlocked' : 'locked'}}">
  <view class="level-number">{{level.order}}</view>
  <view class="level-info">
    <text class="level-name">{{level.name}}</text>
    <text class="level-count">{{level.questions.length}} 题</text>
  </view>
  <view class="level-status-icon">
    <text wx:if="{{!level.unlocked}}">🔒</text>
    <text wx:if="{{level.unlocked && !level.completed}}">▶</text>
    <text wx:if="{{level.completed}}">✓</text>
  </view>
</view>
```

`level-card.wxss`:
```css
/* miniprogram/components/level-card/level-card.wxss */
.level-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid #e0e0e0;
}

.level-card.locked {
  opacity: 0.5;
}

.level-card.unlocked {
  border-color: #2e8b57;
}

.level-number {
  width: 60rpx;
  height: 60rpx;
  background: #2e8b57;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 28rpx;
  color: #333;
  display: block;
  font-weight: 500;
}

.level-count {
  font-size: 22rpx;
  color: #888;
  margin-top: 6rpx;
  display: block;
}

.level-status-icon {
  font-size: 32rpx;
  color: #2e8b57;
}
```

- [ ] **Step 3: Commit**

```bash
git add miniprogram/components/topic-card/ miniprogram/components/level-card/
git commit -m "feat: implement topic and level card components"
```

---

## Task 5: 地图组件

**Files:**
- Modify: `miniprogram/components/progress-map/progress-map.js`
- Modify: `miniprogram/components/progress-map/progress-map.wxml`
- Modify: `miniprogram/components/progress-map/progress-map.wxss`

**Steps:**
- [ ] **Step 1: 实现地图组件**

`progress-map.js`:
```javascript
// miniprogram/components/progress-map/progress-map.js
Component({
  properties: {
    topics: {
      type: Array,
      value: []
    }
  },

  data: {
    mapStyle: 'width: 100%; height: 600rpx;'
  },

  methods: {
    onTopicTap(e) {
      const { topicId } = e.currentTarget.dataset;
      this.triggerEvent('topicTap', { topicId });
    }
  }
});
```

`progress-map.wxml`:
```xml
<!-- miniprogram/components/progress-map/progress-map.wxml -->
<view class="progress-map">
  <view class="map-background">
    <!-- 手绘风格背景装饰 -->
    <view class="bg-path"></view>
  </view>

  <view class="topics-container">
    <view
      wx:for="{{topics}}"
      wx:key="id"
      class="topic-node status-{{item.status}}"
      bindtap="onTopicTap"
      data-topic-id="{{item.id}}"
      style="top: {{item.position.top}}rpx; left: {{item.position.left}}rpx;"
    >
      <view class="node-icon">{{item.icon}}</view>
      <view class="node-label">{{item.name}}</view>
      <view class="node-badge" wx:if="{{item.status === 'locked'}}">🔒</view>
      <view class="node-badge" wx:if="{{item.status === 'unlocked'}}">⭐</view>
      <view class="node-badge" wx:if="{{item.status === 'completed'}}">✓</view>
    </view>

    <!-- 连接线 -->
    <view class="connection-lines">
      <view class="line line-1"></view>
      <view class="line line-2"></view>
      <view class="line line-3"></view>
    </view>
  </view>

  <view class="progress-info">
    <text class="total-progress">已完成 {{completedCount}} / {{totalCount}} 个主题</text>
  </view>
</view>
```

`progress-map.wxss`:
```css
/* miniprogram/components/progress-map/progress-map.wxss */
.progress-map {
  position: relative;
  width: 100%;
  min-height: 800rpx;
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 24rpx;
  overflow: hidden;
  padding: 40rpx 20rpx;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.bg-path {
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800"><path d="M50 400 Q200 200 350 400 T200 700" stroke="%232e8b57" fill="none" stroke-width="3" stroke-dasharray="10,10"/></svg>') no-repeat center;
  background-size: cover;
}

.topics-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80rpx;
  padding-top: 60rpx;
}

.topic-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
  width: 280rpx;
  position: relative;
}

.topic-node.locked {
  opacity: 0.6;
  filter: grayscale(50%);
}

.topic-node.unlocked {
  border: 4rpx solid #ffc107;
}

.topic-node.completed {
  border: 4rpx solid #4caf50;
}

.node-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.node-label {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.node-badge {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  font-size: 40rpx;
  background: #fff;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.15);
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.line {
  position: absolute;
  width: 4rpx;
  background: #2e8b57;
  opacity: 0.3;
}

.line-1 { top: 200rpx; left: 50%; height: 120rpx; }
.line-2 { top: 400rpx; left: 50%; height: 120rpx; }
.line-3 { top: 600rpx; left: 50%; height: 120rpx; }

.progress-info {
  margin-top: 60rpx;
  text-align: center;
}

.total-progress {
  font-size: 26rpx;
  color: #666;
}
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/components/progress-map/
git commit -m "feat: implement progress map component"
```

---

## Task 6: 学堂首页

**Files:**
- Modify: `miniprogram/pages/birding-school/school-home/school-home.js`
- Modify: `miniprogram/pages/birding-school/school-home/school-home.wxml`
- Modify: `miniprogram/pages/birding-school/school-home/school-home.wxss`

**Steps:**
- [ ] **Step 1: 更新学堂首页**

`school-home.js`:
```javascript
// miniprogram/pages/birding-school/school-home/school-home.js
const schoolData = require('../../../utils/school-data');

Page({
  data: {
    topics: [],
    totalCompleted: 0,
    totalTopics: 0
  },

  onLoad() {
    this.loadTopics();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadTopics();
  },

  loadTopics() {
    const topics = schoolData.getTopics();
    const progress = schoolData.getProgress();

    const completedTopics = topics.filter(t => t.status === 'completed').length;

    this.setData({
      topics: topics.map(t => ({
        ...t,
        position: this.getTopicPosition(t.order)
      })),
      totalCompleted: completedTopics,
      totalTopics: topics.length
    });
  },

  getTopicPosition(order) {
    // 为4个主题设置位置
    const positions = [
      { top: 80, left: 60 },
      { top: 280, left: 280 },
      { top: 480, left: 60 },
      { top: 680, left: 280 }
    ];
    return positions[order - 1] || { top: 80, left: 60 };
  },

  onTopicTap(e) {
    const { topicId } = e.detail;
    const topic = this.data.topics.find(t => t.id === topicId);

    if (topic.status === 'locked') {
      wx.showToast({
        title: '请先完成前一主题',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/birding-school/topic-detail/topic-detail?topicId=${topicId}`
    });
  }
});
```

- [ ] **Step 2: 更新WXML和WXSS**

`school-home.wxml`:
```xml
<!-- miniprogram/pages/birding-school/school-home/school-home.wxml -->
<view class="container">
  <view class="header">
    <text class="title">观鸟学堂</text>
    <text class="subtitle">与自然相处的正确价值观</text>
    <view class="progress-badge">
      <text class="progress-text">{{totalCompleted}}/{{totalTopics}} 主题已完成</text>
    </view>
  </view>

  <progress-map topics="{{topics}}" bind:topicTap="onTopicTap" />

  <view class="tip-section">
    <text class="tip-text">💡 完成所有主题可解锁"观鸟学者"称号</text>
  </view>
</view>
```

`school-home.wxss`:
```css
/* miniprogram/pages/birding-school/school-home/school-home.wxss */
.container {
  padding: 20rpx;
  background: #f0f8f4;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 30rpx 0;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #2e8b57;
  display: block;
}

.subtitle {
  font-size: 26rpx;
  color: #666;
  margin-top: 10rpx;
  display: block;
}

.progress-badge {
  margin-top: 20rpx;
  display: inline-block;
  background: #fff;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.progress-text {
  font-size: 24rpx;
  color: #2e8b57;
  font-weight: 500;
}

.tip-section {
  margin-top: 40rpx;
  text-align: center;
}

.tip-text {
  font-size: 24rpx;
  color: #888;
}
```

- [ ] **Step 3: Commit**

```bash
git add miniprogram/pages/birding-school/school-home/
git commit -m "feat: implement school home page"
```

---

## Task 7: 主题详情页

**Files:**
- Modify: `miniprogram/pages/birding-school/topic-detail/topic-detail.js`
- Modify: `miniprogram/pages/birding-school/topic-detail/topic-detail.wxml`
- Modify: `miniprogram/pages/birding-school/topic-detail/topic-detail.wxss`

**Steps:**
- [ ] **Step 1: 更新主题详情页**

`topic-detail.js`:
```javascript
// miniprogram/pages/birding-school/topic-detail/topic-detail.js
const schoolData = require('../../../utils/school-data');

Page({
  data: {
    topic: {},
    levels: []
  },

  onLoad(options) {
    const { topicId } = options;
    this.loadTopic(topicId);
  },

  onShow() {
    // 刷新关卡状态
    if (this.data.topic.id) {
      this.loadTopic(this.data.topic.id);
    }
  },

  loadTopic(topicId) {
    const topic = schoolData.getTopicById(topicId);
    const allLevels = schoolData.getLevelsByTopicId(topicId);
    const progress = schoolData.getProgress();

    const levels = allLevels.map((level, index) => {
      const isUnlocked = index === 0 || progress.completedLevels.includes(allLevels[index - 1].id);
      return {
        ...level,
        unlocked: isUnlocked,
        completed: progress.completedLevels.includes(level.id)
      };
    });

    wx.setNavigationBarTitle({
      title: topic.name
    });

    this.setData({
      topic: { ...topic, icon: this.getTopicEmoji(topic.id) },
      levels
    });
  },

  getTopicEmoji(topicId) {
    const emojis = {
      'equipment': '🔭',
      'safety': '🛡️',
      'behavior': '🍃',
      'advanced': '✈️'
    };
    return emojis[topicId] || '📚';
  },

  onLevelTap(e) {
    const { levelId } = e.detail;
    const level = this.data.levels.find(l => l.id === levelId);

    if (!level.unlocked) {
      wx.showToast({
        title: '请先完成上一关',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/birding-school/level-detail/level-detail?levelId=${levelId}`
    });
  }
});
```

`topic-detail.wxml`:
```xml
<!-- miniprogram/pages/birding-school/topic-detail/topic-detail.wxml -->
<view class="container">
  <view class="topic-header">
    <text class="topic-icon">{{topic.icon}}</text>
    <view class="topic-info">
      <text class="topic-name">{{topic.name}}</text>
      <text class="topic-desc">{{topic.description}}</text>
    </view>
  </view>

  <view class="levels-section">
    <text class="section-title">关卡列表</text>
    <view class="levels-list">
      <level-card
        wx:for="{{levels}}"
        wx:key="id"
        level="{{item}}"
        bind:levelTap="onLevelTap"
      />
    </view>
  </view>

  <view class="reward-section">
    <text class="reward-title">🎁 主题奖励</text>
    <text class="reward-desc">完成全部关卡解锁 "{{topic.name}}达人" 徽章</text>
  </view>
</view>
```

`topic-detail.wxss`:
```css
/* miniprogram/pages/birding-school/topic-detail/topic-detail.wxss */
.container {
  padding: 20rpx;
  background: #f0f8f4;
  min-height: 100vh;
}

.topic-header {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.topic-icon {
  font-size: 80rpx;
  margin-right: 30rpx;
}

.topic-info {
  flex: 1;
}

.topic-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #2e8b57;
  display: block;
}

.topic-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.levels-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.reward-section {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
  border-radius: 20rpx;
  padding: 30rpx;
  text-align: center;
}

.reward-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #f57c00;
  display: block;
  margin-bottom: 10rpx;
}

.reward-desc {
  font-size: 24rpx;
  color: #666;
}
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/birding-school/topic-detail/
git commit -m "feat: implement topic detail page"
```

---

## Task 8: 关卡互动页

**Files:**
- Modify: `miniprogram/pages/birding-school/level-detail/level-detail.js`
- Modify: `miniprogram/pages/birding-school/level-detail/level-detail.wxml`
- Modify: `miniprogram/pages/birding-school/level-detail/level-detail.wxss`

**Steps:**
- [ ] **Step 1: 更新关卡互动页**

`level-detail.js`:
```javascript
// miniprogram/pages/birding-school/level-detail/level-detail.js
const schoolData = require('../../../utils/school-data');

Page({
  data: {
    level: {},
    topic: {},
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    completed: false,
    correctCount: 0,
    showBadge: false
  },

  onLoad(options) {
    const { levelId } = options;
    this.loadLevel(levelId);
  },

  loadLevel(levelId) {
    const level = schoolData.getLevelById(levelId);
    const topic = schoolData.getTopicById(level.topicId);
    const questions = schoolData.getQuestionsByLevelId(levelId);

    wx.setNavigationBarTitle({
      title: level.name
    });

    this.setData({
      level,
      topic,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      completed: false
    });
  },

  onQuestionAnswer(e) {
    const { answer } = e.detail;
    const { currentQuestionIndex, answers, questions } = this.data;

    answers.push(answer);
    this.setData({ answers });

    if (currentQuestionIndex < questions.length - 1) {
      // 延迟切换到下一题，让用户看到反馈
      setTimeout(() => {
        this.setData({
          currentQuestionIndex: currentQuestionIndex + 1
        });
      }, 800);
    } else {
      // 所有题目完成
      setTimeout(() => {
        this.completeLevel();
      }, 800);
    }
  },

  completeLevel() {
    const { levelId, answers, questions } = this.data;

    // 计算分数
    const correctCount = schoolData.calculateScore(levelId, answers);

    // 更新进度
    const progress = schoolData.completeLevel(levelId, correctCount);

    // 检查是否解锁主题徽章
    const topicLevels = schoolData.getLevelsByTopicId(this.data.level.topicId);
    const allCompleted = topicLevels.every(l => progress.completedLevels.includes(l.id));
    const showBadge = allCompleted;

    this.setData({
      completed: true,
      correctCount,
      showBadge,
      totalScore: progress.totalScore
    });
  },

  goToNextLevel() {
    const { level } = this.data;
    const nextLevel = schoolData.getNextLevel(level.topicId, level.order);

    if (nextLevel) {
      wx.redirectTo({
        url: `/pages/birding-school/level-detail/level-detail?levelId=${nextLevel.id}`
      });
    } else {
      // 所有关卡完成，返回主题页
      wx.redirectTo({
        url: `/pages/birding-school/topic-detail/topic-detail?topicId=${level.topicId}`
      });
    }
  },

  goToTopic() {
    wx.redirectTo({
      url: `/pages/birding-school/topic-detail/topic-detail?topicId=${this.data.level.topicId}`
    });
  }
});
```

`level-detail.wxml`:
```xml
<!-- miniprogram/pages/birding-school/level-detail/level-detail.wxml -->
<view class="container">
  <!-- 关卡头部 -->
  <view class="level-header">
    <view class="level-info">
      <text class="level-name">{{level.name}}</text>
      <text class="topic-tag">{{topic.icon}} {{topic.name}}</text>
    </view>
    <view class="progress-indicator">
      <text class="progress-text">{{currentQuestionIndex + 1}} / {{questions.length}}</text>
    </view>
  </view>

  <!-- 题目区域 -->
  <view class="question-area" wx:if="{{!completed}}">
    <view class="question-card">
      <view class="guide-box">
        <text class="guide-text">📖 {{questions[currentQuestionIndex].text}}</text>
      </view>

      <image
        wx:if="{{questions[currentQuestionIndex].image}}"
        class="question-image"
        src="{{questions[currentQuestionIndex].image}}"
        mode="aspectFit"
        binderror="onImageError"
      />

      <!-- 选择题 -->
      <quiz-choice
        wx:if="{{questions[currentQuestionIndex].type === 'choice'}}"
        question="{{questions[currentQuestionIndex]}}"
        bind:answer="onQuestionAnswer"
      />

      <!-- 排序题 -->
      <quiz-sort
        wx:if="{{questions[currentQuestionIndex].type === 'sort'}}"
        question="{{questions[currentQuestionIndex]}}"
        bind:answer="onQuestionAnswer"
      />

      <!-- 补全题 -->
      <quiz-fill
        wx:if="{{questions[currentQuestionIndex].type === 'fill'}}"
        question="{{questions[currentQuestionIndex]}}"
        bind:answer="onQuestionAnswer"
      />
    </view>
  </view>

  <!-- 完成页面 -->
  <view class="complete-area" wx:if="{{completed}}">
    <view class="complete-card">
      <text class="complete-icon">🎉</text>
      <text class="complete-title">关卡完成！</text>
      <view class="score-display">
        <text class="score-label">答对</text>
        <text class="score-number">{{correctCount}}</text>
        <text class="score-total">/ {{questions.length}} 题</text>
      </view>

      <view class="badge-unlock" wx:if="{{showBadge}}">
        <text class="badge-text">🏅 获得主题徽章！</text>
      </view>

      <view class="complete-actions">
        <button class="action-btn primary" bindtap="goToNextLevel">
          {{topic.id ? '继续下一关' : '返回主题'}}
        </button>
        <button class="action-btn secondary" bindtap="goToTopic">查看主题进度</button>
      </view>
    </view>
  </view>
</view>
```

`level-detail.wxss`:
```css
/* miniprogram/pages/birding-school/level-detail/level-detail.wxss */
.container {
  padding: 20rpx;
  background: #f0f8f4;
  min-height: 100vh;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.level-info {
  display: flex;
  flex-direction: column;
}

.level-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.topic-tag {
  font-size: 22rpx;
  color: #888;
  margin-top: 6rpx;
}

.progress-indicator {
  background: #2e8b57;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
}

.question-area {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.question-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.guide-box {
  background: #e8f5e9;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.guide-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.question-image {
  width: 100%;
  height: 350rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.complete-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.complete-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  width: 100%;
}

.complete-icon {
  font-size: 100rpx;
  display: block;
  margin-bottom: 20rpx;
}

.complete-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #2e8b57;
  display: block;
  margin-bottom: 30rpx;
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 30rpx;
}

.score-label {
  font-size: 28rpx;
  color: #888;
}

.score-number {
  font-size: 60rpx;
  font-weight: bold;
  color: #2e8b57;
  margin: 0 10rpx;
}

.score-total {
  font-size: 28rpx;
  color: #888;
}

.badge-unlock {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
  padding: 20rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
}

.badge-text {
  font-size: 28rpx;
  color: #f57c00;
  font-weight: bold;
}

.complete-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-btn {
  border-radius: 40rpx;
  padding: 24rpx;
  font-size: 30rpx;
}

.action-btn.primary {
  background: #2e8b57;
  color: #fff;
}

.action-btn.secondary {
  background: #f5f5f5;
  color: #666;
}
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/birding-school/level-detail/
git commit -m "feat: implement level detail page with quiz interaction"
```

---

## Task 9: 首页入口集成

**Files:**
- Modify: `miniprogram/app.json`
- Modify: `miniprogram/pages/index/index.wxml`
- Modify: `miniprogram/pages/index/index.js`

**Steps:**
- [ ] **Step 1: 添加新页面到 app.json**

在 `pages` 数组中添加：
```json
"pages/birding-school/school-home/school-home",
"pages/birding-school/topic-detail/topic-detail",
"pages/birding-school/level-detail/level-detail"
```

- [ ] **Step 2: 在首页添加学堂入口**

在 `pages/index/index.wxml` 的底部导航区域添加按钮：

```xml
<view class="tab-bar">
  <!-- 现有tab -->
  <view class="tab-item" bindtap="switchTab" data-tab="index">
    <text class="tab-icon">🏠</text>
    <text class="tab-text">首页</text>
  </view>
  <view class="tab-item" bindtap="switchTab" data-tab="birding-school">
    <text class="tab-icon">📚</text>
    <text class="tab-text">观鸟学堂</text>
  </view>
  <view class="tab-item" bindtap="switchTab" data-tab="check-in">
    <text class="tab-icon">✅</text>
    <text class="tab-text">每日签到</text>
  </view>
  <view class="tab-item" bindtap="switchTab" data-tab="achievements">
    <text class="tab-icon">🏆</text>
    <text class="tab-text">成就</text>
  </view>
</view>
```

在 `index.js` 中添加跳转方法：
```javascript
switchTab(e) {
  const tab = e.currentTarget.dataset.tab;
  if (tab === 'birding-school') {
    wx.navigateTo({
      url: '/pages/birding-school/school-home/school-home'
    });
  } else if (tab === 'check-in') {
    wx.navigateTo({
      url: '/pages/activities/check-in/check-in'
    });
  } else if (tab === 'achievements') {
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    });
  }
}
```

- [ ] **Step 3: 更新 tab-bar 样式**

在 `pages/index/index.wxss` 中添加：
```css
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 0;
  background: #fff;
  border-top: 1rpx solid #e0e0e0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon {
  font-size: 40rpx;
}

.tab-text {
  font-size: 22rpx;
  margin-top: 8rpx;
}
```

- [ ] **Step 4: Commit**

```bash
git add miniprogram/app.json miniprogram/pages/index/
git commit -m "feat: integrate school entrance to home page"
```

---

## Task 10: 成就页面（与签到合并）

**Files:**
- Modify: `miniprogram/pages/activities/check-in.wxml`
- Modify: `miniprogram/pages/activities/check-in.js`

**Steps:**
- [ ] **Step 1: 在签到页面添加查看成就按钮（已存在），更新跳转到成就页**

`check-in.js` 的 `viewAchievements` 方法：
```javascript
viewAchievements() {
  wx.navigateTo({
    url: '/pages/achievements/achievements'
  });
}
```

- [ ] **Step 2: 更新成就页面**

创建/更新 `pages/achievements/achievements.js`：
```javascript
// miniprogram/pages/achievements/achievements.js
const schoolData = require('../../utils/school-data');

Page({
  data: {
    badges: [],
    titles: [],
    totalScore: 0,
    level: '',
    rank: ''
  },

  onLoad() {
    this.loadAchievements();
  },

  onShow() {
    this.loadAchievements();
  },

  loadAchievements() {
    const progress = schoolData.getProgress();

    // 徽章列表
    const badgeMap = {
      'equipment-master': { name: '装备达人', icon: '🔭', desc: '完成装备篇' },
      'safety-master': { name: '安全卫士', icon: '🛡️', desc: '完成安全篇' },
      'behavior-master': { name: '观鸟使者', icon: '🍃', desc: '完成行为篇' },
      'advanced-master': { name: '进阶专家', icon: '✈️', desc: '完成进阶篇' }
    };

    const badges = progress.badges.map(bid => badgeMap[bid] || { name: bid, icon: '🏅' });

    // 称号
    let title = '观鸟学徒';
    let level = 1;
    if (progress.completedLevels.length >= 12) {
      title = '观鸟大师';
      level = 4;
    } else if (progress.completedLevels.length >= 8) {
      title = '观鸟专家';
      level = 3;
    } else if (progress.completedLevels.length >= 4) {
      title = '观鸟学者';
      level = 2;
    }

    this.setData({
      badges,
      titles: [title],
      totalScore: progress.totalScore,
      level
    });
  },

  generatePoster() {
    // 生成海报的占位方法
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading'
    });
    // TODO: 实现海报生成
  }
});
```

- [ ] **Step 3: 更新成就页面 WXML**

```xml
<!-- miniprogram/pages/achievements/achievements.wxml -->
<view class="container">
  <view class="header">
    <text class="title">我的成就</text>
  </view>

  <view class="title-section">
    <text class="user-title">{{titles[0]}}</text>
    <text class="score">积分: {{totalScore}}</text>
  </view>

  <view class="badge-section">
    <text class="section-title">徽章墙</text>
    <view class="badge-grid">
      <view wx:for="{{badges}}" wx:key="name" class="badge-item">
        <text class="badge-icon">{{item.icon}}</text>
        <text class="badge-name">{{item.name}}</text>
      </view>
      <view wx:if="{{badges.length === 0}}" class="empty-badges">
        <text>完成关卡解锁徽章</text>
      </view>
    </view>
  </view>

  <button class="poster-btn" bindtap="generatePoster">生成成就海报</button>
</view>
```

- [ ] **Step 4: Commit**

```bash
git add miniprogram/pages/activities/check-in.js miniprogram/pages/achievements/
git commit -m "feat: integrate achievements with school progress"
```

---

## 验证清单

| 验证项 | 通过标准 |
|--------|----------|
| 地图视图显示 | 4个主题站点正确展示，状态正确 |
| 关卡解锁 | 按顺序解锁，线性流程正常 |
| 选择题 | 选项点击有反馈，显示正确/错误 |
| 排序题 | 可拖拽调整顺序，确认后锁定 |
| 补全题 | 输入答案，确认后显示对错 |
| 完成关卡 | 进度保存，徽章解锁 |
| 成就页面 | 徽章墙正确显示，海报按钮存在 |
| 首页入口 | 观鸟学堂入口可点击跳转 |

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-30-birding-school-implementation.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**