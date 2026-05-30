const schoolData = require('../../utils/school-data');

Page({
  data: {
    badges: [],
    titles: [],
    totalScore: 0,
    level: 1,
    completedLevels: 0,
    totalTopics: 4,
    totalBadges: 4
  },

  onLoad() {
    this.loadAchievements();
  },

  onShow() {
    this.loadAchievements();
  },

  loadAchievements() {
    const progress = schoolData.getProgress();

    // 徽章映射
    const badgeMap = {
      'equipment-master': { name: '装备达人', icon: '🔭', desc: '完成装备篇' },
      'safety-master': { name: '安全卫士', icon: '🛡️', desc: '完成安全篇' },
      'behavior-master': { name: '观鸟使者', icon: '🍃', desc: '完成行为篇' },
      'advanced-master': { name: '进阶专家', icon: '✈️', desc: '完成进阶篇' }
    };

    const badges = progress.badges.map(bid => badgeMap[bid] || { name: bid, icon: '🏅', desc: '' });

    // 称号计算
    let title = '观鸟学徒';
    let level = 1;
    const completedCount = progress.completedLevels.length;
    if (completedCount >= 12) {
      title = '观鸟大师';
      level = 4;
    } else if (completedCount >= 8) {
      title = '观鸟专家';
      level = 3;
    } else if (completedCount >= 4) {
      title = '观鸟学者';
      level = 2;
    }

    this.setData({
      badges,
      titles: [title],
      totalScore: progress.totalScore,
      level,
      completedLevels: completedCount,
      totalBadges: Object.keys(badgeMap).length
    });
  },

  getTitleIcon() {
    const iconMap = {
      '观鸟学徒': '🎓',
      '观鸟学者': '📚',
      '观鸟专家': '🎖️',
      '观鸟大师': '👑'
    };
    return iconMap[this.data.titles[0]] || '🎓';
  },

  generatePoster() {
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading'
    });
  }
});