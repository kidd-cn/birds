Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    selectedAnswer: null
  },

  methods: {
    onOptionTap(e) {
      const { value } = e.currentTarget.dataset;
      this.setData({ selectedAnswer: value });
      this.triggerEvent('answer', {
        questionId: this.data.question.id,
        answer: value
      });
    }
  }
});