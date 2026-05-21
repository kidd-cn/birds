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
      { minScore: 90, label: 'Expert Birder!', color: '#4CAF50' },
      { minScore: 70, label: 'Skilled Observer', color: '#8BC34A' },
      { minScore: 50, label: 'Learning Birder', color: '#FFC107' },
      { minScore: 0, label: 'Beginner Birder', color: '#FF9800' }
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
          question: "Which distinctive feature helps identify a Great Blue Heron?",
          options: [
            "Bright red crest",
            "Long yellow bill and neck",
            "Blue-gray plumage and S-shaped neck",
            "Orange wing patches"
          ],
          correctAnswer: 2, // Index of correct option
          explanation: "Great Blue Herons have distinctive blue-gray plumage and a characteristic S-shaped neck when in flight."
        },
        {
          id: 2,
          question: "What is the most recognizable feature of a Northern Cardinal?",
          options: [
            "Long tail feathers",
            "Bright red plumage (male)",
            "Yellow beak",
            "White wing bars"
          ],
          correctAnswer: 1,
          explanation: "Male Northern Cardinals are bright red with a distinctive orange-red beak, making them easily recognizable."
        },
        {
          id: 3,
          question: "How can you identify a Pileated Woodpecker?",
          options: [
            "Small size with green wings",
            "Large size with red crest",
            "Black and white striped pattern",
            "Bright yellow belly"
          ],
          correctAnswer: 1,
          explanation: "Pileated Woodpeckers are large woodpeckers with a distinctive red crest and black body with white stripes."
        },
        {
          id: 4,
          question: "Which feature distinguishes a Mallard duck?",
          options: [
            "Green head (male) and mottled brown (female)",
            "Bright blue wings",
            "Long curved beak",
            "Red breast"
          ],
          correctAnswer: 0,
          explanation: "Male Mallards have a distinctive iridescent green head, while females are mottled brown."
        },
        {
          id: 5,
          question: "What is the key identifying feature of an American Goldfinch?",
          options: [
            "Black wings with white stripes",
            "Bright yellow body and black cap (male)",
            "Long thin beak",
            "White tail feathers"
          ],
          correctAnswer: 1,
          explanation: "Male American Goldfinches are bright yellow with a distinctive black cap, making them easy to identify."
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
        feedbackText = `Correct! ${currentQuestion.explanation}`;
        // Add points (20 points per question)
        this.setData({
          score: this.data.score + 20
        });
      } else {
        feedbackText = `Incorrect. ${currentQuestion.explanation}`;
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