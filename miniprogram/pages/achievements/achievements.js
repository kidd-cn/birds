// pages/achievements/achievements.js
Page({
  data: {
    achievements: [
      {
        id: 1,
        title: '首次签到',
        description: '完成第一次签到',
        icon: '🎯',
        unlocked: true // 假设这个成就可以获得
      },
      {
        id: 2,
        title: '连续签到达人',
        description: '连续签到7天',
        icon: '🔥',
        unlocked: false
      },
      {
        id: 3,
        title: '鸟类专家',
        description: '识别10种不同的鸟类',
        icon: '🦉',
        unlocked: false
      },
      {
        id: 4,
        title: '观鸟新手',
        description: '访问第一个观鸟点',
        icon: '🦆',
        unlocked: true // 假设这个成就可以获得
      },
      {
        id: 5,
        title: '探索家',
        description: '访问所有观鸟点',
        icon: '🦅',
        unlocked: false
      },
      {
        id: 6,
        title: '摄影师',
        description: '拍摄5张鸟类照片',
        icon: '📸',
        unlocked: false
      }
    ]
  },

  onLoad() {
    // 从本地存储加载成就状态
    this.loadAchievements();
  },

  loadAchievements() {
    try {
      // 尝试从存储中加载成就数据
      const savedAchievements = wx.getStorageSync('userAchievements');
      if (savedAchievements) {
        this.setData({
          achievements: savedAchievements
        });
      }
    } catch (e) {
      console.error('加载成就数据失败:', e);
    }
  },

  onShow() {
    // 页面显示时重新加载成就状态
    this.loadAchievements();
  }
});