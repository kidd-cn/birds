// 示例真实鸟类观察数据
// 数据格式包含物种名称、经纬度、观察时间等
const realBirdObservations = [
  {
    id: 1,
    species: "黑脸琵鹭",
    scientificName: "Platalea minor",
    commonName: "黑脸琵鹭",
    location: {
      latitude: 22.483333,
      longitude: 113.950000
    },
    locationName: "福田红树林生态公园",
    date: "2024-03-15",
    time: "07:30",
    habitat: "红树林湿地",
    season: "冬季",
    description: "国家一级保护动物，全球极度濒危物种，在深圳湾越冬，约占全球总数的十分之一。常在浅水区觅食，嘴部呈勺状，适合滤食水中的小鱼虾。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.a1b2c3d4e5f6g7h8i9j0kHaEK&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "红树林自然保护区",
    confidence: 0.99
  },
  {
    id: 2,
    species: "大白鹭",
    scientificName: "Ardea alba",
    commonName: "大白鹭",
    location: {
      latitude: 22.490000,
      longitude: 113.940000
    },
    locationName: "深圳湾公园",
    date: "2024-04-10",
    time: "08:15",
    habitat: "滨海湿地",
    season: "全年",
    description: "大型涉禽，全身洁白，嘴和腿黑色，趾黄色。在深圳湾湿地常见，主要在浅水区觅食鱼虾。是深圳湾的标志性鸟类之一。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.m1n2o3p4q5r6s7t8u9v0wHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "深圳观鸟协会",
    confidence: 0.95
  },
  {
    id: 3,
    species: "苍鹭",
    scientificName: "Ardea cinerea",
    commonName: "苍鹭",
    location: {
      latitude: 22.475000,
      longitude: 113.930000
    },
    locationName: "华侨城国家湿地公园",
    date: "2024-05-01",
    time: "06:45",
    habitat: "淡水湿地",
    season: "全年",
    description: "大型涉禽，灰褐色，具有黑色贯眼纹和眉纹，颈部白色。性情机警，常单独站在水边或浅水中捕鱼。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.x1y2z3a4b5c6d7e8f9g0hHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "华侨城湿地管理员",
    confidence: 0.90
  },
  {
    id: 4,
    species: "反嘴鹬",
    scientificName: "Recurvirostra avosetta",
    commonName: "反嘴鹬",
    location: {
      latitude: 22.488000,
      longitude: 113.960000
    },
    locationName: "深圳湾公园",
    date: "2024-04-20",
    time: "10:30",
    habitat: "泥质滩涂",
    season: "冬春季节",
    description: "中型涉禽，羽毛白色，具有独特的向上弯曲的长嘴。在深圳湾浅滩常见，利用弯曲的嘴部在浅水中扫荡觅食小型无脊椎动物。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.i1j2k3l4m5n6o7p8q9r0sHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "市民观察记录",
    confidence: 0.88
  },
  {
    id: 5,
    species: "夜鹭",
    scientificName: "Nycticorax nycticorax",
    commonName: "夜鹭",
    location: {
      latitude: 22.546000,
      longitude: 114.135000
    },
    locationName: "仙湖植物园",
    date: "2024-05-05",
    time: "18:20",
    habitat: "淡水湖泊",
    season: "全年",
    description: "中型鹭类，头、颈灰色，枕部具两枚白色尖形羽冠，背部呈灰色。主要在黄昏和夜间活动觅食，白天隐蔽在林间休息。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.t1u2v3w4x5y6z7a8b9c0dHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "仙湖植物园工作人员",
    confidence: 0.92
  },
  {
    id: 6,
    species: "赤腹鹰",
    scientificName: "Accipiter soloensis",
    commonName: "赤腹鹰",
    location: {
      latitude: 22.483000,
      longitude: 113.945000
    },
    locationName: "内伶仃福田国家级自然保护区",
    date: "2024-05-12",
    time: "14:45",
    habitat: "红树林",
    season: "迁徙季节",
    description: "小型猛禽，雄鸟体色青蓝，胸腹锈色，雌鸟褐色纵纹。迁徙途中在深圳停歇觅食，是观鸟的明星物种之一。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.f1g2h3i4j5k6l7m8n9o0pHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "自然保护区研究人员",
    confidence: 0.94
  },
  {
    id: 7,
    species: "白头鹎",
    scientificName: "Pycnonotus sinensis",
    commonName: "白头鹎",
    location: {
      latitude: 22.535000,
      longitude: 114.065947
    },
    locationName: "莲花山公园",
    date: "2024-04-18",
    time: "09:30",
    habitat: "城市公园",
    season: "全年",
    description: "华南地区常见鸟类，头顶黑色，枕部白色，是中国特有鸟种。在深圳的城市绿地中广泛分布，是市民常见的伴生鸟类。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.q1r2s3t4u5v6w7x8y9z0aHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "本地观鸟小组",
    confidence: 0.96
  },
  {
    id: 8,
    species: "黄胸鹀",
    scientificName: "Emberiza aureola",
    commonName: "黄胸鹀",
    location: {
      latitude: 22.485000,
      longitude: 113.955000
    },
    locationName: "福田红树林生态公园",
    date: "2024-03-20",
    time: "11:15",
    habitat: "芦苇沼泽",
    season: "迁徙季节",
    description: "国家一级保护动物，极危物种，繁殖于北方，迁徙经华南地区。雄鸟胸部鲜黄色，头部黑色，侧面具栗色块斑。因过度捕捉导致数量急剧下降。",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.b1c2d3e4f5g6h7i8j9k0lHaEo&w=280&h=173&c=7&o=5&dpr=1.1&pid=1.7",
    observer: "观鸟爱好者协会",
    confidence: 0.98
  }
];

module.exports = { realBirdObservations };