/** 深圳代表性观鸟点（地图与列表共用） */
const SHENZHEN_BIRDING_SPOTS = [
  {
    name: '深圳湾公园',
    habitat: '滨海湿地',
    special_species: ['黑脸琵鹭', '大白鹭', '反嘴鹬', '红嘴鸥'],
    coordinates: { latitude: 22.490000, longitude: 113.940000 }
  },
  {
    name: '福田红树林生态公园',
    habitat: '红树林湿地',
    special_species: ['黑脸琵鹭', '白肩雕', '黄胸鹀', '苍鹭'],
    coordinates: { latitude: 22.483333, longitude: 113.950000 }
  },
  {
    name: '华侨城国家湿地公园',
    habitat: '淡水湿地',
    special_species: ['黑脸琵鹭', '苍鹭', '各种鸻鹬类', '鸬鹚'],
    coordinates: { latitude: 22.478000, longitude: 113.935000 }
  },
  {
    name: '内伶仃福田国家级自然保护区',
    habitat: '红树林生态系统',
    special_species: ['赤腹鹰', '各种猛禽', '迁徙鸟类', '蛇雕'],
    coordinates: { latitude: 22.483000, longitude: 113.945000 }
  },
  {
    name: '仙湖植物园',
    habitat: '山林湿地',
    special_species: ['夜鹭', '赤红山椒鸟', '朱背啄花鸟', '叉尾太阳鸟'],
    coordinates: { latitude: 22.546000, longitude: 114.135000 }
  }
];

const SPOT_MARKER_ID_BASE = 10001;

module.exports = {
  SHENZHEN_BIRDING_SPOTS,
  SPOT_MARKER_ID_BASE
};
