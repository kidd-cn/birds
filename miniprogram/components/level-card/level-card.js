Component({
  properties: {
    level: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      if (this.data.level.unlocked) {
        this.triggerEvent('levelTap', { levelId: this.data.level.id });
      }
    }
  }
});