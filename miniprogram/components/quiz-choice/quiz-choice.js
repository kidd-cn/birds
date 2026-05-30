Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },

  data: {
    selectedOption: null,
    answered: false,
    showExplanation: false
  },

  methods: {
    onOptionTap(e) {
      if (this.data.answered) return;
      const { option } = e.currentTarget.dataset;
      this.setData({
        selectedOption: option,
        answered: true,
        showExplanation: true
      });
    },

    onNext() {
      this.triggerEvent('answer', {
        answer: this.data.selectedOption
      });
      this.reset();
    },

    reset() {
      this.setData({
        selectedOption: null,
        answered: false,
        showExplanation: false
      });
    }
  }
});