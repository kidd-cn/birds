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