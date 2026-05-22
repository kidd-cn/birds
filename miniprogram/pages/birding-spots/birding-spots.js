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
    currentSpotDetail: null,
    activeTab: 'overview',  // 添加活动标签页状态
    parkDetails: {
      overview: {},
      birds: {},
      ecology: {}
    },
    showParkDetails: false  // 控制详情面板显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载观鸟点数据
    this.setData({
      birdingSpots: [
        {
          id: 1,
          name: "深圳湾公园",
          location: "深圳市南山区望海路1408号",
          description: "深圳湾公园是观鸟胜地，每年冬季都有大量候鸟在此栖息，包括黑脸琵鹭、白鹭等多种珍稀鸟类。",
          area: "120公顷",
          openingHours: "6:00-23:00",
          transportation: "地铁2号线海上世界站A出口，步行约15分钟",
          features: "沿海湿地，红树林生态系统",
          bestBirdingTime: "秋冬季最佳，特别是11月至次年3月",
          hotspots: "北湾、中湾及南湾沿线，以及红树林区域",
          ecology: {
            habitat: "滨海湿地生态系统",
            vegetation: "红树林、芦苇、海草床",
            seasonalFeatures: "冬季候鸟天堂，夏秋两季也有留鸟和繁殖鸟",
            conservationStatus: "国家级重要生态区域"
          }
        },
        {
          id: 2,
          name: "华侨城国家湿地公园",
          location: "深圳市南山区白石路东8号",
          description: "华侨城湿地公园是深圳首个国家级湿地公园，拥有丰富的鸟类资源和优美的自然景观。",
          area: "68.5公顷",
          openingHours: "9:00-17:00（周一闭馆）",
          transportation: "地铁1号线侨城东站B出口，步行约10分钟",
          features: "淡水湿地，人工修复生态系统",
          bestBirdingTime: "全年适宜，春秋迁徙季节最佳",
          hotspots: "观鸟屋、水禽湖及周边芦苇荡",
          ecology: {
            habitat: "淡水湿地生态系统",
            vegetation: "芦苇、香蒲、荷花等水生植物",
            seasonalFeatures: "四季分明，春秋季候鸟迁徙高峰期",
            conservationStatus: "国家重要湿地，生态修复示范区"
          }
        },
        {
          id: 3,
          name: "福田红树林自然保护区",
          location: "深圳市福田区红树林路1号",
          description: "福田红树林自然保护区是全国唯一位于市区的国家级自然保护区，鸟类资源极为丰富。",
          area: "367.64公顷",
          openingHours: "9:00-17:00",
          transportation: "地铁9号线侨城东站B出口，步行约15分钟",
          features: "天然红树林，生物多样性极高的保护区",
          bestBirdingTime: "10月至次年4月最佳",
          hotspots: "基围、高潮位栖息地、核心区域",
          ecology: {
            habitat: "天然红树林生态系统",
            vegetation: "秋茄、桐花树、海桑等红树植物",
            seasonalFeatures: "冬季候鸟高峰，春秋季迁徙期",
            conservationStatus: "国际重要湿地，拉姆萨尔公约名录"
          }
        },
        {
          id: 4,
          name: "仙湖植物园",
          location: "深圳市罗湖区莲塘仙湖路160号",
          description: "仙湖植物园不仅植物种类丰富，也是观鸟的好去处，尤其在迁徙季节能看到多种林鸟。",
          area: "668公顷",
          openingHours: "8:00-18:00",
          transportation: "梧桐山假日专线1号、M445路公交车仙湖植物园站",
          features: "山地森林生态系统，植物多样性丰富",
          bestBirdingTime: "春秋迁徙季节，早晨和傍晚最佳",
          hotspots: "苏铁园、竹园及森林步道",
          ecology: {
            habitat: "亚热带山地森林生态系统",
            vegetation: "苏铁、竹类、蕨类及多种乔灌木",
            seasonalFeatures: "迁徙鸟类中转站，四季鸟种不同",
            conservationStatus: "保护珍稀植物与鸟类栖息地"
          }
        },
        {
          id: 5,
          name: "东湖公园",
          location: "深圳市罗湖区爱国路4006号",
          description: "东湖公园是深圳市最早的市政公园之一，水域面积较大，是城市中的鸟类栖息地。",
          area: "151公顷",
          openingHours: "6:00-22:00",
          transportation: "地铁14号线黄木岗站A出口，步行约10分钟",
          features: "城市综合性公园，水系发达",
          bestBirdingTime: "全年适宜，清晨最佳",
          hotspots: "湖心岛、亲水平台及湖岸区域",
          ecology: {
            habitat: "城市淡水湖泊生态系统",
            vegetation: "湖滨植物、绿化带树木",
            seasonalFeatures: "留鸟为主，春秋有少量迁徙鸟",
            conservationStatus: "城市生态绿肺，鸟类栖息地"
          }
        }
      ]
    });
  },

  /**
   * 选择观鸟点
   */
  selectSpot(e) {
    const spot = this.getSpotFromEvent(e);
    if (!spot) return;

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
    const spot = this.getSpotFromEvent(e);
    if (!spot) return;

    // 使用新方法显示带标签页的公园详情
    const index = e.currentTarget.dataset.index;
    this.showParkDetails(e);
  },

  /**
   * 获取事件中的观鸟点
   */
  getSpotFromEvent(e) {
    const index = e.currentTarget.dataset.index;
    return this.data.birdingSpots[index] || null;
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  /**
   * 显示公园详情
   */
  showParkDetails(e) {
    const index = e.currentTarget.dataset.index;
    const spot = this.data.birdingSpots[index];

    // 从现有数据构建公园详情
    const parkDetails = this.buildParkDetails(spot);

    this.setData({
      selectedSpot: parkDetails,
      activeTab: 'overview',  // 默认显示概览
      showDetailModal: false, // 关闭旧的详情模态框
      showParkDetails: true
    });
  },

  /**
   * 隐藏公园详情
   */
  hideParkDetails() {
    this.setData({
      showParkDetails: false,
      selectedSpot: null
    });
  },

  /**
   * 从现有鸟类数据构建公园详情
   */
  buildParkDetails(spot) {
    // 从birdData中提取与此公园相关的鸟类
    const { realBirdObservations } = require('../../utils/birdData');
    const parkBirds = realBirdObservations.filter(bird =>
      bird.locationName.includes(spot.name) ||
      spot.name.includes(bird.locationName)
    );

    // 提取唯一鸟类品种
    const uniqueBirds = [];
    const speciesSet = new Set();
    parkBirds.forEach(bird => {
      if (!speciesSet.has(bird.species)) {
        uniqueBirds.push(bird);
        speciesSet.add(bird.species);
      }
    });

    // 构建公园详情对象
    return {
      ...spot,
      birds: uniqueBirds,
      area: spot.area || '未知',
      openingHours: spot.openingHours || '详见公园公告',
      transportation: spot.transportation || '未提供',
      features: spot.features || '未提供',
      bestBirdingTime: spot.bestBirdingTime || '春秋季最佳',
      hotspots: spot.hotspots || '未提供',
      ecology: {
        habitat: spot.ecology?.habitat || '未提供',
        vegetation: spot.ecology?.vegetation || '未提供',
        seasonalFeatures: spot.ecology?.seasonalFeatures || '未提供',
        conservationStatus: spot.ecology?.conservationStatus || '未提供'
      }
    };
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
    const spot = this.data.selectedSpot;
    if (spot && spot.coordinates) {
      const { latitude, longitude } = spot.coordinates;
      const spotPayload = {
        name: spot.name,
        coordinates: { latitude, longitude }
      };

      wx.setStorageSync('selectedSpot', spotPayload);

      wx.redirectTo({
        url: `../index/index?latitude=${latitude}&longitude=${longitude}&spotName=${encodeURIComponent(spot.name)}`
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