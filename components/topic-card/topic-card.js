Component({
  properties: {
    topic: {
      type: Object,
      value: {}
    }
  },

  data: {},

  methods: {
    onTap() {
      this.triggerEvent('tap', { topicId: this.data.topic.id });
    }
  }
});