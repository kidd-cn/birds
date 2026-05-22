// Test suite for index page activity functionality
const indexPage = require('./index');

// Mock WeChat Mini Program API
const mockWx = {
  getSystemInfoSync: jest.fn(),
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn(),
  cloud: {
    callFunction: jest.fn()
  },
  previewImage: jest.fn()
};

// Mock Page constructor
global.Page = jest.fn();

describe('Index Page Activity Functionality', () => {
  let pageInstance;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a mock page instance with necessary methods
    pageInstance = {
      data: {
        showActivityPanel: false,
        activityType: null,
        gameDifficulty: 'medium',
        birdData: []
      },
      setData: jest.fn(function(newData) {
        Object.assign(this.data, newData);
      }),
      resolveSelectedSpot: jest.fn(),
      applyMapCenterFromSpot: jest.fn(),
      loadBirdData: jest.fn(),
      loadLocalBirdData: jest.fn(),
      updateMapMarkers: jest.fn(),
      buildBirdMarkers: jest.fn(),
      onReady: jest.fn(),
      onShow: jest.fn(),
      onMarkerTap: jest.fn(),
      closeDetail: jest.fn(),
      previewBirdImage: jest.fn(),

      // Methods we need to test
      showActivityPanel: indexPage.showActivityPanel,
      hideActivityPanel: indexPage.hideActivityPanel,
      selectActivity: indexPage.selectActivity,
      setGameDifficulty: indexPage.setGameDifficulty,
      startIdentificationGame: indexPage.startIdentificationGame,
      startKnowledgeQuiz: indexPage.startKnowledgeQuiz,
      startCheckInActivity: indexPage.startCheckInActivity
    };

    // Bind the methods to the instance
    pageInstance.showActivityPanel = pageInstance.showActivityPanel.bind(pageInstance);
    pageInstance.hideActivityPanel = pageInstance.hideActivityPanel.bind(pageInstance);
    pageInstance.selectActivity = pageInstance.selectActivity.bind(pageInstance);
    pageInstance.setGameDifficulty = pageInstance.setGameDifficulty.bind(pageInstance);
    pageInstance.startIdentificationGame = pageInstance.startIdentificationGame.bind(pageInstance);
    pageInstance.startKnowledgeQuiz = pageInstance.startKnowledgeQuiz.bind(pageInstance);
    pageInstance.startCheckInActivity = pageInstance.startCheckInActivity.bind(pageInstance);
  });

  describe('showActivityPanel', () => {
    test('should set showActivityPanel to true', () => {
      expect(pageInstance.data.showActivityPanel).toBe(false);
      pageInstance.showActivityPanel();
      expect(pageInstance.setData).toHaveBeenCalledWith({ showActivityPanel: true });
      expect(pageInstance.data.showActivityPanel).toBe(true);
    });
  });

  describe('hideActivityPanel', () => {
    test('should set showActivityPanel to false', () => {
      pageInstance.setData({ showActivityPanel: true });
      pageInstance.hideActivityPanel();
      expect(pageInstance.setData).toHaveBeenCalledWith({ showActivityPanel: false });
      expect(pageInstance.data.showActivityPanel).toBe(false);
    });
  });

  describe('selectActivity', () => {
    test('should set activityType when valid activity is selected', () => {
      pageInstance.selectActivity({ currentTarget: { dataset: { activity: 'identification-game' } } });
      expect(pageInstance.setData).toHaveBeenCalledWith({ activityType: 'identification-game' });
    });

    test('should not set activityType when invalid activity is selected', () => {
      pageInstance.selectActivity({ currentTarget: { dataset: { activity: 'invalid-activity' } } });
      expect(pageInstance.setData).not.toHaveBeenCalledWith({ activityType: 'invalid-activity' });
    });

    test('should throw error when no dataset activity provided', () => {
      expect(() => {
        pageInstance.selectActivity({ currentTarget: { dataset: {} } });
      }).toThrow();
    });
  });

  describe('setGameDifficulty', () => {
    test('should set gameDifficulty to easy', () => {
      pageInstance.setGameDifficulty({ currentTarget: { dataset: { difficulty: 'easy' } } });
      expect(pageInstance.setData).toHaveBeenCalledWith({ gameDifficulty: 'easy' });
    });

    test('should set gameDifficulty to medium', () => {
      pageInstance.setGameDifficulty({ currentTarget: { dataset: { difficulty: 'medium' } } });
      expect(pageInstance.setData).toHaveBeenCalledWith({ gameDifficulty: 'medium' });
    });

    test('should set gameDifficulty to hard', () => {
      pageInstance.setGameDifficulty({ currentTarget: { dataset: { difficulty: 'hard' } } });
      expect(pageInstance.setData).toHaveBeenCalledWith({ gameDifficulty: 'hard' });
    });
  });

  describe('startIdentificationGame', () => {
    test('should initialize identification game with available birds', () => {
      const mockBirdData = [
        { species: 'Egret', commonName: 'Great Egret', imageUrl: 'image1.jpg' },
        { species: 'Heron', commonName: 'Great Blue Heron', imageUrl: 'image2.jpg' }
      ];
      pageInstance.setData({ birdData: mockBirdData });

      pageInstance.startIdentificationGame();

      expect(pageInstance.data.activityType).toBe('identification-game');
      expect(pageInstance.data.gameDifficulty).toBe('medium'); // default
    });
  });

  describe('startKnowledgeQuiz', () => {
    test('should initialize knowledge quiz', () => {
      pageInstance.startKnowledgeQuiz();

      expect(pageInstance.data.activityType).toBe('knowledge-quiz');
    });
  });

  describe('startCheckInActivity', () => {
    test('should initialize check-in activity', () => {
      pageInstance.startCheckInActivity();

      expect(pageInstance.data.activityType).toBe('check-in');
    });
  });
});