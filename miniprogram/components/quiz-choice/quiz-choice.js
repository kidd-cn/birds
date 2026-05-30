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
    getOptionClass(item, selectedOption, answered) {
      if (!answered) {
        return selectedOption === item.id ? 'selected' : '';
      }
      // Show correct answer always
      if (item.isCorrect) {
        return 'correct';
      }
      // Show user's wrong selection
      if (selectedOption === item.id) {
        return 'incorrect';
      }
      return '';
    },

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