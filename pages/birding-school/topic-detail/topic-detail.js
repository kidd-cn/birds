Page({
  data: {
    topicId: '',
    topic: null,
    levels: [],
    completedLevels: []
  },

  onLoad(options) {
    this.setData({ topicId: options.id });
    this.loadTopicDetail();
  },

  loadTopicDetail() {
    // TODO: Load topic detail data
  },

  onLevelTap(e) {
    const { levelId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/birding-school/level-detail/level-detail?id=${levelId}`
    });
  }
});