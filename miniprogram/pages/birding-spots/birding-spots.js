// pages/birding-spots/birding-spots.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birdingSpots: [
      {
        name: "深圳湾公园",
        habitat: "滨海湿地",
        special_species: ["黑脸琵鹭", "大白鹭", "反嘴鹬", "红嘴鸥"],
        coordinates: { latitude: 22.490000, longitude: 113.940000 },
        description: "深圳最知名的国际候鸟天堂，记录鸟类200+种。黑脸琵鹭是这里的明星物种，占全球总数近1/10。最佳观鸟时间为10月至次年4月，低潮位时是观察水鸟的最佳时机。",
        best_time: "10月-次年4月（低潮位最佳）",
        transport: "地铁9号线深圳湾公园站D2出口",
        latest_observation_date: "2026-05-20"
      },
      {
        name: "福田红树林生态公园",
        habitat: "红树林湿地",
        special_species: ["黑脸琵鹭", "白肩雕", "黄胸鹀", "苍鹭"],
        coordinates: { latitude: 22.483333, longitude: 113.950000 },
        description: "与香港米埔自然保护区一河之隔，同属深圳湾生态系统核心。红雨湖的生态浮岛是秋季观鸟的好地方，吸引大量水鸟在此栖息。",
        best_time: "全年，春秋迁徙季节最佳",
        transport: "地铁3号线益田站D出口 / 7号线沙尾站B出口",
        latest_observation_date: "2026-05-20"
      },
      {
        name: "华侨城国家湿地公园",
        habitat: "淡水湿地",
        special_species: ["黑脸琵鹭", "苍鹭", "各种鸻鹬类", "鸬鹚"],
        coordinates: { latitude: 22.478000, longitude: 113.935000 },
        description: "深圳湾滨海湿地系统重要组成部分，被誉为隐藏在城市中的花园绿洲。拥有木质观景台和观鸟屋，是黑脸琵鹭等冬候鸟的重要栖息地。",
        best_time: "11月-次年3月",
        transport: "地铁1号线侨城东站B口 / 9号线深圳湾公园站D1口",
        latest_observation_date: "2026-05-20"
      },
      {
        name: "内伶仃福田国家级自然保护区",
        habitat: "红树林生态系统",
        special_species: ["赤腹鹰", "各种猛禽", "迁徙鸟类", "蛇雕"],
        coordinates: { latitude: 22.483000, longitude: 113.945000 },
        description: "中国面积最小的国家级自然保护区，却有189种鸟类。拥有70公顷天然红树林，6公里'绿色长城'，23种国家保护珍稀濒危鸟类在此栖息。",
        best_time: "春秋迁徙季节",
        transport: "地铁1号线竹子林站",
        latest_observation_date: "2026-05-20"
      },
      {
        name: "仙湖植物园",
        habitat: "山林湿地",
        special_species: ["夜鹭", "赤红山椒鸟", "朱背啄花鸟", "叉尾太阳鸟"],
        coordinates: { latitude: 22.546000, longitude: 114.135000 },
        description: "深圳十佳观鸟地点之一，记录120+种鸟类。夜鹭、白鹭、池鹭四季在此繁殖，还可观赏赤红山椒鸟、朱背啄花鸟等市区罕见的林鸟。",
        best_time: "四季皆宜，清晨最佳",
        transport: "地铁2/8号线仙湖路站C3出口",
        latest_observation_date: "2026-05-20"
      }
    ],
    selectedSpot: null,
    showDetailModal: false,
    currentSpotDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 选择观鸟点
   */
  selectSpot(e) {
    const spot = e.currentTarget.dataset.spot;
    this.setData({
      selectedSpot: spot
    });

    wx.showToast({
      title: `已选择：${spot.name}`,
      icon: 'none'
    });
  },

  /**
   * 查看观鸟点详情
   */
  viewSpotDetail(e) {
    const spot = e.currentTarget.dataset.spot;
    this.setData({
      currentSpotDetail: spot,
      showDetailModal: true
    });
  },

  /**
   * 关闭详情模态框
   */
  closeDetailModal() {
    this.setData({
      showDetailModal: false,
      currentSpotDetail: null
    });
  },

  /**
   * 前往观鸟地图
   */
  goToMap() {
    if (this.data.selectedSpot) {
      // 传递选中的观鸟点信息到地图页面
      wx.setStorageSync('selectedSpot', this.data.selectedSpot);

      // 使用 redirectTo 跳转到地图页面
      wx.redirectTo({
        url: '../index/index'
      });
    } else {
      wx.showToast({
        title: '请选择一个观鸟点',
        icon: 'none'
      });
    }
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
      title: '深圳观鸟点推荐',
      path: '/pages/birding-spots/birding-spots'
    };
  }
});