// 云函数入口文件 - 添加真实鸟类观察数据
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
    // 从事件参数中获取鸟类观察数据
    const { observation } = event;

    // 验证数据完整性
    if (!observation || !observation.species || !observation.location) {
      throw new Error('缺少必要的鸟类观察数据');
    }

    // 验证位置数据
    if (typeof observation.location.latitude !== 'number' ||
        typeof observation.location.longitude !== 'number') {
      throw new Error('位置数据格式错误');
    }

    // 验证是否在深圳区域内
    const SHENZHEN_BOUNDS = {
      north: 22.87, // 深圳最北纬度
      south: 22.45, // 深圳最南纬度
      east: 114.62, // 深圳最东经度
      west: 113.75  // 深圳最西经度
    };

    if (observation.location.latitude < SHENZHEN_BOUNDS.south ||
        observation.location.latitude > SHENZHEN_BOUNDS.north ||
        observation.location.longitude < SHENZHEN_BOUNDS.west ||
        observation.location.longitude > SHENZHEN_BOUNDS.east) {
      throw new Error('观察位置不在深圳区域内');
    }

    // 添加额外字段
    const observationToAdd = {
      ...observation,
      _openid: wxContext.OPENID, // 记录提交用户的ID
      createdAt: new Date(), // 创建时间
      updatedAt: new Date(), // 更新时间
      verified: false, // 是否已验证（默认为false）
      region: '深圳' // 固定区域
    };

    // 插入到鸟类观察数据库
    const result = await db.collection('bird_observations').add({
      data: observationToAdd
    });

    return {
      success: true,
      id: result._id,
      message: '鸟类观察数据添加成功',
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    };
  } catch (error) {
    console.error('添加鸟类观察数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};