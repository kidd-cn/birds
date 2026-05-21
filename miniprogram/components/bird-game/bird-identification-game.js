// Bird Identification Game Component
Component({
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {
    birdData: {
      type: Array,
      value: []
    }
  },

  data: {
    difficulty: 0, // 1-5 scale
    score: 0,
    questionNumber: 0,
    totalQuestions: 10,
    gameStarted: false,
    gameCompleted: false,
    currentQuestion: null,
    selectedOptionIndex: -1,
    showResult: false,
    isCorrect: false,
    gameQuestions: []
  },

  lifetimes: {
    attached() {
      this.initializeGame();
    }
  },

  methods: {
    initializeGame() {
      // Initialize with sample bird data if not provided
      if (!this.data.birdData || this.data.birdData.length === 0) {
        this.setData({
          birdData: [
            { id: 1, name: 'Great Egret', image: '/images/alba.png', species: 'Ardea alba' },
            { id: 2, name: 'Red-winged Blackbird', image: '/images/blackbird-redwinged.png', species: 'Agelaius phoeniceus' },
            { id: 3, name: 'Canada Goose', image: '/images/goose-canada.png', species: 'Branta canadensis' },
            { id: 4, name: 'Blue Jay', image: '/images/jay-blue.png', species: 'Cyanocitta cristata' },
            { id: 5, name: 'Northern Cardinal', image: '/images/cardinal-northern.png', species: 'Cardinalis cardinalis' },
            { id: 6, name: 'American Robin', image: '/images/robin-american.png', species: 'Turdus migratorius' },
            { id: 7, name: 'House Sparrow', image: '/images/sparrow-house.png', species: 'Passer domesticus' },
            { id: 8, name: 'Chipping Sparrow', image: '/images/sparrow-chipping.png', species: 'Spizella passerina' },
            { id: 9, name: 'Tree Sparrow', image: '/images/sparrow-tree.png', species: 'Spizella arborea' },
            { id: 10, name: 'White-throated Sparrow', image: '/images/sparrow-whitethroat.png', species: 'Zonotrichia albicollis' }
          ]
        });
      }
    },

    selectDifficulty(e) {
      const difficulty = parseInt(e.currentTarget.dataset.difficulty);
      this.setData({
        difficulty: difficulty
      });
    },

    startGame() {
      if (this.data.difficulty <= 0) {
        console.error('Please select a difficulty level');
        return;
      }

      this.generateGameQuestions();
      this.nextQuestion();

      this.setData({
        gameStarted: true,
        gameCompleted: false,
        score: 0,
        questionNumber: 0
      });
    },

    generateGameQuestions() {
      const birdData = this.data.birdData;
      const questions = [];

      for (let i = 0; i < this.data.totalQuestions; i++) {
        // Pick a random bird as the correct answer
        const correctBird = this.getRandomBird(birdData);

        // Generate 3 incorrect options
        const wrongOptions = this.generateWrongOptions(birdData, correctBird.name, 3);

        // Combine options and shuffle
        const allOptions = [correctBird.name, ...wrongOptions];
        const shuffledOptions = this.shuffleArray([...allOptions]);

        // Find the index of the correct answer
        const correctAnswerIndex = shuffledOptions.indexOf(correctBird.name);

        questions.push({
          correctAnswer: correctBird.name,
          correctAnswerIndex: correctAnswerIndex,
          imageUrl: correctBird.image,
          options: shuffledOptions
        });
      }

      this.setData({
        gameQuestions: questions
      });
    },

    getRandomBird(birdData) {
      const randomIndex = Math.floor(Math.random() * birdData.length);
      return birdData[randomIndex];
    },

    generateWrongOptions(birdData, correctAnswerName, count) {
      const wrongOptions = [];
      const usedNames = new Set();

      while (wrongOptions.length < count && birdData.length > 1) {
        const randomBird = this.getRandomBird(birdData);

        if (randomBird.name !== correctAnswerName && !usedNames.has(randomBird.name)) {
          wrongOptions.push(randomBird.name);
          usedNames.add(randomBird.name);
        }
      }

      return wrongOptions;
    },

    shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    },

    nextQuestion() {
      const { questionNumber, gameQuestions } = this.data;

      if (questionNumber < this.data.totalQuestions && gameQuestions.length > 0) {
        const currentQuestion = gameQuestions[questionNumber];

        this.setData({
          currentQuestion: currentQuestion,
          questionNumber: questionNumber + 1,
          selectedOptionIndex: -1,
          showResult: false,
          isCorrect: false
        });
      } else {
        this.completeGame();
      }
    },

    selectOption(e) {
      if (this.data.showResult) return; // Prevent selecting during result display

      const index = e.currentTarget.dataset.index;
      const isCorrect = index === this.data.currentQuestion.correctAnswerIndex;

      // Calculate score if answer is correct
      let newScore = this.data.score;
      if (isCorrect) {
        newScore += this.calculateScore(this.data.difficulty);
      }

      this.setData({
        selectedOptionIndex: index,
        showResult: true,
        isCorrect: isCorrect,
        score: newScore
      });
    },

    calculateScore(difficulty) {
      // Different point values based on difficulty level
      const baseScores = {
        1: 10,  // Easy
        2: 20,  // Medium
        3: 30,  // Hard
        4: 40,  // Expert
        5: 50   // Master
      };

      return baseScores[difficulty] || 10;
    },

    nextQuestionOrFinish() {
      if (this.data.questionNumber >= this.data.totalQuestions) {
        this.completeGame();
      } else {
        this.nextQuestion();
      }
    },

    completeGame() {
      this.setData({
        gameCompleted: true
      });
    },

    restartGame() {
      this.setData({
        gameStarted: false,
        gameCompleted: false,
        questionNumber: 0,
        score: 0,
        selectedOptionIndex: -1,
        showResult: false,
        isCorrect: false
      });
    },

    getImageStyle() {
      // Modify image appearance based on difficulty level
      if (this.data.difficulty === 0) return '';

      let filters = [];

      // Increase difficulty by applying filters
      switch (this.data.difficulty) {
        case 1: // Easy - no modification
          break;
        case 2: // Medium - slight blur
          filters.push('blur(2px)');
          break;
        case 3: // Hard - more blur and grayscale
          filters.push('blur(4px)', 'grayscale(30%)');
          break;
        case 4: // Expert - significant blur and grayscale
          filters.push('blur(6px)', 'grayscale(60%)');
          break;
        case 5: // Master - heavy blur and grayscale
          filters.push('blur(8px)', 'grayscale(90%)');
          break;
      }

      return filters.length > 0 ? `filter: ${filters.join(' ')}` : '';
    },

    getPerformanceMessage() {
      const percentage = (this.data.score / (this.data.totalQuestions * this.calculateScore(this.data.difficulty))) * 100;

      if (percentage >= 90) return 'Excellent!';
      else if (percentage >= 70) return 'Good Job!';
      else if (percentage >= 50) return 'Not Bad!';
      else return 'Keep Learning!';
    },

    onImageError(e) {
      console.error('Failed to load image:', e.detail.errMsg);
    }
  }
});