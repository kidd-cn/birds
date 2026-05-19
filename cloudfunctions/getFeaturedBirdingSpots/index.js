// 云函数入口文件 - 获取深圳代表性观鸟景点的鸟类数据
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 深圳代表性观鸟地点列表
const SHENZHEN_BIRDING_SPOTS = [
  {
    name: "深圳湾公园",
    coordinates: { latitude: 22.490000, longitude: 113.940000 },
    radius: 1.5, // 1.5km范围
    habitat: "滨海湿地",
    special_species: ["黑脸琵鹭", "大白鹭", "反嘴鹬"]
  },
  {
    name: "福田红树林生态公园",
    coordinates: { latitude: 22.483333, longitude: 113.950000 },
    radius: 1.2, // 1.2km范围
    habitat: "红树林湿地",
    special_species: ["黑脸琵鹭", "黄胸鹀", "白肩雕"]
  },
  {
    name: "华侨城国家湿地公园",
    coordinates: { latitude: 22.478000, longitude: 113.935000 },
    radius: 1.0, // 1km范围
    habitat: "淡水湿地",
    special_species: ["黑脸琵鹭", "苍鹭", "各种鸻鹬类"]
  },
  {
    name: "内伶仃福田国家级自然保护区",
    coordinates: { latitude: 22.483000, longitude: 113.945000 },
    radius: 2.0, // 2km范围
    habitat: "红树林",
    special_species: ["赤腹鹰", "各种猛禽", "迁徙鸟类"]
  },
  {
    name: "仙湖植物园",
    coordinates: { latitude: 22.546000, longitude: 114.135000 },
    radius: 1.8, // 1.8km范围
    habitat: "山林湿地",
    special_species: ["夜鹭", "赤红山椒鸟", "朱背啄花鸟"]
  }
];

// 主函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    // 从事件参数中获取查询条件
    const {
      spotName = null,      // 特定观鸟点名称
      includeNearby = false, // 是否包含周边数据
      limit = 20            // 返回记录数量限制
    } = event;

    let queryConditions = {};

    if (spotName) {
      // 如果指定了特定观鸟点
      const spot = SHENZHEN_BIRDING_SPOTS.find(s => s.name.includes(spotName));
      if (!spot) {
        throw new Error(`未找到名为 ${spotName} 的观鸟点`);
      }

      // 计算经纬度范围（粗略计算）
      const latRange = spot.radius / 111.0;
      const lngRange = spot.radius / (111.0 * Math.cos(spot.coordinates.latitude * Math.PI / 180));

      queryConditions = {
        'location.latitude': _.gte(spot.coordinates.latitude - latRange)
                              .lte(spot.coordinates.latitude + latRange),
        'location.longitude': _.gte(spot.coordinates.longitude - lngRange)
                               .lte(spot.coordinates.longitude + lngRange),
        verified: true // 只返回已验证的数据
      };
    } else {
      // 如果没有指定特定观鸟点，返回所有代表性观鸟点的数据
      const locationNames = SHENZHEN_BIRDING_SPOTS.map(spot => spot.name);
      queryConditions = {
        locationName: _.in(locationNames),
        verified: true
      };
    }

    // 查询符合条件的鸟类观察数据
    const result = await db.collection('bird_observations')
      .where(queryConditions)
      .limit(limit)
      .orderBy('createdAt', 'desc') // 按创建时间倒序排列
      .get();

    // 添加观鸟点信息
    const enrichedData = result.data.map(observation => {
      const spot = SHENZHEN_BIRDING_SPOTS.find(s =>
        observation.locationName.includes(s.name) || s.name.includes(observation.locationName)
      );

      return {
        ...observation,
        spotInfo: spot ? {
          habitat: spot.habitat,
          special_species: spot.special_species
        } : null
      };
    });

    return {
      success: true,
      data: enrichedData,
      count: enrichedData.length,
      totalSpots: SHENZHEN_BIRDING_SPOTS.length,
      spotsList: SHENZHEN_BIRDING_SPOTS.map(spot => ({
        name: spot.name,
        habitat: spot.habitat,
        special_species: spot.special_species
      })),
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    };
  } catch (error) {
    console.error('获取代表性观鸟点鸟类数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};