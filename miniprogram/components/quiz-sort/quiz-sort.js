Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    options: [],
    locked: false
  },

  lifetimes: {
    attached() {
      this.initOptions();
    }
  },

  methods: {
    initOptions() {
      const shuffled = [...this.data.question.options].sort(() => Math.random() - 0.5);
      this.setData({
        options: shuffled.map((text, index) => ({ id: index, text, locked: false }))
      });
    },

    onItemTap(e) {
      if (this.data.locked) return;
      const { index } = e.currentTarget.dataset;
      const { options } = this.data;
      const item = options[index];
      const newOptions = options.filter((_, i) => i !== index);
      newOptions.push(item);
      this.setData({ options: newOptions });
    },

    onLock() {
      this.setData({ locked: true });
    },

    onConfirm() {
      const { options } = this.data;
      const answer = options.map(o => o.text);
      this.triggerEvent('answer', { answer });
      this.initOptions();
      this.setData({ locked: false });
    },

    onNext() {
      const { options } = this.data;
      const answer = options.map(o => o.text);
      this.triggerEvent('answer', { answer });
      this.initOptions();
      this.setData({ locked: false });
    }
  }
});