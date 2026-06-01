// pages/activities/knowledge-quiz.js
const pointsSystem = require('../../utils/points-system');

Page({
  data: {
    questions: [],
    currentQuestion: 0,
    score: 0,
    quizStarted: false,
    quizCompleted: false,
    difficulty: 'medium',
    userAnswer: '',
    showResult: false,
    correctAnswer: '',
    feedback: ''
  },

  onLoad(options) {
    // Get difficulty from options
    const difficulty = options.difficulty || 'medium';
    this.setData({
      difficulty: difficulty
    });

    // Initialize the quiz
    this.initQuiz();
  },

  initQuiz() {
    // Generate quiz questions based on difficulty
    const questions = this.generateQuestions(this.data.difficulty);

    this.setData({
      questions: questions,
      quizStarted: true
    });

    if (questions.length > 0) {
      this.loadQuestion();
    }
  },

  generateQuestions(difficulty) {
    // Sample questions - in a real app, these would come from a data source
    const allQuestions = [
      {
        id: 1,
        question: '白鹭属于哪个科？',
        options: ['鹭科', '雁科', '雀科', '鹰科'],
        correctAnswer: '鹭科',
        explanation: '白鹭属于鹭科，是一类大型涉禽。'
      },
      {
        id: 2,
        question: '苍鹭主要在什么时间觅食？',
        options: ['白天', '夜晚', '黄昏和黎明', '全天'],
        correctAnswer: '黄昏和黎明',
        explanation: '苍鹭多在晨昏时分觅食。'
      },
      {
        id: 3,
        question: '哪种鸟的颈背部有栗色纵纹？',
        options: ['夜鹭', '池鹭', '绿鹭', '白鹭'],
        correctAnswer: '池鹭',
        explanation: '池鹭繁殖期颈背部有栗色纵纹，这是其显著特征。'
      },
      {
        id: 4,
        question: '黑脸琵鹭是国家几级保护动物？',
        options: ['一级', '二级', '三级', '四级'],
        correctAnswer: '一级',
        explanation: '黑脸琵鹭是国家一级保护动物，全球数量稀少。'
      },
      {
        id: 5,
        question: '以下哪种鸟喜欢集群筑巢？',
        options: ['翠鸟', '戴胜', '白鹭', '鹡鸰'],
        correctAnswer: '白鹭',
        explanation: '白鹭常常成群在高大乔木上营巢。'
      }
    ];

    // Filter questions based on difficulty
    let filteredQuestions = allQuestions;

    if (difficulty === 'hard') {
      // For hard difficulty, use more challenging questions if available
      filteredQuestions = allQuestions.slice(0, 3); // Less questions but harder
    } else if (difficulty === 'easy') {
      // For easy difficulty, use simpler questions
      filteredQuestions = allQuestions;
    }

    // Shuffle questions
    return filteredQuestions.sort(() => Math.random() - 0.5);
  },

  loadQuestion() {
    if (this.data.currentQuestion >= this.data.questions.length) {
      // Quiz completed
      this.endQuiz();
      return;
    }

    const currentQ = this.data.questions[this.data.currentQuestion];

    this.setData({
      currentQuestionData: currentQ,
      userAnswer: '',
      showResult: false,
      feedback: ''
    });
  },

  selectAnswer(e) {
    const selectedAnswer = e.currentTarget.dataset.answer;
    const currentQ = this.data.questions[this.data.currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    if (isCorrect) {
      this.setData({
        score: this.data.score + 1
      });
      const questionId = currentQ.id;
      pointsSystem.addPoints(`game-q:quiz:${questionId}`, 5);
    }

    this.setData({
      userAnswer: selectedAnswer,
      showResult: true,
      correctAnswer: currentQ.correctAnswer,
      feedback: isCorrect ? '回答正确！' + currentQ.explanation : `错误，正确答案是：${currentQ.correctAnswer}。${currentQ.explanation}`
    });

    // Move to next question after delay
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  },

  nextQuestion() {
    const nextQuestionIndex = this.data.currentQuestion + 1;

    if (nextQuestionIndex < this.data.questions.length) {
      this.setData({
        currentQuestion: nextQuestionIndex
      }, () => {
        this.loadQuestion();
      });
    } else {
      this.endQuiz();
    }
  },

  endQuiz() {
    const today = new Date().toISOString().split('T')[0];
    pointsSystem.addPoints(`game-finish:quiz:${today}`, 15);
    this.setData({
      quizCompleted: true
    });
  },

  restartQuiz() {
    this.setData({
      currentQuestion: 0,
      score: 0,
      quizCompleted: false,
      showResult: false
    }, () => {
      this.initQuiz();
    });
  },

  exitQuiz() {
    wx.navigateBack();
  }
});