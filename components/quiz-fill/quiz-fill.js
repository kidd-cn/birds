Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    inputValue: ''
  },

  methods: {
    onInput(e) {
      this.setData({ inputValue: e.detail.value });
    },

    onConfirm() {
      this.triggerEvent('answer', {
        questionId: this.data.question.id,
        answer: this.data.inputValue
      });
    }
  }
});