Component({
  properties: {
    level: {
      type: Object,
      value: {}
    },
    completed: {
      type: Boolean,
      value: false
    }
  },

  data: {},

  methods: {
    onTap() {
      this.triggerEvent('tap', { levelId: this.data.level.id });
    }
  }
});