// pages/activities/check-in.js
const schoolData = require('../../utils/school-data');
const pointsSystem = require('../../utils/points-system');

Page({
  data: {
    todayCheckedIn: false,
    consecutiveDays: 0,
    totalCheckIns: 0,
    streakMessage: '',
    showSuccess: false,
    checkInPoints: 0
  },

  onLoad() {
    this.loadCheckInData();
  },

  loadCheckInData() {
    const checkInData = wx.getStorageSync('checkInData') || {
      lastCheckInDate: '',
      consecutiveDays: 0,
      totalCheckIns: 0,
      checkInDates: []
    };

    const today = new Date().toISOString().split('T')[0];
    const todayCheckedIn = checkInData.checkInDates.includes(today);

    // 计算签到积分（每天签到得10积分）
    const checkInPoints = checkInData.totalCheckIns * 10;

    this.setData({
      todayCheckedIn: todayCheckedIn,
      consecutiveDays: checkInData.consecutiveDays,
      totalCheckIns: checkInData.totalCheckIns,
      checkInPoints: checkInPoints
    });

    this.updateStreakMessage();
  },

  checkIn() {
    if (this.data.todayCheckedIn) {
      wx.showToast({
        title: '今天已签到',
        icon: 'none'
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let checkInData = wx.getStorageSync('checkInData') || {
      lastCheckInDate: '',
      consecutiveDays: 0,
      totalCheckIns: 0,
      checkInDates: []
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (checkInData.lastCheckInDate === yesterdayStr) {
      checkInData.consecutiveDays += 1;
    } else if (checkInData.lastCheckInDate !== today) {
      checkInData.consecutiveDays = 1;
    }

    checkInData.lastCheckInDate = today;
    checkInData.totalCheckIns += 1;

    if (!checkInData.checkInDates.includes(today)) {
      checkInData.checkInDates.push(today);
    }

    wx.setStorageSync('checkInData', checkInData);

    // 累加积分（每次签到+10积分，去重 key 为日期）
    pointsSystem.addPoints(`check-in:${today}`, 10);

    this.setData({
      todayCheckedIn: true,
      consecutiveDays: checkInData.consecutiveDays,
      totalCheckIns: checkInData.totalCheckIns,
      checkInPoints: checkInData.totalCheckIns * 10
    });

    this.updateStreakMessage();
    this.setData({ showSuccess: true });

    setTimeout(() => {
      this.setData({ showSuccess: false });
    }, 2000);

    wx.showToast({
      title: '签到成功！+10积分',
      icon: 'success'
    });
  },

  updateStreakMessage() {
    let message = '';
    if (this.data.consecutiveDays === 0) {
      message = '开始连续签到吧！';
    } else if (this.data.consecutiveDays === 1) {
      message = '第一天签到，加油！';
    } else if (this.data.consecutiveDays < 7) {
      message = `连续签到 ${this.data.consecutiveDays} 天！`;
    } else if (this.data.consecutiveDays < 30) {
      message = `太棒了！连续签到 ${this.data.consecutiveDays} 天！`;
    } else {
      message = `厉害！连续签到 ${this.data.consecutiveDays} 天！`;
    }

    this.setData({ streakMessage: message });
  },

  viewAchievements() {
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    });
  },

  exitCheckIn() {
    wx.navigateBack();
  }
});