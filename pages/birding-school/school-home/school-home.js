Component({
  data: {
    topics: [],
    currentTopic: null,
    mapMarkers: []
  },

  lifetimes: {
    attached() {
      this.loadTopics();
    }
  },

  methods: {
    loadTopics() {
      // TODO: Load topics data
    },

    onTopicTap(e) {
      const { topicId } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/birding-school/topic-detail/topic-detail?id=${topicId}`
      });
    },

    onMarkerTap(e) {
      const { markerId } = e.detail;
      const topic = this.data.topics.find(t => t.id === markerId);
      if (topic) {
        this.setData({ currentTopic: topic });
      }
    }
  }
});