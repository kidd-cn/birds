// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 主函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  // 从事件参数中获取鸟类数据
  const { birds } = event;

  try {
    // 批量插入鸟类数据
    const result = await db.collection('birds').add({
      data: birds
    });

    return {
      success: true,
      data: result,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    };
  } catch (error) {
    console.error('添加鸟类数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};