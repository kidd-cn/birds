/**
 * Bird-watching school data management utilities
 * Contains level data, question types, and progress management
 */

const STORAGE_KEY = 'birding-school-progress';

// ============================================================================
// TOPICS - 4 themes
// ============================================================================

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

// ============================================================================
// LEVELS - 12 levels (3 per topic)
// ============================================================================

const LEVELS = [
  // Equipment Topic Levels (eq-1, eq-2, eq-3)
  {
    id: 'eq-1',
    topicId: 'equipment',
    name: '望远镜的选择',
    order: 1,
    questions: [
      {
        id: 'eq-1-q1',
        type: 'choice',
        text: '观鸟时，双筒望远镜放大倍率多少合适？',
        image: null,
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
    name: '望远镜的使用技巧',
    order: 2,
    questions: [
      {
        id: 'eq-2-q1',
        type: 'choice',
        text: '使用双筒望远镜时，哪种持握方式最稳定？',
        image: null,
        options: [
          { id: 'A', text: '单手握持', isCorrect: false },
          { id: 'B', text: '双手握持，双臂夹紧身体', isCorrect: true },
          { id: 'C', text: '随意握持', isCorrect: false }
        ],
        explanation: '双手握持并将双臂夹紧身体可增加稳定性，减少晃动'
      },
      {
        id: 'eq-2-q2',
        type: 'sort',
        text: '单筒望远镜（观鸟镜）使用步骤排序',
        options: ['安装目镜', '对准目标', '调节焦距', '选择合适位置'],
        correctOrder: ['选择合适位置', '安装目镜', '对准目标', '调节焦距']
      },
      {
        id: 'eq-2-q3',
        type: 'fill',
        text: '填空：观看远处鸟类时，应该先用手持望远镜___秒适应后再仔细观察',
        correctAnswer: '30',
        alternatives: ['10', '20', '30', '60']
      }
    ]
  },
  {
    id: 'eq-3',
    topicId: 'equipment',
    name: '其他观鸟装备',
    order: 3,
    questions: [
      {
        id: 'eq-3-q1',
        type: 'choice',
        text: '观鸟时，以下哪种服装颜色最不合适？',
        image: null,
        options: [
          { id: 'A', text: '迷彩服', isCorrect: false },
          { id: 'B', text: '红色或亮色衣物', isCorrect: true },
          { id: 'C', text: '深绿色或土灰色', isCorrect: false }
        ],
        explanation: '亮色衣物容易惊吓鸟类，应该选择自然色调的服装'
      },
      {
        id: 'eq-3-q2',
        type: 'choice',
        text: '观鸟时，以下哪种装备不是必需的？',
        image: null,
        options: [
          { id: 'A', text: '望远镜', isCorrect: false },
          { id: 'B', text: '相机', isCorrect: true },
          { id: 'C', text: '鸟类图鉴或App', isCorrect: false }
        ],
        explanation: '望远镜是观鸟的核心装备，而相机是可选的记录工具'
      },
      {
        id: 'eq-3-q3',
        type: 'fill',
        text: '填空：携带的鸟类图鉴或App最好选择配有___叫声的版本，便于识别',
        correctAnswer: '叫声',
        alternatives: ['图片', '叫声', '视频', '描述']
      }
    ]
  },

  // Safety Topic Levels (sf-1, sf-2, sf-3)
  {
    id: 'sf-1',
    topicId: 'safety',
    name: '户外安全 basics',
    order: 1,
    questions: [
      {
        id: 'sf-1-q1',
        type: 'choice',
        text: '观鸟时，以下哪种做法不利于安全？',
        image: null,
        options: [
          { id: 'A', text: '结伴而行', isCorrect: false },
          { id: 'B', text: '单独进入偏远湿地', isCorrect: true },
          { id: 'C', text: '告知家人行程', isCorrect: false }
        ],
        explanation: '单独进入偏远地区存在安全风险，应结伴而行并告知行程'
      },
      {
        id: 'sf-1-q2',
        type: 'choice',
        text: '观鸟时遇到恶劣天气，应该怎么做？',
        image: null,
        options: [
          { id: 'A', text: '继续观鸟', isCorrect: false },
          { id: 'B', text: '立即寻找安全避雨处', isCorrect: true },
          { id: 'C', text: '在树下躲避', isCorrect: false }
        ],
        explanation: '遇到恶劣天气应立即寻找安全避雨处，避免在树下或空旷地带停留'
      },
      {
        id: 'sf-1-q3',
        type: 'fill',
        text: '填空：观鸟前应告知家人或朋友自己的___和预计返回时间',
        correctAnswer: '行程',
        alternatives: ['计划', '行程', '同伴', '地点']
      }
    ]
  },
  {
    id: 'sf-2',
    topicId: 'safety',
    name: '湿地安全须知',
    order: 2,
    questions: [
      {
        id: 'sf-2-q1',
        type: 'choice',
        text: '在湿地区域观鸟，以下哪种行为最危险？',
        image: null,
        options: [
          { id: 'A', text: '沿着栈道行走', isCorrect: false },
          { id: 'B', text: '远离水域警戒线', isCorrect: false },
          { id: 'C', text: '为了近距离观鸟越过警戒线', isCorrect: true },
        ],
        explanation: '湿地地形复杂，越过警戒线可能陷入危险，应遵守规定'
      },
      {
        id: 'sf-2-q2',
        type: 'sort',
        text: '湿地观鸟安全装备准备排序',
        options: ['穿着防滑鞋', '携带防水袋', '准备防晒用品', '告知行程'],
        correctOrder: ['告知行程', '穿着防滑鞋', '携带防水袋', '准备防晒用品']
      },
      {
        id: 'sf-2-q3',
        type: 'fill',
        text: '填空：在湿地观察时，深处的水体可能暗藏___，不要轻易涉水',
        correctAnswer: '陷阱',
        alternatives: ['鱼类', '陷阱', '水草', '昆虫']
      }
    ]
  },
  {
    id: 'sf-3',
    topicId: 'safety',
    name: '自然环境安全',
    order: 3,
    questions: [
      {
        id: 'sf-3-q1',
        type: 'choice',
        text: '观鸟时遭遇野生动物（如蛇），正确做法是？',
        image: null,
        options: [
          { id: 'A', text: '快速奔跑离开', isCorrect: false },
          { id: 'B', text: '保持冷静，缓缓后退', isCorrect: true },
          { id: 'C', text: '主动接近观察', isCorrect: false }
        ],
        explanation: '遇到野生动物应保持冷静，缓缓后退，不要主动接近或奔跑'
      },
      {
        id: 'sf-3-q2',
        type: 'choice',
        text: '夏季观鸟时，最重要的是注意什么？',
        image: null,
        options: [
          { id: 'A', text: '防晒和防蚊虫叮咬', isCorrect: true },
          { id: 'B', text: '多带几件衣服', isCorrect: false },
          { id: 'C', text: '在阳光下观察', isCorrect: false }
        ],
        explanation: '夏季高温，防晒和防蚊虫是户外活动的首要注意事项'
      },
      {
        id: 'sf-3-q3',
        type: 'fill',
        text: '填空：观鸟时应随身携带___，以备不时之需',
        correctAnswer: '急救包',
        alternatives: ['相机', '急救包', '望远镜', '食物']
      }
    ]
  },

  // Behavior Topic Levels (bh-1, bh-2, bh-3)
  {
    id: 'bh-1',
    topicId: 'behavior',
    name: '文明观鸟原则',
    order: 1,
    questions: [
      {
        id: 'bh-1-q1',
        type: 'choice',
        text: '观鸟时，以下哪种行为是正确的？',
        image: null,
        options: [
          { id: 'A', text: '大声喧哗吸引鸟类注意', isCorrect: false },
          { id: 'B', text: '保持安静，不干扰鸟类正常活动', isCorrect: true },
          { id: 'C', text: '投喂食物吸引鸟类靠近', isCorrect: false }
        ],
        explanation: '文明观鸟应保持安静，不干扰鸟类的自然行为和正常活动'
      },
      {
        id: 'bh-1-q2',
        type: 'sort',
        text: '观鸟行为准则排序（从重要到次要）',
        options: ['不投喂食物', '不追逐鸟类', '保持安静', '不破坏栖息地'],
        correctOrder: ['不破坏栖息地', '不追逐鸟类', '不投喂食物', '保持安静']
      },
      {
        id: 'bh-1-q3',
        type: 'fill',
        text: '填空：观鸟时应与鸟类保持适当距离，不要___它们的正常生活',
        correctAnswer: '干扰',
        alternatives: ['观察', '干扰', '拍摄', '记录']
      }
    ]
  },
  {
    id: 'bh-2',
    topicId: 'behavior',
    name: '保护生态环境',
    order: 2,
    questions: [
      {
        id: 'bh-2-q1',
        type: 'choice',
        text: '观鸟时发现垃圾，应该怎么做？',
        image: null,
        options: [
          { id: 'A', text: '随手丢在垃圾桶', isCorrect: false },
          { id: 'B', text: '带走自己产生的垃圾，并尽量带走看到的垃圾', isCorrect: true },
          { id: 'C', text: '这不是我的责任，不理睬', isCorrect: false }
        ],
        explanation: '保护环境是每个观鸟者的责任，应带走垃圾并维护自然环境'
      },
      {
        id: 'bh-2-q2',
        type: 'choice',
        text: '为什么观鸟时不应该投喂鸟类？',
        image: null,
        options: [
          { id: 'A', text: '浪费食物', isCorrect: false },
          { id: 'B', text: '会让鸟类产生依赖，影响其自然觅食能力', isCorrect: true },
          { id: 'C', text: '增加观鸟乐趣', isCorrect: false }
        ],
        explanation: '投喂会使鸟类产生依赖，改变其自然习性，降低野外生存能力'
      },
      {
        id: 'bh-2-q3',
        type: 'fill',
        text: '填空：观鸟过程中不应采摘或破坏植物，做一个___的观鸟者',
        correctAnswer: '文明',
        alternatives: ['文明', '专业', '优秀', '合格']
      }
    ]
  },
  {
    id: 'bh-3',
    topicId: 'behavior',
    name: '尊重其他观鸟者',
    order: 3,
    questions: [
      {
        id: 'bh-3-q1',
        type: 'choice',
        text: '发现稀有鸟类时，以下哪种行为不妥？',
        image: null,
        options: [
          { id: 'A', text: '与他人分享观察经验', isCorrect: false },
          { id: 'B', text: '大声呼喊让所有人都来观看', isCorrect: true },
          { id: 'C', text: '轻声告知身旁有兴趣的观鸟者', isCorrect: false }
        ],
        explanation: '大声喧哗会惊吓稀有鸟类，应轻声分享或使用App记录'
      },
      {
        id: 'bh-3-q2',
        type: 'sort',
        text: '多人观鸟时的行为排序',
        options: ['轻声交流', '分享发现', '轮流使用望远镜', '保持适当距离'],
        correctOrder: ['保持适当距离', '轻声交流', '轮流使用望远镜', '分享发现']
      },
      {
        id: 'bh-3-q3',
        type: 'fill',
        text: '填空：多人一起观鸟时，应互相尊重、___，不要独占观察位置',
        correctAnswer: '分享',
        alternatives: ['分享', '竞争', '比较', '争论']
      }
    ]
  },

  // Advanced Topic Levels (ad-1, ad-2, ad-3)
  {
    id: 'ad-1',
    topicId: 'advanced',
    name: '鸟类记录方法',
    order: 1,
    questions: [
      {
        id: 'ad-1-q1',
        type: 'choice',
        text: '以下哪种不是正规的鸟类记录方式？',
        image: null,
        options: [
          { id: 'A', text: '使用专业鸟类App记录', isCorrect: false },
          { id: 'B', text: '投喂食物引诱鸟类到固定位置便于记录', isCorrect: true },
          { id: 'C', text: '拍照记录特征', isCorrect: false }
        ],
        explanation: '投喂诱拍会干扰鸟类自然行为，不是正规的观察和记录方式'
      },
      {
        id: 'ad-1-q2',
        type: 'choice',
        text: '记录鸟类观察时，最重要的是记录什么？',
        image: null,
        options: [
          { id: 'A', text: '鸟类的颜色', isCorrect: false },
          { id: 'B', text: '观察时间、地点和数量', isCorrect: true },
          { id: 'C', text: '鸟类的体重', isCorrect: false }
        ],
        explanation: '时间、地点和数量是科学观鸟记录的核心数据'
      },
      {
        id: 'ad-1-q3',
        type: 'fill',
        text: '填空：使用鸟类App记录时，应开启___定位以便准确记录观察地点',
        correctAnswer: 'GPS',
        alternatives: ['GPS', '蓝牙', 'WiFi', '流量']
      }
    ]
  },
  {
    id: 'ad-2',
    topicId: 'advanced',
    name: '鸟类拍摄技巧',
    order: 2,
    questions: [
      {
        id: 'ad-2-q1',
        type: 'choice',
        text: '拍摄飞行中的鸟类，哪种设置最合适？',
        image: null,
        options: [
          { id: 'A', text: '低速快门', isCorrect: false },
          { id: 'B', text: '高速快门（如1/1000秒或更快）', isCorrect: true },
          { id: 'C', text: '不使用快门', isCorrect: false }
        ],
        explanation: '高速快门可以定格飞行中的鸟类瞬间，避免运动模糊'
      },
      {
        id: 'ad-2-q2',
        type: 'sort',
        text: '鸟类拍摄步骤排序',
        options: ['选择高速连拍模式', '预对焦在可能飞行路线', '发现鸟类', '跟踪拍摄'],
        correctOrder: ['发现鸟类', '选择高速连拍模式', '预对焦在可能飞行路线', '跟踪拍摄']
      },
      {
        id: 'ad-2-q3',
        type: 'fill',
        text: '填空：拍摄水鸟时，最好选择___光线时段，如清晨或傍晚',
        correctAnswer: '柔和',
        alternatives: ['强烈', '柔和', '中午', '任何']
      }
    ]
  },
  {
    id: 'ad-3',
    topicId: 'advanced',
    name: '科学观鸟分享',
    order: 3,
    questions: [
      {
        id: 'ad-3-q1',
        type: 'choice',
        text: '通过公民科学项目（如eBird）提交观鸟记录，有什么好处？',
        image: null,
        options: [
          { id: 'A', text: '没有任何实际意义', isCorrect: false },
          { id: 'B', text: '为鸟类保护和科学研究提供有价值的数据', isCorrect: true },
          { id: 'C', text: '只能自己查看', isCorrect: false }
        ],
        explanation: '公民科学项目收集的观鸟数据有助于全球鸟类监测和保护研究'
      },
      {
        id: 'ad-3-q2',
        type: 'choice',
        text: '分享观鸟照片到社交媒体时，最应该注意的是？',
        image: null,
        options: [
          { id: 'A', text: '照片越清晰越好', isCorrect: false },
          { id: 'B', text: '不标注稀有鸟类的精确位置，避免引来非法捕捉', isCorrect: true },
          { id: 'C', text: '越多越好', isCorrect: false }
        ],
        explanation: '保护稀有鸟类，应避免公开其精确栖息地位置，防止不法分子'
      },
      {
        id: 'ad-3-q3',
        type: 'fill',
        text: '填空：参与观鸟社群分享时，应互相尊重、___，共同进步',
        correctAnswer: '交流',
        alternatives: ['交流', '攀比', '争论', '炫耀']
      }
    ]
  }
];

// ============================================================================
// PROGRESS MANAGEMENT
// ============================================================================

const DEFAULT_PROGRESS = {
  unlockedLevels: ['eq-1'],
  completedLevels: [],
  scores: {}
};

/**
 * Get all topics with their current status
 * @returns {Array} Topics with status
 */
function getTopics() {
  const progress = getProgress();
  return TOPICS.map(topic => {
    const topicLevels = LEVELS.filter(l => l.topicId === topic.id);
    const completedCount = topicLevels.filter(l =>
      progress.completedLevels.includes(l.id)
    ).length;

    return {
      ...topic,
      totalLevels: topicLevels.length,
      completedLevels: completedCount,
      isAllCompleted: completedCount === topicLevels.length
    };
  });
}

/**
 * Get single topic by ID
 * @param {string} topicId - Topic ID
 * @returns {Object|null} Topic object or null
 */
function getTopicById(topicId) {
  return TOPICS.find(t => t.id === topicId) || null;
}

/**
 * Get all levels for a topic
 * @param {string} topicId - Topic ID
 * @returns {Array} Level array
 */
function getLevelsByTopicId(topicId) {
  const progress = getProgress();
  return LEVELS
    .filter(l => l.topicId === topicId)
    .map(level => ({
      ...level,
      isUnlocked: progress.unlockedLevels.includes(level.id),
      isCompleted: progress.completedLevels.includes(level.id),
      score: progress.scores[level.id] || null
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Get single level by ID
 * @param {string} levelId - Level ID
 * @returns {Object|null} Level object or null
 */
function getLevelById(levelId) {
  const progress = getProgress();
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return null;

  return {
    ...level,
    isUnlocked: progress.unlockedLevels.includes(levelId),
    isCompleted: progress.completedLevels.includes(levelId),
    score: progress.scores[levelId] || null
  };
}

/**
 * Get questions for a level
 * @param {string} levelId - Level ID
 * @returns {Array} Question array
 */
function getQuestionsByLevelId(levelId) {
  const level = LEVELS.find(l => l.id === levelId);
  return level ? level.questions : [];
}

/**
 * Get next level in the same topic
 * @param {string} topicId - Topic ID
 * @param {number} currentOrder - Current level order
 * @returns {Object|null} Next level or null
 */
function getNextLevel(topicId, currentOrder) {
  const topicLevels = LEVELS
    .filter(l => l.topicId === topicId)
    .sort((a, b) => a.order - b.order);

  const nextLevel = topicLevels.find(l => l.order === currentOrder + 1);
  return nextLevel || null;
}

/**
 * Calculate score for a level based on answers
 * @param {string} levelId - Level ID
 * @param {Object} answers - User's answers { questionId: answer }
 * @returns {number} Score (0-100)
 */
function calculateScore(levelId, answers) {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return 0;

  let correctCount = 0;
  const totalQuestions = level.questions.length;

  for (const question of level.questions) {
    const userAnswer = answers[question.id];
    if (!userAnswer) continue;

    let isCorrect = false;

    switch (question.type) {
      case 'choice':
        // For choice, userAnswer is the selected option ID (A, B, C)
        const correctOption = question.options.find(o => o.isCorrect);
        isCorrect = correctOption && correctOption.id === userAnswer;
        break;

      case 'sort':
        // For sort, userAnswer is array of option texts in user's order
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctOrder);
        break;

      case 'fill':
        // For fill, userAnswer is the filled text
        isCorrect = userAnswer.toString().trim() === question.correctAnswer.toString().trim();
        break;
    }

    if (isCorrect) correctCount++;
  }

  return totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
}

/**
 * Complete a level and update progress
 * @param {string} levelId - Level ID
 * @param {number} score - Achieved score
 * @returns {Object} Update result with next level info
 */
function completeLevel(levelId, score) {
  const progress = getProgress();

  // Ensure arrays exist
  if (!progress.completedLevels) progress.completedLevels = [];
  if (!progress.unlockedLevels) progress.unlockedLevels = [];
  if (!progress.scores) progress.scores = {};

  // Add to completed levels if not already
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
  }

  // Save score (keep best score)
  const currentBest = progress.scores[levelId] || 0;
  if (score > currentBest) {
    progress.scores[levelId] = score;
  }

  // Unlock next level
  const level = LEVELS.find(l => l.id === levelId);
  let nextLevelId = null;

  if (level) {
    const nextLevel = getNextLevel(level.topicId, level.order);
    if (nextLevel && !progress.unlockedLevels.includes(nextLevel.id)) {
      progress.unlockedLevels.push(nextLevel.id);
      nextLevelId = nextLevel.id;
    }

    // Also unlock first level of next topic if this is the last level
    if (!nextLevel) {
      const currentTopic = TOPICS.find(t => t.id === level.topicId);
      if (currentTopic) {
        const nextTopic = TOPICS.find(t => t.order === currentTopic.order + 1);
        if (nextTopic && !progress.unlockedLevels.includes(nextTopic.levels[0])) {
          progress.unlockedLevels.push(nextTopic.levels[0]);
          nextLevelId = nextTopic.levels[0];
        }
      }
    }
  }

  saveProgress(progress);

  return {
    levelId,
    score,
    isNewBest: score > currentBest,
    nextLevelId
  };
}

/**
 * Get user progress
 * @returns {Object} Progress object
 */
function getProgress() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY);
    if (stored) {
      return {
        ...DEFAULT_PROGRESS,
        ...stored,
        completedLevels: stored.completedLevels || [],
        unlockedLevels: stored.unlockedLevels || [],
        scores: stored.scores || {}
      };
    }
  } catch (e) {
    console.error('Error reading school progress:', e);
  }
  return { ...DEFAULT_PROGRESS };
}

/**
 * Save user progress
 * @param {Object} progress - Progress object to save
 */
function saveProgress(progress) {
  try {
    wx.setStorageSync(STORAGE_KEY, progress);
  } catch (e) {
    console.error('Error saving school progress:', e);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  TOPICS,
  LEVELS,
  getTopics,
  getTopicById,
  getLevelsByTopicId,
  getLevelById,
  getQuestionsByLevelId,
  getNextLevel,
  calculateScore,
  completeLevel,
  getProgress,
  saveProgress
};