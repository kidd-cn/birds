// 云函数入口文件 - 根据地理位置获取鸟类观察数据
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 主函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    // 从事件参数中获取查询条件
    const {
      latitude,
      longitude,
      radius = 5, // 默认5公里半径
      limit = 50, // 默认最多返回50条数据
      season = null // 季节过滤
    } = event;

    // 验证输入参数
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('经纬度参数必须为数字');
    }

    if (typeof radius !== 'number' || radius <= 0) {
      throw new Error('半径参数必须为正数');
    }

    // 计算经纬度范围（粗略计算，适用于小范围）
    // 1度纬度约等于111公里
    // 1度经度随纬度变化，深圳约为111*cos(22.5°) ≈ 103公里
    const latRange = radius / 111.0;
    const lngRange = radius / (111.0 * Math.cos(latitude * Math.PI / 180));

    const queryConditions = {
      'location.latitude': _.gte(latitude - latRange).lte(latitude + latRange),
      'location.longitude': _.gte(longitude - lngRange).lte(longitude + lngRange),
      verified: true // 只返回已验证的数据
    };

    // 如果指定了季节，则添加季节过滤
    if (season) {
      queryConditions.season = _.eq(season);
    }

    // 查询符合条件的鸟类观察数据
    const result = await db.collection('bird_observations')
      .where(queryConditions)
      .limit(limit)
      .orderBy('createdAt', 'desc') // 按创建时间倒序排列
      .get();

    return {
      success: true,
      data: result.data,
      count: result.data.length,
      queryParams: { latitude, longitude, radius, season },
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    };
  } catch (error) {
    console.error('根据位置获取鸟类数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};