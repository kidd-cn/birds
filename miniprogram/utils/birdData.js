// 示例真实鸟类观察数据
// 数据格式包含物种名称、经纬度、观察时间等
const realBirdObservations = [
  {
    id: 1,
    species: "黑脸琵鹭",
    scientificName: "Platalea minor",
    commonName: "黑脸琵鹭",
    location: {
      latitude: 22.517000,
      longitude: 113.996000
    },
    locationName: "福田红树林生态公园",
    date: "2026-05-20",
    time: "07:30",
    habitat: "红树林湿地",
    season: "夏季",
    description: "国家一级保护动物，全球极度濒危物种，在深圳湾越冬，约占全球总数的十分之一。常在浅水区觅食，嘴部呈勺状，适合滤食水中的小鱼虾。",
    imageUrl: "/images/Black_faced_spoonbill.jpeg",
    observer: "红树林自然保护区",
    confidence: 0.99
  },
  {
    id: 2,
    species: "大白鹭",
    scientificName: "Ardea alba",
    commonName: "大白鹭",
    location: {
      latitude: 22.50000,
      longitude: 113.953000
    },
    locationName: "深圳湾公园",
    date: "2026-05-20",
    time: "08:15",
    habitat: "滨海湿地",
    season: "夏季",
    description: "大型涉禽，全身洁白，嘴和腿黑色，趾黄色。在深圳湾湿地常见，主要在浅水区觅食鱼虾。是深圳湾的标志性鸟类之一。",
    imageUrl: "/images/alba.jpg",
    observer: "深圳观鸟协会",
    confidence: 0.95
  },
  {
    id: 3,
    species: "苍鹭",
    scientificName: "Ardea cinerea",
    commonName: "苍鹭",
    location: {
      latitude: 22.527000,
      longitude: 113.983000
    },
    locationName: "华侨城国家湿地公园",
    date: "2026-05-20",
    time: "06:45",
    habitat: "淡水湿地",
    season: "夏季",
    description: "大型涉禽，灰褐色，具有黑色贯眼纹和眉纹，颈部白色。性情机警，常单独站在水边或浅水中捕鱼。",
    imageUrl: "/images/Ardea_cinerea.jpg",
    observer: "华侨城湿地管理员",
    confidence: 0.90
  },
  {
    id: 4,
    species: "反嘴鹬",
    scientificName: "Recurvirostra avosetta",
    commonName: "反嘴鹬",
    location: {
      latitude: 22.492000,
      longitude: 113.953000
    },
    locationName: "深圳湾公园",
    date: "2026-05-20",
    time: "10:30",
    habitat: "泥质滩涂",
    season: "夏季",
    description: "中型涉禽，羽毛白色，具有独特的向上弯曲的长嘴。在深圳湾浅滩常见，利用弯曲的嘴部在浅水中扫荡觅食小型无脊椎动物。",
    imageUrl: "/images/Recurvirostra_avosetta.jpg",
    observer: "市民观察记录",
    confidence: 0.88
  },
  {
    id: 5,
    species: "夜鹭",
    scientificName: "Nycticorax nycticorax",
    commonName: "夜鹭",
    location: {
      latitude: 22.586000,
      longitude: 114.175000
    },
    locationName: "仙湖植物园",
    date: "2026-05-20",
    time: "18:20",
    habitat: "淡水湖泊",
    season: "夏季",
    description: "中型鹭类，头、颈灰色，枕部具两枚白色尖形羽冠，背部呈灰色。主要在黄昏和夜间活动觅食，白天隐蔽在林间休息。",
    imageUrl: "/images/crowned_Night_Heron.jpg",
    observer: "仙湖植物园工作人员",
    confidence: 0.92
  },
  {
    id: 6,
    species: "赤腹鹰",
    scientificName: "Accipiter soloensis",
    commonName: "赤腹鹰",
    location: {
      latitude: 22.525000,
      longitude: 114.005000
    },
    locationName: "内伶仃福田国家级自然保护区",
    date: "2026-05-20",
    time: "14:45",
    habitat: "红树林",
    season: "夏季",
    description: "小型猛禽，雄鸟体色青蓝，胸腹锈色，雌鸟褐色纵纹。迁徙途中在深圳停歇觅食，是观鸟的明星物种之一。",
    imageUrl: "/images/Accipiter_soloensis.jpg",
    observer: "自然保护区研究人员",
    confidence: 0.94
  },
  {
    id: 7,
    species: "白头鹎",
    scientificName: "Pycnonotus sinensis",
    commonName: "白头鹎",
    location: {
      latitude: 22.550000,
      longitude: 114.055947
    },
    locationName: "莲花山公园",
    date: "2026-05-20",
    time: "09:30",
    habitat: "城市公园",
    season: "夏季",
    description: "华南地区常见鸟类，头顶黑色，枕部白色，是中国特有鸟种。在深圳的城市绿地中广泛分布，是市民常见的伴生鸟类。",
    imageUrl: "/images/Chinese_Bubul.jpeg",
    observer: "本地观鸟小组",
    confidence: 0.96
  },
  {
    id: 8,
    species: "黄胸鹀",
    scientificName: "Emberiza aureola",
    commonName: "黄胸鹀",
    location: {
      latitude: 22.520000,
      longitude: 114.010000
    },
    locationName: "福田红树林生态公园",
    date: "2026-05-20",
    time: "11:15",
    habitat: "芦苇沼泽",
    season: "夏季",
    description: "国家一级保护动物，极危物种，繁殖于北方，迁徙经华南地区。雄鸟胸部鲜黄色，头部黑色，侧面具栗色块斑。因过度捕捉导致数量急剧下降。",
    imageUrl: "/images/Emberiza_aureola.jpg",
    observer: "观鸟爱好者协会",
    confidence: 0.98
  },
  {
    id: 9,
    species: "画眉",
    scientificName: "Garrulax canorus",
    commonName: "画眉",
    location: {
      latitude: 22.650000,
      longitude: 113.833000
    },
    locationName: "凤凰山森林公园",
    date: "2026-05-20",
    time: "07:00",
    habitat: "山林",
    season: "春季",
    description: "深圳西部重要的山林鸟类栖息地，宝安区标志性自然景区，素有'凤山福水福盈地'美誉。以林鸟和猛禽为主，常见画眉、白头鹎、红耳鹎、珠颈斑鸠、八哥、乌鸫等留鸟；迁徙季可见凤头蜂鹰、赤腹鹰、松雀鹰等猛禽过境。海拔376米，植被覆盖率高，拥有凤凰古庙人文景观与自然生态结合，山涧溪流和荔枝林为鸟类提供多样生境。",
    imageUrl: "/images/Hua_Mei.jpeg",
    observer: "凤凰山森林公园管理员",
    confidence: 0.93
  }
];

module.exports = { realBirdObservations };