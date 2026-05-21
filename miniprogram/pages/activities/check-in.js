// pages/activities/check-in.js
Page({
  data: {
    todayCheckedIn: false,
    consecutiveDays: 0,
    totalCheckIns: 0,
    streakMessage: '',
    showSuccess: false
  },

  onLoad() {
    // Load check-in data from storage
    this.loadCheckInData();
  },

  loadCheckInData() {
    const checkInData = wx.getStorageSync('checkInData') || {
      lastCheckInDate: '',
      consecutiveDays: 0,
      totalCheckIns: 0,
      checkInDates: []
    };

    // Check if user has checked in today
    const today = new Date().toISOString().split('T')[0];
    const todayCheckedIn = checkInData.checkInDates.includes(today);

    this.setData({
      todayCheckedIn: todayCheckedIn,
      consecutiveDays: checkInData.consecutiveDays,
      totalCheckIns: checkInData.totalCheckIns
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

    // Calculate consecutive days
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (checkInData.lastCheckInDate === yesterdayStr) {
      // Continuing streak
      checkInData.consecutiveDays += 1;
    } else if (checkInData.lastCheckInDate !== today) {
      // Breaking or starting a new streak
      checkInData.consecutiveDays = 1;
    }

    // Update other stats
    checkInData.lastCheckInDate = today;
    checkInData.totalCheckIns += 1;

    if (!checkInData.checkInDates.includes(today)) {
      checkInData.checkInDates.push(today);
    }

    // Save to storage
    wx.setStorageSync('checkInData', checkInData);

    // Update UI
    this.setData({
      todayCheckedIn: true,
      consecutiveDays: checkInData.consecutiveDays,
      totalCheckIns: checkInData.totalCheckIns
    });

    this.updateStreakMessage();

    // Show success message
    this.setData({
      showSuccess: true
    });

    setTimeout(() => {
      this.setData({
        showSuccess: false
      });
    }, 2000);

    wx.showToast({
      title: '签到成功！',
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

    this.setData({
      streakMessage: message
    });
  },

  viewAchievements() {
    // Navigate to achievements page
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    });
  },

  exitCheckIn() {
    wx.navigateBack();
  }
});