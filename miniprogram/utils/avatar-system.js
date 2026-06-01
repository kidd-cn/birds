/**
 * 头像系统 - 头像库、兑换、装备
 * Storage key: 'avatar-system'
 */

const STORAGE_KEY = 'avatar-system';
const DEFAULT_AVATAR = 'sparrow';

const TIERS = {
  normal: { unlockAt: 0, color: '#4CAF50' },
  rare:   { unlockAt: 100, color: '#2196F3' },
  epic:   { unlockAt: 400, color: '#9C27B0' }
};

const AVATARS = [
  { id: 'sparrow',          name: '小麻雀',   tier: 'normal', price: 0,   image: '/images/avatars/sparrow.png' },
  { id: 'pigeon',           name: '城市鸽',   tier: 'normal', price: 50,  image: '/images/avatars/pigeon.png' },
  { id: 'swallow',          name: '小燕子',   tier: 'normal', price: 50,  image: '/images/avatars/swallow.png' },
  { id: 'kingfisher',       name: '蓝翠鸟',   tier: 'normal', price: 50,  image: '/images/avatars/kingfisher.png' },
  { id: 'egret',            name: '白鹭仙子', tier: 'normal', price: 50,  image: '/images/avatars/egret.png' },
  { id: 'hoopoe',           name: '戴胜',     tier: 'rare',   price: 200, image: '/images/avatars/hoopoe.png' },
  { id: 'magpie',           name: '蓝鹊',     tier: 'rare',   price: 200, image: '/images/avatars/magpie.png' },
  { id: 'lapwing',          name: '凤头麦鸡', tier: 'rare',   price: 200, image: '/images/avatars/lapwing.png' },
  { id: 'goose',            name: '斑头雁',   tier: 'rare',   price: 200, image: '/images/avatars/goose.png' },
  { id: 'redstart',         name: '红尾鸲',   tier: 'rare',   price: 200, image: '/images/avatars/redstart.png' },
  { id: 'spoonbill',        name: '黑脸琵鹭', tier: 'epic',   price: 500, image: '/images/avatars/spoonbill.png' },
  { id: 'crested_ibis',     name: '朱鹮',     tier: 'epic',   price: 500, image: '/images/avatars/crested_ibis.png' },
  { id: 'oriental_stork',   name: '东方白鹳', tier: 'epic',   price: 500, image: '/images/avatars/oriental_stork.png' }
];

const DEFAULT_STATE = {
  ownedAvatars: [DEFAULT_AVATAR],
  equippedAvatar: DEFAULT_AVATAR
};

let _state = null;
const _listeners = [];

function load() {
  if (_state) return _state;
  try {
    const stored = wx.getStorageSync(STORAGE_KEY);
    if (stored) {
      _state = {
        ownedAvatars: stored.ownedAvatars || [DEFAULT_AVATAR],
        equippedAvatar: stored.equippedAvatar || DEFAULT_AVATAR
      };
    } else {
      _state = { ...DEFAULT_STATE };
    }
  } catch (e) {
    console.error('avatar-system load error:', e);
    _state = { ...DEFAULT_STATE };
  }
  return _state;
}

function save() {
  try {
    wx.setStorageSync(STORAGE_KEY, _state);
  } catch (e) {
    console.error('avatar-system save error:', e);
  }
}

function notify() {
  _listeners.forEach(fn => {
    try { fn(_state); } catch (e) { console.error('listener error:', e); }
  });
}

function getTotalEarnedPoints() {
  try {
    const ps = require('./points-system');
    return ps.getTotalEarned();
  } catch (e) {
    return 0;
  }
}

function isTierUnlocked(tier) {
  const total = getTotalEarnedPoints();
  return total >= TIERS[tier].unlockAt;
}

function getAllAvatars() {
  const state = load();
  return AVATARS.map(a => ({
    ...a,
    owned: state.ownedAvatars.includes(a.id),
    equipped: state.equippedAvatar === a.id,
    unlocked: isTierUnlocked(a.tier),
    tierColor: TIERS[a.tier].color,
    unlockAt: TIERS[a.tier].unlockAt
  }));
}

function getEquippedAvatar() {
  const state = load();
  const meta = AVATARS.find(a => a.id === state.equippedAvatar) || AVATARS[0];
  return { ...meta };
}

function getAvatarImage(avatarId) {
  const meta = AVATARS.find(a => a.id === avatarId);
  return meta ? meta.image : '';
}

function purchaseAvatar(avatarId) {
  const state = load();
  const meta = AVATARS.find(a => a.id === avatarId);
  if (!meta) {
    return { success: false, reason: 'invalid_avatar' };
  }
  if (state.ownedAvatars.includes(avatarId)) {
    return { success: false, reason: 'already_owned' };
  }
  if (!isTierUnlocked(meta.tier)) {
    return { success: false, reason: 'tier_locked' };
  }
  const ps = require('./points-system');
  const spendResult = ps.spendPoints(meta.price, `avatar:${avatarId}`);
  if (!spendResult.success) {
    return { success: false, reason: 'insufficient_points' };
  }
  state.ownedAvatars.push(avatarId);
  save();
  notify();
  return { success: true };
}

function equipAvatar(avatarId) {
  const state = load();
  if (!state.ownedAvatars.includes(avatarId)) {
    return { success: false, reason: 'not_owned' };
  }
  state.equippedAvatar = avatarId;
  save();
  notify();
  return { success: true };
}

function onChange(callback) {
  if (typeof callback !== 'function') return () => {};
  _listeners.push(callback);
  return () => {
    const i = _listeners.indexOf(callback);
    if (i >= 0) _listeners.splice(i, 1);
  };
}

function reset() {
  _state = { ...DEFAULT_STATE };
  save();
  notify();
}

function init() {
  load();
  if (!_state.ownedAvatars.includes(DEFAULT_AVATAR)) {
    _state.ownedAvatars.push(DEFAULT_AVATAR);
    if (!_state.equippedAvatar) {
      _state.equippedAvatar = DEFAULT_AVATAR;
    }
    save();
  }
}

module.exports = {
  TIERS,
  AVATARS,
  DEFAULT_AVATAR,
  getAllAvatars,
  getEquippedAvatar,
  getAvatarImage,
  purchaseAvatar,
  equipAvatar,
  onChange,
  reset,
  init
};
