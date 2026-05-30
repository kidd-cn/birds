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
          coordinates: { latitude: 22.490000, longitude: 113.940000 },
          description: "深圳湾公园位于深圳市南山区，沿深圳湾海岸线而建，总面积约128.74公顷，是深圳最著名的滨海生态公园。拥有独特的红树林湿地生态系统，与福田红树林自然保护区连成一体，面向碧波荡漾的深圳湾。这里记录鸟类超过200种，是全球极度濒危鸟类黑脸琵鹭的重要越冬地，每年约有375只黑脸琵鹭在此过冬，占全球总数的近1/10。",
          area: "128.74公顷",
          openingHours: "6:00-23:00",
          transportation: "地铁2号线海上世界站A出口，步行约15分钟。建议低潮位时前往，观赏效果更佳。",
          features: "沿海湿地，红树林生态系统，全球黑脸琵鹭重要越冬地",
          bestBirdingTime: "每年11月至次年3月最佳，低潮位时（潮汐1.2米以下）是观察水鸟的最佳时机",
          hotspots: "红树林海滨生态公园南侧滩涂、深圳湾地铁站南侧滩涂、沙河入海口滩涂",
          observationTips: "携带望远镜，着装颜色较暗避免惊扰鸟类。低潮位时鸟类集中在滩涂觅食，视野开阔观察效果最佳。注意保护环境，不投喂鸟类。",
          rating: 5, // 5星评级
          ecology: {
            habitat: "滨海红树林湿地生态系统",
            vegetation: "红树林群落、沿海滩涂植被",
            seasonalFeatures: "冬季候鸟天堂，11月至次年3月鸟类最为丰富",
            conservationStatus: "全球黑脸琵鹭重要越冬地，占全球总数近1/10"
          }
        },
        {
          id: 2,
          name: "华侨城国家湿地公园",
          location: "深圳市南山区白石路东8号",
          coordinates: { latitude: 22.478000, longitude: 113.935000 },
          description: "华侨城湿地公园位于深圳市南山区，是中国唯一地处现代化大都市腹地的滨海红树林湿地。公园保留了原始海岸线的原貌及原生红树林群落，践行'还自然一个自然的状态'的创新管理理念。公园共记录鸟类171种、植被320种，平均每年记录鸟类超1万只次，2018年底还记录到豹猫种群的繁育，印证了湿地生态系统已日趋稳定。",
          area: "现有面积（修复后相比2007年提升超一倍）",
          openingHours: "9:00-17:00（周一闭馆）",
          transportation: "地铁1号线侨城东站B出口，步行约10分钟。需提前预约入园（每日限流400人），可通过官网或微信公众号预约。",
          features: "城市腹地红树林湿地，创新生态管理理念，预约限流参观",
          bestBirdingTime: "全年皆宜，候鸟季（10月至次年4月）鸟类种类和数量最为丰富，非候鸟季以留鸟为主",
          hotspots: "湿地生境维护区、生态浮岛周边、公园内多处观鸟点",
          observationTips: "必须提前预约入园，准时到达。园内保持安静，不大声喧哗。不投喂鸟类，不离开指定路径，注意保护自然环境。观察水鸟时建议携带望远镜。",
          rating: 5, // 5星评级
          ecology: {
            habitat: "城市滨海红树林湿地生态系统",
            vegetation: "原生红树林群落、多样化生态植被",
            seasonalFeatures: "全年适宜观鸟，候鸟季与留鸟季节各具特色",
            conservationStatus: "践行'无痕湿地'理念，生态系统日趋稳定"
          }
        },
        {
          id: 3,
          name: "福田红树林自然保护区",
          location: "深圳市福田区红树林路1号",
          coordinates: { latitude: 22.483333, longitude: 113.950000 },
          description: "福田红树林自然保护区与深圳湾公园、福田红树林湿地公园连成一体，是国家级自然保护区。拥有完整的红树林生态系统，是深圳湾湿地的重要组成部分。这里是东亚-澳大利西亚候鸟迁徙通道上的重要驿站，记录鸟类约200种，其中23种为国家重点保护鸟类。每年有超过10万只的候鸟在深圳湾歇脚或过冬。",
          area: "国家级自然保护区核心区域",
          openingHours: "9:00-17:00",
          transportation: "地铁9号线侨城东站B出口，步行约15分钟。可与深圳湾公园联程游览。",
          features: "国家级自然保护区，东亚-澳大利西亚候鸟迁徙重要驿站，全球黑脸琵鹭重要栖息地",
          bestBirdingTime: "每年11月至次年3月为最佳观鸟期，此时候鸟数量达到峰值",
          hotspots: "红树林海滨生态公园南侧、深圳湾地铁站南侧滩涂、沙河入海口滩涂",
          observationTips: "鸟类活动最频繁的时间是日出后2小时和日落前2小时。观察黑脸琵鹭时请保持距离，避免干扰。注意查看当日潮汐预报，选择合适时间前往。严禁捕捉、干扰野生鸟类。",
          rating: 5, // 5星评级
          ecology: {
            habitat: "国家级红树林湿地生态系统",
            vegetation: "完整红树林群落，近海与海岸湿地植被",
            seasonalFeatures: "冬季候鸟高峰，11月至次年3月鸟类最为密集",
            conservationStatus: "国家重要湿地，全球黑脸琵鹭重要栖息地（占全球总量8.6%）"
          }
        },
        {
          id: 4,
          name: "仙湖植物园",
          location: "深圳市罗湖区莲塘仙湖路160号",
          coordinates: { latitude: 22.546000, longitude: 114.135000 },
          description: "仙湖植物园位于深圳市罗湖区梧桐山脚下，是梧桐山风景区的重要组成部分。植物园依山傍水，拥有丰富的亚热带常绿阔叶林植被，生态环境优越。根据梧桐山风景区的调查，共记录鸟类3目14科19种，其中鹰形目1种，蜀形目2种，雀形目16种，以林鸟为主。",
          area: "668公顷",
          openingHours: "8:00-18:00",
          transportation: "梧桐山假日专线1号、M445路公交车仙湖植物园站。节假日可能拥堵，建议错峰出行。",
          features: "山地森林生态系统，亚热带常绿阔叶林，林鸟栖息地",
          bestBirdingTime: "春季（3-5月）候鸟迁徙经过，林鸟繁殖期活跃；秋季（9-11月）候鸟南迁过境；全年留鸟可见",
          hotspots: "湖区周边（水鸟和林鸟交汇地带）、山林步道（观察林鸟和猛禽）、棕榈园和苏铁园等专类园",
          observationTips: "观察林鸟建议清晨前往，鸟鸣最活跃。爬山时注意安全，穿防滑鞋。可关注植物园微信公众号了解特别展览和鸟类活动信息。山林中蚊虫较多，建议携带驱蚊用品。",
          rating: 4, // 4星评级
          ecology: {
            habitat: "亚热带山地森林生态系统",
            vegetation: "亚热带常绿阔叶林，苏铁、竹类、蕨类及多种乔灌木",
            seasonalFeatures: "春秋季候鸟迁徙，全年留鸟栖息，四季鸟种不同",
            conservationStatus: "梧桐山风景区鸟类栖息地重要组成部分"
          }
        },
        {
          id: 5,
          name: "东湖公园",
          location: "深圳市罗湖区爱国路4006号",
          coordinates: { latitude: 22.539000, longitude: 114.103000 },
          description: "深圳东湖公园位于深圳市罗湖区，始建于1961年，是深圳市最早建立的市政公园之一。公园属于深圳东湖地方级湿地自然公园，是梧桐山风景区的组成部分。公园以湖泊湿地为主，水生生物丰富，拥有广阔的湿地面积，湖中成片生长的芦苇群落，是水鸟觅食与栖息的理想场所。根据区域评价报告，东湖公园共记录鸟类7目16科24种。",
          area: "深圳市最早建立的市政公园之一",
          openingHours: "6:00-22:00",
          transportation: "地铁14号线黄木岗站A出口，步行约10分钟。附近停车位紧张，建议公共交通前往。",
          features: "城市湖泊湿地，淡水咸水交汇，芦苇群落，梧桐山风景区组成部分",
          bestBirdingTime: "冬季（11月-次年3月）候鸟越冬期水鸟数量增加；春季（3-5月）留鸟繁殖期鸣声活跃；清晨和傍晚为鸟类觅食活动高峰期",
          hotspots: "湖区沿岸（观察鹭类、黑水鸡等水鸟）、芦苇湿地（观察鹬类、秧鸡等）、竹林和树林（观察林鸟和猛禽）、东湖绿道（沿湖观鸟步道）",
          observationTips: "清晨和傍晚是观察鸟类最佳时间。观鸟时建议沿着湖边绿道行走，动静结合观察鸟类。湖区蚊虫较多，建议做好防护措施。注意保持湖水清洁，不要乱丢垃圾。",
          rating: 4, // 4星评级
          ecology: {
            habitat: "城市淡水湖泊湿地生态系统",
            vegetation: "芦苇群落、麻竹群落、湖滨植物、绿化带树木",
            seasonalFeatures: "冬季候鸟越冬，春季留鸟繁殖，留鸟为主，春秋有少量迁徙鸟",
            conservationStatus: "深圳市早期建立的鸟类栖息地，城市生态绿肺"
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

    // Ensure rating is a number when setting selectedSpot
    const spotWithNumericRating = {
      ...spot,
      rating: typeof spot.rating === 'number' ? spot.rating : parseInt(spot.rating) || 0
    };

    this.setData({
      selectedSpot: spotWithNumericRating
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
      rating: typeof spot.rating === 'number' ? spot.rating : parseInt(spot.rating) || 0,  // 确保rating是数字
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