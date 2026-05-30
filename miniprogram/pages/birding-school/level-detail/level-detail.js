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
      levelId,  // Store levelId separately
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

    // Store answer keyed by question index
    answers[currentQuestionIndex] = answer;
    this.setData({ answers });

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        this.setData({
          currentQuestionIndex: currentQuestionIndex + 1
        });
      }, 800);
    } else {
      setTimeout(() => {
        this.completeLevel();
      }, 800);
    }
  },

  completeLevel() {
    const { levelId, answers } = this.data;
    console.log('completeLevel called:', { levelId, answers });
    const correctCount = schoolData.calculateScore(levelId, answers);
    console.log('correctCount:', correctCount);
    const progress = schoolData.completeLevel(levelId, correctCount);

    const topicLevels = schoolData.getLevelsByTopicId(this.data.level.topicId);
    const allCompleted = topicLevels.every(l => progress.completedLevels.includes(l.id));
    const showBadge = allCompleted;

    this.setData({
      completed: true,
      correctCount,
      showBadge,
      totalScore: progress.totalScore,
      accuracy: questions.length > 0 ? Math.round(correctCount / questions.length * 100) : 0
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
      wx.redirectTo({
        url: `/pages/birding-school/topic-detail/topic-detail?topicId=${level.topicId}`
      });
    }
  },

  goToTopic() {
    wx.redirectTo({
      url: `/pages/birding-school/topic-detail/topic-detail?topicId=${this.data.level.topicId}`
    });
  },

  goToAchievements() {
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    });
  }
});