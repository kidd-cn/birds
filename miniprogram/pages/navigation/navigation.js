// pages/navigation/navigation.js
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
   * 前往地图页面
   */
  goToMap() {
    wx.removeStorageSync('selectedSpot');
    wx.navigateTo({
      url: '../index/index'
    });
  },

  /**
   * 前往观鸟点页面
   */
  goToBirdingSpots() {
    wx.navigateTo({
      url: '../birding-spots/birding-spots'
    });
  },

  /**
   * 前往活动中心页面
   */
  goToActivityCenter() {
    wx.navigateTo({
      url: '../activities/activity-center'  // 导航到统一的活动中心页面
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '深圳观鸟助手',
      path: '/pages/navigation/navigation'
    };
  }
});