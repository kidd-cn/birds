// app.js
App({
  onLaunch() {
    // 小程序启动时的初始化逻辑
    console.log('App launched');

    const pointsSystem = require('./utils/points-system');
    const avatarSystem = require('./utils/avatar-system');
    pointsSystem.init();
    avatarSystem.init();

    // 初始化云开发
    if (!wx.cloud) {
      console.error('小程序基础库版本过低，暂不支持云开发');
    } else {
      wx.cloud.init({
        env: 'release-env', // 替换为你的云开发环境ID
        traceUser: true,
      });
      console.log('Cloud init success');
    }
  },

  onShow() {
    // 小程序显示时的逻辑
    console.log('App onShow');
  },

  onHide() {
    // 小程序隐藏时的逻辑
    console.log('App onHide');
  },

  onError(err) {
    console.error('App error:', err);
  },

  // 全局数据
  globalData: {
    userInfo: null,
    birdData: [], // 存储鸟类数据
    hasLocationPermission: false, // 是否有位置权限
  }
});