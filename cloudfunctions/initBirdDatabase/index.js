// 云函数入口文件 - 初始化鸟类观察数据库
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 鸟类观察数据的标准结构
const birdObservationSchema = {
  species: String,           // 物种名称
  scientificName: String,    // 学名
  commonName: String,        // 通用名
  location: Object,          // 位置信息 {latitude, longitude}
  locationName: String,      // 位置名称
  date: String,              // 观察日期
  time: String,              // 观察时间
  habitat: String,           // 栖息地类型
  season: String,            // 季节
  description: String,       // 描述
  imageUrl: String,          // 图片URL
  audioUrl: String,          // 音频URL（可选）
  observer: String,          // 观察者
  confidence: Number,        // 观察可信度（0-1）
  verified: Boolean,         // 是否已验证
  region: String,            // 区域（固定为"深圳"）
  _openid: String,           // 提交用户ID
  createdAt: Date,           // 创建时间
  updatedAt: Date,           // 更新时间
};

// 主函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    // 检查并创建集合
    const collections = await db.listCollections();
    const collectionExists = collections.collections.some(
      collection => collection.name === 'bird_observations'
    );

    if (!collectionExists) {
      // 如果集合不存在，输出提示信息
      // 注意：在云开发中，写入数据时会自动创建集合
      console.log('bird_observations 集合将自动创建');
    }

    // 插入一些示例数据用于测试
    const sampleObservations = [
      {
        species: "白鹭",
        scientificName: "Egretta garzetta",
        commonName: "白鹭",
        location: {
          latitude: 22.547000,
          longitude: 114.085947
        },
        locationName: "深圳湾公园",
        date: "2024-05-15",
        time: "08:30",
        habitat: "湿地",
        season: "全年",
        description: "在深圳湾湿地常见，主要在浅水区觅食",
        imageUrl: "https://img.xiangha.com/caipu/2/181/181899423.jpg@s_2,w_400,h_400,q_80,c_crop,x_0,y_0,w_400,h_400.jpg",
        observer: "观鸟爱好者协会",
        confidence: 0.95,
        verified: true,
        region: "深圳"
      },
      {
        species: "红耳鹎",
        scientificName: "Pycnonotus jocosus",
        commonName: "红耳鹎",
        location: {
          latitude: 22.535000,
          longitude: 114.065947
        },
        locationName: "莲花山公园",
        date: "2024-05-16",
        time: "10:15",
        habitat: "城市公园",
        season: "全年",
        description: "在深圳各大公园常见，活跃于灌木丛中",
        imageUrl: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1,179723598&fm=26&gp=0.jpg",
        observer: "本地观鸟小组",
        confidence: 0.90,
        verified: true,
        region: "深圳"
      }
    ];

    // 批量插入示例数据
    for (const obs of sampleObservations) {
      const exists = await db.collection('bird_observations')
        .where({
          species: obs.species,
          'location.latitude': obs.location.latitude,
          'location.longitude': obs.location.longitude,
          date: obs.date
        })
        .count();

      if (exists.total === 0) {
        await db.collection('bird_observations').add({
          data: {
            ...obs,
            _openid: wxContext.OPENID,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    return {
      success: true,
      message: '数据库初始化完成',
      collections: collections.collections.map(c => c.name),
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    };
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};