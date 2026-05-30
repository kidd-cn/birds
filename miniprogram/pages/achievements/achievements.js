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

    // 计算进度百分比
    const totalLevels = 12; // 4 topics * 3 levels
    const progressPercent = Math.round((completedCount / totalLevels) * 100);

    this.setData({
      badges,
      titles: [title],
      totalScore: progress.totalScore,
      level,
      completedLevels: completedCount,
      totalBadges: Object.keys(badgeMap).length,
      progressPercent
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
    // 显示加载中
    wx.showLoading({ title: '生成海报中...' });

    // 获取屏幕尺寸
    const systemInfo = wx.getSystemInfoSync();
    const width = systemInfo.windowWidth;
    const height = systemInfo.windowHeight;

    // 创建离屏 canvas
    const ctx = wx.createCanvasContext('poster-canvas');

    // 绘制背景
    ctx.setFillStyle('#f0f8f4');
    ctx.fillRect(0, 0, width, height * 0.8);

    // 绘制标题栏
    ctx.setFillStyle('#2e8b57');
    ctx.fillRect(0, 0, width, 200);

    // 绘制标题
    ctx.setFillStyle('#fff');
    ctx.setFontSize(40);
    ctx.setTextAlign('center');
    ctx.fillText('🏆 我的成就', width / 2, 80);

    // 绘制称号
    ctx.setFillStyle('#fff');
    ctx.setFontSize(60);
    ctx.fillText(this.getTitleIcon(), width / 2, 160);

    // 绘制称号文字
    ctx.setFontSize(36);
    ctx.fillText(this.data.titles[0], width / 2, 240);

    // 绘制统计信息
    ctx.setFillStyle('#333');
    ctx.setFontSize(28);
    ctx.fillText(`已完成 ${this.data.completedLevels} 关 | 获得 ${this.data.badges.length} 枚徽章`, width / 2, 300);

    // 绘制徽章区域
    const badgeStartX = 50;
    const badgeY = 380;
    const badgeSpacing = (width - 100) / Math.max(this.data.badges.length, 1);

    this.data.badges.forEach((badge, index) => {
      const x = badgeStartX + index * badgeSpacing;
      // 徽章圆形背景
      ctx.setFillStyle('#ffc107');
      ctx.beginPath();
      ctx.arc(x + badgeSpacing / 2, badgeY, 50, 0, 2 * Math.PI);
      ctx.fill();

      // 徽章图标
      ctx.setFontSize(50);
      ctx.setTextAlign('center');
      ctx.fillText(badge.icon, x + badgeSpacing / 2, badgeY + 15);

      // 徽章名称
      ctx.setFillStyle('#333');
      ctx.setFontSize(20);
      ctx.fillText(badge.name, x + badgeSpacing / 2, badgeY + 90);
    });

    // 绘制积分
    ctx.setFillStyle('#2e8b57');
    ctx.setFontSize(32);
    ctx.setTextAlign('center');
    ctx.fillText(`总积分: ${this.data.totalScore}`, width / 2, 520);

    // 绘制底部提示
    ctx.setFillStyle('#888');
    ctx.setFontSize(22);
    ctx.fillText('深圳观鸟助手', width / 2, 580);

    // 绘制到 canvas
    ctx.draw();

    // 转换图片
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'poster-canvas',
        success: (res) => {
          wx.hideLoading();
          // 保存到相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '海报已保存到相册',
                icon: 'success'
              });
            },
            fail: () => {
              wx.showToast({
                title: '保存失败，请授权',
                icon: 'none'
              });
            }
          });
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '生成失败',
            icon: 'none'
          });
        }
      });
    }, 500);
  }
});