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
    showExplanation: false,
    isSelectedCorrect: false
  },

  methods: {
    getOptionClass(item, selectedOption, answered) {
      if (!answered) {
        return selectedOption === item.id ? 'selected' : '';
      }
      // Show correct answer always in green
      if (item.isCorrect) {
        return 'correct';
      }
      // Show user's wrong selection in red
      if (selectedOption === item.id) {
        return 'incorrect';
      }
      return '';
    },

    getAnswerText(optionId) {
      if (!optionId || !this.data.question.options) return '';
      const option = this.data.question.options.find(o => o.id === optionId);
      return option ? option.text : '';
    },

    getCorrectAnswerText() {
      if (!this.data.question.options) return '';
      const correctOption = this.data.question.options.find(o => o.isCorrect);
      return correctOption ? correctOption.text : '';
    },

    onOptionTap(e) {
      if (this.data.answered) return;
      const { option } = e.currentTarget.dataset;
      const correctOption = this.data.question.options.find(o => o.isCorrect);
      const isCorrect = correctOption && correctOption.id === option;

      this.setData({
        selectedOption: option,
        answered: true,
        showExplanation: true,
        isSelectedCorrect: isCorrect
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
        showExplanation: false,
        isSelectedCorrect: false
      });
    }
  }
});