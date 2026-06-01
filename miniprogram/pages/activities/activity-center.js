// pages/activities/activity-center.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 跳转到识别挑战页面
   */
  goToIdentificationGame() {
    wx.navigateTo({
      url: './identification-game'
    });
  },

  /**
   * 跳转到知识问答页面
   */
  goToKnowledgeQuiz() {
    wx.navigateTo({
      url: './knowledge-quiz'
    });
  },

  /**
   * 跳转到每日签到页面
   */
  goToCheckIn() {
    wx.navigateTo({
      url: './check-in'
    });
  },

  /**
   * 跳转到头像商店页面
   */
  goToAvatarShop() {
    wx.navigateTo({
      url: '/pages/avatar-shop/avatar-shop'
    });
  }
});