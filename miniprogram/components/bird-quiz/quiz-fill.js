Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    inputValue: '',
    answered: false,
    isCorrect: false
  },

  methods: {
    onInput(e) {
      if (this.data.answered) return;
      this.setData({ inputValue: e.detail.value });
    },

    onConfirm() {
      const { inputValue, question } = this.data;
      if (!inputValue.trim()) return;
      const isCorrect = question.alternatives
        ? question.alternatives.includes(inputValue.trim())
        : inputValue.trim().toLowerCase() === question.correctAnswer.toLowerCase();
      this.setData({
        answered: true,
        isCorrect
      });
    },

    onNext() {
      const answer = this.data.inputValue.trim();
      this.triggerEvent('answer', { answer });
      this.reset();
    },

    reset() {
      this.setData({
        inputValue: '',
        answered: false,
        isCorrect: false
      });
    }
  }
});