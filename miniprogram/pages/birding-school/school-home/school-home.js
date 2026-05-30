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
    this.loadTopics();
  },

  loadTopics() {
    const topics = schoolData.getTopics();
    const completed = topics.filter(t => t.status === 'completed').length;

    this.setData({
      topics,
      totalCompleted: completed,
      totalTopics: topics.length
    });
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