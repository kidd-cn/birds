const schoolData = require('../../../utils/school-data');
const pointsSystem = require('../../../utils/points-system');

Page({
  data: {
    topics: [],
    totalCompleted: 0,
    totalTopics: 0,
    currentPoints: 0
  },

  onLoad() {
    this.loadTopics();
  },

  onShow() {
    this.loadTopics();
  },

  loadTopics() {
    const topics = schoolData.getTopics();
    const completed = topics.filter(t => t.status === 'completed').length;

    this.setData({
      topics: topics.map(t => ({
        ...t,
        position: this.getTopicPosition(t.order)
      })),
      totalCompleted: completed,
      totalTopics: topics.length,
      currentPoints: pointsSystem.getCurrentPoints()
    });
  },

  getTopicPosition(order) {
    const positions = [
      { top: 80, left: 75 },
      { top: 280, left: 280 },
      { top: 480, left: 75 },
      { top: 680, left: 280 }
    ];
    return positions[order - 1] || { top: 80, left: 75 };
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