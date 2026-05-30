Page({
  data: {
    levelId: '',
    level: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: false
  },

  onLoad(options) {
    this.setData({ levelId: options.id });
    this.loadLevelDetail();
  },

  loadLevelDetail() {
    // TODO: Load level detail with questions
  },

  onAnswerSelect(e) {
    const { questionId, answer } = e.detail;
    this.setData(`answers.${questionId}`, answer);
  },

  onNextQuestion() {
    const { currentQuestionIndex, questions } = this.data;
    if (currentQuestionIndex < questions.length - 1) {
      this.setData({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  onSubmit() {
    // TODO: Submit answers and calculate score
    this.setData({ isCompleted: true });
  }
});