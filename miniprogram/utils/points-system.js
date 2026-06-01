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

/**
 * Load state from storage, caching in memory.
 * @returns {Object} Current state
 */
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

/**
 * Persist current state to storage.
 */
function save() {
  try {
    wx.setStorageSync(STORAGE_KEY, _state);
  } catch (e) {
    console.error('points-system save error:', e);
  }
}

/**
 * Notify all subscribed listeners of a state change.
 */
function notify() {
  _listeners.forEach(fn => {
    try { fn(_state); } catch (e) { console.error('listener error:', e); }
  });
}

/**
 * Award points for a one-time key. Idempotent: a key can only be awarded once.
 * @param {string} key - Unique identifier for this award
 * @param {number} amount - Positive, finite number of points to award
 * @returns {{awarded: boolean, currentPoints: number, totalEarned: number}}
 */
function addPoints(key, amount) {
  const state = load();
  if (!key || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return { awarded: false, currentPoints: state.currentPoints, totalEarned: state.totalEarned };
  }
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

/**
 * Spend points from the user's balance.
 * @param {number} amount - Positive, finite number of points to spend
 * @param {string} [reason] - Optional description of the spend
 * @returns {{success: boolean, currentPoints: number, reason: string}}
 */
function spendPoints(amount, reason) {
  const state = load();
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
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

/**
 * Get the current available points balance.
 * @returns {number} Current points
 */
function getCurrentPoints() {
  return load().currentPoints;
}

/**
 * Get the total points ever earned (does not decrease on spend).
 * @returns {number} Total earned points
 */
function getTotalEarned() {
  return load().totalEarned;
}

/**
 * Get a copy of the full state.
 * @returns {{totalEarned: number, currentPoints: number, earnedKeys: Object}}
 */
function getState() {
  const s = load();
  return {
    totalEarned: s.totalEarned,
    currentPoints: s.currentPoints,
    earnedKeys: { ...s.earnedKeys }
  };
}

/**
 * Subscribe to state changes.
 * @param {Function} callback - Called with the new state on each change
 * @returns {Function} Unsubscribe function that removes the listener when called
 */
function onChange(callback) {
  if (typeof callback !== 'function') return () => {};
  _listeners.push(callback);
  return () => {
    const i = _listeners.indexOf(callback);
    if (i >= 0) _listeners.splice(i, 1);
  };
}

/**
 * Reset state to defaults and persist.
 */
function reset() {
  _state = { ...DEFAULT_STATE, earnedKeys: {} };
  save();
  notify();
}

/**
 * Force eager load at app startup to surface storage errors early.
 */
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
