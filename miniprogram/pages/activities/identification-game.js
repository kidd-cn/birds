// pages/activities/identification-game.js
Page({
  data: {
    gameBirds: [],
    currentQuestion: 0,
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    difficulty: 'medium',
    selectedAnswerId: '',
    options: [],
    showResult: false,
    correctAnswer: '',
    currentBird: {},  // 添加缺失的currentBird变量
    feedback: '',
    // 添加用于追踪每题详情的数组
    questionResults: [],
    // 添加已完成进度
    completedProgress: 0
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
    // 获取完整的鸟类数据
    const app = getApp();
    let allBirds = [];

    // 如果全局数据中有鸟类数据，使用它
    if (app.globalData && app.globalData.currentBirdData) {
      allBirds = app.globalData.currentBirdData;
    } else {
      // 否则尝试从完整的鸟类数据获取
      try {
        const completeBirdDataModule = require('../../utils/completeBirdData');
        allBirds = completeBirdDataModule.completeBirdData;

        // 如果completeBirdData没有成功创建，回退到原有数据
        if (!allBirds || allBirds.length === 0) {
          const birdDataModule = require('../../utils/birdData');
          allBirds = birdDataModule.realBirdObservations;
        }
      } catch (e) {
        console.error('加载完整鸟类数据失败，使用原始数据:', e);
        try {
          // 回退到原有数据
          const birdDataModule = require('../../utils/birdData');
          allBirds = birdDataModule.realBirdObservations;
        } catch (e2) {
          console.error('加载鸟类数据失败:', e2);
          // 备用数据
          allBirds = this.getSampleBirdData();
        }
      }
    }

    // 确保至少有4个鸟类用于游戏
    if (allBirds.length < 4) {
      console.error('鸟类数据不足，无法开始游戏');
      return;
    }

    // 随机选择4个鸟类用于本次游戏作为问题
    const selectedBirds = this.selectRandomBirds(allBirds, 4);

    this.setData({
      gameBirds: selectedBirds,      // 实际游戏题目（4个随机选择的鸟类）
      fullBirds: allBirds,           // 完整鸟类数据，用于生成选项
      gameStarted: true,
      questionResults: [],           // 初始化时重置结果数组
      completedProgress: 0           // 初始进度为0
    });

    if (selectedBirds.length === 4) {
      this.nextQuestion();
    }
  },

  // 从鸟类数组中随机选择指定数量的鸟类
  selectRandomBirds(birds, count) {
    if (birds.length < count) {
      return birds; // 如果总数不够，返回全部
    }

    // 创建副本并随机打乱
    const shuffled = [...birds].sort(() => 0.5 - Math.random());
    // 返回前count个元素
    return shuffled.slice(0, count);
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
    const existingImages = [
      '/images/alba.jpg',           // 白鹭
      '/images/Ardea_cinerea.jpg',  // 苍鹭
      '/images/crowned_Night_Heron.jpg', // 夜鹭
      '/images/Black_faced_spoonbill.jpeg' // 黑脸琵鹭
    ];

    return [
      {
        id: 1,
        commonName: '白鹭',
        species: 'Egretta garzetta',
        imageUrl: '/images/alba.jpg',
        confidence: 0.9
      },
      {
        id: 2,
        commonName: '苍鹭',
        species: 'Ardea cinerea',
        imageUrl: '/images/Ardea_cinerea.jpg',
        confidence: 0.85
      },
      {
        id: 3,
        commonName: '夜鹭',
        species: 'Nycticorax nycticorax',
        imageUrl: '/images/crowned_Night_Heron.jpg',
        confidence: 0.8
      },
      {
        id: 4,
        commonName: '黑脸琵鹭',
        species: 'Platalea minor',
        imageUrl: '/images/Black_faced_spoonbill.jpeg',
        confidence: 0.75
      }
    ];
  },

  nextQuestion() {
    // 不再在这里检查是否超过题目数量，而是在selectAnswer中处理
    // 这样保证在显示当前题目的时候，计数是正确的

    if (this.data.currentQuestion >= this.data.gameBirds.length) {
      // 如果已经达到最大题数，结束游戏
      this.endGame();
      return;
    }

    const currentBird = this.data.gameBirds[this.data.currentQuestion];
    const options = this.generateOptions(currentBird);

    // 计算当前显示的进度（已完成的题目进度）
    const progress = (this.data.currentQuestion / this.data.gameBirds.length) * 100;

    this.setData({
      currentBird: currentBird,
      options: options,
      selectedAnswerId: '',
      showResult: false,
      completedProgress: progress
    });
  },

  generateOptions(currentBird) {
    // 从所有鸟类数据中生成选项，包括正确答案和其他错误选项
    const allBirds = this.data.fullBirds || this.data.gameBirds; // 使用完整的鸟类数据

    // 确保正确答案包含在选项中
    const correctOption = currentBird;

    // 从所有鸟类中排除当前鸟类，选出3个干扰选项
    const otherBirds = allBirds.filter(bird => bird.id !== currentBird.id);

    // 随机选择3个其他鸟类作为错误选项
    const shuffledOthers = [...otherBirds].sort(() => 0.5 - Math.random()).slice(0, 3);

    // 将正确答案插入到随机位置
    const allOptions = [correctOption, ...shuffledOthers];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    // 为选项分配唯一的optionId
    return shuffledOptions.map((bird, index) => ({
      ...bird,
      optionId: `option-${index}`,
      originalId: bird.id
    }));
  },

  selectAnswer(e) {
    const selectedId = e.currentTarget.dataset.id;
    const selectedBird = this.data.options.find(opt => opt.optionId === selectedId);
    const correctBird = this.data.gameBirds[this.data.currentQuestion];

    const isCorrect = selectedBird.originalId === correctBird.id;

    // 记录当前题目的结果
    const currentResult = {
      questionNum: this.data.currentQuestion + 1,
      selectedBird: selectedBird.commonName || selectedBird.species,
      correctBird: correctBird.commonName || correctBird.species,
      isCorrect: isCorrect,
      imageUrl: correctBird.imageUrl
    };

    const updatedResults = [...this.data.questionResults, currentResult];

    if (isCorrect) {
      this.setData({
        score: this.data.score + 1
      });
    }

    // 在显示答案结果时，更新进度到已完成当前题目
    const completedProgress = ((this.data.currentQuestion + 1) / this.data.gameBirds.length) * 100;

    this.setData({
      selectedAnswerId: selectedId,
      showResult: true,
      correctAnswer: correctBird.commonName || correctBird.species,
      feedback: isCorrect ? '回答正确！' : '再接再厉！',
      questionResults: updatedResults,
      completedProgress: completedProgress  // 更新进度到已完成当前题目
    });

    // Move to next question after delay or end game if it's the last question
    setTimeout(() => {
      const nextQuestionIndex = this.data.currentQuestion + 1;

      if (nextQuestionIndex >= this.data.gameBirds.length) {
        // This was the last question, end the game
        this.endGame();
      } else {
        // Move to the next question
        this.setData({
          currentQuestion: nextQuestionIndex
        });
        this.nextQuestion();
      }
    }, 1500);
  },

  endGame() {
    // 在游戏结束时不需要再递增currentQuestion，因为已经在selectAnswer中处理了
    this.setData({
      gameCompleted: true
    });
  },

  restartGame() {
    this.setData({
      currentQuestion: 0,
      score: 0,
      gameCompleted: false,
      showResult: false,
      selectedAnswerId: '',
      questionResults: [],  // 重置题目结果数组
      completedProgress: 0  // 重置进度
    });
    this.nextQuestion();
  },

  exitGame() {
    wx.navigateBack();
  },

  onImageLoad(e) {
    console.log('Image loaded successfully:', e);
  },

  onImageError(e) {
    console.error('Image failed to load:', e);
    // 图片加载失败时，我们可以选择什么都不做，因为已经有默认图片回退
  }
});