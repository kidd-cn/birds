Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    items: [],
    orderedItems: []
  },

  lifetimes: {
    attached() {
      this.setData({
        items: [...this.data.question.items],
        orderedItems: []
      });
    }
  },

  methods: {
    onItemTap(e) {
      const { index } = e.currentTarget.dataset;
      const items = [...this.data.items];
      const orderedItems = [...this.data.orderedItems];
      const item = items.splice(index, 1)[0];
      orderedItems.push(item);
      this.setData({ items, orderedItems });
      this.triggerEvent('answer', {
        questionId: this.data.question.id,
        answer: orderedItems.map(i => i.value)
      });
    },

    onReset() {
      this.setData({
        items: [...this.data.question.items],
        orderedItems: []
      });
    }
  }
});