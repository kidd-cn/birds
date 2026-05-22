Component({
  /**
   * Component properties
   */
  properties: {
    // Whether to start the quiz automatically
    autoStart: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    // Quiz state
    quizStarted: false,
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    selectedOption: null,
    showFeedback: false,
    feedbackText: '',
    quizCompleted: false,
    quizResults: null,

    // Performance rating thresholds
    performanceRatings: [
      { minScore: 90, label: '观鸟专家!', color: '#4CAF50' },
      { minScore: 70, label: '熟练观察者', color: '#8BC34A' },
      { minScore: 50, label: '学习型观鸟者', color: '#FFC107' },
      { minScore: 0, label: '初学者', color: '#FF9800' }
    ]
  },

  /**
   * Lifecycle methods
   */
  lifetimes: {
    attached() {
      // Generate questions when component is attached
      this.generateQuestions();

      if (this.data.autoStart) {
        this.startQuiz();
      }
    }
  },

  /**
   * Component methods
   */
  methods: {
    // Generate quiz questions focused on bird appearance
    generateQuestions() {
      const questions = [
        {
          id: 1,
          question: "哪种独特的特征有助于识别大蓝鹭？",
          options: [
            "鲜红色的羽冠",
            "长而黄色的喙和脖子",
            "蓝灰色羽毛和S形脖子",
            "橙色翅膀斑块"
          ],
          correctAnswer: 2, // Index of correct option
          explanation: "大蓝鹭具有独特的蓝灰色羽毛，在飞行时有典型的S形脖子。"
        },
        {
          id: 2,
          question: "北美红雀最易识别的特征是什么？",
          options: [
            "长尾巴",
            "鲜红色羽毛（雄性）",
            "黄色喙",
            "白色翼条纹"
          ],
          correctAnswer: 1,
          explanation: "雄性北美红雀呈鲜红色，有独特的橙红色喙，很容易辨认。"
        },
        {
          id: 3,
          question: "如何识别北美黑啄木鸟？",
          options: [
            "小型身体带绿色翅膀",
            "大型身体带红色羽冠",
            "黑白条纹图案",
            "亮黄色腹部"
          ],
          correctAnswer: 1,
          explanation: "北美黑啄木鸟是一种大型啄木鸟，具有独特的红色羽冠和黑色身体配白色条纹。"
        },
        {
          id: 4,
          question: "绿头鸭的特征是什么？",
          options: [
            "绿色头部（雄性）和斑驳棕色（雌性）",
            "亮蓝色翅膀",
            "长弯曲的喙",
            "红色胸部"
          ],
          correctAnswer: 0,
          explanation: "雄性绿头鸭有独特的彩虹绿色头部，而雌性是斑驳棕色的。"
        },
        {
          id: 5,
          question: "金翅雀的关键识别特征是什么？",
          options: [
            "黑色翅膀配白色条纹",
            "亮黄色身体和黑色帽子（雄性）",
            "细长的喙",
            "白色尾羽"
          ],
          correctAnswer: 1,
          explanation: "雄性金翅雀呈亮黄色，有独特的黑色帽子，很容易辨认。"
        }
      ];

      this.setData({
        questions: questions
      });
    },

    // Start the quiz
    startQuiz() {
      this.setData({
        quizStarted: true,
        currentQuestionIndex: 0,
        score: 0,
        selectedOption: null,
        showFeedback: false,
        quizCompleted: false
      });
    },

    // Handle option selection
    onOptionSelect(e) {
      const optionIndex = parseInt(e.currentTarget.dataset.index);

      // Only allow selection if we're not showing feedback and quiz hasn't ended
      if (!this.data.showFeedback && !this.data.quizCompleted) {
        this.setData({
          selectedOption: optionIndex
        });

        // Show feedback immediately
        this.showFeedback(optionIndex);
      }
    },

    // Show feedback after selecting an answer
    showFeedback(selectedOption) {
      const currentQuestion = this.data.questions[this.data.currentQuestionIndex];
      const isCorrect = selectedOption === currentQuestion.correctAnswer;

      let feedbackText = '';
      if (isCorrect) {
        feedbackText = `正确! ${currentQuestion.explanation}`;
        // Add points (20 points per question)
        this.setData({
          score: this.data.score + 20
        });
      } else {
        feedbackText = `错误。${currentQuestion.explanation}`;
      }

      this.setData({
        showFeedback: true,
        feedbackText: feedbackText
      });

      // Move to next question after delay
      setTimeout(() => {
        this.nextQuestion();
      }, 3000);
    },

    // Move to next question
    nextQuestion() {
      const nextIndex = this.data.currentQuestionIndex + 1;

      if (nextIndex < this.data.questions.length) {
        // More questions to go
        this.setData({
          currentQuestionIndex: nextIndex,
          selectedOption: null,
          showFeedback: false,
          feedbackText: ''
        });
      } else {
        // Quiz completed
        this.endQuiz();
      }
    },

    // End the quiz and show results
    endQuiz() {
      const percentage = Math.round((this.data.score / 100) * 100);
      const performanceRating = this.getPerformanceRating(percentage);

      this.setData({
        quizCompleted: true,
        quizResults: {
          score: this.data.score,
          percentage: percentage,
          performanceRating: performanceRating
        }
      });
    },

    // Determine performance rating based on score
    getPerformanceRating(percentage) {
      for (let i = 0; i < this.data.performanceRatings.length; i++) {
        const rating = this.data.performanceRatings[i];
        if (percentage >= rating.minScore) {
          return rating;
        }
      }
      return this.data.performanceRatings[this.data.performanceRatings.length - 1];
    },

    // Restart the quiz
    restartQuiz() {
      this.setData({
        quizStarted: false,
        currentQuestionIndex: 0,
        score: 0,
        selectedOption: null,
        showFeedback: false,
        quizCompleted: false,
        quizResults: null,
        feedbackText: ''
      });
    }
  }
})