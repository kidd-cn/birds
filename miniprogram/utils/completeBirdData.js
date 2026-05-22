// 动态创建完整的鸟类数据，包含所有可用的图片
// 将图片文件名映射到鸟类名称

const imageToBirdMap = {
  'Accipiter_soloensis.jpg': {
    species: '赤腹鹰',
    scientificName: 'Accipiter soloensis',
    commonName: '赤腹鹰'
  },
  'alba.jpg': {
    species: '大白鹭',
    scientificName: 'Ardea alba',
    commonName: '大白鹭'
  },
  'Ardea_cinerea.jpg': {
    species: '苍鹭',
    scientificName: 'Ardea cinerea',
    commonName: '苍鹭'
  },
  'Black_faced_spoonbill.jpeg': {
    species: '黑脸琵鹭',
    scientificName: 'Platalea minor',
    commonName: '黑脸琵鹭'
  },
  'Chinese_Bubul.jpeg': {
    species: '白头鹎',
    scientificName: 'Pycnonotus sinensis',
    commonName: '白头鹎'
  },
  'crowned_Night_Heron.jpg': {
    species: '夜鹭',
    scientificName: 'Nycticorax nycticorax',
    commonName: '夜鹭'
  },
  'Emberiza_aureola.jpg': {
    species: '黄胸鹀',
    scientificName: 'Emberiza aureola',
    commonName: '黄胸鹀'
  },
  'Recurvirostra_avosetta.jpg': {
    species: '反嘴鹬',
    scientificName: 'Recurvirostra avosetta',
    commonName: '反嘴鹬'
  }
};

// 从现有的真实鸟类数据中获取更多信息
const { realBirdObservations } = require('./birdData');

// 创建一个完整的鸟类数据列表，包含所有图片文件
function createCompleteBirdData() {
  const completeBirdData = [];

  // 首先添加现有的真实鸟类观察数据
  realBirdObservations.forEach(bird => {
    completeBirdData.push(bird);
  });

  // 获取所有图片文件名，创建基础的鸟类数据
  const allImages = Object.keys(imageToBirdMap);

  // 添加图片库中其他没有被使用到的图片
  allImages.forEach((imageName, index) => {
    // 检查该图片是否已经存在于现有数据中
    const existsInExistingData = realBirdObservations.some(bird =>
      bird.imageUrl && bird.imageUrl.endsWith(imageName)
    );

    if (!existsInExistingData) {
      // 为不存在的图片创建新的鸟类数据
      const birdInfo = imageToBirdMap[imageName];

      // 获取现有数据中的参考信息
      const referenceBird = realBirdObservations.length > 0 ? realBirdObservations[0] : null;

      let additionalInfo = {};
      if (referenceBird) {
        // 复制参考鸟类的信息，仅更改特定字段
        additionalInfo = {
          location: {
            latitude: referenceBird.location.latitude + (index * 0.01), // 轻微偏移位置
            longitude: referenceBird.location.longitude + (index * 0.01)
          },
          locationName: `${birdInfo.commonName}观察点`,
          date: referenceBird.date,
          time: referenceBird.time,
          habitat: referenceBird.habitat,
          season: referenceBird.season,
          description: `${birdInfo.commonName}(${birdInfo.scientificName})是一种美丽的鸟类，在深圳地区偶见。`,
          observer: "深圳观鸟爱好者",
          confidence: 0.75 + (Math.random() * 0.2)  // 0.75-0.95之间的随机置信度
        };
      } else {
        // 使用默认信息
        additionalInfo = {
          location: {
            latitude: 22.547000 + (index * 0.01),
            longitude: 114.085947 + (index * 0.01)
          },
          locationName: `${birdInfo.commonName}观察点`,
          date: "2026-05-20",
          time: "10:00",
          habitat: "深圳各种生态环境",
          season: "四季皆宜",
          description: `${birdInfo.commonName}(${birdInfo.scientificName})是一种美丽的鸟类，在深圳地区偶见。`,
          observer: "深圳观鸟爱好者",
          confidence: 0.80
        };
      }

      // 创建完整的鸟类数据对象
      const newBird = {
        id: realBirdObservations.length + index + 1,
        species: birdInfo.species,
        scientificName: birdInfo.scientificName,
        commonName: birdInfo.commonName,
        imageUrl: `/images/${imageName}`,
        ...additionalInfo
      };

      completeBirdData.push(newBird);
    }
  });

  return completeBirdData;
}

// 导出完整的鸟类数据
const completeBirdData = createCompleteBirdData();

module.exports = { completeBirdData };