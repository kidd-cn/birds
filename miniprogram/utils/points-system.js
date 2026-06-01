/**
 * 积分系统 - 统一管理用户积分
 * Storage key: 'points-system'
 */

const STORAGE_KEY = 'points-system';

const DEFAULT_STATE = {
  totalEarned: 0,
  currentPoints: 0,
  earnedKeys: {}
};

let _state = null;
const _listeners = [];

function load() {
  if (_state) return _state;
  try {
    const stored = wx.getStorageSync(STORAGE_KEY);
    if (stored) {
      _state = {
        totalEarned: stored.totalEarned || 0,
        currentPoints: stored.currentPoints || 0,
        earnedKeys: stored.earnedKeys || {}
      };
    } else {
      _state = { ...DEFAULT_STATE, earnedKeys: {} };
    }
  } catch (e) {
    console.error('points-system load error:', e);
    _state = { ...DEFAULT_STATE, earnedKeys: {} };
  }
  return _state;
}

function save() {
  try {
    wx.setStorageSync(STORAGE_KEY, _state);
  } catch (e) {
    console.error('points-system save error:', e);
  }
}

function notify() {
  _listeners.forEach(fn => {
    try { fn(_state); } catch (e) { console.error('listener error:', e); }
  });
}

function addPoints(key, amount) {
  if (!key || typeof amount !== 'number' || amount <= 0) {
    return { awarded: false, currentPoints: load().currentPoints, totalEarned: load().totalEarned };
  }
  const state = load();
  if (state.earnedKeys[key]) {
    return { awarded: false, currentPoints: state.currentPoints, totalEarned: state.totalEarned };
  }
  state.earnedKeys[key] = true;
  state.totalEarned += amount;
  state.currentPoints += amount;
  save();
  notify();
  return { awarded: true, currentPoints: state.currentPoints, totalEarned: state.totalEarned };
}

function spendPoints(amount, reason) {
  const state = load();
  if (typeof amount !== 'number' || amount <= 0) {
    return { success: false, reason: 'invalid_amount', currentPoints: state.currentPoints };
  }
  if (state.currentPoints < amount) {
    return { success: false, reason: 'insufficient_points', currentPoints: state.currentPoints };
  }
  state.currentPoints -= amount;
  save();
  notify();
  return { success: true, currentPoints: state.currentPoints, reason: reason || '' };
}

function getCurrentPoints() {
  return load().currentPoints;
}

function getTotalEarned() {
  return load().totalEarned;
}

function getState() {
  const s = load();
  return {
    totalEarned: s.totalEarned,
    currentPoints: s.currentPoints,
    earnedKeys: { ...s.earnedKeys }
  };
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
  _state = { ...DEFAULT_STATE, earnedKeys: {} };
  save();
  notify();
}

function init() {
  load();
}

module.exports = {
  addPoints,
  spendPoints,
  getCurrentPoints,
  getTotalEarned,
  getState,
  onChange,
  reset,
  init
};
