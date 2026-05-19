// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 主函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    // 从鸟类数据库中获取数据
    const result = await db.collection('birds').get();

    return {
      success: true,
      data: result.data,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    };
  } catch (error) {
    console.error('获取鸟类数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};