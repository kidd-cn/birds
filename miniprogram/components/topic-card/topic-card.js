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