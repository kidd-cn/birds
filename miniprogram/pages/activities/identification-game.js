// pages/activities/identification-game.js
Page({
  data: {
    gameBirds: [],
    currentQuestion: 0,
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    difficulty: 'medium',
    userAnswer: '',
    options: [],
    showResult: false,
    correctAnswer: ''
  },

  onLoad(options) {
    // Get difficulty from options
    const difficulty = options.difficulty || 'medium';
    this.setData({
      difficulty: difficulty
    });

    // Initialize the game
    this.initGame();
  },

  initGame() {
    // Get bird data from global state or props if available
    const app = getApp();
    let allBirds = [];

    // If we have bird data in app.globalData, use it
    if (app.globalData && app.globalData.currentBirdData) {
      allBirds = app.globalData.currentBirdData;
    } else {
      // Fallback: try to get from storage or use sample data
      allBirds = this.getSampleBirdData();
    }

    // Filter birds based on difficulty
    let filteredBirds = this.filterBirdsByDifficulty(allBirds, this.data.difficulty);

    // Ensure we have enough birds for the game (minimum 3)
    if (filteredBirds.length < 3) {
      filteredBirds = allBirds.slice(0, Math.max(3, allBirds.length));
    }

    // Take up to 10 birds for the game
    filteredBirds = filteredBirds.slice(0, 10);

    this.setData({
      gameBirds: filteredBirds,
      gameStarted: true
    });

    if (filteredBirds.length > 0) {
      this.nextQuestion();
    }
  },

  filterBirdsByDifficulty(birds, difficulty) {
    switch(difficulty) {
      case 'easy':
        // Easy: return birds that are distinctive/common
        return birds.filter(bird => bird.confidence > 0.7 || (bird.commonName && !bird.rare));
      case 'hard':
        // Hard: return birds that are similar looking or rare
        return birds.filter(bird => bird.similarSpecies || bird.rare);
      case 'medium':
      default:
        return birds;
    }
  },

  getSampleBirdData() {
    // Return sample bird data for the game
    return [
      {
        id: 1,
        commonName: '白鹭',
        species: 'Egretta garzetta',
        imageUrl: '/images/alba.png',
        confidence: 0.9
      },
      {
        id: 2,
        commonName: '苍鹭',
        species: 'Ardea cinerea',
        imageUrl: '/images/heron.jpg',
        confidence: 0.85
      },
      {
        id: 3,
        commonName: '夜鹭',
        species: 'Nycticorax nycticorax',
        imageUrl: '/images/night-heron.jpg',
        confidence: 0.8
      },
      {
        id: 4,
        commonName: '池鹭',
        species: 'Ardeola bacchus',
        imageUrl: '/images/chicken-bittern.jpg',
        confidence: 0.75
      }
    ];
  },

  nextQuestion() {
    if (this.data.currentQuestion >= this.data.gameBirds.length) {
      // Game completed
      this.endGame();
      return;
    }

    const currentBird = this.data.gameBirds[this.data.currentQuestion];
    const options = this.generateOptions(currentBird);

    this.setData({
      currentBird: currentBird,
      options: options,
      userAnswer: '',
      showResult: false
    });
  },

  generateOptions(currentBird) {
    // Generate options including the correct answer and 3 random wrong answers
    const allBirds = this.data.gameBirds;
    const correctOption = currentBird;

    // Get 3 random wrong answers
    const wrongOptions = allBirds
      .filter(bird => bird.id !== currentBird.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Combine and shuffle options
    const options = [correctOption, ...wrongOptions]
      .map((bird, index) => ({ ...bird, id: `option-${index}` }))
      .sort(() => Math.random() - 0.5);

    return options;
  },

  selectAnswer(e) {
    const selectedId = e.currentTarget.dataset.id;
    const selectedBird = this.data.options.find(opt => opt.id === selectedId);
    const correctBird = this.data.gameBirds[this.data.currentQuestion];

    const isCorrect = selectedBird.id === correctBird.id;

    if (isCorrect) {
      this.setData({
        score: this.data.score + 1
      });
    }

    this.setData({
      userAnswer: selectedBird.commonName || selectedBird.species,
      showResult: true,
      correctAnswer: correctBird.commonName || correctBird.species,
      feedback: isCorrect ? '回答正确！' : '再接再厉！'
    });

    // Move to next question after delay
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  },

  endGame() {
    this.setData({
      gameCompleted: true
    });
  },

  restartGame() {
    this.setData({
      currentQuestion: 0,
      score: 0,
      gameCompleted: false,
      showResult: false
    });
    this.nextQuestion();
  },

  exitGame() {
    wx.navigateBack();
  }
});