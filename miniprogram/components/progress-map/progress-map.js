Component({
  properties: {
    topics: {
      type: Array,
      value: []
    }
  },

  data: {
    completedCount: 0,
    totalCount: 0
  },

  observers: {
    'topics': function(topics) {
      if (topics && topics.length) {
        const completed = topics.filter(t => t.status === 'completed').length;
        this.setData({
          completedCount: completed,
          totalCount: topics.length
        });
      }
    }
  },

  methods: {
    onTopicTap(e) {
      const { topicId } = e.currentTarget.dataset;
      this.triggerEvent('topicTap', { topicId });
    }
  }
});